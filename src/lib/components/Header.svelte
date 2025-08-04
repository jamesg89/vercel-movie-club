<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	interface Props {
		user: {
			username: string;
		};
		showLikesButton?: boolean;
	}

	let { user, showLikesButton = true }: Props = $props();

	function toggleMobileMenu() {
		const menu = document.getElementById('mobile-menu');
		menu?.classList.toggle('hidden');
	}

	// Helper function to check if current page matches the href
	function isActivePage(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<header style="background-color: #fff;" class="shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-6">
			<div class="flex items-center">
				<a href="/" class="block">
					<img src="/logo.png" alt="Trap Movie Club Logo" class="h-20 w-auto" />
				</a>
			</div>
			<div class="flex items-center space-x-4">
				<span class="hidden md:inline" style="color: #111111;">Welcome, {user.username}!</span>
				
				<!-- Navigation Links -->
				<nav class="hidden space-x-2 md:flex">
					<a
						href="/"
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActivePage('/') 
							? 'text-black' 
							: 'hover:text-black'}"
						style="{isActivePage('/') 
							? 'background-color: #FDCA5A; color: #000000;' 
							: 'color: #111111;'}"
					>
						All Movies
					</a>
					<a
						href="/top-liked"
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActivePage('/top-liked') 
							? 'text-black' 
							: 'hover:text-black'}"
						style="{isActivePage('/top-liked') 
							? 'background-color: #FDCA5A; color: #000000;' 
							: 'color: #111111;'}"
					>
						Top Liked
					</a>
					<a
						href="/requests"
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActivePage('/requests') 
							? 'text-black' 
							: 'hover:text-black'}"
						style="{isActivePage('/requests') 
							? 'background-color: #FDCA5A; color: #000000;' 
							: 'color: #111111;'}"
					>
						Requests
					</a>
					{#if showLikesButton}
						<a
							href="/likes"
							class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActivePage('/likes') 
								? 'text-black' 
								: 'hover:text-black'}"
							style="{isActivePage('/likes') 
								? 'background-color: #FDCA5A; color: #000000;' 
								: 'color: #111111;'}"
						>
							My Likes
						</a>
					{/if}
				</nav>

				<!-- Mobile Menu Button -->
				<div class="md:hidden">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 transition-colors"
						style="color: #111111;"
						onclick={toggleMobileMenu}
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>

				<form method="post" action="/logout" use:enhance>
					<button
						type="submit"
						class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
						style="background-color: #111111; color: #f9fafc;"
					>
						Sign Out
					</button>
				</form>
			</div>
		</div>

		<!-- Mobile Menu -->
		<div id="mobile-menu" class="hidden pb-3 pt-4 md:hidden" style="border-top: 1px solid #111111;">
			<div class="space-y-1 px-2">
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium transition-colors"
					style="{isActivePage('/') 
						? 'background-color: #FDCA5A; color: #000000;' 
						: 'color: #111111;'}"
				>
					All Movies
				</a>
				<a
					href="/top-liked"
					class="block rounded-md px-3 py-2 text-base font-medium transition-colors"
					style="{isActivePage('/top-liked') 
						? 'background-color: #FDCA5A; color: #000000;' 
						: 'color: #111111;'}"
				>
					Top Liked
				</a>
				<a
					href="/requests"
					class="block rounded-md px-3 py-2 text-base font-medium transition-colors"
					style="{isActivePage('/requests') 
						? 'background-color: #FDCA5A; color: #000000;' 
						: 'color: #111111;'}"
				>
					Requests
				</a>
				{#if showLikesButton}
					<a
						href="/likes"
						class="block rounded-md px-3 py-2 text-base font-medium transition-colors"
						style="{isActivePage('/likes') 
							? 'background-color: #FDCA5A; color: #000000;' 
							: 'color: #111111;'}"
					>
						My Likes
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>