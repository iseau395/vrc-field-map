<script lang="ts">
    export let label: string;
</script>

<li>
    {label}
</li>

<style>
    li {
        width: calc(100% - 10px);
<<<<<<< HEAD
        height: 40px;
=======
        height: 50px;
>>>>>>> cbe4d898443285132e32aa956a96ffbcc9439fb6

        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;

        background-color: rgb(193, 193, 193);
        color: black;

        list-style-type: none;

        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    li:last-child {
        margin-bottom: 0;
    }
</style>