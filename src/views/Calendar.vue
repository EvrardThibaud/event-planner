<script setup>
import { ref, onMounted } from 'vue';

// TODO: Replace with your actual client ID and API key
const CLIENT_ID = '241948682819-u21tselap4mi8p5u1ktvd0453begefdr.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

const authorizeButton = ref(null);
const signoutButton = ref(null);
const contentArea = ref(null);

// Function to dynamically load scripts
function loadScript(src, onload) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  script.onload = onload;
  document.head.appendChild(script);
}

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Will be set later in handleAuthClick
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    authorizeButton.value.style.visibility = 'visible';
  }
}

async function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    signoutButton.value.style.visibility = 'visible';
    authorizeButton.value.innerText = 'Refresh';
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    contentArea.value.innerText = '';
    authorizeButton.value.innerText = 'Authorize';
    signoutButton.value.style.visibility = 'hidden';
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
  if (!events || events.length == 0) {
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
  authorizeButton.value.style.visibility = 'hidden';
  signoutButton.value.style.visibility = 'hidden';

  // Load the Google API and Google Identity scripts dynamically
  loadScript('https://apis.google.com/js/api.js', gapiLoaded);
  loadScript('https://accounts.google.com/gsi/client', gisLoaded);
});
</script>

<template>
  <div class="text-white">
    <h1 class="pt-24">Google Calendar API</h1>
    <button ref="authorizeButton" @click="handleAuthClick">Authorize</button>
    <button ref="signoutButton" @click="handleSignoutClick">Sign Out</button>
    <pre ref="contentArea" style="white-space: pre-wrap;"></pre>
  </div>
</template>

<style scoped>
</style>
