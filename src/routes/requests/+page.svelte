<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	let title = $state('');
	let year = $state('');
	let genre = $state('');
	let reason = $state('');
	let isSubmitting = $state(false);

	// Reset form on successful submission
	$effect(() => {
		if (form?.success) {
			title = '';
			year = '';
			genre = '';
			reason = '';
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<Header user={data.user} />

	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Movie Requests</h1>
			<p class="mt-2 text-gray-600">Request movies to be added to our collection</p>
		</div>

		<!-- Request Form -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-lg font-medium text-gray-900">Request a Movie</h2>
			
			{#if form?.success}
				<div class="mb-4 rounded-md bg-green-50 p-4">
					<div class="flex">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						<div class="ml-3">
							<p class="text-sm font-medium text-green-800">{form.message}</p>
						</div>
					</div>
				</div>
			{/if}

			{#if form?.message && !form?.success}
				<div class="mb-4 rounded-md bg-red-50 p-4">
					<div class="flex">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
						<div class="ml-3">
							<p class="text-sm font-medium text-red-800">{form.message}</p>
						</div>
					</div>
				</div>
			{/if}

			<form 
				method="post" 
				action="?/submit" 
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="md:col-span-2">
						<label for="title" class="mb-2 block text-sm font-medium text-gray-700">
							Movie Title *
						</label>
						<input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							required
							placeholder="Enter movie title..."
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label for="year" class="mb-2 block text-sm font-medium text-gray-700">
							Year (Optional)
						</label>
						<input
							id="year"
							name="year"
							type="number"
							bind:value={year}
							placeholder="e.g., 2023"
							min="1900"
							max="2030"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label for="genre" class="mb-2 block text-sm font-medium text-gray-700">
							Genre (Optional)
						</label>
						<input
							id="genre"
							name="genre"
							type="text"
							bind:value={genre}
							placeholder="e.g., Action, Comedy"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div class="md:col-span-2">
						<label for="reason" class="mb-2 block text-sm font-medium text-gray-700">
							Why should we add this movie? *
						</label>
						<textarea
							id="reason"
							name="reason"
							bind:value={reason}
							required
							rows="3"
							placeholder="Tell us why this movie would be a great addition..."
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						></textarea>
					</div>
				</div>
				<div class="mt-6">
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
					>
						{isSubmitting ? 'Submitting...' : 'Submit Request'}
					</button>
				</div>
			</form>
		</div>

		<!-- Recent Requests -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-lg font-medium text-gray-900">Recent Requests</h2>
			
			{#if data.requests.length > 0}
				<div class="space-y-4">
					{#each data.requests as request}
						<div class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h3 class="font-medium text-gray-900">
										{request.title}
										{#if request.year}
											<span class="text-gray-500">({request.year})</span>
										{/if}
									</h3>
									{#if request.genre}
										<p class="mt-1 text-sm text-gray-600">Genre: {request.genre}</p>
									{/if}
									<p class="mt-2 text-sm text-gray-700">{request.reason}</p>
									<p class="mt-2 text-xs text-gray-500">
										Requested on {new Date(request.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div class="ml-4">
									<span class="inline-flex rounded-full px-2 py-1 text-xs font-medium {
										request.status === 'approved' ? 'bg-green-100 text-green-800' :
										request.status === 'rejected' ? 'bg-red-100 text-red-800' :
										'bg-yellow-100 text-yellow-800'
									}">
										{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-8 text-center">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 7v10h6V7H9z" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No requests yet</h3>
					<p class="mt-1 text-sm text-gray-500">Be the first to request a movie!</p>
				</div>
			{/if}
		</div>
	</div>
</div>