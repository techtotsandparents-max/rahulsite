# Web App Authentication and Downstream Access

**Two identities:** Entra signs in the owner; the Web App's managed identity connects to Azure resources. Login permission and resource permission are separate.

## 1. Authentication on the Web App

### Configure in Azure Portal

1. Open the correct **App Service / slot > Authentication**. Enable authentication, select **Microsoft**, and confirm the existing `prodwebapp` registration's client ID.
2. Keep **Allow unauthenticated access** so public pages remain public. Application code protects editing and uploads.
3. In **Entra ID > App registrations > prodwebapp > Authentication**, add this **Web** callback without removing other apps' callbacks:

   ```text
   https://rahulsite-cga7gwaye4g0f0hy.southindia-01.azurewebsites.net/.auth/login/aad/callback
   ```

4. Add the equivalent callback for any custom domain/slot used for login. `/blog` is the return page, not the registered callback.
5. Verify the registration's supported account types and issuer match the owner account. A personal account must be supported or admitted as a guest in the configured tenant.
6. Check the Microsoft provider's credential setting, commonly `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. Use the **secret value**, not its ID; check expiration and never commit it.
7. Enable the **token store**. Keep HTTPS, nonce/state, tenant, and audience validation enabled. Do not disable nonce validation or force implicit flow to fix login loops.
8. Save settings and restart if required. These steps describe configuration; they do not confirm the current live Azure settings.

### App Service Environment Variables

| Setting | Value / purpose |
| --- | --- |
| `ADMIN_EMAILS` | Only your validated owner email. Matching ignores case and surrounding spaces. |
| `WEBSITE_HOSTNAME` | Supplied by App Service; trusted hostname for backend session validation. |
| `NEXTAUTH_URL` | Canonical HTTPS site origin, including the custom domain used for writes. |
| `NEXTAUTH_SECRET` | Server-only secret for NextAuth sessions. |

NextAuth's optional `AZURE_AD_*` settings and `/api/auth/callback/azure-ad` callback are separate from Easy Auth. They do not configure the platform's Microsoft provider.

### Site Login Flow

```text
Admin Login -> /.auth/login/aad -> Entra -> registered Web callback
-> AppServiceAuthSession cookie -> return to current page
-> /api/auth/session -> backend validates cookie through /.auth/me
-> normalized email checked against ADMIN_EMAILS -> user.isAdmin
-> authorized admin API -> save/upload
```

- [Navbar.tsx](../components/navigation/Navbar.tsx) now has **one Admin Login** instead of separate User/Admin controls. It performs a full browser redirect preserving the current pathname. The owner's allowlisted identity grants editing, not the button label.
- [easy-auth.ts](../lib/azure/easy-auth.ts) validates the cookie against the trusted platform hostname. Do not trust arbitrary identity headers or expose raw provider tokens.
- [The session endpoint](../app/api/auth/[...nextauth]/route.ts) supplies the sanitized session to `useSession()`. [proxy.ts](../proxy.ts) protects admin routes and checks origins for Easy Auth writes; admin APIs must also enforce authorization.
- Logout clears NextAuth, then redirects Easy Auth sessions through `/.auth/logout?post_logout_redirect_uri=%2F`. Clearing UI state alone is insufficient.

### Login Troubleshooting

| Problem | Check / fix |
| --- | --- |
| Button does nothing | Open `/.auth/login/aad?post_login_redirect_uri=%2Fblog` directly. If it works, check hydration and session loading. The deployed `/admin` page also has a native link. |
| Easy Auth 404 locally | `next dev` does not host Easy Auth. Use configured NextAuth through `/admin` locally; test platform login on App Service. |
| `AADSTS50011` | Match the actual `redirect_uri` to the registered HTTPS **Web** callback. |
| Redirect loop / empty `/.auth/me` | Check token store, cookie/hostname, issuer, expired credentials, and Entra/Easy Auth logs. Keep nonce validation. |
| Login works, editing does not | Check deployed `ADMIN_EMAILS` and `/api/auth/session` for `isAdmin`; deploy session bridge and guards together. |
| Custom-domain writes return 403 | Match browser origin to `NEXTAUTH_URL`; keep the origin check. |

Verify deployed owner login/save/upload/logout, public browsing, and rejection of anonymous/non-owner writes. Never share cookies, secrets, or raw token-store responses.

## 2. Backend Connections to Azure Resources

### Configure Identity and Access

1. Enable **App Service > Identity > System assigned**. Record its **principal/object ID**; slots have separate identities.
2. Assign data roles to that **Web App identity**, not the owner or sign-in registration. Use the narrowest practical scope.
3. Configure endpoints below and check firewalls, VNet/private endpoints, and DNS. Managed identity does not bypass network restrictions.
4. Allow role propagation. Restarting reloads settings but does not guarantee RBAC or platform identity caches have refreshed.

