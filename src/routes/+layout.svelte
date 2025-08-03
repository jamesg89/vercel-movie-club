<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Movie Club</title>
	<meta name="description" content="A modern movie discovery and voting platform" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
