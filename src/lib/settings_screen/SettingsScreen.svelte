<script lang="ts">
    import Switch from "../components/Switch.svelte";
    import { grid_enabled } from "../../stores/settings";

    export let on_close: () => void;

    window.addEventListener("keydown", ev => {
        if (ev.key == "Escape")
            on_close();
    });
</script>

<div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="settings-bg" on:click={on_close} />
    <span class="settings-popup">
        <h4>
            Settings
            <button on:click={on_close} title="Close Settings">
                <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="4" />
                    <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="4" />
                </svg>
            </button>
        </h4>
        Grid: <Switch bind:value={$grid_enabled}/><br/>
    </span>
</div>

<style>
    span.settings-bg {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: black;
        opacity: .7;
    }

    span.settings-popup {
        width: 70%;
        min-width: 300px;
        max-width: 500px;
        height: 70%;
        min-height: 300px;
        max-height: 700px;

        z-index: 1;

        background-color: #303030;
        border-radius: 20px;

        font-size: 20px;
        color: white;
        line-height: 30px;

        padding: 20px;
    }

    div {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        z-index: 1;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    h4 {
        margin-top: 0;

        display: flex;
        justify-content: space-between;
    }

    svg {
        width: 30px;
        height: 30px;

        cursor: pointer;
    }

    button {
        height: 30px;
        width: 30px;

        padding: 0;

        background-color: transparent;
        border-style: none;
    }
</style>