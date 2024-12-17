<script setup>
    import { defineProps, ref } from 'vue'
    
    const props = defineProps({
        sender: String,
        content: String,
        datetime: Date,   
    })

</script>

<template>
    
    <div class="bg-red-800 text-white min-h-32 w-1/2 p-4">
        {{ props.content }}
    </div>

</template>

<style scoped>
</style>
