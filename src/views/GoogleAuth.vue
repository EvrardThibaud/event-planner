<script setup>
import { ref, onMounted } from 'vue';
import { loadScript, gapiLoaded, gisLoaded, handleAuthClick, handleSignoutClick } from "../composable/GoogleAuth.js" ;

const authorize_button = ref(null);
const signout_button = ref(null);


onMounted(() => {
  authorize_button.value.style.visibility = 'hidden';
  signout_button.value.style.visibility = 'hidden';

  loadScript('https://apis.google.com/js/api.js', gapiLoaded);
  loadScript('https://accounts.google.com/gsi/client', gisLoaded);
});
</script>

<template>
  <div class="text-white">
    <h1>Google Auth with Persistence</h1>
    <button ref="authorize_button" id="authorize_button" class="primary_button" @click="handleAuthClick">Authorize</button>
    <button ref="signout_button" id="signout_button" class="red_button" @click="handleSignoutClick">Sign Out</button>
  </div>
</template>

<style scoped>
</style>
