<script lang="ts">
    import Switch from "./Switch.svelte";

    export let on_close: () => void;

    window.addEventListener("keydown", ev => {
        console.log(ev.key);
        if (ev.key == "Escape")
            on_close();
    });
</script>

<div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="settings-bg" on:click={on_close} />
    <span class="settings-popup">
        <h1>
            Settings
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <svg class="svelte-qag648" on:click={on_close}>
                <line x1="5" y1="5" x2="35" y2="35" stroke="white" stroke-width="4" />
                <line x1="35" y1="5" x2="5" y2="35" stroke="white" stroke-width="4" />
            </svg>
        </h1>
        Test: <Switch /><br/>
        Test: <Switch /><br/>
        Test: <Switch /><br/>
        Test: <Switch /><br/>
    </span>
</div>

<style>
    span.settings-bg {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: black;
        opacity: .7;
    }

    span.settings-popup {
        width: 70%;
        min-width: 300px;
        max-width: 1000px;
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

    h1 {
        margin-top: 0;

        display: flex;
        justify-content: space-between;
    }

    svg {
        width: 50px;
        height: 50px;

        cursor: pointer;
    }
</style>