<script setup>
    import { ref } from 'vue';

    const form = ref({
        title: '',
        email: '',
        content: ''
    });

    const submitForm = () => {
        console.log('Form Data:', form.value);
    };

    // secret key 1052cd416041d3ddb900bb0939cbadd7
    //  api key 5a1e5a4e5a8c32c044fd53f7b095f1ea
</script>

<template>
    <h1 class="text-2xl mt-24 text-gray-300">Contact Us</h1>

    <form @submit.prevent="submitForm" class="w-1/2 h-max space-y-4 text-gray-300">
      <div>
        <label for="title" class="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          v-model="form.title"
          placeholder="Enter the title"
          class="w-full p-2 border text-green-900 border-gray-700 rounded focus:ring focus:ring-green-500"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
          class="w-full p-2 text-green-900 border-gray-700 rounded focus:ring focus:ring-green-500"
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium mb-2">Content</label>
        <textarea
          id="content"
          v-model="form.content"
          placeholder="Write your message"
          class="w-full p-2 text-green-900 border-gray-700 rounded focus:ring focus:ring-green-500"
          rows="4"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:ring focus:ring-green-500"
      >
        Submit
      </button>
    </form>
</template>

<style scoped>
/* Vous pouvez personnaliser le style ici */
</style>
