<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const new_save_screen_open = writable(false);
</script>

<script lang="ts">
    import Button from "../components/Button.svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import Switch from "../components/Switch.svelte";
    import { game_type, is_skills } from "../../stores/settings";
    import { string_to_game_type } from "../map/games/game";
    import { reset_field } from "../map/field";
    import Textbox from "../components/Textbox.svelte";
    import { current_save_id, get_save_state, load_save_state, reset_undo } from "../map/saving";

    window.addEventListener("keydown", ev => {
        if (ev.key == "Escape")
            $new_save_screen_open = false;
    });

    let selected_game_type: string;
    let save_name: string;
    let skills = false;

    async function create_save() {
        if (!selected_game_type || !save_name.trim()) return;
        $new_save_screen_open = false;

        $game_type = string_to_game_type(selected_game_type)!;
        $is_skills = skills;
        $current_save_id = save_name.trim();
        
        reset_undo();
        await reset_field();
        load_save_state(get_save_state());
    }
</script>

<div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="new-save-bg" on:click={() => $new_save_screen_open = false} />
    <span class="new-save-popup">
        <h4>
            New Save...
            <button on:click={() => $new_save_screen_open = false} title="Close New Save Screen">
                <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="4" />
                    <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="4" />
                </svg>
            </button>
        </h4>

        <ul>
            <li><p>Save Name: </p> <Textbox bind:value={save_name}></Textbox></li>
            <li><p>Season:</p> <Dropdown label="Select..." options={["Over Under", "Spin Up"]} bind:selected={selected_game_type}></Dropdown></li>
            <li><p>Skills:</p> <Switch bind:value={skills}/></li>
            <li><Button text="Create" on:click={create_save}></Button></li>
        </ul>
    </span>
</div>

<style>
    span.new-save-bg {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: black;
        opacity: .7;
    }

    span.new-save-popup {
        width: 70%;
        min-width: 300px;
        max-width: 500px;
        height: 70%;
        min-height: 300px;
        max-height: 700px;

        z-index: 1;

        background-color: #303030;
        border-radius: 20px;

        font-size: 20px;
        color: white;
        line-height: 30px;

        padding: 20px;
    }

    div {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        z-index: 1;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    h4 {
        margin-top: 0;

        display: flex;
        justify-content: space-between;
    }

    svg {
        width: 30px;
        height: 30px;

        cursor: pointer;
    }

    button {
        height: 30px;
        width: 30px;

        padding: 0;

        background-color: transparent;
        border-style: none;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        height: 40px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
    }

    p {
        display: inline;
        margin-right: 10px;
    }
</style>