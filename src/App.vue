<script setup>
  import { useRoute,useRouter } from 'vue-router';
  import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="alertsBox" class="h-auto w-auto fixed bottom-2 right-2"></div>
  <header class="fixed h-14 w-screen bg-zinc-900 border-b-green-200 border-b-2 flex justify-between items-center">
    <RouterLink class="font-bold text-green-300 ml-4 mr-4 min-w-fit" :to="{name: 'Home'}" >
      EventPlanner+
    </RouterLink>
    <NavBar/>
  </header>
  <div class="h-14 bg-red-500 w-full"></div>
  <main class="bg-zinc-900 ">
    <RouterView></RouterView>
  </main>
</template>


