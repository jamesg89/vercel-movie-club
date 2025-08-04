<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let title = $state('');
	let year = $state('');
	let status = $state('');
	let isSubmitting = $state(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		
		if (!title.trim()) {
			status = 'Movie title is required';
			return;
		}

		isSubmitting = true;
		status = 'Submitting...';
		
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const object = Object.fromEntries(formData);
		const json = JSON.stringify(object);

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: json
			});
			
			const result = await response.json();
			
			if (result.success) {
				status = 'Movie request submitted successfully!';
				title = '';
				year = '';
			} else {
				status = 'Failed to submit request. Please try again.';
			}
		} catch (error) {
			status = 'Failed to submit request. Please try again.';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<Header user={data.user} />

	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold" style="color: #000000;">Movie Requests</h1>
			<p class="mt-2" style="color: #111111;">Request movies to be added to our collection</p>
		</div>

		<!-- Request Form -->
		<div class="mb-8 rounded-lg p-6 shadow" style="background-color: #FDCA5A;">
			<h2 class="mb-4 text-lg font-medium" style="color: #000000;">Request a Movie</h2>
			
			{#if status}
				<div class="mb-4 rounded-md p-4" style="{status.includes('success') ? 'background-color: #5cb85c;' : 'background-color: #F7ADC8; border: 2px solid #111111;'}">
					<div class="flex">
						<svg class="h-5 w-5" style="color: #111111;" viewBox="0 0 20 20" fill="currentColor">
							{#if status.includes('success')}
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							{:else}
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							{/if}
						</svg>
						<div class="ml-3">
							<p class="text-sm font-medium" style="color: #000000;">{status}</p>
						</div>
					</div>
				</div>
			{/if}

			<form onsubmit={handleSubmit}>
				<input type="hidden" name="access_key" value="e8624904-c31f-43eb-a896-f5b500c29f5a">
				<input type="hidden" name="subject" value="Movie Request from Trap Movie Club">
				<input type="hidden" name="from_name" value="Trap Movie Club">
				<input type="hidden" name="redirect" value="false">
				
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="md:col-span-2">
						<label for="title" class="mb-2 block text-sm font-medium" style="color: #111111;">
							Movie Title *
						</label>
						<input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							required
							placeholder="Enter movie title..."
							class="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
							style="border-color: #111111; background-color: #f9fafc; color: #111111; focus:ring-color: #F7ADC8;"
						/>
					</div>
					<div class="md:col-span-2">
						<label for="year" class="mb-2 block text-sm font-medium" style="color: #111111;">
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
							class="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2"
							style="border-color: #111111; background-color: #f9fafc; color: #111111; focus:ring-color: #F7ADC8;"
						/>
					</div>
				</div>
				<div class="mt-6">
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
						style="background-color: #111111; color: #f9fafc; focus:ring-color: #F7ADC8;"
					>
						{isSubmitting ? 'Submitting...' : 'Submit Request'}
					</button>
				</div>
			</form>
		</div>

		<!-- Instructions -->
		<div class="rounded-lg p-6" style="background-color: #F7ADC8;">
			<div class="flex">
				<svg class="h-5 w-5" style="color: #111111;" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
				</svg>
				<div class="ml-3">
					<h3 class="text-sm font-medium" style="color: #000000;">How to Request Movies</h3>
					<div class="mt-2 text-sm" style="color: #111111;">
						<p>Use the form above to suggest movies you'd like to see added to our collection. Include the title and year (if known) to help us find the right movie.</p>
					</div>
				</div>
			</div>
		</div>
	</div>