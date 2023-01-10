<script lang="ts">
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";

    import { draw_field, update_field } from "./field";
    import type { Input } from "./types";

    let bg_canvas: HTMLCanvasElement;
    let fg_canvas: HTMLCanvasElement;

    let interval: NodeJS.Timer;
    let anim_frame: number;

    onMount(() => {
        const bg_ctx = bg_canvas.getContext("2d", { alpha: false });
        const fg_ctx = fg_canvas.getContext("2d");

        const input: Input = {
            mouse_x: 0,
            mouse_y: 0,
            mouse_button: -1,
            wheel: 1,
            keys: new Map<string, boolean | undefined>(),
        };

        // Input events
        {
            window.addEventListener("keydown", (ev) => {
                ev.preventDefault();

                input.keys.set(ev.key, true);
            });

            window.addEventListener("keyup", (ev) => {
                ev.preventDefault();

                input.keys.set(ev.key, false);
            });

            fg_canvas.addEventListener("mousemove", (ev) => {
                input.mouse_x = ev.offsetX;
                input.mouse_y = ev.offsetY;
            });
            fg_canvas.addEventListener("mousedown", (ev) => {
                input.mouse_button = ev.button as 0 | 1 | 2;
            });
            fg_canvas.addEventListener("mouseup", (ev) => {
                input.mouse_button = -1;
            });

            fg_canvas.addEventListener("wheel", ev => {
                input.wheel += ev.deltaY * 0.01;
                input.wheel = Math.min(Math.max(-4, input.wheel), -.75);
            });
        }

        function resize() {
            bg_canvas.width = bg_canvas.clientWidth;
            bg_canvas.height = bg_canvas.clientHeight;
            fg_canvas.width = fg_canvas.clientWidth;
            fg_canvas.height = fg_canvas.clientHeight;

            draw_field(fg_ctx, bg_ctx, true);
        }
        window.addEventListener("resize", resize);

        function tick() {
            update_field(input);
        }

        function render() {
            draw_field(fg_ctx, bg_ctx, false);

            anim_frame = requestAnimationFrame(render);
        }

        interval = setInterval(tick, 20);
        anim_frame = requestAnimationFrame(render);
        update_field(input);
        resize();
    });

    onDestroy(() => {
        clearTimeout(interval);
        cancelAnimationFrame(anim_frame);
    });
</script>

<canvas bind:this={bg_canvas} style="z-index: -1;" />
<canvas bind:this={fg_canvas} style="z-index: 0;" />

<style>
    canvas {
        width: 100%;
        height: calc(100%);

        position: absolute;
    }
</style>
