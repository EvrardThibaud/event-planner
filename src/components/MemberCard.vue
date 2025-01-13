<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  name: String,
  dsc: String,
  src: String,
});

const isTurned = ref(false);

function toggleIsTurned() {
  isTurned.value = !isTurned.value;
}
</script>

<template>
  <div
    class="bg-zinc-800 hover:opacity-90 cursor-pointer select-none border-zinc-400 border-2 rounded-2xl h-80 w-60 flex flex-col justify-center items-center"
    @click="toggleIsTurned"
  >
    <template v-if="isTurned">
      <div class="flex justify-center items-center w-full gap-2">
        <img class="rounded-full size-12 object-cover" :src="src" alt="" />
        <h1 class="text-gray-300 font-bold">{{ name }}</h1>
      </div>
      <p class="text-gray-300 text-justify w-9/12">{{ dsc }}</p>
    </template>
    <template v-else>
      <img class="rounded-full size-36 object-cover" :src="src" alt="" />
      <h1 class="text-gray-300 text-xl">{{ name }}</h1>
    </template>
  </div>
</template>

<style scoped></style>
