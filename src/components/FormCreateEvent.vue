<script setup>
    import { defineProps, ref,computed, defineEmits } from 'vue'

    const props = defineProps({
        newEvent: Object,
        participantsList: Array,
        isAdding: Boolean,
        newParticipant: String,
    })
    const emit = defineEmits([
        "update:newParticipant", 
        'handleAddEventClick', 
        'handleAddParticipant', 
        'handleDeleteParticipantClick',
        'toggleIsCreating'
      ]);

    function handleAddEventClick(){
      emit('handleAddEventClick');
    }

    function toggleIsCreating(){
      emit('toggleIsCreating');
    }

    function handleAddParticipant(){
      emit('handleAddParticipant');
    }

    function handleDeleteParticipantClick(){
      emit('handleDeleteParticipantClick');
    }

    function handleInput(event) {
      emit("update:newParticipant", event.target.value); 
    }

</script>

<template>
    <form @submit.prevent="submitForm" id="form_add_event" class="fixed flex justify-center items-start flex-col gap-2 px-4">
        <h2 class="text-gray-300 font-bold text-2xl">Add an Event</h2>
        <div>
          <label for="title">Title</label>
          <input
          id="title"
          type="text"
          v-model="newEvent.title"
          placeholder="A name for your event"
          />
        </div>
        <div>
          <label for="datetime">Date and time</label>
          <input
          id="datetime"
          type="datetime-local"
          v-model="newEvent.datetime"
          :min = newEvent.datetime
          required
          />
        </div>
        <div>
          <label for="time">Duration</label>
          <input
          id="time"
          type="time"
          v-model="newEvent.time"
          value= "01:00"
          required
          />
        </div>
        <div>
          <label for="location">Location</label>
          <input
          id="location"
          type="text"
          v-model="newEvent.location"
          placeholder="Where is your event ?"
          />
        </div>
        <div>
          <label for="description">Description</label>
          <textarea
          id="description"
          v-model="newEvent.description"
          placeholder="Describe your event"
          ></textarea>
        </div> 
        
        <form @submit.prevent="submitForm" @submit="handleAddParticipant">
          <div>
            <label for="participants">Add participants</label>
            <ul v-if="participantsList.length !== 0" class="bg-zinc-800 my-2 p-2 w-4/5 rounded">
              <li class="text-white flex justify-between flex-row" v-for="(participant, i) in participantsList" :key="i">
                <p> {{ participant.email }} </p>
                <i class="fa-solid fa-trash" @click="handleDeleteParticipantClick(i)"></i>
                <p class="hover:cursor-pointer active:scale-90" @click="handleDeleteParticipantClick(i)">🗑️</p>
              </li>
            </ul>
              <input
              :value="newParticipant"
              @input="handleInput"
              type="email"
              id="participants"
              placeholder="Participants's email"
              required
              ></input>
              <button class="secondary_button mt-2" @click="handleAddParticipant">Add this particpant</button>
            </div> 
          </form>
          <span class="gap-1 flex ">
            <button class="primary_button" @click="handleAddEventClick">{{ isAdding ? "Adding..." : "Add Event" }}</button>
            <button class="red_button" @click="toggleIsCreating">Cancel</button>
          </span>
      </form>
</template>

<style scoped>
  #form_add_event{
    background-color: #18181b;
    width: 100%;
    height: calc(100vh);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    div{
      display: flex;
      flex-direction: column;
    }
  }
</style>
