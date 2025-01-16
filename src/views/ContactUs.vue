<script setup>
import { ref } from "vue";
import axios from "axios";
import { createAlert } from "../composable/Alerts";

const form = ref({
  title: "",
  email: "",
  content: "",
});

async function sendMailToUser() {
  try {
    await axios.post("http://localhost:3000/send-email", {
      from: {
        email: "webprojecteventplanner@gmail.com",
        name: "EventPlanner+ Support",
      },
      to: { email: form.value.email, name: "client" },
      subject: `EventPlanner+ ticket : ${form.value.title}`,
      HTMLPart: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4CAF50;">Thank You for Contacting Us!</h2>
              <p>Hello <strong>Valued User</strong>,</p>
              <p>We have received your inquiry and our team will get back to you as soon as possible. Below is a summary of your message:</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                <p><strong>Your Message:</strong></p>
                <p>${form.value.content}</p>
              </div>
              <p>In the meantime, feel free to explore our website or reach out if you have any urgent questions.</p>
              <p>Best regards,<br><strong>The Event Planner Team</strong></p>
              <hr>
              <p style="font-size: 0.9em; color: #888;">This is an automated email, please do not reply directly to this message.</p>
            </div>`,
    });
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.response ? error.response.data : error.message
    );
  }
}

async function sendMailToTeam() {
  try {
    await axios.post("http://localhost:3000/send-email", {
      from: {
        email: "webprojecteventplanner@gmail.com",
        name: "EventPlanner+ Support",
      },
      to: {
        email: "webprojecteventplanner@gmail.com",
        name: "EventPlanner+ Support",
      },
      subject: `ticket : ${form.value.title}`,
      HTMLPart: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #d9534f;">New Support Ticket Created</h2>
              <p>Hello Team,</p>
              <p>A new support ticket has been opened. Here are the details:</p>
              <ul style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d9534f; list-style: none;">
                <li><strong>Title:</strong> ${form.value.title}</li>
                <li><strong>Email:</strong> ${form.value.email}</li>
                <li><strong>Message:</strong> ${form.value.content}</li>
              </ul>
              <p>Please address this ticket as soon as possible.</p>
              <p>Best regards,<br><strong>Automated Notification System</strong></p>
              <hr>
              <p style="font-size: 0.9em; color: #888;">This is an automated notification. Please do not reply directly to this email.</p>
            </div>`,
    });
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.response ? error.response.data : error.message
    );
  }
}

async function submitForm() {
  sendMailToUser();
  sendMailToTeam();
  form.value.title = "";
  form.value.email = "";
  form.value.content = "";
  createAlert(
    "Your message has been successfully sent. You should receive a confirmation email shortly.",
    "success"
  );
}
</script>

<template>
  <h1 class="text-gray-300 font-bold text-2xl w-full px-4">Contact Us</h1>
  <section >
    <form @submit.prevent="submitForm" class="w-full">
      <div>
        <label for="title">Title</label>
        <input
          type="text"
          v-model="form.title"
          placeholder="Enter the title"
          required
        />
      </div>

      <div>
        <label for="email">Email</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label for="content">Content</label>
        <textarea
          id="content"
          v-model="form.content"
          placeholder="Write your message"
          required
          rows="4"
        ></textarea>
      </div>

      <button class="primary_button w-full" type="submit">Submit</button>
    </form>
  </section>
</template>

<style scoped>
section {

  form {
    div {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
