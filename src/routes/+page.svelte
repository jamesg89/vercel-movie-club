<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let searchTitle = $state(data.searchTitle);
	let searchYear = $state(data.searchYear);
	let sortBy = $state('title'); // Default sort by title

	// Filter and sort movies based on search criteria and sort option
	let filteredMovies = $derived(() => {
		let filtered = data.movies.filter((movie) => {
			const titleMatch =
				!searchTitle || movie.title.toLowerCase().includes(searchTitle.toLowerCase());
			const yearMatch = !searchYear || movie.year.toString().includes(searchYear);
			return titleMatch && yearMatch;
		});

		// Apply sorting
		switch (sortBy) {
			case 'year-latest':
				return filtered.sort((a, b) => b.year - a.year);
			case 'year-oldest':
				return filtered.sort((a, b) => a.year - b.year);
			case 'genre':
				return filtered.sort((a, b) => (a.genre || '').localeCompare(b.genre || ''));
			case 'likes':
				return filtered.sort((a, b) => b.totalLikes - a.totalLikes);
			default:
				return filtered.sort((a, b) => a.title.localeCompare(b.title));
		}
	});

	async function handleSearch() {
		const params = new URLSearchParams();
		if (searchTitle) params.set('title', searchTitle);
		if (searchYear) params.set('year', searchYear);

		const url = $page.url.pathname + (params.toString() ? '?' + params.toString() : '');
		await goto(url, { replaceState: true });
	}

	function clearSearch() {
		searchTitle = '';
		searchYear = '';
		sortBy = 'title';
		handleSearch();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<Header user={data.user} />

	<!-- Search/Filter Section -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-lg font-medium text-gray-900">Search & Filter Movies</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div>
					<label for="title-search" class="mb-2 block text-sm font-medium text-gray-700">
						Movie Title
					</label>
					<input
						id="title-search"
						type="text"
						bind:value={searchTitle}
						placeholder="Search by title..."
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						oninput={handleSearch}
					/>
				</div>
				<div>
					<label for="year-search" class="mb-2 block text-sm font-medium text-gray-700">
						Year
					</label>
					<input
						id="year-search"
						type="text"
						bind:value={searchYear}
						placeholder="Search by year..."
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						oninput={handleSearch}
					/>
				</div>
				<div>
					<label for="sort-select" class="mb-2 block text-sm font-medium text-gray-700">
						Sort By
					</label>
					<select
						id="sort-select"
						bind:value={sortBy}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="title">Title (A-Z)</option>
						<option value="year-latest">Year (Latest)</option>
						<option value="year-oldest">Year (Oldest)</option>
						<option value="genre">Genre</option>
						<option value="likes">Most Liked</option>
					</select>
				</div>
				<div class="flex items-end">
					<button
						type="button"
						onclick={clearSearch}
						class="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
					>
						Clear Filters
					</button>
				</div>
			</div>
		</div>

		<!-- Movies Grid -->
		<div class="mb-6">
			<h2 class="mb-4 text-xl font-semibold text-gray-900">
				{filteredMovies().length} Movies Found
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredMovies() as movie (movie.id)}
				<div
					class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
				>
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
						<div class="mb-3 flex items-center text-xs text-gray-500">
							<svg class="mr-1 h-3 w-3 fill-current" viewBox="0 0 24 24">
								<path
									d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
								/>
							</svg>
							{movie.totalLikes} {movie.totalLikes === 1 ? 'like' : 'likes'}
						</div>

						<!-- Like Button -->
						<form method="post" action="?/toggleLike" use:enhance>
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

		{#if filteredMovies().length === 0}
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
				<p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
			</div>
		{/if}
	</div>
</div>
