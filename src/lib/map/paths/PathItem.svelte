<script lang="ts" context="module">
    import { writable } from "svelte/store";

    const selected = writable<HTMLLIElement | null>();
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Point } from "./point";
    import type { BezierCurve } from "./bezier";
    import { inch_pixel_ratio } from "../constants";

    import OptionsDropdown from "./OptionsDropdown.svelte";
    import DropdownOption from "./DropdownOption.svelte";
    import { path } from "../field";

    export let segment: Point | BezierCurve;
    export let index: number;

    let canvas: HTMLCanvasElement;

    if ("points" in segment) {
        let unsub: () => void;
        onMount(() => {
            const ctx = canvas.getContext("2d");

            unsub = segment.subscribe(() => {
                if (!("points" in segment)) return;

                let min_x = segment.points[0].x;
                let max_x = segment.points[0].x;
                let min_y = segment.points[0].y;
                let max_y = segment.points[0].y;

                for (const point of segment.points) {
                    if (point.x < min_x) min_x = point.x;
                    if (point.x > max_x) max_x = point.x;

                    if (point.y < min_y) min_y = point.y;
                    if (point.y > max_y) max_y = point.y;
                }

                const x_scale = 40 / Math.abs(max_x - min_x);
                const y_scale = 40 / Math.abs(max_y - min_y);
                const scale = Math.min(x_scale, y_scale);

                ctx.restore();
                ctx.clearRect(0, 0, 50, 50);
                ctx.save();

                ctx.scale(scale, scale);
                ctx.translate(
                    -min_x + (50 - (max_x - min_x) * scale) / 2 / scale,
                    -min_y + (50 - (max_y - min_y) * scale) / 2 / scale
                );

                segment.render(ctx);
                for (const point of segment.points) {
                    point.render(ctx);
                }
            });
        });

        onDestroy(unsub);
    }

    function translate_cords(x: number, y: number) {
        return `${Math.round(y/inch_pixel_ratio*100)/100}, ${Math.round(x/inch_pixel_ratio*100)/100}`;
    }

    function copy_to_clipboard() {
        if (!("points" in segment)) {
            navigator.clipboard.writeText(
                translate_cords(segment.x, segment.y)
            );
        } else {
            navigator.clipboard.writeText(
                `pos(${translate_cords(
                    segment.points[0].x,
                    segment.points[0].y
                )}), ` +
                `pos(${translate_cords(
                    segment.points[1].x,
                    segment.points[1].y
                )}), ` +
                `pos(${translate_cords(
                    segment.points[2].x,
                    segment.points[2].y
                )}), ` +
                `pos(${translate_cords(
                    segment.points[3].x,
                    segment.points[3].y
                )})`
            );
        }
    }

    function isBefore(el1, el2) {
        let cur;
        if (el2.parentNode === el1.parentNode) {
            for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
                if (cur === el2) return true;
            }
        }
        return false;
    }

    function dragStart(ev: DragEvent) {
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", null);
        $selected = ev.target as HTMLLIElement;
        (ev.target as HTMLLIElement).style.opacity = "0";
    }

    function dragOver(ev: DragEvent) {
        if (!$selected) return;

        $selected.style.opacity = "1";
        $selected.style.boxShadow = "-5px -5px 0 #00AA00";
        $selected.style.marginLeft = "5px";

        if (isBefore($selected, ev.target)) {
            (ev.target as HTMLLIElement).parentNode.insertBefore($selected, ev.target as HTMLLIElement);
        } else {
            (ev.target as HTMLLIElement).parentNode.insertBefore($selected, (ev.target as HTMLLIElement).nextSibling);
        }
        ev.preventDefault();
    }

    function dragEnd(ev: DragEvent) {
        $selected.style.boxShadow = "none"
        $selected.style.marginLeft = "0";

        if (isBefore($selected, ev.target)) {
            (ev.target as HTMLLIElement).parentNode.insertBefore($selected, ev.target as HTMLLIElement);
        } else {
            (ev.target as HTMLLIElement).parentNode.insertBefore($selected, (ev.target as HTMLLIElement).nextSibling);
        }

        const nodes = Array.prototype.slice.call( ev.target.parentElement.children );

        console.log(index, nodes.indexOf(ev.target));

        path.move_segment(index, nodes.indexOf(ev.target));
        index = nodes.indexOf(ev.target);

        $selected = null;
    }
</script>

<li draggable="true" on:dragstart={dragStart} on:dragover={dragOver} on:dragend={dragEnd}>
    {#if "points" in segment}
        <canvas width="50" height="50" bind:this={canvas} />
        Bézier Curve
    {:else}
        <svg viewBox="0 0 50 50"
            ><circle cx="25" cy="25" r="25" fill="#DD0000" /></svg
        >
        Point ({translate_cords($segment.x, $segment.y)})
    {/if}
    <OptionsDropdown>
        <DropdownOption on:click={() => copy_to_clipboard()}
            >Copy to clipboard</DropdownOption
        >
        <DropdownOption on:click={() => path.remove_segment(index)}
            >Delete</DropdownOption
        >
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

    canvas {
        padding-right: 5px;
    }

    svg {
        width: 10px;
        height: 10px;

        margin-left: 5px;
        margin-right: 10px;
    }

    li:last-child {
        margin-bottom: 0;
    }
</style>
