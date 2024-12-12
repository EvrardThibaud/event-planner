<script setup>
  import { ref, onMounted } from 'vue';
  import {gisLoaded, gapiLoaded, loadScript} from "../composable/GoogleAuth.js";
  import {addTimeToDateTime, calculTimeMin, calculTimeMax} from "../composable/DateTime.js";
  import Event from '../components/Event.vue';
  
  const contentArea = ref(null);
  const event = ref(null)
  const showCalendar = ref(null);
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
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
       console.log(err.message);
      showCalendar.value.innerText = 'Show Calendar';
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

  async function handleRemoveEventClick(event,id){
    event.target.innerText = 'Deleting...';
    let response;
    try {
      const request = {
        calendarId: 'primary',
        eventId: id
      };
      response = await gapi.client.calendar.events.delete(request);
      if (response.status === 204) {
        listUpcomingEvents();
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async function handleAddEventClick() {
    isAdding.value = true;

    if (!newEvent.value.datetime || !newEvent.value.time){
      console.log("ya pas");
      isAdding.value = false;
      return;
    }

    const event = {
      summary: newEvent.value.title,
      location: newEvent.value.location,
      description: newEvent.value.description,
      start: {
        dateTime: newEvent.value.datetime + ':00',  
        timeZone: 'Europe/London', 
      },
      end: {
        dateTime: addTimeToDateTime(newEvent.value.datetime,newEvent.value.time) + ':00',  
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
      }
    } catch (err) {
      isAdding.value = false;
      console.log(err);
      return;
    }
  }

  async function modifyEvent(){
    console.log("Modification réussi !!!!");
  }

  async function handleAddParticipant(){
    participantsList.value.push({email : newParticipant.value});
    newParticipant.value = '';
  }

  async function handeDeleteParticipantClick(i){
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

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);

    setDatetime();

  });
</script>

<template>
  <div class=" min-h-max grid grid-cols-[30%,40%,30%]">
    <section v-if="isConnected" class="border-r-green-200 border-r-2">
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
                <i class="fa-solid fa-trash" @click="handeDeleteParticipantClick(i)"></i>
              </li>
            </ul>
              <input
              v-model="newParticipant"
              type="email"
              id="participants"
              placeholder="Participants's email"
              required
              ></input>
              <button id="secondary_button">Add this particpant</button>
          </div> 
        </form>

          <button  @click="handleAddEventClick">{{ isAdding ? "Adding..." : "Add Event" }}</button>
      </form>
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
      <ul>
        <li v-for="event in eventsList" class= "b-white border-2 m-2 p-2 text-white" :key="event.id" @click="handleViewMore(event)">
          <p>Titre : {{ event.summary }}</p>
          <p>De : {{ event.start }}</p>
          <p>A : {{ event.end }}</p>
          <button @click="handleRemoveEventClick($event, event.id)">Delete this event</button>
        </li>
      </ul>

      <div id="to_connect" class="text-gray-200">
        <p>You can't see any calendar because you are not connected</p>
        <RouterLink   class="hover:text-green-300 " :to="{name: 'GoogleAuth'}" >
          Click here to connect.
        </RouterLink>
      </div>
      <p v-if="noEvent" class="text-gray-200">Your calendar doesn't contain any event.</p>
      <button class="bg-gray-200 p-2 rounded active:scale-95 hover:opacity-90" ref="showCalendar" id="show_calendar" @click="() => listUpcomingEvents()">Show Calendar</button>
    </section>

    <section class="px-4">
      <Event :event="event" @modifyEvent="modifyEvent"></Event>
    </section>
  </div>
</template>

<style scoped lang="scss">
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
  }
</style>
