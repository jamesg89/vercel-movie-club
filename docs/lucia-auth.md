========================
CODE SNIPPETS
========================
TITLE: Clone Example Project
DESCRIPTION: Clones the example Astro project for GitHub OAuth integration. This provides a starting point for the tutorial.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: bash
CODE:
```
git clone [email protected]:lucia-auth/example-astro-github-oauth.git
```

----------------------------------------

TITLE: Clone Example Project
DESCRIPTION: Clones a pre-built example project for Google OAuth integration with Lucia and Next.js from GitHub. This provides a starting point for the tutorial.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: bash
CODE:
```
git clone [email protected]:lucia-auth/example-nextjs-google-oauth.git
```

----------------------------------------

TITLE: Clone Example Project
DESCRIPTION: Clones the example Astro project for Google OAuth integration. This provides a ready-to-use reference for the tutorial.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: bash
CODE:
```
git clone [email protected]:lucia-auth/example-astro-google-oauth.git
```

----------------------------------------

TITLE: Clone GitHub OAuth Example Project
DESCRIPTION: Clones the example SvelteKit project for GitHub OAuth integration. This provides a ready-to-run starting point for the tutorial.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: bash
CODE:
```
git clone [email protected]:lucia-auth/example-sveltekit-github-oauth.git
```

----------------------------------------

TITLE: Clone Example Project
DESCRIPTION: Provides the command to clone the example Next.js GitHub OAuth project locally for reference or starting point.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: bash
CODE:
```
git clone [email protected]:lucia-auth/example-nextjs-github-oauth.git
```

----------------------------------------

TITLE: Clone Example Project
DESCRIPTION: Clones the official example project for integrating Google OAuth with SvelteKit and Lucia. This provides a ready-to-use starting point for the tutorial.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: shell
CODE:
```
git clone [email protected]:lucia-auth/example-sveltekit-google-oauth.git
```

----------------------------------------

TITLE: Install Arctic OAuth Library
DESCRIPTION: Installs the Arctic library, a recommended OAuth client for Lucia Auth, which simplifies the implementation of OAuth flows for various providers.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: bash
CODE:
```
npm install arctic
```

----------------------------------------

TITLE: Install Arctic OAuth Library
DESCRIPTION: Installs the Arctic library, a lightweight OAuth client that simplifies the implementation of OAuth flows for various providers.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: bash
CODE:
```
npm install arctic

```

----------------------------------------

TITLE: Install Arctic Package
DESCRIPTION: Installs the Arctic OAuth library using npm. Arctic is a lightweight OAuth 2.0 library that simplifies the process of integrating various OAuth providers.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: bash
CODE:
```
npm install arctic
```

----------------------------------------

TITLE: TokenBucketRateLimit Usage Example
DESCRIPTION: An example demonstrating how to instantiate and use the `TokenBucketRateLimit` class. It shows creating a rate limiter instance and calling the `consume` method to check if an action is permitted, throwing an error if it's not.

SOURCE: https://lucia-auth.com/rate-limit/token-bucket

LANGUAGE: javascript
CODE:
```
// Bucket that has 10 tokens max and refills at a rate of 30 seconds/token
const ratelimit = new TokenBucketRateLimit("ip", 5, 30);
const valid = await ratelimit.consume(ip, 1);
if (!valid) {
	throw new Error("Too many requests");
}
```

----------------------------------------

TITLE: Initialize GitHub OAuth Provider
DESCRIPTION: Initializes the GitHub OAuth provider using the client ID and secret from environment variables. This setup is crucial for generating authorization URLs and handling callbacks.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null);
```

----------------------------------------

TITLE: Client-Side Session Cookie
DESCRIPTION: Example of a Set-Cookie header for storing a session token. Recommends HttpOnly, Secure, and SameSite=Lax attributes for enhanced security.

SOURCE: https://lucia-auth.com/sessions/basic

LANGUAGE: HTTP
CODE:
```
Set-Cookie: session_token=SESSION_TOKEN; Max-Age=86400; HttpOnly; Secure; Path=/; SameSite=Lax
```

----------------------------------------

TITLE: Handle Google OAuth Callback in Astro
DESCRIPTION: This snippet handles the Google OAuth callback in an Astro application. It validates the state, authorization code, and code verifier against stored values. It then decodes the ID token to get user information, checks for an existing user in the database, creates a new user if necessary, and finally establishes a new session by setting a session cookie. Dependencies include `@lib/server/session`, `arctic`, and the `google` OAuth library.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: typescript
CODE:
```
import { generateSessionToken, createSession, setSessionTokenCookie } from "@lib/server/session";
import { google } from "@lib/oauth";
import { decodeIdToken } from "arctic";

