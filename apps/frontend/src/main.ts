import './styles.css';
import { defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import router from './router';
import { createApp } from 'vue';

import App from './app/App.vue';

defineRule('required', required);
defineRule('email', email);

const app = createApp(App);
app.use(router);
app.mount('#root');
