<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const sidebar_visible = writable(false);
</script>

<script lang="ts">
    import PathItem from "./PathItem.svelte";


    const segments = [{
        label: "test1"
    },{
        label: "test2"
    },{
        label: "test3"
    },{
        label: "test4"
    },{
        label: "test1"
    },{
        label: "test2"
    },{
        label: "test3"
    },{
        label: "test4"
    },{
        label: "test1"
    },{
        label: "test2"
    },{
        label: "test3"
    },{
        label: "test4"
    },{
        label: "test1"
    },{
        label: "test2"
    },{
        label: "test3"
    },{
        label: "test4"
    }];
</script>

<aside>
    <h1>
        Path Editor
        <button on:click={() => $sidebar_visible = false}>
            <img src="./media/exit.svg" alt="Close sidebar"/>
        </button>
    </h1>
    <ul>
        {#each segments as segment}
        <PathItem label={segment.label} />
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

    button, img {
        width: 30px;
        height: 30px;

        padding: 0;

        background-color: transparent;
        border-style: none;

        cursor: pointer;
    }

    ul {
        height: auto;

        overflow-y: auto;
        display: flexbox;
        flex-direction: column;

        padding: 0;
        padding-right: 5px;

        flex: 1 1 auto;
    }

    h1 {
        margin: 0;

        display: flex;
        justify-content: space-between;

        padding-left: 20px;
    }
</style>