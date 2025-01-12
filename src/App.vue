<script setup>
  import { useRoute,useRouter } from 'vue-router';
  import NavBar from './components/NavBar.vue'
  import Footer from './components/Footer.vue';
</script>

<template>
  <div id="alertsBox" class="h-auto w-auto fixed bottom-2 right-2 flex flex-col-reverse z-30"></div>

  <header class="fixed h-14 w-full border-b-green-200 border-b-2 flex justify-between items-center backdrop-blur-xl">
    <!-- RouterLink pour afficher "E" ou "EventPlanner+" -->
    <RouterLink class="font-bold text-green-300 ml-4 mr-4 min-w-fit eventLink" :to="{name: 'Home'}">
      
    </RouterLink>

    <NavBar/>

    <RouterLink class="hover:text-green-300 text-gray-200" :to="{name: 'GoogleAuth'}" >
      <span class="material-symbols-outlined text-3xl size-10">
        account_circle
      </span>
    </RouterLink>
  </header>
  
  <div class="h-14 w-full"></div>
  
  <main class="flex flex-col justify-center items-center">
    <RouterView></RouterView>
  </main>
  
  <Footer></Footer>
</template>

<style>
 .eventLink::after {
    content: 'EventPlanner+';
  }

  @media (max-width: 426px) {
    .eventLink::after {
      content: 'E'; 
    }

    .eventLink {
      font-size: 20px; 
    }
  }
</style>