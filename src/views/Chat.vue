<script setup>
  import { ref, onMounted, watch, watchEffect } from "vue";
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import Message from "../components/Message.vue";
  import { createAlert } from "../composable/Alerts";

  const genAI = new GoogleGenerativeAI("AIzaSyAdn8fbCMXxyOat2ZyWkmVed54w_Q6tgqg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const messagesBox = ref(null);
  const textarea = ref(null);
  const result = ref(null);
  const prompt = ref("");
  const messages = ref([]); 
  const typing = ref(false)
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
    scrollToBottom()

    typing.value = true
    if (chat) {
      result.value = await chat.sendMessage(tempPrompt);
    }
    else {
      createAlert("Try to refresh the page","error",undefined,"Chat not created")
    }
    
    now = new Date();
    const apiResponse = {
      parts: [{text :result.value.response.text()}],
      datetime: now.toLocaleString(),
      role: "model",
    };
    typing.value = false
    messages.value = [...messages.value, apiResponse];
    scrollToBottom()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  };

  watch(
    messages,
    (newMessages) => {
      localStorage.setItem("messages", JSON.stringify(newMessages));
    },
    { deep: true } 
  );


  onMounted(() => {
    const savedMessages = localStorage.getItem("messages");
    let history = []
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages);
      
      history = messages.value.map(message => {
        return {
          parts: message.parts,
          role: message.role 
        };
      });
    }
    chat = model.startChat({
      history: history
    });
  });

</script>

<template>
  <section class="w-full flex justify-center">
    <div v-if="messages.length !== 0" id="messagesBox" ref="messagesBox">
      <Message  v-for="(message, i) in messages" :key="i" 
        :text="message.parts[0].text"
        :role="message.role"
        :datetime="message.datetime"
      />
      <Message v-if="typing" id="typingMessage"
      text=""
      role="model"
      :datetime=null
      />
    </div>
    <div v-else id="noMessage" class="text-white w-full flex justify-center items-center opacity-70">
      <p>It’s quiet here, send a message!</p>
    </div>
  
    <form @submit.prevent="submitForm">
      <textarea v-model="prompt" ref="textarea" @keydown="handleKeyDown" @input="autoResize" placeholder="Type your message"></textarea>
      <button @click="handleButtonClick" class="primary_button" :disabled="prompt === ''">Send message</button>
    </form>

  </section>

</template>

<style scoped>
  #noMessage{
     height: calc(80vh - 56px);
  }

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

  #messagesBox{
    /* height: calc(80vh - 56px); */
    margin-bottom: 20vh;
    width: calc(60vw);
    display: flex;
    justify-content: end;
    flex-direction: column;
  }

  #typingMessage{
    border-radius: 10px;
    padding: 6px;
    margin: 2px 6px 2px 6px;
    width: fit-content;
    height: fit-content;
    max-width: 70%;
    width: 40px;
    aspect-ratio: 2;
    --_g: no-repeat radial-gradient(circle closest-side,#fff 90%,#0000);
    background: 
      var(--_g) 0%   50%,
      var(--_g) 50%  50%,
      var(--_g) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: l3 1s infinite linear;
  }

  @keyframes l3 {
      20%{background-position:0%   0%, 50%  50%,100%  50%}
      40%{background-position:0% 100%, 50%   0%,100%  50%}
      60%{background-position:0%  50%, 50% 100%,100%   0%}
      80%{background-position:0%  50%, 50%  50%,100% 100%}
  }
</style>
