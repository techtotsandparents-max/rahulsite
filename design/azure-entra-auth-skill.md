# Azure Web App + Entra ID Authentication Skill

## Overview
This skill provides a complete, battle-tested authentication and authorization pattern for **Azure Web App** (App Service) using **Microsoft Entra ID** (Azure AD) Easy Auth and **System-Assigned Managed Identity** for backend storage access.

---

## Architecture

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│   Browser    │───▶│  Azure Web App  │───▶│  Azure Blob Storage  │
│  (SPA/HTML)  │    │   (Node.js)     │    │   (rahulweb, etc.)   │
│              │◀───│                 │◀───│                      │
└──────────────┘    └─────────────────┘    └──────────────────────┘
       │                    │                        │
       │  Entra ID          │  System-Assigned       │  RBAC Role:
       │  Easy Auth         │  Managed Identity      │  Storage Blob
       │  (Cookie-based)    │  (DefaultAzureCredential)  Data Owner
       │                    │                        │
```

**Key Principle**: Users authenticate via Entra ID → Easy Auth injects identity headers → Backend code reads headers → Backend uses Managed Identity (not user's token) to access Azure Storage → Code enforces per-user access policy.

---

## Managed Identity — Required RBAC Roles on Storage Account

The Web App's **System-Assigned Managed Identity** is the single service account that connects to Azure Blob Storage on behalf of ALL users. Individual users do NOT get IAM roles on the storage account — only the Managed Identity does.

### Role Assignment Summary

| Role | Required? | What It Grants | When to Use |
|------|-----------|----------------|-------------|
| **Storage Blob Data Owner** | ✅ Recommended | Read, write, delete blobs + containers + **blob index tags** | Full-featured apps (tags, metadata, all operations) |
| **Storage Blob Data Contributor** | ⚠️ Partial | Read, write, delete blobs + containers (but **NO tags**) | Simple apps that don't use blob index tags |
| **Storage Blob Delegator** | Optional | Generate user delegation SAS tokens | Only if you generate SAS URLs server-side |
| **Storage Blob Data Reader** | ❌ Insufficient | Read-only access to blobs | Not enough for upload/delete operations |

> [!CAUTION]
> **"Storage Blob Data Contributor"** does NOT include the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` permission. If your code passes `includeTags: true` to `listBlobsByHierarchy()`, Azure will throw **`AuthorizationPermissionMismatch`** (403). Use **"Storage Blob Data Owner"** instead, or remove `includeTags: true` from your code.

> [!IMPORTANT]
> RBAC role assignments take **5–10 minutes** to propagate across Azure. After assigning a role, restart the Web App (`az webapp restart`) to clear any cached credentials from `DefaultAzureCredential`.

### How to Assign (Azure CLI)

```bash
# 1. Get the Managed Identity's principal ID
PRINCIPAL_ID=$(az webapp identity show \
  --resource-group <RG> \
  --name <WEB_APP_NAME> \
  --query principalId -o tsv)

# 2. Assign "Storage Blob Data Owner" at the Storage Account scope
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Storage Blob Data Owner" \
  --scope /subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT>

# 3. (Optional) Also assign "Storage Blob Delegator" if generating SAS tokens
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Storage Blob Delegator" \
  --scope /subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT>

# 4. Verify assignments
az role assignment list \
  --assignee $PRINCIPAL_ID \
  --scope /subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT> \
  --query "[].roleDefinitionName" -o tsv
# Expected output:
#   Storage Blob Data Owner
#   Storage Blob Delegator

# 5. Restart to pick up new credentials
az webapp restart --resource-group <RG> --name <WEB_APP_NAME>
```

### How It Works End-to-End

