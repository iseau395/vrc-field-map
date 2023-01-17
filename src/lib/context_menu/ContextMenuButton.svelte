<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import type { ContextMenuOption } from "./context_menu";

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click on:mouseenter={onmouseenter} on:mouseleave={onmouseleave}>
    {name + (options != null ? "..." : "")}

    {#if options}
    <span>
        >
    </span>
    {/if}

    {#if submenu_visible && options != null}
    <ContextMenu x={14} y={0} og_x={og_x} og_y={og_y} on:mouseenter={onmouseenter} on:mouseleave={onmouseleave} options={options}/>
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