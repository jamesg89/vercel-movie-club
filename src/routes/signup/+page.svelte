<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8" style="background-color: #f9fafc;">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<img src="/logo.png" alt="The Trap Movie Club Logo" class="mx-auto h-32 w-auto mb-8" />
			<h2 class="text-4xl font-black" style="color: #000000; font-family: 'Arial Black', 'Helvetica Bold', sans-serif;">
				Create your account
			</h2>
			<p class="mt-4 text-center text-lg font-bold" style="color: #111111;">
				Or
				<a href="/login" class="font-black transition-colors hover:text-pink-400" style="color: #FDCA5A; text-decoration: underline; text-decoration-color: #FDCA5A;">
					sign in to your existing account
				</a>
			</p>
		</div>
		<form class="mt-8 space-y-6" method="post" use:enhance>
			<div class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-bold mb-2" style="color: #111111;">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="block w-full rounded-lg px-4 py-3 text-lg font-semibold transition-colors focus:outline-none focus:ring-4"
						style="border: 3px solid #111111; background-color: #ffffff; color: #111111; focus:border-color: #FDCA5A; focus:ring-color: #FDCA5A;"
						placeholder="Choose a username"
					/>
				</div>
				<div>
					<label for="password" class="block text-sm font-bold mb-2" style="color: #111111;">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="block w-full rounded-lg px-4 py-3 text-lg font-semibold transition-colors focus:outline-none focus:ring-4"
						style="border: 3px solid #111111; background-color: #ffffff; color: #111111; focus:border-color: #FDCA5A; focus:ring-color: #FDCA5A;"
						placeholder="Create a password"
					/>
				</div>
			</div>

			{#if form?.message}
				<div class="text-center text-lg font-bold" style="color: #dc2626;">{form.message}</div>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-lg px-6 py-4 text-xl font-black transition-colors focus:outline-none focus:ring-4 hover:bg-pink-300"
					style="background-color: #FDCA5A; color: #000000; border: 3px solid #111111; text-shadow: 1px 1px 0px #111111; focus:ring-color: #F7ADC8;"
				>
					SIGN UP
				</button>
			</div>
		</form>
	</div>
</div>
