import { createApp } from 'vue'
import './style.css'
import './style/button.css'
import './style/input.css'
import './style/alert.css'
import './style/section.css'
import App from './App.vue'
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App).use(router).mount('#app')
