<script setup>
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import Message from "../components/Message.vue";
  import { ref, onMounted } from 'vue';

  const genAI = new GoogleGenerativeAI("AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  
  const result = ref(null)
  const prompt = ref("")
  const messages = ref([])
  const chat = model.startChat()

  async function handleButtonClick(){
    let now = new Date();
    messages.value.push({ 
        content: prompt.value, 
        datetime: now.toLocaleString(),
        sender : "me"
    });
    result.value = await chat.sendMessage(prompt.value);
    now = new Date();
    messages.value.push({ 
        content: result.value.response.text(), 
        datetime: now.toLocaleString(),
        sender : "api"
    });

    console.log(messages.value);
    prompt.value = ""
  }
</script>

<template>
  <h1 class="mt-28 text-white">Chat</h1>
  <div>
    <Message v-if="messages.length !== 0" v-for="(message, i) in messages" :key="i" 
      :content="message.content"
      :sender="message.sender"
      :datetime="message.datetime"
    />
    <p v-else class="text-white">pas de message</p>
  </div>

  <form @submit.prevent="submitForm">
    <input type="text" v-model="prompt">
    <button @click="handleButtonClick" class="text-white">Send message</button>
  </form>

</template>

<style scoped>
</style>
