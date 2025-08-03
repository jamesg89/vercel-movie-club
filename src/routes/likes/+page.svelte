<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<div class="flex items-center space-x-4">
					<a href="/" class="font-medium text-blue-600 hover:text-blue-500"> ← Back to Movies </a>
					<h1 class="text-3xl font-bold text-gray-900">My Liked Movies</h1>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-gray-700">Welcome, {data.user.username}!</span>
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

	<!-- Content -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if data.likedMovies.length === 0}
			<div class="py-16 text-center">
				<svg
					class="mx-auto h-16 w-16 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
				<h3 class="mt-4 text-lg font-medium text-gray-900">No liked movies yet</h3>
				<p class="mt-2 text-gray-500">Start exploring movies and like the ones you enjoy!</p>
				<div class="mt-6">
					<a
						href="/"
						class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
					>
						Browse Movies
					</a>
				</div>
			</div>
		{:else}
			<div class="mb-6">
				<h2 class="text-xl font-semibold text-gray-900">
					{data.likedMovies.length} Liked {data.likedMovies.length === 1 ? 'Movie' : 'Movies'}
				</h2>
			</div>

			<div
				class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
			>
				{#each data.likedMovies as movie (movie.id)}
					<div
						class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
					>
						<!-- Placeholder for movie poster -->
						<div class="flex h-64 w-full items-center justify-center bg-gray-200">
							<div class="p-4 text-center text-gray-500">
								<svg class="mx-auto mb-2 h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span class="text-sm">No Image</span>
							</div>
						</div>

						<div class="p-4">
							<h3
								class="mb-1 overflow-hidden text-sm font-semibold text-gray-900"
								style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
							>
								{movie.title}
							</h3>
							<p class="mb-3 text-sm text-gray-600">{movie.year}</p>

							{#if movie.summary}
								<p
									class="mb-3 overflow-hidden text-xs text-gray-700"
									style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
								>
									{movie.summary}
								</p>
							{/if}

							<div class="mb-3 text-xs text-gray-500">
								Liked: {new Date(movie.likedAt).toLocaleDateString()}
							</div>

							<!-- Unlike Button -->
							<form method="post" action="?/unlike" use:enhance>
								<input type="hidden" name="movieId" value={movie.id} />
								<button
									type="submit"
									class="flex w-full items-center justify-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-200"
								>
									<svg class="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
										<path
											d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
										/>
									</svg>
									Unlike
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