```
┌─────────────────────────────────────────────────────────────────┐
│ User "tripathr@outlook.com" logs in via Entra ID               │
│   → Easy Auth validates → injects X-MS-CLIENT-PRINCIPAL header │
│                                                                 │
│ Backend Node.js reads header → resolves USER_STORAGE_ACCESS     │
│   → user has containers:["*"], permissions:["read","write"...]  │
│                                                                 │
│ Backend calls Azure Storage using Managed Identity              │
│   → DefaultAzureCredential auto-picks System-Assigned MI        │
│   → MI has "Storage Blob Data Owner" on the Storage Account     │
│   → Azure Storage authorizes the request ✅                     │
│                                                                 │
│ Backend filters results per user's access policy                │
│   → returns only allowed containers/blobs to browser            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Identity Headers (Injected by Easy Auth)

When Azure App Service Easy Auth is enabled, **every authenticated request** to the backend has these headers automatically injected:

| Header | Description | Example |
|--------|-------------|---------|
| `X-MS-CLIENT-PRINCIPAL` | Base64-encoded JSON with full claims (primary source) | `eyJ1c2VySW...` |
| `X-MS-CLIENT-PRINCIPAL-NAME` | User Principal Name (UPN / Email) | `Tripathr@outlook.com` |
| `X-MS-CLIENT-PRINCIPAL-ID` | Unique Object ID (OID) in Entra ID | `a1b2c3d4-...` |
| `X-MS-CLIENT-PRINCIPAL-IDP` | Identity Provider identifier | `aad` |
| `X-MS-TOKEN-AAD-ID-TOKEN` | Raw JWT ID token from Entra ID | `eyJ0eXAi...` |

> [!IMPORTANT]
> These headers are **trusted** because Azure App Service strips any client-provided values for these headers before injecting the real ones. They cannot be spoofed.

> [!WARNING]
> `X-MS-CLIENT-PRINCIPAL-NAME` is **case-sensitive** as returned by Entra ID (e.g., `Tripathr@outlook.com` not `tripathr@outlook.com`). Always normalize to lowercase when comparing.

---

## Node.js Authentication Module

### `auth/identity.js` — Core Identity Extraction

```javascript
/**
 * identity.js — Azure Web App Entra ID Identity Module
 * 
 * Extracts and normalizes user identity from Easy Auth headers.
 * Works with Azure App Service Authentication (Easy Auth v2).
 * 
 * USAGE:
 *   const { getIdentity, requireAuth } = require('./auth/identity');
 *   
 *   // In an Express route:
 *   app.get('/api/me', requireAuth, (req, res) => {
 *     res.json(req.identity);
 *   });
 */
'use strict';

// ─── Header Extraction ────────────────────────────────────────────────────────

/**
 * Decode the base64-encoded X-MS-CLIENT-PRINCIPAL header.
 * This is the richest source of identity data from Easy Auth.
 * 
 * @param {string} encoded - Base64-encoded principal JSON
 * @returns {object|null} Decoded principal with claims array
 */