import type { APIContext } from "astro";
import type { OAuth2Tokens } from "arctic";

export async function GET(context: APIContext): Promise<Response> {
	const code = context.url.searchParams.get("code");
	const state = context.url.searchParams.get("state");
	const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
	const codeVerifier = context.cookies.get("google_code_verifier")?.value ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(context, sessionToken, session.expiresAt);
		return context.redirect("/");
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(context, sessionToken, session.expiresAt);
	return context.redirect("/");
}

```

----------------------------------------

TITLE: Generate Google OAuth Authorization URL
DESCRIPTION: Handles the GET request for the Google OAuth initiation. It generates state and code verifier, creates the authorization URL with specified scopes, stores necessary cookies, and redirects the user to Google.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/login/google/+server.ts
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

	event.cookies.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});
	event.cookies.set("google_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
```

----------------------------------------

TITLE: Database Schema for Sessions (SQLite)
DESCRIPTION: Provides an example SQL schema for storing session data in a SQLite database. It specifies columns for session ID, the hashed secret (as BLOB), and creation timestamp.

SOURCE: https://lucia-auth.com/sessions/basic

LANGUAGE: sql
CODE:
```
CREATE TABLE session (
	id TEXT NOT NULL PRIMARY KEY,
	secret_hash BLOB NOT NULL, -- blob is a SQLite data type for raw binary
	created_at INTEGER NOT NULL -- unix time (seconds)
) STRICT;
```

----------------------------------------

TITLE: GitHub OAuth Authorization Route Handler
DESCRIPTION: Handles the GET request to initiate the GitHub OAuth flow. It generates a state, creates the authorization URL, stores the state in cookies, and redirects the user to GitHub.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: typescript
CODE:
```
// app/login/github/route.ts
import { generateState } from "arctic";
import { github } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	const cookieStore = await cookies();
	cookieStore.set("github_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
```

----------------------------------------

TITLE: User Interface Definition for Google OAuth
DESCRIPTION: An example TypeScript interface defining the user model. It includes fields for the user's unique ID and their Google-specific identifier, essential for storing authenticated user data.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
interface User {
	id: number;
	googleId: string;
	name: string;
}
```

----------------------------------------

TITLE: Handle Google OAuth Callback in Next.js
DESCRIPTION: Processes the callback from Google OAuth, validating the state parameter and authorization code against stored values. It exchanges the code for tokens, decodes the ID token to get user information, checks for an existing user in the database, and creates a new user or logs in an existing one. Finally, it generates a session, sets a session cookie, and redirects the user.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
	const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}

	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}

```

----------------------------------------

TITLE: Get Current User from Astro Locals
DESCRIPTION: Retrieves the currently authenticated user object from Astro's `Locals` object. This assumes that middleware has been implemented to populate `Astro.locals.user`. If no user is found, it redirects to the login page.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: typescript
CODE:
```
if (Astro.locals.user === null) {
	return Astro.redirect("/login");
}

const user = Astro.locals.user;

```

----------------------------------------

TITLE: Persist Session Cookies using Next.js Middleware
DESCRIPTION: Provides a Next.js middleware example to persist session cookies by re-setting them with an updated expiration. This addresses the limitation of setting cookies during rendering by using middleware, ensuring session continuity.

SOURCE: https://lucia-auth.com/sessions/frameworks/nextjs

LANGUAGE: TypeScript
CODE:
```
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	const sessionToken = request.cookies.get("session")?.value ?? null;

	if (sessionToken !== null) {
		// Re-set the cookie with updated expiration
		response.cookies.set({
			name: "session",
			value: sessionToken,
			maxAge: 60 * 60 * 24 * 365, // 1 year
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production"
		});
	}

	return response;
}

```

