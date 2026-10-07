import { type NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const azureAdClientId = process.env.AZURE_AD_CLIENT_ID ?? '';
const azureAdClientSecret = process.env.AZURE_AD_CLIENT_SECRET ?? '';
const azureAdTenantId = process.env.AZURE_AD_TENANT_ID ?? 'common';
const adminPassword = process.env.ADMIN_PASSWORD ?? '';

export const authProviderAvailability = {
  google: Boolean(googleClientId && googleClientSecret),
  azureAd: Boolean(azureAdClientId && azureAdClientSecret),
  credentials: Boolean(adminPassword && adminEmails.length > 0),
};

const providers: any[] = [];

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

if (authProviderAvailability.credentials) {
  providers.push(
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const inputEmail = credentials.email.toLowerCase().trim();
        
        if (adminEmails.includes(inputEmail) && credentials.password === adminPassword) {
          return {
            id: inputEmail,
            email: inputEmail,
            name: "Admin User",
          };
        }
        
        return null;
      }
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
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true; 
      }
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
