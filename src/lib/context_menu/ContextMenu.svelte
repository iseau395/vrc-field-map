<script lang="ts">
    import { translate_cords } from "../map/field";
    import ContextMenuButton from "./ContextMenuButton.svelte";
    import type Option from "./context_menu.ts";

    export let x: number;
    export let y: number;
    export let og_x = 0;
    export let og_y = 0;
    export let options: ContextMenuOption[];

    x += 1;

    function button_pressed(callback: Option["on_select"]) {
        if (!callback)
            return;

        const translated = translate_cords(og_x, og_y);

        callback(
            translated.x,
            translated.y
        );
    }
</script>

<span style="left: {x}px; top:{y}px;" on:contextmenu|preventDefault>
    <div on:mouseenter on:mouseleave>
        {#each options as option}
        <ContextMenuButton name={option.name} options={option.options} on:click={button_pressed(option.on_select)} og_x={x ?? og_x} og_y={y ?? og_y}/>
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