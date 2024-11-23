<script setup>
    import { defineProps, ref } from 'vue'
    
    const props = defineProps({
        name: String,
        dsc: String,
        src: String,   
    })

</script>

<template>
    <div class="bg-zinc-800  border-zinc-400 border-2 rounded-2xl h-80 w-60 flex flex-col justify-center items-center">
        <img class="w-2/5 rounded-full " :src=src alt="">
        <h1 class="text-gray-300 text-xl">{{ name }}</h1>
        <p class="text-gray-300 text-justify w-9/12">{{ dsc }}</p>
    </div>

</template>

<style scoped>
</style>
