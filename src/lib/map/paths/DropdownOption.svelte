<button on:click>
    <slot />
</button>

<style>
    button {
        width: 100%;
        height: 30px;

        margin: 0;
        padding-right: 15px;

        text-align: right;
        color: #111;
            
        background-color: transparent;
        border-style: none;

        user-select: none;
    }

    button:hover {
        background-color: #AAA;
    }

    button:first-child {
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
    }

    button:last-child {
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
    }
</style>