----------------------------------------

TITLE: Get Current User Session in Next.js
DESCRIPTION: This React component retrieves the current user's session information using the `getCurrentSession` function. If no user is authenticated, it redirects the user to the login page. Otherwise, it displays a greeting message with the user's username. It depends on session management utilities from '@/lib/session'.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export default async function Page() {
	const { user } = await getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}
	return <h1>Hi, {user.username}!</h1>;
}

```

----------------------------------------

TITLE: SvelteKit Sign-in Page
DESCRIPTION: Creates a basic Svelte page component for the sign-in interface. It includes a link that directs users to the GitHub OAuth initiation endpoint.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: svelte
CODE:
```
<!-- routes/login/+page.svelte -->
<h1>Sign in</h1>
<a href="/login/github">Sign in with GitHub</a>
```

----------------------------------------

TITLE: Astro Sign-in Page
DESCRIPTION: Creates a basic Astro page with a link to initiate the Google OAuth sign-in process. This page directs users to the /login/google endpoint.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: astro
CODE:
```
<!-- pages/login/index.astro -->
<html lang="en">
	<body>
		<h1>Sign in</h1>
		<a href="/login/google">Sign in with Google</a>
	</body>
</html>
```

----------------------------------------

TITLE: SvelteKit GitHub OAuth Initiation Route
DESCRIPTION: An API route handler in SvelteKit that initiates the GitHub OAuth flow. It generates a state parameter, creates an authorization URL, sets a cookie for state verification, and redirects the user to GitHub.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/login/github/+server.ts
import { generateState } from "arctic";
import { github } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	event.cookies.set("github_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
```

----------------------------------------

TITLE: Sign in Page (Astro)
DESCRIPTION: A simple Astro page with a link to initiate the GitHub OAuth sign-in process. It directs users to the `/login/github` endpoint.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: astro
CODE:
```
<!-- pages/login/index.astro -->
<html lang="en">
	<body>
		<h1>Sign in</h1>
		<a href="/login/github">Sign in with GitHub</a>
	</body>
</html>

```

----------------------------------------

TITLE: GitHub OAuth Callback Handler
DESCRIPTION: Handles the callback from GitHub OAuth, validating the state, exchanging the authorization code for an access token, fetching user profile, checking/creating user in the database, and establishing a new session. It relies on session utilities and the Arctic library for OAuth flow.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/login/github/callback/+server.ts
import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { github } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(githubUserId, githubUsername);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}

```

----------------------------------------

TITLE: Initialize Arctic Google Provider
DESCRIPTION: Initializes the Arctic OAuth client for the Google provider, using environment variables for client ID and secret, and specifying the redirect URI.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: typescript
CODE:
```
import { Google } from "arctic";

export const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	"http://localhost:4321/login/google/callback"
);
```

----------------------------------------

TITLE: Initialize Google Provider with Arctic
DESCRIPTION: Initializes the Google OAuth provider using the Arctic library. It requires the Google Client ID, Client Secret, and the redirect URI, which must match the configuration in the Google Cloud Console.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { Google } from "arctic";

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"http://localhost:3000/login/google/callback"
);
```

----------------------------------------

TITLE: User Interface for Google Sign-in
DESCRIPTION: A simple Svelte component for the sign-in page. It provides a link that directs users to the Google authentication flow.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: svelte
CODE:
```
<!-- routes/login/+page.svelte -->
<h1>Sign in</h1>
<a href="/login/google">Sign in with Google</a>
```

----------------------------------------

TITLE: Sign-in Page Component
DESCRIPTION: A simple React component for the sign-in page in a Next.js application. It provides a link that directs users to the Google OAuth initiation endpoint.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: tsx
CODE:
```
// app/login/page.tsx
export default async function Page() {
	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/google">Sign in with Google</a>
		</>
	);
}
```

----------------------------------------

TITLE: Sign In Page Component
DESCRIPTION: A simple React component for the sign-in page, providing a link to initiate the GitHub OAuth flow.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: typescript
CODE:
```
// app/login/page.tsx
export default async function Page() {
	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/github">Sign in with GitHub</a>
		</>
	);
}
```

----------------------------------------

