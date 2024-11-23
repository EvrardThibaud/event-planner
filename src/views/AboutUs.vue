<script setup>
  import MemberCard from '../components/MemberCard.vue'
</script>

<template>

  <section class=" w-1/2 pt-28 pb-12 flex flex-col gap-5">
    <h1 class="w-full text-center text-5xl text-green-300">
      About Us
    </h1>
  </section>
  
  <section class=" w-1/2 pt-28 pb-12 flex flex-wrap gap-2">
    <h2 class="text-green-300">Our Team</h2>
    <div class=" flex flex-wrap gap-2">
      <MemberCard></MemberCard>
      <MemberCard :name="'Thibaud'" :src="'../../public/thibaudevrard.svg'" ></MemberCard>
      <MemberCard :name="'Mateo'" :src="'../../public/petitcroco.png'" ></MemberCard>
    </div>

  </section>

    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Our Mission</h2>
        <p class="text-gray-200 text-justify">
          Our mission at <bold class="font-bold text-green-300">EventPlanner+</bold> is to revolutionize the way events are organized and managed by providing a user-friendly and innovative platform. We aim to empower individuals and teams to seamlessly plan, coordinate, and execute events of any size, ensuring that every detail is handled efficiently and collaboratively.
        </p>
    </section>
    
    <section class=" w-1/2 pt-12 pb-12 flex flex-col gap-5">
        <h2 class="text-green-300">Our Vision</h2>
        <p class="text-gray-200 text-justify">
          We envision <bold class="font-bold text-green-300">EventPlanner+</bold> as the go-to solution for event planning worldwide, fostering stronger connections and collaboration. By integrating advanced tools like real-time communication, interactive calendars, and dynamic management features, we aspire to make event planning not just a task, but an enjoyable and creative experience for everyone involved.
        </p>
    </section>

    <section>
      <RouterLink :to="{name: 'ContactUs'}" >
        <button class="m-12 h-10 w-24 text-green-50 bg-green-900 rounded">Contact Us ></button>
      </RouterLink>
    </section>

</template>

<style scoped>
</style>
