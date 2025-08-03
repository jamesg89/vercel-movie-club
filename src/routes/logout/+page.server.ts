import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return redirect(302, '/login');
		}

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}
};
