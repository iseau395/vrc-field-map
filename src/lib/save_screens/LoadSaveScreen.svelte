<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const load_save_screen_open = writable(false);
</script>

<script lang="ts">
    import SaveFile from "./SaveFile.svelte";

    window.addEventListener("keydown", ev => {
        if (ev.key == "Escape")
            $load_save_screen_open = false;
    });

    let raw_saves = localStorage.getItem("save-list");

    let saves = raw_saves ? raw_saves.split("|") : [];

    function update_saves_list() {
        raw_saves = localStorage.getItem("save-list");
        saves = raw_saves ? raw_saves.split("|") : [];
    }
</script>

<div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="new-save-bg" on:click={() => $load_save_screen_open = false} />
    <span class="new-save-popup">
        <h4>
            Load Save...
            <button on:click={() => $load_save_screen_open = false} title="Close New Save Screen">
                <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="4" />
                    <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="4" />
                </svg>
            </button>
        </h4>

        <ul>
            {#if raw_saves}
            {#key saves}
            {#each saves as save}
            <SaveFile id={save} update_saves_list={update_saves_list}/>
            {/each}
            {/key}
            {:else}
            <p>No saves found!</p>
            {/if}
        </ul>
    </span>
</div>

<style>
    span.new-save-bg {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: black;
        opacity: .7;
    }

    span.new-save-popup {
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

    ul {
        list-style-type: none;
        padding: 0;
    }
</style>