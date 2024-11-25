<script setup>
  import { ref, onMounted } from 'vue';

  const contentArea = ref(null);

  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

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
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', 
    });
    gisInited = true;
  }

  async function initializeGapiClient() {
    await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;

    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      gapi.client.setToken({ access_token: savedToken });
      await listUpcomingEvents();
    } else {
      contentArea.value.innerText = 'You are not connected';
    }
  }

  async function handleRefreshClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      // Sauvegarder le token dans localStorage
      const token = gapi.client.getToken().access_token;
      localStorage.setItem('google_access_token', token);

      signoutButton.value.style.visibility = 'visible';
      authorizeButton.value.innerText = 'Refresh';
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
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

  onMounted(() => {
    contentArea.value.innerText = '';

    loadScript('https://apis.google.com/js/api.js', gapiLoaded);
    loadScript('https://accounts.google.com/gsi/client', gisLoaded);
  });

</script>

<template>
  <div class="text-white">
    <h1 class="pt-24">Event</h1>
    <button ref="authorizeButton" @click="handleRefreshClick">Refresh</button>
    <pre ref="contentArea" style="white-space: pre-wrap;"></pre>
  </div>
</template>
