import { verifyPassword } from '$lib/server/password';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		const [existingUser] = await db.select().from(user).where(eq(user.username, username));

		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
};
