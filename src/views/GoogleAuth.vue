<script setup>
import { ref, onMounted, watch } from "vue";
import {
  tokenClient,
  loadScript,
  gapiLoaded,
  gisLoaded,
  handleAuthClick,
  handleSignoutClick,
} from "../composable/GoogleAuth.js";

const authorize_button = ref(null);
const signout_button = ref(null);

onMounted(() => {
  authorize_button.value.style.visibility = "hidden";
  signout_button.value.style.visibility = "hidden";

  loadScript("https://apis.google.com/js/api.js", gapiLoaded);
  loadScript("https://accounts.google.com/gsi/client", gisLoaded);
});
</script>

<template>
  <div class="flex flex-col gap-4 text-gray-200 p-24 w-1/2">
    <h1 class="text-xl">Connect</h1>
    <p class="text-justify">
      To use the calendar and event features of EventPlanner+, you must sign in
      with your Google account. Once that's done, head over to the
      <RouterLink :to="{ name: 'Calendar' }" class="text-green-300"> Calendar Page </RouterLink> on the
      website and start organizing your events!
    </p>
    <div>
      <button
        ref="authorize_button"
        id="authorize_button"
        class="primary_button"
        @click="handleAuthClick"
      >
        Sign In with Google
      </button>
      <button
        ref="signout_button"
        id="signout_button"
        class="red_button"
        @click="handleSignoutClick"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<style scoped></style>
