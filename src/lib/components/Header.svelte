<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		user: {
			username: string;
		};
		showLikesButton?: boolean;
	}

	let { user, showLikesButton = true }: Props = $props();
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
				{#if showLikesButton}
					<a
						href="/likes"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						My Likes
					</a>
				{/if}
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
	</div>
</header>