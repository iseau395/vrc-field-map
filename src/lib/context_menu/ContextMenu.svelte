<script lang="ts">
    import { translate_cords } from "../map/field";
    import ContextMenuButton from "./ContextMenuButton.svelte";
    import type { ContextMenuOption, ContextMenuOptionCallback } from "./context_menu";

    export let x: number;
    export let y: number;
    export let og_x = 0;
    export let og_y = 0;
    export let options: ContextMenuOption[];

    x += 1;

    function button_pressed(callback: ContextMenuOptionCallback["on_select"]) {
        if (!callback)
            return;

        const translated = translate_cords(og_x || x, og_y || y);

        callback(
            translated.x,
            translated.y
        );
    }
</script>

<span style="left: {x}px; top:{y}px;" on:contextmenu|preventDefault>
    <div on:mouseenter on:mouseleave>
        {#each options as option}
        <ContextMenuButton name={option.name} options={"options" in option ? option.options : null} og_x={x ?? og_x} og_y={y ?? og_y} on:click={"on_select" in option ? () => button_pressed("on_select" in option ? option.on_select : null) : undefined}/>
        {/each}
    </div>
</span>

<style>
    div {
        width: calc(100% - 10px);
        height: 100%;
        margin: 0;

        user-select: none;

        border-width: 1px;
        border-color: #404040;
        border-style: solid;
        border-radius: 5px;

        background-color: #303030;

        display: inline-flex;
        align-items: center;
        flex-direction: column;
    }

    span {
        width: 150px;

        position: absolute;
        z-index: 1;
    }
</style>