TITLE: Load User Data in SvelteKit Page
DESCRIPTION: Loads the current authenticated user from SvelteKit's event locals. If no user is found, it redirects the user to the login page. This is typically used in `+page.server.ts` files to protect routes and provide user context.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/+page.server.ts
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}

	return {
		user
	};
};

```

----------------------------------------

TITLE: Initialize Arctic Google Provider
DESCRIPTION: Initializes the Google OAuth provider using the Arctic library. It requires the client ID, client secret, and the redirect URI for the OAuth callback.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"http://localhost:5173/login/google/callback"
);
```

----------------------------------------

TITLE: SvelteKit Layout Server Load Function Behavior
DESCRIPTION: Illustrates a SvelteKit project structure where a server load function in `+layout.server.ts` might not execute on navigation between nested pages. This highlights the need for per-request session validation in `+page.server.ts` files or `handle()` hooks to ensure security.

SOURCE: https://lucia-auth.com/sessions/frameworks/sveltekit

LANGUAGE: text
CODE:
```
routes/
    +layout.server.ts
    +page.svelte
    foo/
        +page.svelte
```

----------------------------------------

TITLE: Initialize Arctic GitHub Provider
DESCRIPTION: Shows how to initialize the Arctic GitHub OAuth provider with the client ID and secret loaded from environment variables.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { GitHub } from "arctic";

export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID,
	process.env.GITHUB_CLIENT_SECRET,
	null
);
```

----------------------------------------

TITLE: Initialize GitHub Provider with Arctic
DESCRIPTION: Initializes the GitHub provider using the Arctic library with client ID, client secret, and an optional redirect URI. This object is used to create authorization URLs.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: typescript
CODE:
```
import { GitHub } from "arctic";

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET,
	null
);

```

----------------------------------------

TITLE: GitHub OAuth Environment Variables
DESCRIPTION: Defines the necessary environment variables for GitHub OAuth authentication. These include the client ID and client secret obtained from creating a GitHub OAuth app.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: env
CODE:
```
# .env
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

----------------------------------------

TITLE: Google OAuth Callback Handling in SvelteKit
DESCRIPTION: Handles the callback from Google OAuth, validating the state parameter, authorization code, and code verifier. It decodes the ID token to retrieve user information, checks for existing users in the database, creates a new user if necessary, and establishes a new session by setting a session cookie. Dependencies include the 'arctic' library and custom session utilities.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/login/google/callback/+server.ts
import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { google } from "$lib/server/oauth";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}

```

----------------------------------------

TITLE: Environment Variables for Google OAuth
DESCRIPTION: Defines the necessary environment variables for Google OAuth credentials. These should be stored securely in a .env file.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: env
CODE:
```
# .env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

----------------------------------------

TITLE: Create GitHub Authorization URL
DESCRIPTION: An Astro API route that generates a state parameter, creates a GitHub authorization URL using the Arctic provider, sets the state in a cookie, and redirects the user to GitHub.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: typescript
CODE:
```
// pages/login/github/index.ts
import { generateState } from "arctic";
import { github } from "@lib/oauth";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	context.cookies.set("github_oauth_state", state, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return context.redirect(url.toString());
}

```

----------------------------------------

TITLE: Load Current User in SvelteKit Page
DESCRIPTION: Demonstrates how to access the authenticated user's data within a SvelteKit page server load function. It checks for the presence of `event.locals.user` and redirects the user to the login page if no user is found, ensuring only authenticated users can access the page.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/+page.server.ts
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}

	return {
		user
	};
};

```

----------------------------------------

TITLE: Create Session with Token
DESCRIPTION: Generates a new session ID, secret, and token. Hashes the secret using SHA-256 and stores session details in the database. Returns the session object including the generated token.

SOURCE: https://lucia-auth.com/sessions/basic

LANGUAGE: TypeScript
CODE:
```
async function createSession(dbPool: DBPool): Promise<SessionWithToken> {
	const now = new Date();

	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();
	const secretHash = await hashSecret(secret);

	const token = id + "." + secret;

	const session: SessionWithToken = {
		id,
		secretHash,
		createdAt: now,
		token
	};

	await executeQuery(dbPool, "INSERT INTO session (id, secret_hash, created_at) VALUES (?, ?, ?)", [
		session.id,
		session.secretHash,
		Math.floor(session.createdAt.getTime() / 1000)
	]);

	return session;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}

