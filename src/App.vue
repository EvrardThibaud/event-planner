<script setup>
  import { useRoute,useRouter } from 'vue-router';
  import NavBar from './components/NavBar.vue'
  import Footer from './components/Footer.vue';
</script>

<template>
  <div id="alertsBox" class="h-auto w-auto fixed bottom-2 right-2 flex flex-col-reverse z-30"></div>
  <header class="fixed h-14 w-screen bg-zinc-900/90 border-b-green-200 border-b-2 flex justify-between items-center backdrop-blur-xl">
    <RouterLink class="font-bold text-green-300 ml-4 mr-4 min-w-fit" :to="{name: 'Home'}" >
      EventPlanner+
    </RouterLink>
    <NavBar/>
  </header>
  
  <div class="h-14 w-full"></div>
  
  <main class="bg-zinc-900 flex flex-col justify-center items-center">
    <RouterView></RouterView>
  </main>
  
  <Footer></Footer>

</template>


