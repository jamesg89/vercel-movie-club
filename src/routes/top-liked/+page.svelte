<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<Header user={data.user} />

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Top 20 Most Liked Movies</h1>
			<p class="mt-2 text-gray-600">Discover the community's favorite films</p>
		</div>

		<!-- Movies Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each data.movies as movie, index (movie.id)}
				<div
					class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
				>
					<!-- Ranking Badge -->
					<div class="absolute left-2 top-2 z-10">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full {index < 3
								? 'bg-yellow-500 text-white'
								: 'bg-gray-600 text-white'} text-sm font-bold"
						>
							{index + 1}
						</div>
					</div>

					<div class="flex h-64 w-full items-center justify-center bg-gray-200">
						{#if movie.posterUrl}
							<img
								src={movie.posterUrl}
								alt={movie.title}
								class="h-full w-full object-cover"
							/>
						{:else}
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
						{/if}
					</div>

					<div class="p-4">
						<h3
							class="mb-1 overflow-hidden text-sm font-semibold text-gray-900"
							style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
						>
							{movie.title}
						</h3>
						<div class="mb-3 flex items-center justify-between">
							<p class="text-sm text-gray-600">{movie.year}</p>
							{#if movie.genre}
								<span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
									{movie.genre}
								</span>
							{/if}
						</div>

						{#if movie.summary}
							<p
								class="mb-3 overflow-hidden text-xs text-gray-700"
								style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
							>
								{movie.summary}
							</p>
						{/if}

						<!-- Total Likes Counter -->
						<div class="mb-3 flex items-center justify-center rounded-md bg-yellow-50 py-2 text-sm text-yellow-800">
							<svg class="mr-1 h-4 w-4 fill-current" viewBox="0 0 24 24">
								<path
									d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
								/>
							</svg>
							<strong>{movie.totalLikes} {movie.totalLikes === 1 ? 'like' : 'likes'}</strong>
						</div>

						<!-- Like Button -->
						<form method="post" action="/?/toggleLike" use:enhance>
							<input type="hidden" name="movieId" value={movie.id} />
							<button
								type="submit"
								class="flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 {movie.isLiked
									? 'bg-red-100 text-red-700 hover:bg-red-200'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								<svg
									class="mr-2 h-4 w-4 {movie.isLiked ? 'fill-current' : 'stroke-current'}"
									viewBox="0 0 24 24"
								>
									<path
										d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
									/>
								</svg>
								{movie.isLiked ? 'Unlike' : 'Like'}
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>

		{#if data.movies.length === 0}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 7v10h6V7H9z"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No movies found</h3>
				<p class="mt-1 text-sm text-gray-500">No movies have been liked yet.</p>
			</div>
		{/if}
	</div>
</div>