<script setup>
  import { ref, onMounted } from 'vue';
  import {gisLoaded, gapiLoaded, loadScript} from "../composable/GoogleAuth.js";
  import {addTimeToDateTime} from "../composable/DateTime.js";
  
  const contentArea = ref(null);
  const showCalendar = ref(null);
  const isAdding = ref(false);
  const eventsList = ref([]);
  const newEvent = ref({
        title: '',
        datetime: '',
        time: '01:00',
        location: '',
        description: ''
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
      end: event.end?.dateTime || event.end?.date || null, // Ajout de la fin si nécessaire
      location: event.location || null, // Facultatif, si l'événement a une localisation
      description: event.description || null, // Facultatif, si l'événement a une description
      viewMore: false,
    }));
    eventsList.value.push(...output);
    showCalendar.value.style.visibility = 'hidden';
    isAdding.value = false;
  }

  // const event = {
  //   summary: 'Judo',
  //   location: '415 carrer de Valencie',
  //   description: 'On va faire du judo',
  //   start: {
  //     dateTime: '2024-11-28T08:00:00+01:00',  // Heure correcte en Europe/Paris
  //     timeZone: 'Europe/Paris',  // Corrigé la timezone
  //   },
  //   end: {
  //     dateTime: '2024-11-28T10:00:00+01:00',  // Exemple: l'événement dure 1 heure
  //     timeZone: 'Europe/Paris',  // Corrigé la timezone
  //   },
  //   // recurrence: [
  //   //   'RRULE:FREQ=DAILY;COUNT=2',  // L'événement se répète tous les jours pendant 2 jours
  //   // ],
  //   attendees: [
  //     { email: 'lpage@example.com' },
  //     { email: 'sbrin@example.com' },
  //   ],
  //   reminders: {
  //     useDefault: false,
  //     overrides: [
  //       { method: 'email', minutes: 24 * 60 },  // Rappel par email 24 heures avant
  //       { method: 'popup', minutes: 10 },  // Rappel par popup 10 minutes avant
  //     ],
  //   },
  // };

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
    }
    
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: event
      };
      response = await gapi.client.calendar.events.insert(request);
      if (response.status === 200) {
        listUpcomingEvents();
      }
    } catch (err) {
      isAdding.value = false;
      console.log(err);
      return;
    }
  }

  async function handleViewMore(id){
    const event = eventsList.value.find(event => event.id === id);
    event.viewMore = !event.viewMore;  
  }

  onMounted(() => {
    contentArea.value.innerText = '';
    showCalendar.value.style.visibility = 'hidden';

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);

    const input = document.getElementById('datetime');
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const formattedNow = localDate.toISOString().slice(0, 16); 
    input.min = formattedNow;
    newEvent.value.datetime = formattedNow;
  });
</script>

<template>
  <div class="pt-24 grid grid-cols-[30%,70%]">
  <section>
    <h2 class="text-center text-gray-300 font-bold text-2xl">Add an Event</h2>
    <form @submit.prevent="submitForm" id="form_add_event" class="flex justify-center items-start flex-col gap-4 p-4">
      <div>

        <label for="title">Title</label>
        <input
        id="title"
        type="text"
        v-model="newEvent.title"
        placeholder="My future event"
        />
      </div>
      <div>

        <label for="datetime">Date</label>
        <input
        id="datetime"
        type="datetime-local"
        v-model="newEvent.datetime"
        />
      </div>
      <div>

        <label for="time">Duration</label>
        <input
        id="time"
        type="time"
        v-model="newEvent.time"
        value= "01:00"
        />
      </div>
      <div>
        <label for="location">Location</label>
        <input
        id="location"
        type="text"
        v-model="newEvent.location"
        />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea
        id="description"
        v-model="newEvent.description"
        ></textarea>
      </div>  
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
          <p>{{ event.id }}</p>
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

    input, textarea{
      min-width: 200px;
      max-height: 100px;
      
      min-height: 40px;
      width: 80%;
      color: #18181b;
      padding: 2px;
      border: 2px solid #18181b;
      border-radius: 5px;
      background-color: #d1d5db;
    }

    textarea{

    }

  }
</style>
