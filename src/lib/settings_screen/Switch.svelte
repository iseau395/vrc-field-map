<script lang="ts">
    export let value = false;
</script>

<input type="checkbox" bind:checked={value}/>
<div class="switch-outer" style="justify-content: {value ? 'flex-end' : 'flex-start'}; {!value && 'background-color: #999999'}">
    <div class="switch-slider" />
</div>

<style>
    input {
        width: 42px;
        height: 22px;
        margin: 0;
        margin-top: 3px;
        border-radius: 15px;

        opacity: 0;

        position: absolute;
    }
    
    div.switch-outer {
        width: 34px;
        height: 14px;

        border-radius: 15px;
        padding: 4px;

        display: inline-flex;

        background-color: #7777FF;
    }

    div.switch-slider {
        width: 14px;
        height: 14px;

        border-radius: 50%;

        background-color: white;
    }
</style>