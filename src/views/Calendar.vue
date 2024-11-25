<script setup>
  import { ref, onMounted } from 'vue';

  const contentArea = ref(null);

  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  let tokenClient;

  function loadScript(src, onload) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = onload;
    document.head.appendChild(script);
  }

  const API_KEY = 'AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg';
  const CLIENT_ID = '241948682819-u21tselap4mi8p5u1ktvd0453begefdr.apps.googleusercontent.com';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', 
    });
  }

  async function initializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    });

    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      gapi.client.setToken({ access_token: savedToken });
      await listUpcomingEvents();
    } else {
      contentArea.value.innerText = 'You are not connected';
    }
  }

  async function listUpcomingEvents() {
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
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    contentArea.value.innerText = output;
  }

  const event = {
    'summary': 'Judo',
    'location': '415 carrer de Valencie',
    'description': 'on va faire du judo',
    'start': {
      'dateTime': '2024-11-26T09:00:00-07:00',
      'timeZone': 'France/Paris'
    },
    'end': {
      'dateTime': '2024-11-26T09:00:00-07:00',
      'timeZone': 'France/Paris'
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };

  async function handleAddEventClick() {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        resource: event
      };
      response = await gapi.client.calendar.events.insert(request);
    } catch (err) {
      contentArea.value.innerText = contentArea.value.innerText + err.message ;
      return;
    }
  }

  onMounted(() => {
    contentArea.value.innerText = '';

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);
  });
</script>

<template>
  <div class="text-white">
    <h1 class="pt-24">Calendar</h1>
    <pre ref="contentArea" style="white-space: pre-wrap;"></pre>
    <button class="text-white" @click="handleAddEventClick">Add event</button>
  </div>
</template>

<style scoped>
</style>
