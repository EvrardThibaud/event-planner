<script setup>
    import {formatToDatetimeLocal, formatEventDateTimes} from "../composable/DateTime.js";
    import { defineProps, ref,computed, defineEmits } from 'vue'

    const modifying = ref(false)
    const props = defineProps({
        event: Object,
    })
    const startEndDisplayFormatted = computed(() => {
        console.log(props.event.start);
        if (props.event && props.event.start && props.event.end) {
            return formatEventDateTimes(props.event.start, props.event.end);
        }
        return null;
    });
    const startEndInputFormatted = computed(() => {
        if (props.event && props.event.start && props.event.end) {
            return [formatToDatetimeLocal(props.event.start),formatToDatetimeLocal(props.event.end)]
        }
        return null;
    });
    const emit = defineEmits();
    const emitEvent = () => {
        emit('modifyEvent');
    };

    
    async function handleModifyEventClick(){
        if (modifying.value) {
            emitEvent()
        } else {
            
        }
        modifying.value = !modifying.value
    }

</script>

<template>
    <h1 class="text-gray-300 font-bold text-2xl">Event</h1>
    <div v-if="event">
        <div v-if="modifying">
            <form @submit.prevent="submitForm" id="form_modify_event">
                <div>
                    <label for="title">Title</label>
                    <input
                    id="title"
                    type="text"
                    v-model="props.event.summary"
                    placeholder="A name for your event"
                    />
                </div>
                <div>
                    <label for="datetime">Date & time Start </label>
                    <input
                    id="datetime"
                    type="datetime-local"
                    v-model="startEndInputFormatted[0]"
                    required
                    />
                </div>
                <div>
                    <label for="datetime">Date & time End </label>
                    <input
                    id="datetime"
                    type="datetime-local"
                    v-model="startEndInputFormatted[1]"
                    :min = startEndInputFormatted[0]
                    required
                    />
                </div>
                <div>
                    <label for="location">Location</label>
                    <input
                    id="location"
                    type="text"
                    v-model="props.event.location"
                    placeholder="Where is your event ?"
                    />
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea
                    id="description"
                    v-model="props.event.description"
                    placeholder="Describe your event"
                    ></textarea>
                </div> 
                <button @click="handleModifyEventClick">Save Modification</button>
            </form>
        </div>
        <div class="text-white" v-else>
                <p v-if="props.event.summary">📋 {{ props.event.summary }}</p>
                <p v-if="isSingleString">⏰ {{ startEndDisplayFormatted }}</p>
            <div v-else>
                <p>⏰ {{ startEndDisplayFormatted[0] + " - " + startEndDisplayFormatted[1]}}</p>
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
        <button v-if="!modifying" @click="handleModifyEventClick">Modify</button>
    </div>

</template>

<style scoped>
    #form_modify_event{
        div{
        display: flex;
        flex-direction: column;
        width: 100%;
        }
    } 

    label{
        color: #d1d5db;
        font-weight: 500;
        font-size: large;
    }

    input, textarea, button{
        min-width: 300px;
        min-height: 40px;
        height: 40px;
        max-height: 100px;
        color: #18181b;
        padding: 6px;
        border: 2px solid #18181b;
        border-radius: 5px;
        background-color: #d1d5db;
        outline: none;
    }

    button{
        font-weight: 600;
        background-color: #86efac;
    }
    input:hover, textarea:hover, button:hover{
        opacity: .9;
    }

    button:active{
        scale: .98;
    }

    #secondary_button{
        background-color: #d1d5db;
        font-weight: normal;
    }
</style>
