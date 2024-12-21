<script setup>
import { ref, onMounted } from 'vue';

const authorize_button = ref(null);
const signout_button = ref(null);
const API_KEY = 'AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const CLIENT_ID = '241948682819-u21tselap4mi8p5u1ktvd0453begefdr.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
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

async function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function gisLoaded() {
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
    listUpcomingEvents();

    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
        gapi.client.setToken({ access_token: savedToken });
        const signoutButton = document.getElementById('signout_button')
        const authorizeButton = document.getElementById('authorize_button')
        if (signoutButton && authorizeButton){
            signoutButton.style.visibility = 'visible';
            authorizeButton.innerText = 'Refresh';
        } 

        const toConnect = document.getElementById('to_connect')
        if (toConnect){
            toConnect.style.visibility = 'hidden'; 
        }

        const showCalendar = document.getElementById('show_calendar')
        if (showCalendar){
            showCalendar.style.visibility = 'visible'; 
        }
    }
}

async function listUpcomingEvents() {
    
    let response;
    console.log(gapi);
    try {
      const request = {
        calendarId: 'primary',
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
      console.log(response);
    } 
    catch (err) {
      console.log(err);
      return;
    }
  }


function maybeEnableButtons() {
    const authorizeButton = document.getElementById('authorize_button');
    if (authorizeButton) {
        authorizeButton.style.visibility = 'visible';
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

        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}


onMounted(() => {
  authorize_button.value.style.visibility = 'hidden';
  signout_button.value.style.visibility = 'hidden';

  loadScript('https://apis.google.com/js/api.js', gapiLoaded);
  loadScript('https://accounts.google.com/gsi/client', gisLoaded);
});
</script>

<template>
  <div class="text-white">
    <h1 class="pt-24">Google Auth with Persistence</h1>
    <button ref="authorize_button" id="authorize_button" class="primary_button" @click="handleAuthClick">Authorize</button>
    <button ref="signout_button" id="signout_button" class="red_button" @click="handleSignoutClick">Sign Out</button>
  </div>
</template>

<style scoped>
</style>
