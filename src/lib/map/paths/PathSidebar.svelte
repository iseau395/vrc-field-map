<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const sidebar_visible = writable(false);
</script>

<script lang="ts">

</script>

<aside>
    <h1>
        Path Editor
        <button on:click={() => $sidebar_visible = false}>
            <img src="./media/exit.svg" />
        </button>
    </h1>
    <div>

    </div>
</aside>

<style>
    aside {
        width: 25%;
        max-width: 500px;
        height: calc(100% - 125px);

        padding: 20px;

        position: absolute;
        z-index: 1;
        right: 15px;
        bottom: 15px;

        border-radius: 15px;

        background-color: #303030;
        color: white;
    }

    button, img {
        width: 30px;
        height: 30px;

        padding: 0;

        background-color: transparent;
        border-style: none;

        cursor: pointer;
    }

    div {
        overflow: scroll;
        display: flex;
        flex-direction: column;
    }

    h1 {
        margin: 0;

        display: flex;
        justify-content: space-between;

        padding-left: 20px;
    }
</style>