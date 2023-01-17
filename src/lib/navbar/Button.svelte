<script lang="ts">
    export let text: string;
</script>

<span on:click on:keydown>
    {text}
</span>

<style>
    span {
        height: 100%;
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
    }

    span:hover {
        background-color: #656565;
        color: #E0E0E0;
    }
</style>