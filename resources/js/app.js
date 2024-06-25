import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '../js/bootstrap/dist/css/bootstrap.min.css';
import '../js/bootstrap/dist/js/bootstrap.bundle.js';
import '../js/bootstrap-icons/font/bootstrap-icons.min.css';
import store from './store/index.js';
import axios from 'axios';
import 'vue3-toastify/dist/index.css'
// import '../js/bootstrap/dist/css/bootstrap.min.css';
// import '../js/bootstrap/dist/css/bootstrap.bundle.js';
// import './bootstrap-icons/font/bootstrap-icons.min.css';

axios.interceptors.request.use(config => {
    const token = store.getters.getToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});


axios.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const { success } = await store.dispatch('refreshToken');
        if (success) {
            return axios(originalRequest);
        } else {
            router.push('/login');
        }
    }

    return Promise.reject(error);
});

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');
