<script setup>
    import { ref } from 'vue';
    import axios from 'axios';

    const form = ref({
        title: '',
        email: '',
        content: ''
    });

    const submitForm = async () => {
      try {
        const response = await axios.post('http://localhost:3000/send-email',
          {
            from : {email : 'webprojecteventplanner@gmail.com', name : 'EventPlanner+ Support'},
            to : {email : form.value.email, name : 'client'},
            subject: `EventPlanner+ ticket : ${form.value.title}`,
            HTMLPart: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><h2 style="color: #4CAF50;">Thank You for Contacting Us!</h2><p>Hello <strong>Valued User</strong>,</p><p>We have received your inquiry and our team will get back to you as soon as possible. Below is a summary of your message:</p><div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;"><p><strong>Your Message:</strong></p><p>${form.value.content}</p></div><p>In the meantime, feel free to explore our website or reach out if you have any urgent questions.</p><p>Best regards,<br><strong>The Event Planner Team</strong></p><hr><p style="font-size: 0.9em; color: #888;">This is an automated email, please do not reply directly to this message.</p></div>`
          }
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Failed to send email:', error.response ? error.response.data : error.message);
      }

      try {
        const response = await axios.post('http://localhost:3000/send-email',
          {
            from : {email : 'webprojecteventplanner@gmail.com', name : 'EventPlanner+ Support'},
            to : {email : 'webprojecteventplanner@gmail.com', name : 'EventPlanner+ Support'},
            subject: `ticket : ${form.value.title}`,
            HTMLPart: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><h2 style="color: #d9534f;">New Support Ticket Created</h2><p>Hello Team,</p><p>A new support ticket has been opened. Here are the details:</p><ul style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d9534f; list-style: none;"><li><strong>Title:</strong> ${form.value.title}</li><li><strong>Email:</strong> ${form.value.email}</li><li><strong>Message:</strong> ${form.value.content}</li></ul><p>Please address this ticket as soon as possible.</p><p>Best regards,<br><strong>Automated Notification System</strong></p><hr><p style="font-size: 0.9em; color: #888;">This is an automated notification. Please do not reply directly to this email.</p></div>`
          }
        );
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Failed to send email:', error.response ? error.response.data : error.message);
      }
    };
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
          required
          class="w-full p-2 border text-green-900 border-gray-700 rounded focus:ring focus:ring-green-500"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
          class="w-full p-2 text-green-900 border-gray-700 rounded focus:ring focus:ring-green-500"
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium mb-2">Content</label>
        <textarea
          id="content"
          v-model="form.content"
          placeholder="Write your message"
          required
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
