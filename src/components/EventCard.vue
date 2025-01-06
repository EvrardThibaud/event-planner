<script setup>
    import { defineProps, ref } from 'vue'
    import { formatEventDateTimes } from '../composable/DateTime';
    
    const props = defineProps({
        event : Object
    })
</script>

<template>
    <div id="eventCard" >
        
        <p class="text-lg font-medium " >📋{{ props.event.summary }}</p>
        <p class="text-sm" v-for="(text, i) in formatEventDateTimes(props.event.start,event.end)" :key="i" >
            ⏰ {{text}}
        </p>
    </div>

</template>

<style scoped>
    #eventCard{
        user-select: none;
        color: white;
        background-color: rgb(19, 60, 78);
        padding: 6px;
        border-radius: 10px;
    }
</style>
