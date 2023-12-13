<script lang="ts">
    import NavBar from "./lib/navbar/NavBar.svelte";
    import Map from "./lib/map/Map.svelte";
    import SettingsScreen from "./lib/settings_screen/SettingsScreen.svelte";
    import { game_type, settings_screen_visible } from "./stores/settings";
    import NewSaveScreen, { new_save_screen_open } from "./lib/save_screens/NewSaveScreen.svelte";
    import { current_save_id } from "./lib/map/saving";
    import LoadSaveScreen, { load_save_screen_open } from "./lib/save_screens/LoadSaveScreen.svelte";

    function close_settings() {
        $settings_screen_visible = false;
    }

    const hover_query = window.matchMedia("(hover: hover)");
    const pointer_query = window.matchMedia("(pointer: fine)");

    let has_hover = hover_query.matches;
    let has_pointer = pointer_query.matches;

    hover_query.onchange = (q) => {
        has_hover = q.matches;
    };
    pointer_query.onchange = (q) => {
        has_pointer = q.matches;
    };

    $: hasMouse = has_hover || has_pointer;
</script>

<main>
    <NavBar/>
    {#key $current_save_id}
    <Map />
    {/key}
    {#if !hasMouse}
    <p>
        It looks like you are on a device without a mouse or touchpad. If you can, please use a device with a mouse or touchpad as this map is only designed to work on these devices.
    </p>
    {/if}

    {#if $settings_screen_visible}
    <SettingsScreen on_close={close_settings} />
    {/if}

    {#if $new_save_screen_open}
    <NewSaveScreen/>
    {/if}

    {#if $load_save_screen_open}
    <LoadSaveScreen/>
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100%;

        display: flex;
    }
    
    p {
        position: absolute;

        top: 100px;

        color: white;
        background-color: rgb(190, 95, 95);
        display: block;
        margin-left: 1cm;
        margin-right: 1cm;
        border-style: solid;
        border-width: 2px;
        border-color: red;
        max-width: 400px;
        border-radius: 10px;
        padding: 0.2cm;

        z-index: 1;
    }
</style>