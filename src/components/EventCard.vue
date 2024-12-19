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
    <div>
        <p>Titre : {{ props.event.summary }}</p>
          <p v-for="(text, i) in formatEventDateTimes(props.event.start,event.end)" :key="i" >
            {{text}}
          </p>
          <button @click="handleRemoveEventClick($event, props.event.id)">Delete this event</button>
    </div>

</template>

<style scoped>
    
</style>
