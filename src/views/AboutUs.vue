<script setup>
import MemberCard from "../components/MemberCard.vue";
</script>

<template>
  <h1 class="text-gray-300 font-bold text-2xl w-full px-4">About Us</h1>

  <section  class="w-1/2 pt-28 pb-12 flex flex-wrap flex-col gap-2">
    <h2 class="text-green-300">Our Team</h2>
    <div id="memberscard_container" class="flex flex-wrap gap-2">
      <MemberCard
        :name="'MARTIN Mateo'"
        :src="'../../public/mateomartin.jpg'"
        :dsc="'Mateo Martin, visionary CEO of Event Planner, turns every event into a unique experience. Passionate about innovation, he combines creativity and expertise to elevate every key moment.'"
      ></MemberCard>
      <MemberCard
        :name="'EVRARD Thibaud'"
        :src="'../../public/thibaudevrard.jpg'"
        :dsc="'Thibaud Evrard, head of the Web Development Department, drives digital innovation. Passionate about technology and strategy, he crafts cutting-edge solutions to elevate Event Planner\'s online presence.'"
      ></MemberCard>
    </div>
  </section>

  <section class="w-1/2 pt-12 pb-12 flex flex-col gap-5">
    <h2 class="text-green-300">Our Mission</h2>
    <p class="text-gray-200 text-justify">
      Our mission at
      <bold class="font-bold text-green-300">EventPlanner+</bold> is to
      revolutionize the way events are organized and managed by providing a
      user-friendly and innovative platform. We aim to empower individuals and
      teams to seamlessly plan, coordinate, and execute events of any size,
      ensuring that every detail is handled efficiently and collaboratively.
    </p>
  </section>

  <section class="w-1/2 pt-12 pb-12 flex flex-col gap-5">
    <h2 class="text-green-300">Our Vision</h2>
    <p class="text-gray-200 text-justify">
      We envision <bold class="font-bold text-green-300">EventPlanner+</bold> as
      the go-to solution for event planning worldwide, fostering stronger
      connections and collaboration. By integrating advanced tools like
      real-time communication, interactive calendars, and dynamic management
      features, we aspire to make event planning not just a task, but an
      enjoyable and creative experience for everyone involved.
    </p>
  </section>

  <section class="pb-12">
    <RouterLink :to="{ name: 'ContactUs' }">
      <button class="primary_button">Contact Us</button>
    </RouterLink>
  </section>
</template>

<style scoped>

@media (max-width: 768px) {
  #memberscard_container {
    justify-content: center;
  }
}
  
</style>
