<script setup></script>

<template>
  <section class="">
    <h1 class="w-full text-center text-green-300">
      Welcome To <br />
      <bold class="font-bold">EventPlanner+</bold>
    </h1>

    <p class=" text-justify">
      Welcome to <bold class="font-bold text-green-300">EventPlanner+</bold>,
      the ultimate platform for online event management! Whether you're an event
      organizer or a participant, EventPlanner+ streamlines event planning and
      coordination with its intuitive interface and powerful tools. Create,
      manage, and track your events in real time, while easily communicating and
      collaborating with all participants. With a smooth experience and modern
      design, EventPlanner+ helps you plan your events more efficiently and
      enjoyably than ever before.
    </p>
  </section>

  <section >
    <h2 class="text-green-300">Event Management</h2>
    <p class="text-justify">
      With <bold class="font-bold text-green-300">EventPlanner+</bold>,
      creating, modifying, and tracking your events is a breeze. Add essential
      details such as the title, date, time, location, and description, and edit
      them in real time. You can also invite other users directly through the
      platform or via email, ensuring seamless coordination.
    </p>
    <div class="text-center">
      <button class="secondary_button">
        <RouterLink :to="{ name: 'Calendar' }">
          Start managing your events now !
        </RouterLink>
      </button>
    </div>
  </section>

  <section>
    <h2 class="text-green-300">Interactive Calendar</h2>
    <p class=" text-justify">
      Our interactive calendar allows you to view your events in multiple
      formats (monthly, weekly, or daily), giving you a clear view of your
      schedule. Simply click on an event to see its details. You can also add
      new events directly from the calendar with ease.
    </p>
    <div class="text-center">
      <button class="secondary_button">
        <RouterLink :to="{ name: 'Calendar' }"> Try it out now ! </RouterLink>
      </button>
    </div>
  </section>

  <section >
    <h2 class="text-green-300">Chat System</h2>
    <p class=" text-justify">
      Stay connected with participants through
      <bold class="font-bold text-green-300">EventPlanner+</bold>’s built-in
      chat system. The chat interface enables real-time communication, allowing
      you to discuss event details, share updates, and collaborate. With
      automated replies powered by Google's Gemini API, the system provides a
      realistic and efficient messaging experience, simulating the feel of
      modern chat applications.
    </p>
    <div class="text-center">
      <button class="secondary_button">
        <RouterLink :to="{ name: 'Chat' }"> Start chating now ! </RouterLink>
      </button>
    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 5vw;
}
</style>
