<script setup>
    import { defineProps, ref } from 'vue'
    
    const props = defineProps({
        event: Object  
    })


</script>

<template>
    <div class="text-white">
        <h1>Event</h1>
        <p>{{ props.event.summary }}</p>
        <p>{{ props.event.start }}</p>
        <p>{{ props.event.end }}</p>
        <p>{{ props.event.location }}</p>
        <p>{{ props.event.description }}</p>
        
        <ul>
            <li v-for="(attender, i) in props.event.attendees" :key="index">
                {{attender.email}}
            </li>
        </ul>
        
    </div>

</template>

<style scoped>
</style>
