<script setup>

</script>

<template>
    <footer class="p-4 flex flex-col justify-center items-center">
        <div class="flex w-full justify-around">
            <nav class="flex flex-col">
                <RouterLink class="hover:text-green-300 " :to="{name: 'Home'}" >
                    Home
                </RouterLink>
    
                <RouterLink class="hover:text-green-300 " :to="{name: 'Calendar'}" >
                    Calendar
                </RouterLink>
    
                <RouterLink class="hover:text-green-300 " :to="{name: 'Chat'}" >
                    Chat
                </RouterLink>
            
                <RouterLink class="hover:text-green-300 " :to="{name: 'AboutUs'}" >
                    About Us
                </RouterLink>
            </nav>
            <nav class="flex flex-col">
                <RouterLink class="hover:text-green-300 " :to="{name: 'ContactUs'}" >
                    Contact Us
                </RouterLink>
                <RouterLink class="hover:text-green-300 " :to="{name: 'GoogleAuth'}" >
                    Google Auth
                </RouterLink>
            </nav>
        </div>
        <p>Copyright © 2025 EventPlanner+. All rights reserved.</p>
    </footer>
</template>

<style scoped>
</style>
