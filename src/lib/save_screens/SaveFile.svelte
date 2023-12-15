<script lang="ts">
    import { game_type, default_game_type } from "../../stores/settings";
    import Button from "../components/Button.svelte";
    import { clickOutside } from "../util/click_outside";
    import { current_save_id, load_save_state, reset_undo, save_state } from "../map/saving";
    import { game, reset_field } from "../map/field";
    import { load_save_screen_open } from "./LoadSaveScreen.svelte";
    import { GameType, game_type_to_string } from "../map/games/game";
    import { reset_objects } from "../map/objects/object";

    export let id: string;
    export let update_saves_list: () => void;

    const raw_save_data = localStorage.getItem(`file-${id}`);
    const save_data = raw_save_data!.split("|");
    
    const metadata = save_data.shift()!.split(",");

    const save_game_type: GameType = +metadata[1];

    let open = false;

    async function load_file() {
        save_state();

        $game_type = save_game_type;
        $current_save_id = id;
        await reset_field();
        await game;

        load_save_state(raw_save_data!);
        reset_undo();

        $load_save_screen_open = false;
    }

    function delete_file() {
        if (!confirm("Are you sure you want to delete the file? It will be gone forever!")) return;

        localStorage.removeItem(`file-${id}`);

        const save_list = localStorage.getItem("save-list")!.split("|");
        
        save_list.splice(save_list.indexOf(id), 1);

        localStorage.setItem("save-list", save_list.join("|"));

        update_saves_list();

        if ($current_save_id == id) {
            $game_type = default_game_type;

            reset_undo();
            reset_objects();
            reset_field();

            $current_save_id = undefined;
        }
    }
</script>

<li use:clickOutside on:outclick={() => open = false}>
    <span on:click={() => open = !open} on:keydown={() => open = !open} >
    <p>{id}</p><p>{game_type_to_string(save_game_type)}</p>
    </span>
    {#if open}
    <div class="save-file-inner">
        Game Type: {game_type_to_string(save_game_type)}<br/>
        <div class="save-file-buttons">
            <Button on:click={load_file} text="Load"/>
            <Button on:click={delete_file} text="Delete" red={true}/>
        </div>
    </div>
    {/if}
</li>

<style>
    li {
        min-height: 30px;
        width: calc(100% - 10px);

        background-color: rgb(153, 153, 153);
        color: black;

        margin-bottom: 5px;
        border-radius: 5px;

        font-size: 17px;
    }

    div.save-file-inner {
        padding-left: 10px;
    }

    div.save-file-buttons {
        padding: 5px;
        padding-left: 0;

        display: flex;
        flex-direction: row;
    }

    span {
        cursor: pointer;
        display: block;
        width: calc(100% - 20px);
        height: 30px;
        border-radius: 5px;

        padding-left: 10px;
        padding-right: 10px;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    span:hover, span:focus {
        background-color: rgb(123, 123, 123);
    }
</style>