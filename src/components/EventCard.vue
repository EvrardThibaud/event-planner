<script setup>
    import { defineProps, ref } from 'vue'
    import { formatEventDateTimes } from '../composable/DateTime';
    
    const props = defineProps({
        event : Object
    })

    const emit = defineEmits(['handleRemoveEventClick']);
    const emitEvent = (event, eventId) => {
        emit('handleRemoveEventClick', event, eventId);
    };

    async function handleRemoveEventClick(event, eventId) {
        emitEvent(event, eventId);
    }


</script>

<template>
    <div id="eventCard" >
        <p class="text-lg font-medium " >{{ props.event.summary }}</p>
        <p class="text-sm" v-for="(text, i) in formatEventDateTimes(props.event.start,event.end)" :key="i" >
            {{text}}
        </p>
        <div @click="handleRemoveEventClick($event, props.event.id)" class="hover:cursor-pointer">
            Click here to delete this event
        </div>
    </div>

</template>

<style scoped>
    #eventCard{
        color: white;
        background-color: rgb(19, 60, 78);
        padding: 6px;
        border-radius: 10px;
    }
</style>
