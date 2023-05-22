<script lang="ts">
    import { onMount, tick } from "svelte";
    import { path } from "../field";
    import { BezierCurve } from "./bezier";
    import { insert_dropdown_open } from "./PathSidebar.svelte";
    import { Point } from "./point";

    let type = -1;

    let point_x = 0;
    let point_y = 0;

    let bezier_x1 = 0;
    let bezier_y1 = 0;
    let bezier_x2 = 0;
    let bezier_y2 = 0;
    let bezier_x3 = 0;
    let bezier_y3 = 0;
    let bezier_x4 = 0;
    let bezier_y4 = 0;

    let insert_dropdown: HTMLSpanElement;
    let point_button: HTMLElement;

    onMount(() => {
        point_button.focus();

        insert_dropdown.addEventListener("paste", ev => {
            const data: string = (ev.clipboardData || (window as any).clipboardData).getData("text");

            if (type == 0) {
                const point_regex = /^(?<x>-?\d+(?:\.\d+)?), (?<y>-?\d+(?:\.\d+)?)$/;

                if (point_regex.test(data)) {
                    const output = point_regex.exec(data);

                    point_x = +output.groups.x;
                    point_y = +output.groups.y;

                    ev.preventDefault();
                }
            } else if (type == 1) {
                const bezier_regex = /^pos\((-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)\),?\n?(?: |	)*pos\((-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)\),?\n?(?: |	)*pos\((-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)\),?\n?(?: |	)*pos\((-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)\)$/;

                if (bezier_regex.test(data)) {
                    const output = bezier_regex.exec(data);

                    bezier_x1 = +output[2];
                    bezier_y1 = +output[1];
                    bezier_x2 = +output[4];
                    bezier_y2 = +output[3];
                    bezier_x3 = +output[6];
                    bezier_y3 = +output[5];
                    bezier_x4 = +output[8];
                    bezier_y4 = +output[7];

                    ev.preventDefault();
                }
            }
        });

        insert_dropdown.addEventListener("keydown", ev => {
            console.log(ev.key);
            if (ev.key == "Enter") {
                submit();
            }
        });
    });

    function submit() {
        if (type == 0) {
            path.add_segment(new Point(point_x, point_y));
        } else if (type == 1) {
            path.add_segment(
                new BezierCurve(
                    bezier_x1, bezier_y1,
                    bezier_x2, bezier_y2,
                    bezier_x3, bezier_y3,
                    bezier_x4, bezier_y4
                )
            );
        }

        insert_dropdown_open.set(false);

        console.log("e");

        return false;
    }

    async function type_select(type_selected: number) {
        type = type_selected;

        await tick();

        const element = insert_dropdown.getElementsByTagName("input")[0];

        if (element?.focus) element.focus();
    }
</script>

<div bind:this={insert_dropdown}>
    {#if type == -1}
    <ul>
        <li>
            <button bind:this={point_button} on:click={() => type_select(0)}>Point</button>
        </li>
        <li>
            <button on:click={() => type_select(1)}>Bezier Curve</button>
        </li>
    </ul>
    {:else if type == 0}
    <span>
        Point<br/>

        <label for="point-x-position">x:</label>
        <input id="point-x-position" type="number" bind:value={point_x} />
        <label for="point-y-position">y:</label>
        <input id="point-y-position" type="number" bind:value={point_y} />
        <br/>

        <button on:click={submit}>Insert</button>
    </span>
    {:else if type == 1}
    <span>
        <label for="bezier-x1-position">x1:</label>
        <input id="bezier-x1-position" type="number" bind:value={bezier_x1} />
        <label for="bezier-y1-position">y1:</label>
        <input id="bezier-y1-position" type="number" bind:value={bezier_y1} />
        <br/>

        <label for="bezier-x2-position">x2:</label>
        <input id="bezier-x2-position" type="number" bind:value={bezier_x2} />
        <label for="bezier-y2-position">y2:</label>
        <input id="bezier-y2-position" type="number" bind:value={bezier_y2} />
        <br/>

        <label for="bezier-x3-position">x3:</label>
        <input id="bezier-x3-position" type="number" bind:value={bezier_x3} />
        <label for="bezier-y3-position">y3:</label>
        <input id="bezier-y3-position" type="number" bind:value={bezier_y3} />
        <br/>

        <label for="bezier-x4-position">x4:</label>
        <input id="bezier-x4-position" type="number" bind:value={bezier_x4} />
        <label for="bezier-y4-position">y4:</label>
        <input id="bezier-y4-position" type="number" bind:value={bezier_y4} />
        <br/>

        <button on:click={submit}>Insert</button>
    </span>
    {/if}
</div>

<style>
    div {
        width: calc(100%);
        border-radius: 10px;

        margin-top: 10px;
        margin-bottom: 10px;

        color: black;

        background-color: rgb(220, 220, 220);
    }

    ul {
        display: flexbox;
        flex-direction: column;

        padding: 0;
    }

    li {
        width: 100%;
        height: 30px;

        list-style-type: none;

        display: flex;
        align-items: center;

        cursor: pointer;
    }

    li button {
        width: 100%;
        height: 100%;

        background-color: transparent;
        border-style: none;

        padding-left: 10px;
        padding-right: 10px;

        text-align: left;
    }

    li:hover {
        background-color: rgb(200, 200, 200);
    }

    li:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    li:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    span {
        display: block;

        width: calc(100% - 20px);

        padding: 10px;
    }

    input {
        width: 20%;
        border-radius: 10px;

        padding-left: 7px;
        padding-right: 7px;
    }
</style>