<template>
    <div class="sidebar py-3 d-flex flex-column">
        <div class="header">
            <h5 class="text-white">Res Kitchen</h5>
            <hr>
        </div>
        <div class="flex-grow-1">
            <ul class="nav flex-column mt-1">
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="collapse" href="#collapseHome" role="button"
                        aria-expanded="false" aria-controls="collapseHome" @click="toggleCollapse('homeCollapse')">
                        <div class="">
                            <i class="bi bi-house me-2"></i>
                            <span class="me-5">
                                Home
                            </span>
                            <i class="ms-2" :class="homeCollapse ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
                        </div>
                    </a>
                    <transition name="slide-fade">
                        <div class="py-2 mt-1" id="collapseHome" :class="['collapse', { show: homeCollapse }]">
                            <ul class="list-unstyled">
                                <li class="d-flex justify-content-center">
                                    <i class="bi bi-dash-lg text-secondary"></i>
                                    <router-link to="/dishes" class="nav-link">
                                        Dishes</router-link>
                                </li>

                                <li class="d-flex justify-content-center my-2 ">
                                    <!-- <i class="bi bi-dash-lg text-secondary"></i>
                                    <router-link to="/orders" class="nav-link"> Orders</router-link> -->
                                    <!-- <small class="badge text-bg-info">
                                        {{ orderCount }}
                                    </small> -->



                                    <div class="d-flex position-relative">
                                        <i class="bi bi-dash-lg text-secondary"></i>
                                        <router-link to="/orders" class="nav-link"> Orders</router-link>
                                        <span v-if="orderCount > 0"
                                            class="position-absolute top-50 start-100 px-2 translate-middle p-1  badge rounded-pill bg-danger">
                                            {{ orderCount }}
                                            <span class="visually-hidden">unread messages</span>
                                        </span>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </transition>
                </li>

                <li class="nav-item my-4">
                    <a class="nav-link" data-bs-toggle="collapse" href="#collapseStaff" role="button"
                        aria-expanded="false" aria-controls="collapseStaff" @click="toggleCollapse('staffCollapse')">
                        <div class="">
                            <i class="bi bi-people me-2"></i>
                            <span class="me-5">
                                Staff
                            </span>
                            <i class="ms-3" :class="staffCollapse ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
                        </div>
                    </a>
                    <transition name="slide-fade">
                        <div class="py-2 mt-1" id="collapseStaff" :class="['collapse', { show: staffCollapse }]">
                            <ul class="list-unstyled">
                                <li class="d-flex justify-content-center">
                                    <i class="bi bi-dash-lg text-secondary"></i>
                                    <router-link to="/staffs" class="nav-link">
                                        All Staffs</router-link>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </li>
            </ul>
        </div>

        <div class="mb-4 mt-2 d-flex justify-content-center gap-3">
            <div>
                <i class="bi bi-sun-fill sun text-white" style="font-size: 1.3rem;" v-if="!getTheme"></i>
                <i class="bi bi-moon stars text-white" style="font-size: 1.3rem;" v-if="getTheme"></i>
            </div>

            <label class="switch mt-1">
                <input type="checkbox" id="theme-toggle" @change="toggleTheme" :checked="getTheme">
                <span class="slider round"></span>
            </label>
        </div>

        <div class="logout mt-auto">
            <form action="" @submit.prevent="userLogout">
                <button class="btn btn-danger w-75" type="submit">Logout</button>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name: 'SideBar',

    data() {
        return {
            homeCollapse: false,
            staffCollapse: false,
        }
    },

    computed: {
        ...mapGetters(["getTheme", "getOrders"]),

        orderCount() {
            return this.getOrders.filter(order => order.status === 'new_order').length;
        }
    },

    methods: {
        ...mapActions(['logout', 'changeTheme']),

        isActive(route) {
            return this.$route.path === route;
        },

        toggleCollapse(section) {
            if (section === 'homeCollapse') {
                this.homeCollapse = !this.homeCollapse;
                this.staffCollapse = false;
            } else if (section === 'staffCollapse') {
                this.staffCollapse = !this.staffCollapse;
                this.homeCollapse = false;
            }
        },

        async userLogout() {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Log token for debugging
                await axios.post('http://localhost:8000/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Logged out successfully');
                this.logout(); // Call the Vuex logout action
                this.$router.push('/login');
            } catch (error) {
                console.log(error.message);
            }
        },

        toggleTheme(e) {
            console.log(e.target.checked);
            this.changeTheme(e.target.checked);
        }
    }
}
</script>

<style scoped>
.sidebar {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #181a20;
    text-align: center;
    height: 100%;
    overflow-y: auto;
}

.nav-link {
    padding: 0rem 1rem;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.7px;
    color: whitesmoke;
}

hr {
    color: whitesmoke;
}

li::marker {
    color: rgb(138, 138, 138);
}

.sidebar .nav-link.router-link-active {
    color: #42b883;
    /* Example color for active route */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease-out;
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

a:hover {
    color: whitesmoke;
}

.logout {
    margin-top: auto;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
