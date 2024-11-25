<script setup>

</script>

<template>
  <nav class="text-1xl text-gray-200 w-1/2 flex justify-evenly">
    <RouterLink class="hover:text-green-300 " :to="{name: 'Home'}" >
        Home
    </RouterLink>

    <RouterLink class="hover:text-green-300 " :to="{name: 'Calendar'}" >
        Calendar
    </RouterLink>

    <RouterLink class="hover:text-green-300 " :to="{name: 'Chat'}" >
        Chat
    </RouterLink>
  
    <RouterLink class="hover:text-green-300 " :to="{name: 'AboutUs'}" >
        About Us
    </RouterLink>
  </nav>
</template>

<style scoped>
</style>
