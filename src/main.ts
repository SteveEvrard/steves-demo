import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App)

app.config.devtools = true;

app.use(createPinia())
app.use(router)
app.use(PrimeVue);

app.component('InputText', InputText);
app.component('Button', Button);
app.component('ProgressSpinner', ProgressSpinner);

app.mount('#app')
