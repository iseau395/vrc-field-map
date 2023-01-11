<script lang="ts">
    import NavBar from "./lib/navbar/NavBar.svelte";
    import Map from "./lib/map/Map.svelte";
    import GithubLink from "./lib/GithubLink.svelte";
</script>

<main>
    <NavBar/>
    <Map/>
    <GithubLink/>
</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }
</style>