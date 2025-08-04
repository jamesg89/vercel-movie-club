<script lang="ts">
	import { enhance } from '$app/forms';

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
</script>

<header class="bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-6">
			<div class="flex items-center">
				<a href="/" class="block">
					<!-- Theater Marquee SVG -->
					<svg width="200" height="100" viewBox="0 0 200 100" class="h-20 w-auto">
						<!-- Marquee Background -->
						<rect x="10" y="10" width="180" height="80" rx="8" fill="#000000" stroke="#333333" stroke-width="2"/>
						
						<!-- Marquee Border Lights -->
						<circle cx="20" cy="20" r="3" fill="#ffffff"/>
						<circle cx="35" cy="20" r="3" fill="#ffffff"/>
						<circle cx="50" cy="20" r="3" fill="#ffffff"/>
						<circle cx="65" cy="20" r="3" fill="#ffffff"/>
						<circle cx="80" cy="20" r="3" fill="#ffffff"/>
						<circle cx="100" cy="20" r="3" fill="#ffffff"/>
						<circle cx="115" cy="20" r="3" fill="#ffffff"/>
						<circle cx="130" cy="20" r="3" fill="#ffffff"/>
						<circle cx="145" cy="20" r="3" fill="#ffffff"/>
						<circle cx="160" cy="20" r="3" fill="#ffffff"/>
						<circle cx="175" cy="20" r="3" fill="#ffffff"/>
						
						<circle cx="20" cy="80" r="3" fill="#ffffff"/>
						<circle cx="35" cy="80" r="3" fill="#ffffff"/>
						<circle cx="50" cy="80" r="3" fill="#ffffff"/>
						<circle cx="65" cy="80" r="3" fill="#ffffff"/>
						<circle cx="80" cy="80" r="3" fill="#ffffff"/>
						<circle cx="100" cy="80" r="3" fill="#ffffff"/>
						<circle cx="115" cy="80" r="3" fill="#ffffff"/>
						<circle cx="130" cy="80" r="3" fill="#ffffff"/>
						<circle cx="145" cy="80" r="3" fill="#ffffff"/>
						<circle cx="160" cy="80" r="3" fill="#ffffff"/>
						<circle cx="175" cy="80" r="3" fill="#ffffff"/>
						
						<!-- Side Lights -->
						<circle cx="20" cy="35" r="3" fill="#ffffff"/>
						<circle cx="20" cy="50" r="3" fill="#ffffff"/>
						<circle cx="20" cy="65" r="3" fill="#ffffff"/>
						<circle cx="175" cy="35" r="3" fill="#ffffff"/>
						<circle cx="175" cy="50" r="3" fill="#ffffff"/>
						<circle cx="175" cy="65" r="3" fill="#ffffff"/>
						
						<!-- Text -->
						<text x="100" y="42" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">PLAYING AT:</text>
						<text x="100" y="68" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">THE TRAP</text>
					</svg>
				</a>
			</div>
			<div class="flex items-center space-x-4">
				<span class="hidden text-gray-700 md:inline">Welcome, {user.username}!</span>
				
				<!-- Navigation Links -->
				<nav class="hidden space-x-2 md:flex">
					<a
						href="/"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						All Movies
					</a>
					<a
						href="/top-liked"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Top Liked
					</a>
					<a
						href="/requests"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					>
						Requests
					</a>
					{#if showLikesButton}
						<a
							href="/likes"
							class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							My Likes
						</a>
					{/if}
				</nav>

				<!-- Mobile Menu Button -->
				<div class="md:hidden">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
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
						class="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
					>
						Sign Out
					</button>
				</form>
			</div>
		</div>

		<!-- Mobile Menu -->
		<div id="mobile-menu" class="hidden border-t border-gray-200 pb-3 pt-4 md:hidden">
			<div class="space-y-1 px-2">
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
				>
					All Movies
				</a>
				<a
					href="/top-liked"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
				>
					Top Liked
				</a>
				<a
					href="/requests"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
				>
					Requests
				</a>
				{#if showLikesButton}
					<a
						href="/likes"
						class="block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
					>
						My Likes
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>