<script setup>
    import {formatDateTimeCommonLanguage, formatEventDateTimes} from "../composable/DateTime.js";
    import { defineProps, ref, onMounted,computed  } from 'vue'

    const props = defineProps({
        event: Object,
    })

    const timeFormated = computed(() => {
        if (props.event && props.event.start && props.event.end) {
            return formatEventDateTimes(props.event.start, props.event.end);
        }
        return null;
    });



</script>

<template>
    <h1 class="text-gray-300 font-bold text-2xl">Calendar</h1>
    <div class="text-white" v-if="event">
        <p v-if="props.event.summary">📋 {{ props.event.summary }}</p>
        <p v-if="isSingleString">⏰ {{ timeFormated }}</p>
        <div v-else>
            <p>⏰ {{ timeFormated[0] + " - " + timeFormated[1]}}</p>
        </div>
        <p v-if="props.event.location">📍 {{ props.event.location }}</p>
        <p v-if="props.event.description">📝 {{ props.event.description }}</p>

        <div v-if="props.event.attendees">
            <p>👤 Attendees :</p>
            <ul>
                <li v-for="(attender, i) in props.event.attendees" :key="i">
                    - {{ attender.email }}
                </li>
            </ul>
        </div>

        
    </div>

</template>

<style scoped>
</style>
