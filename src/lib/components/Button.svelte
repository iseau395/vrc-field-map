<script lang="ts">
    export let text: string;
</script>

<button on:click on:keydown>
    {text}
</button>

<style>
    button {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;

        height: 40px;
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

    button:hover {
        background-color: #656565;
        color: #E0E0E0;
    }
</style>