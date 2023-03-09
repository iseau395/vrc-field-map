<script lang="ts">
    import { onMount, onDestroy} from "svelte";
    import type { Point } from "./point";
    import type { BezierCurve } from "./bezier";
    import { inch_pixel_ratio } from "../constants";

    import OptionsDropdown from "./OptionsDropdown.svelte";
    import DropdownOption from "./DropdownOption.svelte";
    import { path } from "../field";

    export let segment: Point | BezierCurve;
    export let index: number;

    const point = !("points" in segment);

    let canvas: HTMLCanvasElement;

    let unsub: () => void;

    if ("points" in segment)
        onMount(() => {
            const ctx = canvas.getContext("2d");

            unsub = segment.subscribe(() => {
                let min_x = segment.points[0].x;
                let max_x = segment.points[0].x;
                let min_y = segment.points[0].y;
                let max_y = segment.points[0].y;

                for (const point of segment.points) {
                    if (point.x < min_x)
                        min_x = point.x;
                    if (point.x > max_x)
                        max_x = point.x;

                    if (point.y < min_y)
                        min_y = point.y;
                    if (point.y > max_y)
                        max_y = point.y;
                }

                const x_scale = 40/Math.abs(max_x - min_x);
                const y_scale = 40/Math.abs(max_y - min_y);
                const scale = Math.min(x_scale, y_scale)

                ctx.restore();
                ctx.clearRect(0, 0, 50, 50);
                ctx.save();

                ctx.scale(scale, scale);
                ctx.translate(-min_x + (50 - (max_x - min_x)*scale)/2/scale, -min_y + (50 - (max_y - min_y)*scale)/2/scale);

                segment.render(ctx);
                for (const point of segment.points) {
                    point.render(ctx);
                }
            });
        });

    function translate_cords(x: number, y: number) {
        return `${Math.round(y/inch_pixel_ratio*100)/100}, ${Math.round(x/inch_pixel_ratio*100)/100}`
    }
    function copy_to_clipboard() {

        if (!("points" in segment))
        {
            navigator.clipboard.writeText(
                translate_cords(segment.x, segment.y)
            );
        }
        else
        {
            navigator.clipboard.writeText(
                `pos(${translate_cords(segment.points[0].x, segment.points[0].y)}), ` +
                `pos(${translate_cords(segment.points[1].x, segment.points[1].y)}), ` +
                `pos(${translate_cords(segment.points[2].x, segment.points[2].y)}), ` +
                `pos(${translate_cords(segment.points[3].x, segment.points[3].y)})`
            );
        }
    }


    if (unsub)
        onDestroy(unsub);
</script>

<li>
    {#if "points" in segment}
    <canvas width="50" height="50" bind:this={canvas}></canvas>
    Bézier Curve
    {:else}
    <svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="#DD0000"/></svg>
    Point ({translate_cords($segment.x, $segment.y)})
    {/if}
    <OptionsDropdown>
        <DropdownOption on:click={() => copy_to_clipboard()}>Copy to clipboard</DropdownOption>
        <DropdownOption on:click={() => path.remove_segment(index)}>Delete</DropdownOption>
    </OptionsDropdown>
</li>

<style>
    li {
        width: calc(100% - 10px);
        height: 50px;

        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;

        background-color: rgb(193, 193, 193);
        color: black;

        list-style-type: none;

        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    svg {
        width: 10px;
        height: 10px;

        margin-left: 5px;
        margin-right: 10px
    }

    li:last-child {
        margin-bottom: 0;
    }
</style>