<script lang="ts">
    import { clickOutside } from "../util/click_outside";

    export let options: string[];
    export let label: string;
    export let selected: string | null = null;

    let dropdown: HTMLSpanElement;
    let shown = false;

    function toggle_closed() {
        if (!shown) {
            dropdown.style.display = "block";
            shown = true;
        } else {
            dropdown.style.display = "none";
            shown = false;
        }
    }

    function option_selected(option: string) {
        dropdown.style.display = "none";
        label = option;
        selected = option;
    }
</script>

<div>
    <button on:click={toggle_closed} use:clickOutside on:outclick={() => shown && toggle_closed()}>{label}</button>
    <span bind:this={dropdown}>
        {#each options as option} 
        <p on:click={() => option_selected(option)} on:keypress={() => option_selected(option)}>{option}</p>
        {/each}
    </span>
</div>

<style>
    button {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;

        cursor: pointer;

        user-select: none;

        display: inline;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #454545;
        color: #E0E0E0;
        border-radius: 12px;

        margin-right: 5px;

        border-style: none;
    }

    button:hover, button:focus {
        background-color: #656565;
        color: #E0E0E0;
    }

    div {
        position: relative;
        display: inline-block;
    }

    span {
        display: none;
        position: absolute;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;

        background-color: #999999;
        border-radius: 12px;
    }

    p {
        color: #353535;
        padding-left: 12px;
        padding-right: 12px;
        text-decoration: none;
        display: block;

        font-size: 16px;

        margin: 0;

        cursor: pointer;
        border-radius: 12px;
    }

    p:hover {
        background-color: #ddd;
    }
</style>