interface SessionWithToken extends Session {
	token: string;
}

interface Session {
	// ...
}
```

----------------------------------------

TITLE: Google OAuth Authorization Route Handler
DESCRIPTION: An API route handler in Next.js that initiates the Google OAuth flow. It generates state and code verifier, creates an authorization URL with specified scopes, and sets cookies for state and verifier before redirecting the user to Google.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
// app/login/google/route.ts
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

	const cookieStore = await cookies();
	cookieStore.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});
	cookieStore.set("google_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
```

----------------------------------------

TITLE: Environment Variables for Google OAuth
DESCRIPTION: Defines the necessary environment variables for Google OAuth integration. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required for authenticating with Google's OAuth 2.0 service.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: env
CODE:
```
# .env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

----------------------------------------

TITLE: Sign Out Form in SvelteKit
DESCRIPTION: Provides a simple Svelte form with a button to trigger the sign-out action. It uses the `enhance` action from `$app/forms` to enable client-side navigation for a smoother user experience when submitting the form.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: svelte
CODE:
```
<!-- routes/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form method="post" use:enhance>
    <button>Sign out</button>
</form>

```

----------------------------------------

TITLE: Handle GitHub OAuth Callback
DESCRIPTION: Processes the callback from GitHub after user authorization. It validates the state parameter, exchanges the authorization code for an access token, fetches the user's profile from the GitHub API, checks for existing users in the database, creates a new user if necessary, and establishes a new session for the authenticated user.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: typescript
CODE:
```
import { generateSessionToken, createSession, setSessionTokenCookie } from "@lib/session";
import { github } from "@lib/oauth";

import type { APIContext } from "astro";
import type { OAuth2Tokens } from "arctic";

export async function GET(context: APIContext): Promise<Response> {
	const code = context.url.searchParams.get("code");
	const state = context.url.searchParams.get("state");
	const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(context, sessionToken, session.expiresAt);
		return context.redirect("/");
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(githubUserId, githubUsername);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(context, sessionToken, session.expiresAt);
	return context.redirect("/");
}

```

----------------------------------------

TITLE: User Model Update for GitHub ID
DESCRIPTION: Illustrates the required update to the user data model to store GitHub-specific information, such as the user's unique GitHub ID and username.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
interface User {
	id: number;
	githubId: number;
	username: string;
}
```

----------------------------------------

TITLE: Environment Variables for Google OAuth
DESCRIPTION: Stores your Google OAuth client ID and client secret in the .env file. These are required for authenticating with Google's OAuth service.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: env
CODE:
```
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

----------------------------------------

TITLE: Generate Google OAuth Authorization URL
DESCRIPTION: An Astro API route that generates the OAuth state, code verifier, and authorization URL for Google. It stores state and verifier in cookies and redirects the user.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: typescript
CODE:
```
// pages/login/google/index.ts
import { generateState } from "arctic";
import { google } from "@lib/oauth";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier(); // Assuming generateCodeVerifier is imported or defined elsewhere
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

	context.cookies.set("google_oauth_state", state, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});
	context.cookies.set("google_code_verifier", codeVerifier, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return context.redirect(url.toString());
}
```

----------------------------------------

TITLE: Load and Reference Redis Script
DESCRIPTION: Demonstrates how to load a Lua script into Redis using its client library and obtain its SHA hash. This hash is then used for efficient execution of the script via EVALSHA, avoiding repeated script transfers.

SOURCE: https://lucia-auth.com/rate-limit/token-bucket

LANGUAGE: javascript
CODE:
```
const SCRIPT_SHA = await client.scriptLoad(script);
```

----------------------------------------

TITLE: User Sign Out in SvelteKit
DESCRIPTION: Implements the server-side logic for user sign-out. This action invalidates the current user's session and removes the session cookie. It then redirects the user to the login page. The action returns a `fail` response with status 401 if no active session is found.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/session";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// ...
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
};

```

----------------------------------------

