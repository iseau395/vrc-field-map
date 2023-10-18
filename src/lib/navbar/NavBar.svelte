<script lang="ts">
    import Button from "../components/Button.svelte";
    import { settings_screen_visible } from "../../stores/settings";
    import { sidebar_visible } from "../map/paths/PathSidebar.svelte";
    import { current_save_id, save_as } from "../map/saving";
    import { new_save_screen_open } from "../save_screens/NewSaveScreen.svelte";
</script>

<div class="navbar-wrapper">
    <div class="navbar-main">
        <Button text="Settings" on:click={() => $settings_screen_visible = !$settings_screen_visible} />
        <Button text="Edit Path" on:click={() => $sidebar_visible = !$sidebar_visible} />
        <Button text="New Save" on:click={() => $new_save_screen_open = !$new_save_screen_open} />
        <!-- <Button text="Load Save" on:click={() => $saving_screen_visible = !$saving_screen_visible} /> -->
        <Button text="Save as..." on:click={() => {
            const new_id = prompt("What should it be saved as?");
            if (!new_id) return;

            save_as(new_id);
            $current_save_id = new_id;
        }} />
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