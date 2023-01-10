<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import type { Option } from "./context_menu.ts";

    export let og_x: number;
    export let og_y: number;

    export let name: string;
    export let options: ContextMenuOption[] | null = null;

    let submenu_visible = false;
    function onmouseenter() {
        submenu_visible = true;
    }
    function onmouseleave() {
        submenu_visible = false;
    }
</script>

<div on:click on:mouseenter={onmouseenter} on:mouseleave={onmouseleave}>
    {name}

    {#if options != null}
    ...
    <span>
        >
    </span>
    {/if}

    {#if submenu_visible && options != null}
    <ContextMenu x=14 y=0 og_x={og_x} og_y={og_y} on:mouseenter={onmouseenter} on:mouseleave={onmouseleave} options={options}/>
    {/if}
</div>

<style>
    div {
        width: calc(100% - 15px);
        height: 15px;

        padding: 5px;
        padding-left: 10px;

        font-size: 13px;
        color: #CCCCCC;

        display: flex;
        justify-content: space-between;
    }

    div:hover {
        background-color: #454545;
        cursor: pointer;
    }

    span {
        margin-right: 3px;
    }
</style>