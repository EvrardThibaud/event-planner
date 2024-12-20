<script setup>
    import { defineProps, ref,computed, defineEmits } from 'vue'

    const props = defineProps({
        newEvent: Object,
        participantsList: Array,
        isAdding: Boolean,
        newParticipant: String,
    })
    const emit = defineEmits(["update:newParticipant", 'handleAddEventClick', 'handleAddParticipant']);

    function handleAddEventClick(){
      emit('handleAddEventClick');
    }

    function handleAddParticipant(){
      emit('handleAddParticipant');
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
        
        <form class="w-full" @submit.prevent="submitForm" @submit="handleAddParticipant">
          <div>
            <label for="participants">Add participants</label>
            <ul v-if="participantsList.length !== 0" class="bg-zinc-800 my-2 p-2 w-4/5 rounded">
              <li class="text-white flex justify-between flex-row" v-for="(participant, i) in participantsList" :key="i">
                <p> {{ participant.email }} </p>
                <!-- <i class="fa-solid fa-trash" @click="handleDeleteParticipantClick(i)"></i> -->
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
              <button id="secondary_button" @click="handleAddParticipant">Add this particpant</button>
          </div> 
        </form>

          <button  @click="handleAddEventClick">{{ isAdding ? "Adding..." : "Add Event" }}</button>
      </form>
</template>

<style scoped>
#form_add_event{
    div{
      display: flex;
      flex-direction: column;
      width: 100%;
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
    
    button:hover{
      opacity: .9;
    }

    button:active{
      scale: .98;
    }

    #secondary_button{
      background-color: #d1d5db;
      font-weight: normal;
    }
  }
</style>
