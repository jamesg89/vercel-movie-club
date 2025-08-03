import { generateIdFromEntropySize } from 'lucia';
import { hashPassword } from '$lib/server/password';
import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || username.length < 3 || username.length > 31) {
			return fail(400, {
				message: 'Username must be between 3 and 31 characters'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Password must be between 6 and 255 characters'
			});
		}

		const userId = generateIdFromEntropySize(10);
		const passwordHash = await hashPassword(password);

		try {
			await db.insert(user).values({
				id: userId,
				username,
				passwordHash
			});

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, userId);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, {
				message: 'Username already taken'
			});
		}

		return redirect(302, '/');
	}
};
