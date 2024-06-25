<template>
    <div class="loader">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loader'
}
</script>

<style>
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 2em;
    color: #007bff;
}
</style>
