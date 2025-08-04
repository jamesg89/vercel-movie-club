<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Trap Movie Club</title>
	<meta name="description" content="Vote for the next movie night at The Trap" />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen" style="background-color: #f9fafc;">
	{@render children?.()}
</div>
