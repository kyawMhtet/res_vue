<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="login py-3 px-4 border shadow">
            <h3 class="text-center mt-3">Welcome</h3>
            <form class="" @submit.prevent="userLogin">
                <div class="mt-4">
                    <label for="">
                        <strong>Email:</strong>
                    </label>
                    <input type="text" class="form-control mt-1" placeholder="example@gmail.com"
                        v-model="userData.email">
                </div>

                <div class="mt-3">
                    <label for="">
                        <strong>Password:</strong>
                    </label>
                    <input type="password" class="form-control mt-1" placeholder="********" v-model="userData.password">
                </div>


                <button class="btn btn-dark w-100 mt-3" type="submit">
                    Sign in
                </button>
                <small class="d-flex justify-content-center mt-1">
                    Don't have an account? <router-link to="/register">Sign up</router-link>
                </small>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import { mapActions, mapGetters } from 'vuex';
import { mapGetters, mapActions } from 'vuex';


export default {
    name: 'LoginPage',
    data() {
        return {
            userData: {
                email: '',
                password: ''
            }
        }
    },

    computed: {
        ...mapGetters(["getToken", 'getUserData'])
    },

    methods: {
        ...mapActions(['setToken', 'setUserData', 'setRole']),

        async userLogin() {
            try {
                let res = await axios.post('http://localhost:8000/api/auth/login', this.userData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                console.log(res);

                if (res.data.token) {
                    this.setToken(res.data.token);
                    this.setUserData(res.data.user);

                    this.setRole(res.data.user.role);
                    this.userData = {};

                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('refreshToken', res.data.refresh_token);
                    this.$router.push({ path: '/home' });
                    console.log('Token:', this.getToken);
                    console.log('User Data:', this.getUserData);
                } else {
                    console.log('Login error: Token not found in response');
                }
            } catch (error) {
                console.log(error);
            }
        }
    },


    // mounted() {
    //     console.log('Token:', this.getToken);
    //     console.log('User Data:', this.getUserData);
    // },
}
</script>

<style>
.login {
    width: 400px;
    height: 350px;
    border-radius: 5px;
}
</style>
