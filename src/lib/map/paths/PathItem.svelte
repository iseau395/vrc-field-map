<script lang="ts">
    import { is_point } from "./path";
    import { onMount, onDestroy} from "svelte";
    import type { Point } from "./point";
    import type { Bezier } from "./bezier";
    import { inch_pixel_ratio } from "../constants";

    import OptionsDropdown from "./OptionsDropdown.svelte";

    export let segment: Point | Bezier;

    const point = is_point(segment);

    let canvas: HTMLCanvasElement;

    let unsub;

    onMount(() => {
        if (point) return;

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

            console.log((max_x - min_x)*scale);

            ctx.scale(scale, scale);
            ctx.translate(-min_x + (50 - (max_x - min_x)*scale)/2/scale, -min_y + (50 - (max_y - min_y)*scale)/2/scale);

            segment.render(ctx);
            for (const point of segment.points) {
                point.render(ctx);
            }
        });
    });


    if (unsub)
        onDestroy(unsub);
</script>

<li>
    {#if point}
    <svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="#DD0000"/></svg>
    Point ({Math.round($segment.x / inch_pixel_ratio * 100) / 100}, {Math.round($segment.y / inch_pixel_ratio * 100) / 100})
    {:else}
    <canvas width="50" height="50" bind:this={canvas}></canvas>
    Bezier Curve
    {/if}
    <OptionsDropdown />
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