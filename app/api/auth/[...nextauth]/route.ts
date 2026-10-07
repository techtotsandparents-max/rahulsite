import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getEasyAuthSession } from '@/lib/azure/easy-auth';

const handler = NextAuth(authOptions);

const signInHandler = NextAuth({
	...authOptions,
	pages: { ...authOptions.pages, signIn: undefined },
});

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ nextauth: string[] }> },
) {
	const { nextauth } = await context.params;
	if (nextauth.length === 1 && nextauth[0] === 'session') {
		const session = await getEasyAuthSession(request.headers);
		if (session) {
			return Response.json(session, { headers: { 'Cache-Control': 'private, no-store' } });
		}
	}
	return signInHandler(request, context);
}

export { handler as POST };
