<script setup>
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import Message from "../components/Message.vue";
  import { ref, onMounted } from 'vue';

  const genAI = new GoogleGenerativeAI("AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  
  const result = ref(null)
  const prompt = ref("")
  const messages = ref([])

  async function handleButtonClick(){
    result.value = await model.generateContent(prompt.value);
    messages.value.push(result.value)
    console.log(result.value.response);
  }
</script>

<template>
  <h1 class="mt-28 text-white">Chat</h1>
  <div>
    <Message v-if="messages.length !== 0" v-for="(message, i) in messages" :key="i" :content="message.response.text()"/>
    <p v-else class="text-white">pas de message</p>
  </div>

  <form @submit.prevent="submitForm">
    <input type="text" v-model="prompt">
    <button @click="handleButtonClick" class="text-white">Send message</button>
  </form>

</template>

<style scoped>
</style>
