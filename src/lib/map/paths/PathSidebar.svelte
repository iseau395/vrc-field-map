<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const sidebar_visible = writable(false);
</script>

<script lang="ts">
    import PathItem from "./PathItem.svelte";
    import { path } from "../field";

    let path_array = path.path;
    path.on_path_updated(p => {
        path_array = p;
    })
</script>

<aside>
    <h1>
        Path Editor
        <button on:click={()=> $sidebar_visible = false} title="Close Sidebar">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="4" />
                <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="4" />
            </svg>
        </button>
    </h1>
    <ul>
        {#each path_array as segment}
        <PathItem segment={segment} />
        {/each}
    </ul>
</aside>

<style>
    aside {
        width: 25%;
        max-width: 500px;
        height: calc(100% - 125px);

        padding: 20px;
        padding-right: 15px;
        padding-left: 15px;

        position: absolute;
        z-index: 1;
        right: 15px;
        bottom: 15px;

        border-radius: 15px;

        background-color: #303030;
        color: white;

        display: flex;
        flex-direction: column;
    }

    button,
    svg {
        width: 30px;
        height: 30px;

        padding: 0;

        background-color: transparent;
        border-style: none;

        cursor: pointer;

        user-select: none;
    }

    ul {
        height: auto;

        display: flexbox;
        flex-direction: column;

        flex: 1 1 auto;

        overflow-y: auto;

        padding: 0;
        padding-right: 5px;
        padding-left: 5px;
    }

    h1 {
        margin: 0;

        display: flex;
        justify-content: space-between;

        padding-left: 20px;
    }
</style>