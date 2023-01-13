<script lang="ts">
    import NavBar from "./lib/navbar/NavBar.svelte";
    import Map from "./lib/map/Map.svelte";
    import SettingsScreen from "./lib/settings_screen/SettingsScreen.svelte";
    import { settings_screen_visible } from "./stores/settings.ts";

    function close_settings() {
        $settings_screen_visible = false;
    }
</script>

<main>
    <NavBar/>
    <Map />

    {#if $settings_screen_visible}
    <SettingsScreen on_close={close_settings} />
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }
</style>