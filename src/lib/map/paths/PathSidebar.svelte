<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const sidebar_visible = writable(false);
    export const insert_dropdown_open = writable(false);
</script>

<script lang="ts">
    import PathItem from "./PathItem.svelte";
    import { path } from "../field";
    import InsertDropdown from "./InsertDropdown.svelte";
</script>

<aside>
    <h1>
        Path Editor
        <button on:click={() => $sidebar_visible = false} title="Close Sidebar" class="exit-sidebar-button">
            <svg viewBox="0 0 50 50">
                <line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="4" />
                <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="4" />
            </svg>
        </button>
    </h1>
    <ul>
        <!-- {#key $path.path} -->
        {#each $path.path as segment, index}
        <PathItem segment={segment} {index} />
        {/each}
        <!-- {/key} -->

        {#if $insert_dropdown_open}
        <InsertDropdown></InsertDropdown>
        {/if}

        <li>
            <button on:click={() => $insert_dropdown_open = ! $insert_dropdown_open}>
            <svg viewBox="0 0 50 50">
                <line x1="5" y1="25" x2="45" y2="25" stroke="#555555" stroke-width="5" stroke-linecap="round" />
                <line x1="25" y1="5" x2="25" y2="45" stroke="#555555" stroke-width="5" stroke-linecap="round" />
            </svg>

            <span>Insert Path Segment</span>
                
            </button>
        </li>
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

    h1 {
        margin: 0;

        display: flex;
        justify-content: space-between;

        padding-left: 20px;
    }

    .exit-sidebar-button,
    svg {
        width: 30px;
        height: 30px;

        padding: 0;

        margin-left: 5px;

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
        overflow-x: hidden;

        margin-top: 0;

        padding: 0;
        padding-right: 5px;
        padding-left: 5px;
        padding-top: 1em;
    }

    li {
        width: 100%;
        height: 60px;

        border-radius: 10px;
        margin: 0px;

        background-color: rgb(193, 193, 193);
        color: black;

        list-style-type: none;

        cursor: pointer;
    }

    button {
        width: 100%;
        height: 100%;

        border-radius: 10px;
        padding: 5px;
        margin: 0;

        display: flex;
        align-items: center;
        justify-content: flex-start;

        background-color: rgba(0, 0, 0, 0);
        border-width: 0;

        cursor: pointer;
    }

    span {
        margin-left: 10px;
    }

    li:hover {
        background-color: rgb(163, 163, 163);
    }
</style>
