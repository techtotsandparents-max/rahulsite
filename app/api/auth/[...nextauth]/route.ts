import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

const signInHandler = NextAuth({
	...authOptions,
	pages: { ...authOptions.pages, signIn: undefined },
});

export { signInHandler as GET, handler as POST };
