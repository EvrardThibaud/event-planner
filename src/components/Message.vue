<script setup>
    import { defineProps, ref } from 'vue'
    
    const props = defineProps({
        sender: String,
        content: String,
        datetime: String,   
    })

</script>

<template>
    <div 
        id="message"
        :class="[
            sender === 'me' ? 'bg-indigo-500 self-end' : 'bg-gray-300 self-start'
        ]"
    >
        <p>{{ props.content }}</p>
        <p class="text-xs my-1 opacity-70">{{props.datetime}}</p>
    </div>

</template>

<style scoped>
    #message{
        border-radius: 10px;
        padding: 6px;
        margin: 2px 6px 2px 6px;
        width: fit-content;
        height: fit-content;
        max-width: 70%
    }
</style>
