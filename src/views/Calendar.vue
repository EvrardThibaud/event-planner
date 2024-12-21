<script setup>
  import { ref, onMounted } from 'vue';
  import {handleAuthClick} from "../composable/GoogleAuth.js";
  import { loadScript, gisLoaded, gapiLoaded } from '../composable/GoogleAuth.js';
  import {addTimeToDateTime, calculTimeMin, calculTimeMax, getSortingTime} from "../composable/DateTime.js";
  import { createAlert } from '../composable/Alerts.js';
  import Event from '../components/Event.vue';
  import EventCard from '../components/EventCard.vue';
  import FormCreateEvent from '../components/FormCreateEvent.vue';

  const eventLoading = ref(true)
  const isCreating = ref(false)
  const event = ref(null)
  const refreshButton = ref(null)
  const newParticipant = ref('');
  const isAdding = ref(false);
  const eventsList = ref([]);
  const isConnected = ref(localStorage.getItem('google_access_token') !== null);
  const noEvent = ref(false)
  const participantsList = ref([]);
  const sortingType = ref('daily');
  const sortingTime = ref()
  const newEvent = ref({
        title: '',
        datetime: '',
        time: '01:00',
        location: '',
        description: '',
        attendees: []
    });

  async function listUpcomingEvents() {
    eventsList.value = [];
    noEvent.value = false;
    
    let timeMin = calculTimeMin(sortingTime.value,sortingType.value)
    let timeMax = calculTimeMax(sortingTime.value,sortingType.value)
    let response;

    try {
      const request = {
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } 
    catch (err) {
      console.log(err);
      createAlert("Click on the 'refresh' button.","error",err.result.error.code,err.result.error.errors[0].message)
      
      refreshButton.value.style.visibility = 'visible';
      
      return;
    }

    eventLoading.value = false
    refreshButton.value.style.visibility = 'hidden';
    isAdding.value = false;
    
    const events = response.result.items;
    if (!events || events.length === 0) {
      noEvent.value = true;
      return;
    }
      
    const output = events.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end?.dateTime || event.end?.date || null,
      location: event.location || null, 
      description: event.description || null, 
      attendees: event.attendees || null,
    }));
    eventsList.value.push(...output);
  }

  async function unselectEvent(){
    event.value = null
  }

  async function handleRemoveEventClick(e, id){
    e.target.innerText = 'Deleting...';
    let response;
    try {
      const request = {
        calendarId: 'primary',
        eventId: id
      };
      response = await gapi.client.calendar.events.delete(request);
      if (response.status === 204) {
        listUpcomingEvents();
        event.value = null
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async function handleAddEventClick() {
    isAdding.value = true;

    if (!newEvent.value.datetime || !newEvent.value.time){
      isAdding.value = false;
      return;
    }

    const event = {
      summary: newEvent.value.title,
      location: newEvent.value.location,
      description: newEvent.value.description,
      start: {
        dateTime: newEvent.value.datetime + ':00+01:00',  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: addTimeToDateTime(newEvent.value.datetime,newEvent.value.time) + ':00+01:00',  
        timeZone: 'Europe/London',  
      },
      attendees: participantsList.value,
    }
    
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: event
      };
      response = await gapi.client.calendar.events.insert(request);
      if (response.status === 200) {
        console.log(response);
        createAlert("Your event named " + newEvent.value.title + " has been added successfully.","success")
        newEvent.value = {
            title: '',
            datetime: '',
            time: '01:00',
            location: '',
            description: '',
            attendees: []
        }
        participantsList.value = [];
        listUpcomingEvents();
        setDatetime();
        toggleIsCreating();
      }
    } catch (err) {
      isAdding.value = false;
      console.log(err);
      return;
    }
  }

  async function modifyEvent(){
    const eventModified = {
      summary: event.value.summary,
      location: event.value.location,
      description: event.value.description,
      start: {
        dateTime: event.value.start,  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: event.value.end,  
        timeZone: 'Europe/London',  
      },
      attendees: event.attendees,
    }
    
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: eventModified,
        eventId: event.value.id,
      };
      response = await gapi.client.calendar.events.update(request);
      if (response.status === 204) {

        listUpcomingEvents();
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async function handleAddParticipant(){
    participantsList.value.push({email : newParticipant.value});
    newParticipant.value = '';
  }

  async function handleDeleteParticipantClick(i){
    participantsList.value.splice(i,1);
  }

  async function handleViewMore(e){
    event.value = e
  }

  async function handleSortingChange(){
    sortingTime.value = getSortingTime(sortingType.value)

    listUpcomingEvents()
  }

  async function setDatetime(){
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedDateTime = localDate.toISOString().slice(0, 16); 
    newEvent.value.datetime = formattedDateTime;

    const formattedDate = localDate.toISOString().slice(0, 10);
    sortingTime.value = formattedDate; // yyyy-mm-dd
  }

  async function toggleIsCreating(){
    console.log(isCreating.value); 
    isCreating.value = !isCreating.value
    console.log(isCreating.value); 
  }

  onMounted(() => {
    refreshButton.value.style.visibility = 'hidden';


    loadScript('https://apis.google.com/js/api.js', () => {
      gapiLoaded(listUpcomingEvents); 
    });
    // loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    setDatetime();
  });
</script>

<template>
  <section id="section_calendar" class="px-4" v-if="isConnected" >
    <h1 class="text-gray-300 font-bold text-2xl">Calendar</h1>
    
    <div  class="text-gray-200">
      <select name="" id="" v-model="sortingType" class="text-gray-800" @change="handleSortingChange" >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <input 
        v-model="sortingTime"
        @input="listUpcomingEvents"
        :type="sortingType === 'daily' ? 'date' : 
        sortingType === 'weekly' ? 'week' : 
        sortingType === 'monthly' ? 'month' : ''"
        class="text-gray-800"
      >
    </div>
    
    <div class="grid grid-cols-auto gap-2 my-4 h-auto text-white">
      <EventCard v-for="event in eventsList" 
        :key="event.id" 
        @click="handleViewMore(event)" 
        :event="event" 
        @handleRemoveEventClick="handleRemoveEventClick"/>     
    </div>
    
    <button class="primary_button" id="buttonOpenAddEventForm" @click="toggleIsCreating">
      <div class="flex items-center">
        <span class="material-symbols-outlined">add</span>
        <p>Create a new event</p>
      </div>
    </button>
    

    <p v-if="noEvent" class="text-gray-200">
      {{
        sortingType === "daily" ? "You don't have any event this day" :
        sortingType === "weekly" ? "You don't have any event this week" :
        sortingType === "monthly" ? "You don't have any event this month" : "error"
      }}
    </p>
    
    <button 
      class="bg-gray-200 p-2 rounded active:scale-95 hover:opacity-90" 
      ref="refreshButton"  
      @click="handleAuthClick">
      Refresh
    </button>

    <div v-if="eventLoading" class="w-full top-0 right-0 flex items-center justify-center ">
      <div class="loader"  ></div> 
    </div>
  </section>

  <div v-else class="text-gray-200">
      <p>You can't see any calendar because you are not connected</p>
      <RouterLink    :to="{name: 'GoogleAuth'}" >
        <button class="primary_button">Click here to connect.</button>
      </RouterLink>
    </div>

  

  <FormCreateEvent 
    v-if="isCreating"
    :newEvent="newEvent" 
    :participantsList="participantsList" 
    :isAdding="isAdding"
    v-model:newParticipant="newParticipant"
    @handleAddEventClick="handleAddEventClick"
    @handleAddParticipant="handleAddParticipant"
    @handleDeleteParticipantClick="handleDeleteParticipantClick"
    @toggleIsCreating="toggleIsCreating"
  />

  <Event v-if="event" 
    :event="event" 
    @modifyEvent="modifyEvent" 
    @handleRemoveEventClick="handleRemoveEventClick"
    @unselectEvent="unselectEvent"
  ></Event>
  
</template>

<style scoped lang="scss">
  #section_calendar{
    min-height: calc(100vh - 56px);
  }

  .grid-cols-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  #buttonOpenAddEventForm{
    position: fixed;
    bottom: 20px;
    left: calc(50vw );
    transform: translateX(-50%);
    transform-origin: center;
    &:active{
      transform: translateX(-50%) scale(0.98);
    }
  }

.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid #133c4e;
  animation:
    l20-1 0.8s infinite linear alternate,
    l20-2 1.6s infinite linear;
}
@keyframes l20-1{
   0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
   12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
   25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
   50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
   100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
}
@keyframes l20-2{ 
  0%    {transform:scaleY(1)  rotate(0deg)}
  49.99%{transform:scaleY(1)  rotate(135deg)}
  50%   {transform:scaleY(-1) rotate(0deg)}
  100%  {transform:scaleY(-1) rotate(-135deg)}
}
</style>