function decodeClientPrincipal(encoded) {
  if (!encoded) return null;
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Convert the claims array from X-MS-CLIENT-PRINCIPAL into a lookup map.
 * 
 * @param {Array} claims - Array of {typ, val} objects
 * @returns {object} Map of claim type → array of values
 * 
 * @example
 * // Input:  [{typ: 'preferred_username', val: 'user@example.com'}]
 * // Output: {'preferred_username': ['user@example.com']}
 */
function claimsToMap(claims) {
  const map = {};
  for (const claim of claims || []) {
    if (!claim?.typ) continue;
    const key = String(claim.typ).toLowerCase();
    if (!map[key]) map[key] = [];
    map[key].push(claim.val);
  }
  return map;
}

/**
 * Get the first matching claim value from a claims map.
 * Tries each key in order and returns the first found value.
 */
function firstClaim(claimMap, keys) {
  for (const key of keys) {
    const values = claimMap[String(key).toLowerCase()] || [];
    if (values.length) return values[0];
  }
  return '';
}

/**
 * Extract a normalized identity object from Express request headers.
 * 
 * @param {object} headers - Express req.headers (already lowercase)
 * @returns {object|null} Normalized identity or null if unauthenticated
 * 
 * @example
 * const identity = getIdentity(req.headers);
 * // Returns:
 * // {
 * //   email: 'tripathr@outlook.com',       // Always lowercase
 * //   displayName: 'Tripathr@outlook.com',  // Original case
 * //   objectId: 'a1b2c3d4-...',
 * //   provider: 'aad',
 * //   roles: ['authenticated'],
 * //   claims: { preferred_username: ['...'], ... },
 * //   rawToken: 'eyJ0eXAi...'  // JWT if available
 * // }
 */
function getIdentity(headers) {
  // ── Strategy 1: Full principal (richest data) ──
  const principal = decodeClientPrincipal(headers['x-ms-client-principal']);
  if (principal) {
    const claims = Array.isArray(principal.claims) ? principal.claims : [];
    const claimMap = claimsToMap(claims);

    const email = (
      firstClaim(claimMap, [
        'preferred_username',
        'upn',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
        'email',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      ]) ||
      principal.userDetails ||
      ''
    );

    const objectId = (
      principal.userId ||
      firstClaim(claimMap, [
        'oid',
        'http://schemas.microsoft.com/identity/claims/objectidentifier',
        'sub',
      ])
    );

    const roles = Array.from(new Set([
      ...(principal.userRoles || []),
      ...(claimMap.roles || []),
      ...(claimMap['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []),
      'authenticated',
    ])).filter(Boolean);

    return {
      email: email.toLowerCase(),        // ← ALWAYS lowercase for comparisons
      displayName: principal.userDetails || email,
      objectId: objectId || '',
      provider: principal.identityProvider || 'aad',
      roles,
      claims: claimMap,
      rawToken: headers['x-ms-token-aad-id-token'] || null,
    };
  }

  // ── Strategy 2: Individual headers (fallback) ──
  const name = headers['x-ms-client-principal-name'];
  const id = headers['x-ms-client-principal-id'];
  if (!name && !id) return null;

  return {
    email: (name || id || '').toLowerCase(),
    displayName: name || id || '',
    objectId: id || '',
    provider: headers['x-ms-client-principal-idp'] || 'aad',
    roles: ['authenticated'],
    claims: {},
    rawToken: headers['x-ms-token-aad-id-token'] || null,
  };
}


// ─── Express Middleware ────────────────────────────────────────────────────────

/**
 * Express middleware that extracts identity and attaches it to req.identity.
 * Does NOT block unauthenticated requests (use requireAuth for that).
 */
function identityMiddleware(req, res, next) {
  req.identity = getIdentity(req.headers);
  next();
}

/**
 * Express middleware that requires authentication.
 * Returns 401 if user is not authenticated.
 */
function requireAuth(req, res, next) {
  req.identity = getIdentity(req.headers);
  if (!req.identity) {
    return res.status(401).json({
      ok: false,
      error: 'Authentication required. Sign in via /.auth/login/aad',
    });
  }
  next();
}


// ─── JWT Decoding (Optional — for inspecting token claims) ─────────────────

/**
 * Decode a JWT without verifying the signature.
 * Useful for reading claims from X-MS-TOKEN-AAD-ID-TOKEN.
 * 
 * NOTE: Do NOT use this for security decisions — the token is already
 * validated by Easy Auth. This is for informational/logging purposes.
 * 
 * @param {string} token - Raw JWT string
 * @returns {object|null} Decoded payload or null
 */
function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}


module.exports = {
  getIdentity,
  identityMiddleware,
  requireAuth,
  decodeClientPrincipal,
  claimsToMap,
  decodeJwt,
};
```

---

### `auth/access-policy.js` — User-Level RBAC

```javascript
/**
 * access-policy.js — Per-User Access Control
 * 
 * Controls which containers each user can access, independent of
 * the Managed Identity's storage-level permissions.
 * 
 * Configuration via App Setting: USER_STORAGE_ACCESS
 * Format: JSON object mapping email → {containers, permissions}
 * 
 * Example:
 * {
 *   "rahul@tripathies.com": {
 *     "containers": ["*"],
 *     "permissions": ["read", "write", "delete", "manage"]
 *   },
 *   "viewer@company.com": {
 *     "containers": ["reports", "public"],
 *     "permissions": ["read"]
 *   }
 * }
 */
'use strict';

/**
 * Resolve access policy for a given identity.
 * 
 * @param {object} identity - From getIdentity()
 * @returns {object} { containers: string[], permissions: string[], allowAll: boolean }
 */
function resolveAccess(identity) {
  const noAccess = { containers: [], permissions: [], allowAll: false };
  if (!identity) return noAccess;

  const userMap = parseJsonEnv('USER_STORAGE_ACCESS', {});

  // ── Case-insensitive email lookup ──
  // Entra ID may return 'Tripathr@outlook.com' but policy has 'tripathr@outlook.com'
  const lookupKeys = [
    identity.email,                    // Already lowercase
    identity.objectId,                 // UUID fallback
    identity.displayName,              // Original case
  ].filter(Boolean);

  // Build lowercase lookup table
  const normalizedMap = {};
  for (const [key, value] of Object.entries(userMap)) {
    normalizedMap[key.toLowerCase()] = value;
  }

  // Find first matching rule
  for (const key of lookupKeys) {
    const rule = normalizedMap[key.toLowerCase()];
    if (rule) {
      const containers = Array.isArray(rule.containers) ? rule.containers : [];
      const permissions = Array.isArray(rule.permissions) ? rule.permissions : [];
      return {
        containers,
        permissions,
        allowAll: containers.includes('*'),
      };
    }
  }

  return noAccess;
}

/**
 * Assert that the user has access to a specific container + permission.
 * Throws an error with statusCode 403 if denied.
 */
function assertAccess(access, container, permission) {
  if (!access.allowAll && !access.containers.includes(container)) {
    const err = new Error(`Access denied to container: ${container}`);
    err.statusCode = 403;
    throw err;
  }
  if (permission && !access.permissions.includes(permission)) {
    const err = new Error(`Permission denied: ${permission}`);
    err.statusCode = 403;
    throw err;
  }
}

function parseJsonEnv(name, fallback) {
  try {
    return JSON.parse(process.env[name] || '');
  } catch {
    return fallback;
  }
}

module.exports = { resolveAccess, assertAccess };
```

---

### `auth/managed-identity.js` — Backend Storage Client

```javascript
/**
 * managed-identity.js — Azure Blob Storage via Managed Identity
 * 
 * The Web App's System-Assigned Managed Identity authenticates to
 * Azure Storage. Users do NOT get individual IAM roles on storage —
 * only the Managed Identity does.
 * 
 * Required Azure RBAC:
 *   Role:  "Storage Blob Data Owner" (or "Contributor" if no tags needed)
 *   Scope: Storage Account level
 *   Assignee: Web App's System-Assigned Managed Identity principal ID
 * 
 * Required App Settings:
 *   BLOB_SERVICE_URL=https://<account>.blob.core.windows.net
 *   STORAGE_ACCOUNT_NAME=<account>
 */
'use strict';

let _blobServiceClient;

/**
 * Get a singleton BlobServiceClient authenticated via Managed Identity.
 * 
 * NEVER use connection strings in production. DefaultAzureCredential
 * automatically detects:
 *   - System-Assigned Managed Identity → when running on Azure App Service
 *   - Azure CLI / VS Code identity    → during local development
 */
function getBlobServiceClient() {
  if (_blobServiceClient) return _blobServiceClient;

  const { BlobServiceClient } = require('@azure/storage-blob');
  const { DefaultAzureCredential } = require('@azure/identity');
  const serviceUrl = process.env.BLOB_SERVICE_URL;
  if (!serviceUrl) throw new Error('BLOB_SERVICE_URL is not configured.');

  // If a User-Assigned Identity is configured, pass its client ID.
  // Otherwise DefaultAzureCredential uses System-Assigned automatically.
  const clientId = process.env.USER_ASSIGNED_IDENTITY_CLIENT_ID;
  const credential = new DefaultAzureCredential(
    clientId ? { managedIdentityClientId: clientId } : undefined
  );

  _blobServiceClient = new BlobServiceClient(serviceUrl, credential);
  return _blobServiceClient;
}

/**
 * List containers the user is allowed to see.
 * 
 * @param {object} access - From resolveAccess()
 * @returns {Array} Container objects with name and properties
 */
async function listContainersForUser(access) {
  const client = getBlobServiceClient();
  const results = [];

  if (access.allowAll) {
    // User has wildcard access — list everything
    for await (const container of client.listContainers()) {
      results.push(container);
    }
  } else {
    // User has specific containers — verify each exists
    for (const name of access.containers) {
      const cc = client.getContainerClient(name);
      if (await cc.exists()) {
        const props = await cc.getProperties();
        results.push({ name, properties: props });
      }
    }
  }

  return results;
}

/**
 * List blobs in a container with hierarchy support.
 * 
 * @param {string} container - Container name
 * @param {string} prefix - Folder prefix (e.g., "docs/2024/")
 * @returns {object} { folders: [], files: [] }
 * 
 * IMPORTANT: Do NOT pass includeTags: true unless the Managed Identity
 * has "Storage Blob Data Owner" role. "Contributor" does not have
 * tags/read permission and will throw AuthorizationPermissionMismatch.
 */
async function listBlobs(container, prefix = '') {
  const client = getBlobServiceClient().getContainerClient(container);
  const folders = [];
  const files = [];

  for await (const item of client.listBlobsByHierarchy('/', {
    prefix,
    includeMetadata: true,
    // includeTags: true  ← Requires "Storage Blob Data Owner" role!
  })) {
    if (item.kind === 'prefix') {
      folders.push({
        fullName: item.name,
        name: item.name.slice(prefix.length).replace(/\/$/, ''),
      });
    } else {
      files.push({
        fullName: item.name,
        name: item.name.slice(prefix.length),
        size: item.properties.contentLength || 0,
        lastModified: item.properties.lastModified || null,
        contentType: item.properties.contentType || 'application/octet-stream',
        tier: String(item.properties.accessTier || 'Hot'),
        etag: String(item.properties.etag || '').replace(/"/g, ''),
        metadata: item.metadata || {},
      });
    }
  }

  return { folders, files };
}

module.exports = { getBlobServiceClient, listContainersForUser, listBlobs };
```

---

## Express Integration Example

```javascript
/**
 * server.js — Putting it all together
 */
const express = require('express');
const { identityMiddleware, requireAuth } = require('./auth/identity');
const { resolveAccess, assertAccess } = require('./auth/access-policy');
const { listContainersForUser, listBlobs } = require('./auth/managed-identity');

const app = express();
app.use(express.json({ limit: '50mb' }));

// Attach identity to every request
app.use(identityMiddleware);

// ─── Public endpoint: who am I? ───
app.get('/api/auth/me', requireAuth, (req, res) => {
  const access = resolveAccess(req.identity);
  res.json({
    ok: true,
    payload: {
      user: {
        email: req.identity.email,
        displayName: req.identity.displayName,
        objectId: req.identity.objectId,
        provider: req.identity.provider,
        roles: req.identity.roles,
      },
      allowedContainers: access.containers,
      permissions: access.permissions,
    },
  });
});

// ─── List containers ───
app.post('/api/storage', requireAuth, async (req, res) => {
  const access = resolveAccess(req.identity);
  const { operation } = req.body;

  if (operation === 'listContainers') {
    const containers = await listContainersForUser(access);
    return res.json({ ok: true, payload: { containers } });
  }

  if (operation === 'listBlobs') {
    const { containerPath } = req.body;
    const [container, ...rest] = containerPath.split('/');
    assertAccess(access, container, 'read');
    const data = await listBlobs(container, rest.join('/'));
    return res.json({ ok: true, payload: data });
  }

  res.status(400).json({ ok: false, error: 'Unknown operation' });
});

app.listen(process.env.PORT || 8080);
```

---

## Azure CLI Setup Commands

### 1. Enable System-Assigned Managed Identity
```bash
az webapp identity assign \
  --resource-group <RG> \
  --name <APP_NAME>
```

### 2. Grant Storage Access to Managed Identity
```bash
# Get the principal ID
PRINCIPAL_ID=$(az webapp identity show -g <RG> -n <APP_NAME> --query principalId -o tsv)

# Assign "Storage Blob Data Owner" (full access including tags)
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Storage Blob Data Owner" \
  --scope /subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.Storage/storageAccounts/<SA>
```

### 3. Configure Entra ID Easy Auth (Implicit ID Token Flow)
```bash
# Fetch current auth settings
az rest --method GET \
  --uri "https://management.azure.com/subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.Web/sites/<APP>/config/authsettingsV2?api-version=2022-03-01" \
  -o json > auth-settings.json

# Key properties to set in auth-settings.json:
# {
#   "properties": {
#     "globalValidation": {
#       "requireAuthentication": false,
#       "unauthenticatedClientAction": "AllowAnonymous"
#     },
#     "identityProviders": {
#       "azureActiveDirectory": {
#         "enabled": true,
#         "login": {
#           "loginParameters": [
#             "response_type=id_token",
#             "response_mode=form_post",
#             "scope=openid profile email"
#           ]
#         },
#         "registration": {
#           "clientId": "<APP_REGISTRATION_CLIENT_ID>",
#           "clientSecretSettingName": "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET",
#           "openIdIssuer": "https://login.microsoftonline.com/<TENANT_ID>/v2.0"
#         }
#       }
#     },
#     "login": {
#       "tokenStore": { "enabled": true },
#       "nonce": { "validateNonce": false }
#     }
#   }
# }

az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.Web/sites/<APP>/config/authsettingsV2?api-version=2022-03-01" \
  --body @auth-settings.json \
  --headers "Content-Type=application/json"
```

### 4. Set App Settings
```bash
az webapp config appsettings set -g <RG> -n <APP> --settings \
  BLOB_SERVICE_URL="https://<storage_account>.blob.core.windows.net" \
  STORAGE_ACCOUNT_NAME="<storage_account>" \
  USER_STORAGE_ACCESS='{"user@example.com":{"containers":["*"],"permissions":["read","write","delete","manage"]}}'
```

---

## Frontend Login / Logout (Browser-Side)

```javascript
// Login — redirect to Easy Auth endpoint
function login() {
  const redirect = window.location.pathname;
  window.location.href = '/.auth/login/aad?post_login_redirect_uri=' + encodeURIComponent(redirect);
}

// Logout
function logout() {
  window.location.href = '/.auth/logout?post_logout_redirect_uri=' + encodeURIComponent(window.location.origin);
}

// Check if user is authenticated (uses Easy Auth token store)
async function getAuthUser() {
  try {
    const res = await fetch('/.auth/me', { credentials: 'same-origin' });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data?.clientPrincipal || null;
  } catch {
    return null;
  }
}

// Better: use your own /api/auth/me which also returns access policy
async function getAuthContext() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.ok ? body.payload : null;
  } catch {
    return null;
  }
}
```

---

## Troubleshooting Guide

| Error | Cause | Fix |
|-------|-------|-----|
| **AuthorizationPermissionMismatch** | `includeTags: true` in listBlobs but identity only has "Contributor" role | Remove `includeTags` or upgrade to "Storage Blob Data **Owner**" |
| **Login redirect loop (401)** | `response_type=code` with `tokenStore: false` | Switch to `response_type=id_token` OR enable `tokenStore: true` |
| **/.auth/me returns empty** | `tokenStore` is disabled | Enable `tokenStore: true` in authsettingsV2 |
| **403 on listContainers** | RBAC role not propagated (can take 5-10 min) | Wait, then restart the Web App to clear cached tokens |
| **Case-sensitive email mismatch** | Entra returns `User@Example.com`, policy has `user@example.com` | Always `.toLowerCase()` before lookup |
| **No containers visible (blank page)** | Frontend silently swallowing 403 errors | Show error toasts instead of silent `return` on 403 |
| **AZURE_CLIENT_ID conflict** | App setting overrides System-Assigned identity | Remove `AZURE_CLIENT_ID` env var; use `USER_ASSIGNED_IDENTITY_CLIENT_ID` only if using User-Assigned |

---

## Required npm Packages

```json
{
  "@azure/identity": "^4.x",
  "@azure/storage-blob": "^12.x",
  "express": "^4.x"
}
```

---

## Summary of Access Flow

```
1. User clicks "Sign In" → /.auth/login/aad → Entra ID login page
2. Entra ID validates credentials → issues ID token → redirects back
3. Easy Auth creates session cookie + stores token
4. Every subsequent request:
   a. Easy Auth validates cookie
   b. Injects X-MS-CLIENT-PRINCIPAL headers
   c. Backend reads headers → getIdentity()
   d. Backend checks USER_STORAGE_ACCESS → resolveAccess()
   e. Backend calls Azure Storage via Managed Identity
   f. Returns filtered data to browser
5. User clicks "Sign Out" → /.auth/logout → cookie cleared
```
