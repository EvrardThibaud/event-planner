<script setup>
import { useRoute,useRouter } from 'vue-router';
  import {ref} from 'vue'
  
  const router = useRouter();
  
  const route = useRoute();

  console.log(router)
  console.log(route)
  import NavBar from './components/NavBar.vue'
</script>

<template>
  <header class="fixed h-14 w-screen bg-zinc-900 border-b-green-200 border-b-2 flex justify-between items-center">
    <RouterLink class="font-bold text-green-300 ml-4 mr-4 min-w-fit" :to="{name: 'Home'}" >
      EventPlanner+
    </RouterLink>
    <NavBar/>
  </header>
  <main class="bg-zinc-900 flex items-center flex-col min-h-screen">
    <RouterView></RouterView>
  </main>
</template>


