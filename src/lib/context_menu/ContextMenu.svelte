<script lang="ts">
    import ContextMenuButton from "./ContextMenuButton.svelte";
    import type Option from "./context_menu.ts";

    export let x = 0;
    export let y = 0;
    export let options: Option[];

    x += 1;

    console.log(options);
</script>

<span style="left: {x}px; top:{y}px;" on:contextmenu|preventDefault>
    <div on:mouseenter on:mouseleave>
        {#each options as option}
        <ContextMenuButton name={option.name} options={option.options} on:click={option.on_select}/>
        {/each}
    </div>
</span>

<style>
    div {
        width: calc(100% - 10px);
        height: 100%;

        user-select: none;

        border-width: 1px;
        border-color: #404040;
        border-style: solid;
        border-radius: 5px;

        background-color: #303030;

        display: flex;
        align-items: center;
        flex-direction: column;
    }

    span {
        width: 150px;

        position: absolute;
        z-index: 1;
    }
</style>