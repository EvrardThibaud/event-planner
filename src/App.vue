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
  <header class="h-14 bg-zinc-800 border-b-green-200 border-b-2 flex justify-between items-center">
    <RouterLink class="font-bold text-green-300 ml-4 mr-4 min-w-fit" :to="{name: 'Home'}" >
      Event Planner
    </RouterLink>
    <NavBar/>
  </header>
  <main>
    <RouterView></RouterView>
  </main>
</template>


