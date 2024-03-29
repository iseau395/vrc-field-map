<script lang="ts">
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import ContextMenu from "../context_menu/ContextMenu.svelte";
    import { options } from "../context_menu/context_menu";

    import { draw_field, update_field, check_cursor } from "./field";
    import type { Input } from "./constants";

    import PathSidebar, { sidebar_visible } from "./paths/PathSidebar.svelte";
    import { save_state, redo, undo } from "./saving";

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
        const bg_ctx = bg_canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
        const fg_ctx = fg_canvas.getContext("2d") as CanvasRenderingContext2D;

        const input: Input = {
            mouse_x: 0,
            mouse_y: 0,
            gridless_mouse_x: 0,
            gridless_mouse_y: 0,
            mouse_button: -1,
            mouse_button_changed: false,
            wheel: -1,
            keys: new Map<string, boolean | null>(),
        };


        // Input events
        {
            window.addEventListener("focus", () => {
                input.keys.clear();
            });

            window.addEventListener("keydown", ev => {
                if ((ev.target as HTMLElement).nodeName != "INPUT")
                    ev.preventDefault();

                input.keys.set(ev.key, true);
            });

            window.addEventListener("keyup", ev => {
                if ((ev.target as HTMLElement).nodeName != "INPUT")
                    ev.preventDefault();

                input.keys.set(ev.key, false);
                save_state();
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
                save_state();
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
                ev.preventDefault();
            });
            fg_canvas.addEventListener("wheel", ev => {
                input.wheel += ev.deltaY * 0.01;
                input.wheel = Math.min(Math.max(-5, input.wheel), -.75);
            }, { passive: true });
        }

        function resize() {
            if (!bg_canvas || !fg_canvas) return;

            bg_canvas.width = window.innerWidth;
            bg_canvas.height = window.innerHeight;
            fg_canvas.width = window.innerWidth;
            fg_canvas.height = window.innerHeight;

            draw_field(fg_ctx, bg_ctx, true);
        }
        window.addEventListener("resize", resize);

        let last_wheel = input.wheel;
        let last_undo = false;
        let last_redo = false;
        function tick() {
            let any_true = false;
            for (const value of input.keys.values()) {
                if (value == true) {
                    any_true = true;
                    break;
                }
            }

            const undo_pressed = input.keys.get("Control") && input.keys.get("z");
            if (undo_pressed && !last_undo) {
                undo();
                last_undo = true;
            } if (!undo_pressed && last_undo) {
                last_undo = false;
            }
            

            const redo_pressed = input.keys.get("Control") && input.keys.get("y");
            if (redo_pressed && !last_redo) {
                redo();
                last_redo = true;
            } if (!redo_pressed && last_redo) {
                last_redo = false;
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

<div>
    <a href="https://github.com/iseau395/vrc-field-map" target="_blank" rel="noreferrer" title="Github Repository">
        <img src="/vrc-field-map/media/github.png" alt="Github Repository"/>
    </a>
    <p>Developed by<br/>team 15442C</p>
</div>

{#if context_menu.visible}
<ContextMenu x={context_menu.x} y={context_menu.y} options={options}/>
{/if}

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

    div {
        position: absolute;
        bottom: 15px;
        left: 15px;

        display: flex;

        pointer-events: none
    }

    p {
        color: white;
        opacity: 50%;

        pointer-events: none;
        user-select: none;

        margin-left: 15px;
    }

    a, img {
        width: 50px;
        height: 50px;

        border-radius: 50%;

        pointer-events: fill;
    }

    a {
        margin: auto;
    }

    img {
        opacity: 30%;

        user-select: none;
    }

    img:hover {
        opacity: 70%;
    }
</style>
