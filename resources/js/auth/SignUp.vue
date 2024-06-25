<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="register py-3 px-4 border shadow">
            <h3 class="text-center mt-3">Welcome</h3>

            <form action="" class="" @submit.prevent="signup">

                <div class="mt-4">
                    <label for="">
                        <strong>Name:</strong>
                    </label>
                    <input type="text" class="form-control mt-1" placeholder="your name" v-model="userData.name">
                </div>

                <div class="mt-3">
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
                    Sign up
                </button>
                <small class="d-flex justify-content-center mt-1">
                    Already have an account? <router-link to="/login">Sign in</router-link>
                </small>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SignUp',

    data() {
        return {
            userData: {
                name: '',
                email: '',
                password: ''
            }
        }
    },

    methods: {
        async signup() {
            try {
                const res = await axios.post('http://localhost:8000/api/auth/sign-up', this.userData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(res);
                // const token = res.data.token;
            } catch (error) {
                console.log(error.message);
            }
        }
    },
}
</script>

<style>
.register {
    width: 400px;
    height: 420px;
    border-radius: 5px;
}
</style>
