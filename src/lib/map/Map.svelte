<script lang="ts">
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import ContextMenu from "../context_menu/ContextMenu.svelte";
    import { options } from "../context_menu/context_menu";

    import { draw_field, update_field, check_cursor } from "./field";
    import type { Input } from "./types";

    import PathSidebar, { sidebar_visible } from "./paths/PathSidebar.svelte";

    let bg_canvas: HTMLCanvasElement;
    let fg_canvas: HTMLCanvasElement;

    // let interval: ReturnType<typeof setInterval> | null = null;
    let anim_frame: number | null = null;

    const context_menu = {
        x: 0,
        y: 0,
        visible: false
    };

    onMount(() => {
        const bg_ctx = bg_canvas.getContext("2d", { alpha: false });
        const fg_ctx = fg_canvas.getContext("2d");

        const input: Input = {
            mouse_x: 0,
            mouse_y: 0,
            gridless_mouse_x: 0,
            gridless_mouse_y: 0,
            mouse_button: -1,
            mouse_button_changed: false,
            wheel: -1,
            keys: new Map<string, boolean | undefined>(),
        };

        // Input events
        {
            window.addEventListener("focus", ev => {
                input.keys.clear();
            });

            window.addEventListener("keydown", ev => {
                ev.preventDefault();

                input.keys.set(ev.key, true);
            });

            window.addEventListener("keyup", ev => {
                ev.preventDefault();

                input.keys.set(ev.key, false);
            });

            window.addEventListener("mousemove", ev => {
                input.mouse_x = ev.clientX;
                input.mouse_y = ev.clientY;
            });
            fg_canvas.addEventListener("mousedown", ev => {
                input.mouse_button = ev.button as 0 | 1 | 2;
                input.mouse_button_changed = true;

                input.mouse_x = ev.clientX;
                input.mouse_y = ev.clientY;

                context_menu.visible = false;
            });
            fg_canvas.addEventListener("mouseup", () => {
                input.mouse_button = -1;
                input.mouse_button_changed = true;
            });

            fg_canvas.addEventListener("contextmenu", ev => {
                ev.preventDefault();

                if (ev.button == 2) {
                    context_menu.visible = true;
                    context_menu.x = input.mouse_x;
                    context_menu.y = input.mouse_y;
                }
            });

            fg_canvas.addEventListener("wheel", ev => {
                input.wheel += ev.deltaY * 0.01;
                input.wheel = Math.min(Math.max(-10, input.wheel), -.75);
            }, { passive: true });
        }

        function resize() {
            bg_canvas.width = window.innerWidth;
            bg_canvas.height = window.innerHeight;
            fg_canvas.width = window.innerWidth;
            fg_canvas.height = window.innerHeight;

            draw_field(fg_ctx, bg_ctx, true);
        }
        window.addEventListener("resize", resize);

        let last_wheel = input.wheel;
        function tick() {
            let any_true = false;
            for (const value of input.keys.values()) {
                if (value == true) {
                    any_true = true;
                    break;
                }
            }

            if (any_true || last_wheel != input.wheel)
                context_menu.visible = false;

            last_wheel = input.wheel;

            update_field(input);

            check_cursor(fg_canvas);

            input.mouse_button_changed = false;
        }

        function render() {
            tick();

            draw_field(fg_ctx, bg_ctx, false);

            anim_frame = requestAnimationFrame(render);
        }

        // interval = setInterval(tick, 20);
        anim_frame = requestAnimationFrame(render);

        update_field(input);
        resize();
    });

    onDestroy(() => {
        // if (interval != null)
        //     clearTimeout(interval);
        if (anim_frame != null)
            cancelAnimationFrame(anim_frame);
    });
</script>

<canvas bind:this={bg_canvas} style="z-index: -1;" />
<canvas bind:this={fg_canvas} style="z-index: 0;" />
{#if context_menu.visible}
<ContextMenu x={context_menu.x} y={context_menu.y} options={options}/>
{/if}

<p>Developed by team 15442C</p>
<a href="https://github.com/iseau395/vrc-field-map" target="_blank" rel="noreferrer">
    <img src="/vrc-field-map/media/github.png" alt="Github Repository"/>
</a>

{#if $sidebar_visible}
<PathSidebar />
{/if}

<style>
    canvas {
        width: 100%;
        height: 100%;

        object-fit: contain;

        position: absolute;
    }

    p {
        position: absolute;
        left: 15px;
        bottom: 0;

        color: white;
        opacity: 50%;

        pointer-events: none;
        user-select: none;
    }

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;

        opacity: 30%;

        user-select: none;
    }

    img:hover {
        opacity: 70%;
    }

    a {
        width: 50px;
        height: 50px;

        position: absolute;
        bottom: 10px;
        right: 15px;

        border-radius: 50%;
    }
</style>
