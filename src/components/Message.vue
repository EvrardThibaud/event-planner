<script setup>
    import { defineProps, ref } from 'vue'
    
    const props = defineProps({
        role: String,
        text: String,
        datetime: String,   
    })

</script>

<template>
    <div 
        id="message"
        :class="[
            role === 'user' ? 'bg-indigo-500 self-end' : 'bg-gray-300 self-start'
        ]"
    >
        <p>{{ props.text }}</p>
        <p class="text-xs my-1 font-light">{{props.datetime}}</p>
    </div>

</template>

<style scoped>
    #message{
        color: black;
        border-radius: 10px;
        padding: 6px;
        margin: 2px 6px 2px 6px;
        width: fit-content;
        height: fit-content;
        max-width: 70%
    }
</style>
