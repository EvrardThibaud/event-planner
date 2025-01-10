<script setup>
    import {formatToDatetimeLocal, formatEventDateTimes} from "../composable/DateTime.js";
    import { defineProps, ref,computed, defineEmits } from 'vue'
    import { createAlert } from "../composable/Alerts.js";

    const newParticipant = ref('');
    const modifying = ref(false)
    const props = defineProps({
        event: Object,
    })


    const startEndDisplayFormatted = computed(() => {
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


    const emit = defineEmits(['modifyEvent', 'handleRemoveEventClick','unselectEvent']);

    const emitRemoveEvent = (event, eventId) => {
        emit('handleRemoveEventClick', event, eventId);
    };

    async function handleRemoveEventClick(event, eventId) {
        emitRemoveEvent(event, eventId);
    }

    async function unselectEvent(){
        emit('unselectEvent')
    }

    async function handleModifyEventClick() {
        if (modifying.value) {
            props.event.start = startEndInputFormatted.value[0] + ":00+01:00";
            props.event.end = startEndInputFormatted.value[1] + ":00+01:00";
            emit('modifyEvent', props.event);
        }
        modifying.value = !modifying.value;
    }


    async function handleDeleteParticipantClick(i){
        props.event.attendees.splice(i,1);
    }

    async function handleAddParticipant(){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newParticipant.value)) {
            createAlert('Please enter a valid email address.','error');
            return;
        }

        props.event.attendees.push({email : newParticipant.value});
        newParticipant.value = '';
    }

</script>

<template>
    <section @click="unselectEvent">
        <div id="event" @click.stop>
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
                    <div>
                        <label for="participants">Add participants</label>
                        <ul v-if="props.event.attendees && props.event.attendees.length > 0" class="bg-zinc-800 my-2 p-2 w-4/5 rounded">
                            <li class="text-white flex justify-between flex-row" v-for="(attender, i) in props.event.attendees" :key="i">
                                <p> {{ attender.email }} </p>
                                <span class="material-symbols-outlined hover:cursor-pointer active:scale-90" @click="handleDeleteParticipantClick(i)">delete</span>
                            </li>
                        </ul>
                        <input
                            v-model="newParticipant"
                            type="email"
                            id="participants"
                            placeholder="Participants's email"  
                        ></input>
                        <button type="button" @click="handleAddParticipant" class="secondary_button">Add this particpant</button>
                    </div> 
                    <button type="submit" class="primary_button" @click="handleModifyEventClick">Save Modification</button>
                </form>
            </div>
            <div class="text-white" v-else>
                <p>📋{{ props.event.summary || 'Unamed Event' }}</p>
                <p v-if="startEndDisplayFormatted.length === 1">⏰ {{ startEndDisplayFormatted[0]}}</p>
                <p v-else>⏰ {{ startEndDisplayFormatted[0] + " - " + startEndDisplayFormatted[1]}}</p>
                <p >📍 {{ props.event.location || 'No Location' }}</p>
                <p >📝 {{ props.event.description || 'No Description' }}</p>
                <div >
                    <p>👤 Attendees :</p>
                    <ul v-if="props.event.attendees && props.event.attendees.length > 0">
                        <li v-for="(attender, i) in props.event.attendees" :key="i">
                            - {{ attender.email }}
                        </li>
                    </ul>
                    <p v-else>No attendees</p>
                </div>
            </div>
            <div class="flex flex-col">
                <button class="primary_button" v-if="!modifying" @click="handleModifyEventClick">Modify this event</button>
                <button class="red_button" id="deleteButton" v-if="!modifying" @click="handleRemoveEventClick($event, props.event.id)">Delete this event</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
    #form_modify_event{
        div{
        display: flex;
        flex-direction: column;
        width: 100%;
        }
    }

    section{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #event{
        background-color: #343435;
        width: fit-content;
        height: fit-content;
        border-radius: 10px;
        padding: 10px;
    }
</style>
