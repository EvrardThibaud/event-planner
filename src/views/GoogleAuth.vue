<script setup>
import { ref, onMounted } from "vue";
import {
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
  <div class="flex flex-col gap-4 text-gray-200 p-24">
    <h1 class="text-xl">Connect</h1>
    <p>
      To use the EventPlanner+ calendar and events service, you must sign in
      with Google.
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
