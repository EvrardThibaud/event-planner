<script setup>

</script>

<template>
  <nav class="text-1xl text-white w-full flex justify-evenly">
    <RouterLink class="" :to="{name: 'Home'}" >
        Home
    </RouterLink>

    <RouterLink class="" :to="{name: 'Calendar'}" >
        Calendar
    </RouterLink>

    <RouterLink class="" :to="{name: 'Event'}" >
        Event
    </RouterLink>
  
    <RouterLink class="" :to="{name: 'AboutUs'}" >
        About Us
    </RouterLink>
  </nav>
</template>

<style scoped>
</style>
