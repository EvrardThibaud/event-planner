<script setup>

</script>

<template>
     <form @submit.prevent="submitForm" class="flex flex-col text-green-500">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          v-model="newEvent.title"
          placeholder="My future event"
        />
        <label for="datetime">Date</label>
        <input
          id="datetime"
          type="datetime-local"
          v-model="newEvent.datetime"
        />
        <label for="time">Duration</label>
        <input
          id="time"
          type="time"
          v-model="newEvent.time"
          value= "01:00"
        />
        <label for="location">Location</label>
        <input
          id="location"
          type="text"
          v-model="newEvent.location"
        />
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="newEvent.description"
        ></textarea>
      <button class="text-white" @click="handleAddEventClick">{{ isAdding ? "Adding..." : "Add Event" }}</button>
    </form>
    
</template>

<style scoped>
</style>
