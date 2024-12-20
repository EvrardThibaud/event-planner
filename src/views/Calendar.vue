<script setup>
  import { ref, onMounted } from 'vue';
  import {gisLoaded, gapiLoaded, loadScript,handleAuthClick} from "../composable/GoogleAuth.js";
  import {addTimeToDateTime, calculTimeMin, calculTimeMax, formatEventDateTimes} from "../composable/DateTime.js";
  import { createAlert } from '../composable/Alerts.js';
  import Event from '../components/Event.vue';
  import EventCard from '../components/EventCard.vue';
  import FormCreateEvent from '../components/FormCreateEvent.vue';

  const event = ref(null)
  const showCalendar = ref(null);
  const refreshButton = ref(null)
  const newParticipant = ref('');
  const isAdding = ref(false);
  const eventsList = ref([]);
  const isConnected = ref(false);
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
    showCalendar.value.innerText = 'Loading...';
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
    } catch (err) {
      createAlert("Click on the 'refresh' button.","error",err.result.error.code,err.result.error.errors[0].message)
      showCalendar.value.innerText = 'Show Calendar';
      refreshButton.value.style.visibility = 'visible';
      return;
    }

    showCalendar.value.style.visibility = 'hidden';
    isConnected.value = true;
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
        setDatetime()
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

  async function setDatetime(){
    const input = document.getElementById('datetime');
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedDateTime = localDate.toISOString().slice(0, 16); 
    newEvent.value.datetime = formattedDateTime;
    const formattedDate = localDate.toISOString().slice(0, 10);
    sortingTime.value = formattedDate
  }

  onMounted(() => {
    showCalendar.value.style.visibility = 'hidden';
    refreshButton.value.style.visibility = 'hidden';

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);

    setDatetime();
  });
</script>

<template>
  <div class=" min-h-max grid grid-cols-[30%,40%,30%]">
    <section v-if="isConnected" class="border-r-green-200 border-r-2">
      <FormCreateEvent 
        :newEvent="newEvent" 
        :participantsList="participantsList" 
        :isAdding="isAdding"
        v-model:newParticipant="newParticipant"
        @handleAddEventClick="handleAddEventClick"
        @handleAddParticipant="handleAddParticipant"/>
        <p class="text-white">
          {{ newParticipant }}
        </p>
    </section>

    <section class="px-4 border-r-green-200 border-r-2">
      <h1 class="text-gray-300 font-bold text-2xl">Calendar</h1>
      <div v-if="isConnected" class="text-gray-200">
        <select name="" id="" v-model="sortingType" class="text-gray-800">
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
      
      <div id="to_connect" class="text-gray-200">
        <p>You can't see any calendar because you are not connected</p>
        <RouterLink   class="hover:text-green-300 " :to="{name: 'GoogleAuth'}" >
          Click here to connect.
        </RouterLink>
      </div>
      <p v-if="noEvent" class="text-gray-200">Your calendar doesn't contain any event.</p>
      <button class="bg-gray-200 p-2 rounded active:scale-95 hover:opacity-90 m-6" ref="showCalendar" id="show_calendar" @click="() => listUpcomingEvents()">Show Calendar</button>
      <button class="bg-gray-200 p-2 rounded active:scale-95 hover:opacity-90" ref="refreshButton"  @click="handleAuthClick">Refresh</button>

    </section>

    <section class="px-4 fixed right-0">
      <Event v-if="event" :event="event" @modifyEvent="modifyEvent" @handleRemoveEventClick="handleRemoveEventClick"></Event>
    </section>
  </div>
</template>

<style scoped lang="scss">
  .grid-cols-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
</style>
