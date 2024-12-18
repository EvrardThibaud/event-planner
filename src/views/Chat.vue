<script setup>
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import Message from "../components/Message.vue";
  import { ref, onMounted, watch  } from 'vue';

  const genAI = new GoogleGenerativeAI("AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const textarea = ref(null);
  const result = ref(null)
  const prompt = ref("")
  const messages = ref([])
  const chat = model.startChat()

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleButtonClick();
    }
  };

  async function handleButtonClick(){
    let now = new Date();
    const tempPrompt = prompt.value
    prompt.value = ""
    messages.value.push({ 
        content: tempPrompt, 
        datetime: now.toLocaleString(),
        sender : "me"
    });
    result.value = await chat.sendMessage(tempPrompt);
    now = new Date();
    messages.value.push({ 
        content: result.value.response.text(), 
        datetime: now.toLocaleString(),
        sender : "api"
    });
  }

  // const autoResize = () => {
  //   const el = textarea.value;
  //   if (el) {
  //     el.style.height = 'auto'; // Reset the height to calculate new height
  //     el.style.height = `${el.scrollHeight}px`; // Adjust height based on content
  //   }
  // };

  // watch(prompt, autoResize);

  onMounted(() => {
    // autoResize();
  });
</script>

<template>
  <section class="bg-red-400">
    <div div="" class="bg-purple-500">
      <Message v-if="messages.length !== 0" v-for="(message, i) in messages" :key="i" 
        :content="message.content"
        :sender="message.sender"
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
    position: fixed;
    top: 80vh;
    width: 100vw;
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
</style>
