<script lang="ts">
    import Button from "./Button.svelte";
    import { settings_screen_visible } from "../../stores/settings";
    import { sidebar_visible } from "../map/paths/PathSidebar.svelte";
</script>

<div class="navbar-wrapper">
    <div class="navbar-main">
        <Button text="Settings" on:click={() => $settings_screen_visible = !$settings_screen_visible} />
        <Button text="Edit Path" on:click={() => $sidebar_visible = !$sidebar_visible} />
    </div>
</div>

<style>
    div.navbar-wrapper {
        width: 100%;
        height: 60px;

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1;

        position: fixed;
    }

    div.navbar-main {
        width: calc(100% - 30px);
        height: 40px;

        background-color: #303030;
        border-radius: 15px;

        display: flex;
        align-items: center;

        padding: 6px;
        padding-right: 0;
    }
</style>