| Resource | Access and site configuration |
| --- | --- |
| Blob Storage | **Storage Blob Data Contributor** for ordinary uploads/read/delete. Set `AZURE_STORAGE_ACCOUNT_URL` and `AZURE_STORAGE_CONTAINER`. Tag operations require additional tag permissions, not a blanket Owner grant. |
| Key Vault | **Key Vault Secrets User** on an RBAC vault, or secret `Get` in a legacy access policy. Set `AZURE_KEYVAULT_URI`. |
| Cosmos DB: current MongoDB API | Managed identity reads Key Vault secret `cosmos-db-connection-string`; Mongoose connects using that credential. Set `COSMOS_DB_NAME`. Direct `COSMOS_DB_CONNECTION_STRING` takes precedence. |
| Cosmos DB: optional NoSQL API | Native **Cosmos DB Built-in Data Contributor** data-plane assignment, not generic IAM Contributor. Requires a NoSQL endpoint, SDK, and compatible data model. |
| Foundry: optional Azure OpenAI inference | **Cognitive Services OpenAI User** on the hosting resource, plus its model endpoint and deployment. Project/agent APIs require their own endpoint and appropriate project role. |

### Reuse the Site's Code

```typescript
import { AzureStorageClient } from '@/lib/azure/storage';
import { AzureCosmosClient } from '@/lib/azure/cosmos';

const uploaded = await AzureStorageClient.uploadBlob(fileBuffer, blobName, mimeType);
const database = await AzureCosmosClient.connect();
if (!database) throw new Error('Database is not configured');
```

Call after owner authorization and input/file validation. [storage.ts](../lib/azure/storage.ts) uses `DefaultAzureCredential` when the account URL is set, otherwise a connection-string fallback. Its `createIfNotExists()` call also needs container-creation permission or an implementation change to use pre-provisioned containers. [cosmos.ts](../lib/azure/cosmos.ts) uses MongoDB/Mongoose, not NoSQL token authentication.

### Minimal SDK Examples

Server-side only. `DefaultAzureCredential` can use managed identity in App Service and authenticated developer credentials locally; these are different principals with separate permissions. Check conflicting environment credentials.

```typescript
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential();
const vault = new SecretClient('https://<vault>.vault.azure.net', credential);
const secret = await vault.getSecret('cosmos-db-connection-string');
if (!secret.value) throw new Error('Database secret is empty');
```

Never log or return `secret.value`. An App Service Key Vault reference is an alternative to fetching secrets in code; it still needs vault permissions and network access.

For future NoSQL/Foundry integrations, add only the required package (`@azure/cosmos` or `openai`). These are connection examples, not implemented site features; they reuse `credential` above:

```typescript
import { CosmosClient } from '@azure/cosmos';
import { OpenAI } from 'openai';

const cosmos = new CosmosClient({
  endpoint: 'https://<nosql-account>.documents.azure.com:443/',
  aadCredentials: credential,
});
const model = new OpenAI({
  baseURL: 'https://<resource>.openai.azure.com/openai/v1/',
  apiKey: getBearerTokenProvider(credential, 'https://ai.azure.com/.default'),
});
```

Use a current OpenAI SDK supporting token-provider functions: `apiKey` here supplies a renewable Entra token, not a stored key. A Foundry project endpoint is not an OpenAI model endpoint; any project-owned downstream calls need permissions for the project's own identity too.

### Downstream Troubleshooting

| Failure | Check |
| --- | --- |
| Credential unavailable / 401 | Correct slot identity, credential selection, token audience, and endpoint. |
| Storage/Key Vault 403 | Principal, data role/scope, vault access model, network restrictions, and propagation. Management-plane Contributor alone is insufficient. |
| Cosmos failure | MongoDB versus NoSQL API, credential/secret validity, TLS/network, and native data roles where applicable. |
| Foundry 401/403/404 | Model versus project endpoint, role/audience, deployment name, and supported API. 429 means quota/rate limits, not missing RBAC. |

## Verification and References

Test small authorized resource operations and clean up test data. Successful backend access does not prove anonymous website writes are blocked.

Local auth checks: `node --test lib/azure/easy-auth.test.mjs`. The final test still expects the old navbar native link and needs updating for the consolidated button. Live Entra login/logout requires deployed verification.

- [App Service Entra setup](https://learn.microsoft.com/azure/app-service/configure-authentication-provider-aad)
- [Managed identities](https://learn.microsoft.com/azure/app-service/overview-managed-identity)
- [Cosmos NoSQL data RBAC](https://learn.microsoft.com/azure/cosmos-db/nosql/how-to-connect-role-based-access-control)
- [Foundry OpenAI JavaScript](https://learn.microsoft.com/azure/foundry/openai/supported-languages?pivots=programming-language-javascript)