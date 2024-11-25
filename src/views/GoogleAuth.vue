<script setup>
import { ref, onMounted } from 'vue';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

let tokenClient;
let gapiInited = false;
let gisInited = false;

const authorizeButton = ref(null);
const signoutButton = ref(null);

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
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();

  // Si un token existe déjà dans localStorage, on le réutilise
  const savedToken = localStorage.getItem('google_access_token');
  if (savedToken) {
    gapi.client.setToken({ access_token: savedToken });
    signoutButton.value.style.visibility = 'visible';
    authorizeButton.value.innerText = 'Refresh';
  }
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

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    localStorage.removeItem('google_access_token');

    authorizeButton.value.innerText = 'Authorize';
    signoutButton.value.style.visibility = 'hidden';
  }
}

onMounted(() => {
  authorizeButton.value.style.visibility = 'hidden';
  signoutButton.value.style.visibility = 'hidden';

  loadScript('https://apis.google.com/js/api.js', gapiLoaded);
  loadScript('https://accounts.google.com/gsi/client', gisLoaded);
});
</script>

<template>
  <div class="text-white">
    <h1 class="pt-24">Google Auth with Persistence</h1>
    <button ref="authorizeButton" @click="handleAuthClick">Authorize</button>
    <button ref="signoutButton" @click="handleSignoutClick">Sign Out</button>
  </div>
</template>

<style scoped>
</style>
