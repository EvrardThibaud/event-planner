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
  <NavBar/>
  <main>
    <RouterView></RouterView>
  </main>
</template>


