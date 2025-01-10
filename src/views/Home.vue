<script setup>

</script>

<template>
    <section class=" w-1/2 pt-28 pb-12 flex flex-col gap-5  ">
        <h1 class="w-full text-center text-7xl text-green-300">
            Welcome To <br> <bold class="font-bold">EventPlanner+</bold>
        </h1>

        <p class="text-gray-200 text-justify">
            Welcome to <bold class="font-bold text-green-300 ">EventPlanner+</bold>, the ultimate platform for online event management! Whether you're an event organizer or a participant, EventPlanner+ streamlines event planning and coordination with its intuitive interface and powerful tools. Create, manage, and track your events in real time, while easily communicating and collaborating with all participants. With a smooth experience and modern design, EventPlanner+ helps you plan your events more efficiently and enjoyably than ever before.
        </p>
    </section>

    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Link EventPlanner+ to your google account :</h2>
        <p class="text-gray-200 text-justify">

        </p>
        <RouterLink class="hover:text-green-300 text-gray-200" :to="{name: 'GoogleAuth'}" >
            Link
        </RouterLink>
    </section>

    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Event Management</h2>
        <p class="text-gray-200 text-justify">
            With <bold class="font-bold text-green-300">EventPlanner+</bold>, creating, modifying, and tracking your events is a breeze. Add essential details such as the title, date, time, location, and description, and edit them in real time. You can also invite other users directly through the platform or via email, ensuring seamless coordination.
        </p>
    </section>

    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Interactive Calendar</h2>
        <p class="text-gray-200 text-justify">
            Our interactive calendar allows you to view your events in multiple formats (monthly, weekly, or daily), giving you a clear view of your schedule. Simply click on an event to see its details. You can also add new events directly from the calendar with ease.
        </p>
    </section>
    
    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Chat System</h2>
        <p class="text-gray-200 text-justify">
            Stay connected with participants through <bold class="font-bold text-green-300">EventPlanner+</bold>’s built-in chat system. The chat interface enables real-time communication, allowing you to discuss event details, share updates, and collaborate. With automated replies powered by Google's Gemini API, the system provides a realistic and efficient messaging experience, simulating the feel of modern chat applications.
        </p>
    </section>

    
</template>

<style scoped>
</style>