TITLE: Handle GitHub OAuth Callback in Next.js
DESCRIPTION: This route handler manages the callback from GitHub OAuth. It validates the state parameter, exchanges the authorization code for an access token, fetches user profile data from the GitHub API, checks for existing users in the database, creates new users if necessary, and establishes a new session with a cookie. It relies on utility functions from '@/lib/session' and '@/lib/oauth'.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/session";
import { github } from "@/lib/oauth";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(githubUserId, githubUsername);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}

```

----------------------------------------

TITLE: GitHub OAuth Credentials
DESCRIPTION: Environment variables to store GitHub OAuth client ID and secret. These are essential for authenticating with GitHub.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/astro

LANGUAGE: env
CODE:
```
# .env
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

```

----------------------------------------

TITLE: Implement User Sign Out in Next.js
DESCRIPTION: Provides a UI element (a button within a form) to initiate the sign-out process. The `logout` server action invalidates the current user's session, deletes the session cookie, and redirects the user to the login page.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
	return (
		<form action={logout}>
			<button>Sign out</button>
		</form>
	);
}

async function logout(): Promise<ActionResult> {
	"use server";
	const { session } = await getCurrentSession();

	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await invalidateSession(session.id);
	await deleteSessionTokenCookie();

	return redirect("/login");
}

interface ActionResult {
	error: string | null;
}

```

----------------------------------------

TITLE: User Interface Schema for Google OAuth
DESCRIPTION: Defines the TypeScript interface for the user model, including fields to store Google-specific user information like ID and name.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: typescript
CODE:
```
interface User {
	id: number;
	googleId: string;
	name: string;
}
```

----------------------------------------

TITLE: GitHub OAuth Environment Variables
DESCRIPTION: Defines the necessary environment variables for GitHub OAuth integration, including the client ID and secret obtained from the GitHub OAuth app.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/nextjs

LANGUAGE: env
CODE:
```
# .env
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

----------------------------------------

TITLE: Sign Out Functionality
DESCRIPTION: Handles the user sign-out process by invalidating the active session, deleting the session cookie, and redirecting the user to the login page. This involves server-side logic for session management and a client-side form for triggering the action.

SOURCE: https://lucia-auth.com/tutorials/github-oauth/sveltekit

LANGUAGE: typescript
CODE:
```
// routes/+page.server.ts (actions)
import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/session";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// ...
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
};

```

LANGUAGE: svelte
CODE:
```
<!-- routes/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form method="post" use:enhance>
    <button>Sign out</button>
</form>

```

----------------------------------------

TITLE: Protect Route with Session in Next.js
DESCRIPTION: Secures a page component by fetching the current user's session using `getCurrentSession`. If no user is found (i.e., the user is not logged in), it redirects them to the login page. Otherwise, it displays a greeting with the user's name.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/nextjs

LANGUAGE: typescript
CODE:
```
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export default async function Page() {
	const { user } = await getCurrentSession();

	if (user === null) {
		return redirect("/login");
	}

	return <h1>Hi, {user.name}!</h1>;
}

```

----------------------------------------

TITLE: Access Current User from Astro Locals
DESCRIPTION: This snippet demonstrates how to retrieve the currently authenticated user object from Astro's `Astro.locals` property. It includes a check to redirect to the login page if no user is found. This assumes middleware has been set up to populate `Astro.locals.user`.

SOURCE: https://lucia-auth.com/tutorials/google-oauth/astro

LANGUAGE: typescript
CODE:
```
if (Astro.locals.user === null) {
	return Astro.redirect("/login");
}

const user = Astro.locals.user;

```

----------------------------------------

TITLE: Secure Random String Generation
DESCRIPTION: A JavaScript function to generate cryptographically secure random strings for use as session IDs and secrets. It uses `crypto.getRandomValues` and a custom alphabet to ensure sufficient entropy.

SOURCE: https://lucia-auth.com/sessions/basic

LANGUAGE: javascript
CODE:
```
function generateSecureRandomString(): string {
	// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 "removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}
```

----------------------------------------

TITLE: Constant Time Equality Check
DESCRIPTION: Compares two Uint8Array buffers in constant time to prevent timing attacks. This is crucial for security when comparing secrets or hashes.

SOURCE: https://lucia-auth.com/sessions/basic

LANGUAGE: TypeScript
CODE:
```
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}
```