import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';

const loadDependency = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));

function loadModule(file, env, mocks = {}, fetchMock) {
  const source = readFileSync(resolve(root, file), 'utf8');
  const { outputText, diagnostics } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    reportDiagnostics: true,
  });
  assert.equal(diagnostics.length, 0);
  const loaded = { exports: {} };
  vm.runInNewContext(outputText, {
    module: loaded,
    exports: loaded.exports,
    require: (name) => mocks[name] || loadDependency(name),
    process: { env },
    fetch: fetchMock,
    Headers, AbortSignal, Date, Map, URL, Response,
  });
  return loaded.exports;
}

test('Azure validates the cookie; only allowlisted Entra identities become admins', async () => {
  const env = { WEBSITE_HOSTNAME: 'example.azurewebsites.net', ADMIN_EMAILS: ' Admin@Example.com ' };
  let payload = [];
  let ok = true;
  let calls = 0;
  const { getEasyAuthSession } = loadModule('lib/azure/easy-auth.ts', env, {}, async (url, options) => {
    calls++;
    assert.equal(url, 'https://example.azurewebsites.net/.auth/me');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.headers.cookie, 'AppServiceAuthSession=test-only');
    return { ok, json: async () => payload };
  });
  const headers = new Headers({ cookie: 'AppServiceAuthSession=test-only' });
  assert.equal(await getEasyAuthSession(new Headers({ 'x-ms-client-principal-name': 'admin@example.com' })), null);
  assert.equal(calls, 0);

  for (const claimType of ['email', 'preferred_username', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) {
    payload = [{ provider_name: 'aad', user_id: 'subject-id', user_claims: [{ typ: claimType, val: 'ADMIN@example.com' }], access_token: 'never-expose' }];
    const session = await getEasyAuthSession(headers);
    assert.equal(session.user.isAdmin, true);
    assert.equal(session.authProvider, 'easy-auth');
    assert.equal(JSON.stringify(session).includes('never-expose'), false);
  }

  payload[0].user_claims[0].val = 'visitor@example.com';
  assert.equal((await getEasyAuthSession(headers)).user.isAdmin, false);
  env.ADMIN_EMAILS = '';
  assert.equal((await getEasyAuthSession(headers)).user.isAdmin, false);
  payload[0].provider_name = 'google';
  assert.equal(await getEasyAuthSession(headers), null);
  ok = false;
  assert.equal(await getEasyAuthSession(headers), null);
  ok = true;
  payload = { malformed: true };
  assert.equal(await getEasyAuthSession(headers), null);
  delete env.WEBSITE_HOSTNAME;
  assert.equal(await getEasyAuthSession(headers), null);
});

test('Azure failures fail closed', async () => {
  const { getEasyAuthSession } = loadModule('lib/azure/easy-auth.ts', { WEBSITE_HOSTNAME: 'example.azurewebsites.net' }, {}, async () => {
    throw new Error('Unavailable');
  });
  assert.equal(await getEasyAuthSession(new Headers({ cookie: 'AppServiceAuthSession=test-only' })), null);
});

test('admin guards and browser sessions agree, with CSRF protection and NextAuth fallback', async () => {
  const env = { WEBSITE_HOSTNAME: 'example.azurewebsites.net', NEXTAUTH_URL: 'https://example.azurewebsites.net' };
  let session = null;
  let token = null;
  const auth = { getEasyAuthSession: async () => session };
  const { proxy } = loadModule('proxy.ts', env, {
    '@/lib/azure/easy-auth': auth,
    'next-auth/jwt': { getToken: async () => token },
  });
  const { GET } = loadModule('app/api/auth/[...nextauth]/route.ts', env, {
    '@/lib/azure/easy-auth': auth,
    '@/lib/auth': { authOptions: {} },
    'next-auth': { __esModule: true, default: () => async () => Response.json({ fallback: true }) },
  });
  const request = (path, method = 'GET', origin) => new NextRequest(`https://example.azurewebsites.net${path}`, {
    method, headers: origin ? { origin } : {},
  });

  assert.equal((await proxy(request('/admin/dashboard'))).status, 307);
  assert.equal((await proxy(request('/api/admin/upload', 'POST'))).status, 401);
  session = { user: { isAdmin: false }, authProvider: 'easy-auth' };
  token = { isAdmin: true };
  const denied = await proxy(request('/admin/dashboard'));
  assert.equal(new URL(denied.headers.get('location')).searchParams.get('error'), 'AccessDenied');
  assert.equal((await proxy(request('/api/admin/upload', 'POST'))).status, 401);

  session = { user: { isAdmin: true }, authProvider: 'easy-auth' };
  assert.equal(new URL((await proxy(request('/admin/dashboard'))).headers.get('location')).pathname, '/blog');
  assert.equal((await proxy(request('/admin/blog'))).headers.get('x-middleware-next'), '1');
  assert.equal((await proxy(request('/api/admin/upload', 'POST', 'https://example.azurewebsites.net'))).headers.get('x-middleware-next'), '1');
  assert.equal((await proxy(request('/api/admin/upload', 'POST', 'https://attacker.example'))).status, 403);
  assert.equal((await proxy(request('/api/admin/upload', 'POST'))).status, 403);
  const browserSession = await GET(request('/api/auth/session'), { params: Promise.resolve({ nextauth: ['session'] }) });
  assert.equal((await browserSession.json()).user.isAdmin, true);
  assert.equal(browserSession.headers.get('cache-control'), 'private, no-store');

  session = null;
  assert.equal(new URL((await proxy(request('/admin/dashboard'))).headers.get('location')).pathname, '/blog');
  const fallback = await GET(request('/api/auth/session'), { params: Promise.resolve({ nextauth: ['session'] }) });
  assert.equal((await fallback.json()).fallback, true);
});

test('the admin icon uses a native Azure link and the login card does not intercept Azure clicks', () => {
  const navbar = readFileSync(resolve(root, 'components/navigation/Navbar.tsx'), 'utf8');
  const card = readFileSync(resolve(root, 'components/admin/AdminLoginCard.tsx'), 'utf8');
  assert.match(navbar, /<a\s+href="\/\.auth\/login\/aad\?post_login_redirect_uri=%2Fblog"/);
  assert.match(card, /onClick=\{useEasyAuth \? undefined : handleLogin\}/);
  assert.match(card, /\/\.auth\/login\/aad\?post_login_redirect_uri=/);
});