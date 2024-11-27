import { ref } from 'vue';

const API_KEY = 'AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg';
const CLIENT_ID = '241948682819-u21tselap4mi8p5u1ktvd0453begefdr.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
let tokenClient;
let gapiInited = false;
let gisInited = false;



export async function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
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
        const signoutButton = document.getElementById('signout_button')
        const authorizeButton = document.getElementById('authorize_button')
        if (signoutButton && authorizeButton){
            signoutButton.style.visibility = 'visible';
            authorizeButton.innerText = 'Refresh';
        } 

        const showCalendar = document.getElementById('show_calendar')
        if (showCalendar){
            showCalendar.style.visibility = 'visible'; 
        }
    }else {
        const contentArea = document.getElementById('content_area')
        if (contentArea){
            contentArea.innerText = 'You are not connected';
        }
    }
}

export async function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

export function maybeEnableButtons() {
    const authorizeButton = document.getElementById('authorize_button');
    if (authorizeButton) {
        authorizeButton.style.visibility = 'visible';
    }
}

export async function handleAuthClick() {
    console.log("handleAuthClick0");
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
        throw resp;
        }
        // Sauvegarder le token dans localStorage
        const token = gapi.client.getToken().access_token;
        localStorage.setItem('google_access_token', token);

        console.log("handleAuthClick1");

        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}


export function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        localStorage.removeItem('google_access_token');

        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}
