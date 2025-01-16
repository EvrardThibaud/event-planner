<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
const navmenu = ref(null);

function handleToggleNavmenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<template>
  <button
    id="button_open"
    class="primary_button"
    @click="handleToggleNavmenu()"
  >
    <span class="material-symbols-outlined"> menu </span>
  </button>

  <nav id="navbar" class="text-1xl w-1/2 flex justify-evenly">
    <RouterLink class="hover:text-green-300" :to="{ name: 'Home' }">
      Home
    </RouterLink>

    <RouterLink class="hover:text-green-300" :to="{ name: 'Calendar' }">
      Calendar
    </RouterLink>

    <RouterLink class="hover:text-green-300" :to="{ name: 'Chat' }">
      Chat
    </RouterLink>

    <RouterLink class="hover:text-green-300" :to="{ name: 'AboutUs' }">
      About Us
    </RouterLink>
  </nav>

  <Teleport to="body">
    <nav v-if="menuOpen" ref="navmenu" id="navmenu">
      <RouterLink
        class="hover:text-green-300"
        :to="{ name: 'Home' }"
        @click="handleToggleNavmenu()"
      >
        Home
      </RouterLink>

      <RouterLink
        class="hover:text-green-300"
        :to="{ name: 'Calendar' }"
        @click="handleToggleNavmenu()"
      >
        Calendar
      </RouterLink>

      <RouterLink
        class="hover:text-green-300"
        :to="{ name: 'Chat' }"
        @click="handleToggleNavmenu()"
      >
        Chat
      </RouterLink>

      <RouterLink
        class="hover:text-green-300"
        :to="{ name: 'AboutUs' }"
        @click="handleToggleNavmenu()"
      >
        About Us
      </RouterLink>
    </nav>
  </Teleport>
</template>

<style scoped>
#button_open {
  display: none;
}

@media (max-width: 426px) {
  #button_open {
    display: block;
  }

  #navbar {
    display: none;
  }
}

#navmenu {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #18181b;
  height: 100vh;
  width: 100%;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: x-large;
}
</style>
