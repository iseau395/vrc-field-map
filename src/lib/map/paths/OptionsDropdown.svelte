<script lang="ts" context="module">
    const close_functions = new Set();

    function close_popups() {
        close_functions.forEach(callback => {
            callback();
        });
    }
</script>

<script lang="ts">
    import { onDestroy } from "svelte";
    import { clickOutside } from "../../util/click_outside";

    let dropdown_visible = false;

    function toggle() {
        close_popups();
        dropdown_visible = !dropdown_visible;
    }

    function close() {
        dropdown_visible = false;
    }

    close_functions.add(close);

    onDestroy(() => close_functions.delete(close));
</script>

<span>
    <button on:click={toggle} title="Options...">
        <img src="./media/options.svg" alt="Options...">
    </button>
    {#if dropdown_visible}
    <div use:clickOutside on:outclick={() => close()}>
        <slot />
    </div>
    {/if}
</span>

<style>
    span, button, img {
        width: 30px;
        height: 30px;
    }

    span {
        margin-left: auto;
        margin-right: 10px;
    }

    button {
        border-radius: 50%;

        padding: 0;

        border-style: none;

        background-color: transparent;

        user-select: none;
    }

    button:hover {
        background-color: rgb(183, 183, 183);
    }

    div {
        min-width: 170px;

        position: absolute;
        right: 20px;

        border-radius: 15px;

        background-color: rgb(153, 153, 153);

        display: flex;
        flex-direction: column;
    }
</style>