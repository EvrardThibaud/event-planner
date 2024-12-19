<script setup>
  import { ref, onMounted, watch } from "vue";
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import Message from "../components/Message.vue";

  const genAI = new GoogleGenerativeAI("AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const textarea = ref(null);
  const result = ref(null);
  const prompt = ref("");
  const messages = ref([]); 
  var chat = null

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleButtonClick();
    }
  };
  async function handleButtonClick() {
    if (!prompt.value.trim()) return; 

    let now = new Date();
    const tempPrompt = prompt.value;
    prompt.value = "";

    const newMessage = {
      parts: [{text :tempPrompt}],
      datetime: now.toLocaleString(),
      role: "user",
    };
    messages.value = [...messages.value, newMessage]; 

    result.value = await chat.sendMessage(tempPrompt);

    now = new Date();
    const apiResponse = {
      parts: [{text :result.value.response.text()}],
      datetime: now.toLocaleString(),
      role: "model",
    };
    messages.value = [...messages.value, apiResponse];
  }
  watch(
    messages,
    (newMessages) => {
      localStorage.setItem("messages", JSON.stringify(newMessages));
    },
    { deep: true } 
  );

  onMounted(() => {
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages);
      
      const history = messages.value.map(message => {
        return {
          parts: message.parts,
          role: message.role 
        };
      });

      chat = model.startChat({
        history: history
      });
    }
  });

</script>

<template>
  <section class="w-full flex justify-center">
    <div id="messagesBox">
      <Message v-if="messages.length !== 0" v-for="(message, i) in messages" :key="i" 
        :text="message.parts[0].text"
        :role="message.role"
        :datetime="message.datetime"
      />
      <p v-else class="text-white">pas de message</p>
    </div>
  
    <form @submit.prevent="submitForm">
      <textarea v-model="prompt" ref="textarea" @keydown="handleKeyDown" @input="autoResize"></textarea>
      <button @click="handleButtonClick" class="text-white">Send message</button>
    </form>

  </section>

</template>

<style scoped>
  form{
    background-color: #18181b;
    position: fixed;
    top: 80vh;
    width: 100vw;
    height: 20vh;
    display: flex;
    justify-content: center;
    gap: 2px;
  }

  input, textarea, button{
    height: 40px;
    color: #18181b;
    padding: 6px;
    border: 2px solid #18181b;
    border-radius: 5px;
    background-color: #d1d5db;
    outline: none;
  }

  textarea{
    min-height: 40px;
    height: 40px;
    max-height: 100px;
    min-width: 50vw;
    overflow-y: scroll;
  }

  button{
    min-width: 10vw;
    font-weight: 600;
    background-color: #86efac;
  }

  button:hover{
    opacity: .9;
  }

  button:active{
    scale: .98;
  }

  #messagesBox{
    /* height: calc(80vh - 56px); */
    margin-bottom: 20vh;
    width: calc(60vw);
    display: flex;
    justify-content: end;
    flex-direction: column;
    overflow-y: auto;
  }
</style>
