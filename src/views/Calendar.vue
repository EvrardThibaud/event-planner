<script setup>
  import { ref, onMounted } from 'vue';
  import {gisLoaded, gapiLoaded} from "../composable/GoogleAuth.js";


  const contentArea = ref(null);
  const showCalendar = ref(null);

  const eventsList = ref([]);


  function loadScript(src, onload) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = onload;
    document.head.appendChild(script);
  }

  async function listUpcomingEvents() {
    showCalendar.value.innerText = 'Loading...';

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
    
    eventsList.value = [];
    
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
  }

  const event = {
    summary: 'Judo',
    location: '415 carrer de Valencie',
    description: 'On va faire du judo',
    start: {
      dateTime: '2024-11-28T08:00:00+01:00',  // Heure correcte en Europe/Paris
      timeZone: 'Europe/Paris',  // Corrigé la timezone
    },
    end: {
      dateTime: '2024-11-28T10:00:00+01:00',  // Exemple: l'événement dure 1 heure
      timeZone: 'Europe/Paris',  // Corrigé la timezone
    },
    // recurrence: [
    //   'RRULE:FREQ=DAILY;COUNT=2',  // L'événement se répète tous les jours pendant 2 jours
    // ],
    attendees: [
      { email: 'lpage@example.com' },
      { email: 'sbrin@example.com' },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },  // Rappel par email 24 heures avant
        { method: 'popup', minutes: 10 },  // Rappel par popup 10 minutes avant
      ],
    },
  };

  async function handleRemoveEventClick(id){
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
  });
</script>

<template>
  <div class="text-white">
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
        <button @click="handleRemoveEventClick(event.id)">Delete this event</button>
      </li>
    </ul>
    <pre ref="contentArea" id="content_area" style="white-space: pre-wrap;">aaad</pre>
    <button class="text-white" @click="handleAddEventClick">Add event</button>
    <button ref="showCalendar" id="show_calendar" @click="listUpcomingEvents">Show Calendar</button>
  </div>
</template>

<style scoped>
</style>
