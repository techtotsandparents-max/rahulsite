import { type NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const azureAdClientId = process.env.AZURE_AD_CLIENT_ID ?? '';
const azureAdClientSecret = process.env.AZURE_AD_CLIENT_SECRET ?? '';
const azureAdTenantId = process.env.AZURE_AD_TENANT_ID ?? 'common';

export const authProviderAvailability = {
  google: Boolean(googleClientId && googleClientSecret),
  azureAd: Boolean(azureAdClientId && azureAdClientSecret),
};

const providers = [];

if (authProviderAvailability.google) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

if (authProviderAvailability.azureAd) {
  providers.push(
    AzureADProvider({
      clientId: azureAdClientId,
      clientSecret: azureAdClientSecret,
      tenantId: azureAdTenantId,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/admin',
    error: '/admin?error=AccessDenied',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      const userEmail = user.email?.toLowerCase() ?? '';
      return adminEmails.includes(userEmail);
    },
    async jwt({ token }) {
      const email = token.email?.toLowerCase() ?? '';
      token.isAdmin = adminEmails.includes(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}

export function isAdminEmail(email?: string | null) {
  return adminEmails.includes((email ?? '').toLowerCase());
}
