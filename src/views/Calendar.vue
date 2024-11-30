<script setup>
  import { ref, onMounted } from 'vue';
  import {gisLoaded, gapiLoaded, loadScript} from "../composable/GoogleAuth.js";
  import {addTimeToDateTime} from "../composable/DateTime.js";
  
  const contentArea = ref(null);
  const showCalendar = ref(null);
  const newParticipant = ref('');
  const isAdding = ref(false);
  const eventsList = ref([]);
  const participantsList = ref([]);
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

    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      contentArea.value.innerText = err.message;
      return;
    }
    
    const events = response.result.items;
    if (!events || events.length === 0) {
      contentArea.value.innerText = 'No events found.';
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
      viewMore: false,
    }));
    eventsList.value.push(...output);
    showCalendar.value.style.visibility = 'hidden';
    isAdding.value = false;
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
        setDatetime();
        listUpcomingEvents();
      }
    } catch (err) {
      isAdding.value = false;
      console.log(err);
      return;
    }
  }

  async function handleAddParticipant(){
    participantsList.value.push({email : newParticipant.value});
    newParticipant.value = '';
  }

  async function handeDeleteParticipantClick(i){
    participantsList.value.splice(i,1);
  }

  async function handleViewMore(id){
    const event = eventsList.value.find(event => event.id === id);
    event.viewMore = !event.viewMore;  
  }

  async function setDatetime(){
    const input = document.getElementById('datetime');
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedNow = localDate.toISOString().slice(0, 16); 
    input.min = formattedNow;
    newEvent.value.datetime = formattedNow;
  }

  onMounted(() => {
    contentArea.value.innerText = '';
    showCalendar.value.style.visibility = 'hidden';

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);

    setDatetime();
  });
</script>

<template>
  <div class="pt-24 grid grid-cols-[30%,70%]">
  <section>
    <h2 class="pl-4 text-gray-300 font-bold text-2xl">Add an Event</h2>
    <form @submit.prevent="submitForm" id="form_add_event" class=" flex justify-center items-start flex-col gap-4 p-4">
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
          ></input>
        </div> 
      </form>

        <button  @click="handleAddEventClick">{{ isAdding ? "Adding..." : "Add Event" }}</button>
      </form>
    </section>
      
    <section>
      <h1 class="pt-24">Calendar</h1>
      <ul>
        <li v-for="event in eventsList" class= "b-white border-2 m-2 p-2" :key="event.id" @click="handleViewMore(event.id)">
          <p>Titre : {{ event.summary }}</p>
          <p>De : {{ event.start }}</p>
          <p>A : {{ event.end }}</p>
          <div v-if="event.viewMore">
            <p v-if="event.location">Where : {{ event.location }}</p>
            <p v-if="event.description">Description : {{ event.description }}</p>
          </div>
          <p v-for="(guest, i) in event.attendees" :key="i">
            {{ guest.email }}
          </p>
          <button @click="handleRemoveEventClick($event, event.id)">Delete this event</button>
        </li>
      </ul>
      <pre ref="contentArea" id="content_area" style="white-space: pre-wrap;">aaad</pre>
      <button ref="showCalendar" id="show_calendar" @click="listUpcomingEvents">Show Calendar</button>
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
      min-width: 200px;
      width: 80%;
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
  }
</style>
