<template>
    <div>
        <div class="row g-0">
            <div class="col-md-2">
                <div class="sidebar py-3 d-flex flex-column">
                    <div class="header">
                        <h5 class="text-white">Menu Panel</h5>
                        <hr>
                    </div>
                    <div class="flex-grow-1">
                        <ul class="nav flex-column mt-1">
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="collapse" href="#collapseHome" role="button"
                                    aria-expanded="false" aria-controls="collapseHome"
                                    @click="toggleCollapse('homeCollapse')">
                                    <div class="">
                                        <i class="bi bi-house me-2"></i>
                                        <span class="me-5">
                                            Home
                                        </span>
                                        <i class="ms-2"
                                            :class="homeCollapse ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
                                    </div>
                                </a>
                                <transition name="slide-fade">
                                    <div class="py-2 mt-1" id="collapseHome"
                                        :class="['collapse', { show: homeCollapse }]">
                                        <ul class="list-unstyled">
                                            <li class="d-flex justify-content-center">
                                                <i class="bi bi-dash-lg text-secondary"></i>
                                                <router-link :to="{ name: 'MenuPage' }" class="nav-link" exact>
                                                    Menus</router-link>
                                            </li>

                                            <li class="d-flex justify-content-center my-2">
                                                <i class="bi bi-dash-lg text-secondary"></i>

                                                <router-link to="/about" class="nav-link"> Orders</router-link>
                                            </li>
                                        </ul>

                                    </div>
                                </transition>

                            </li>
                            <!-- <li class="nav-item">
                                <router-link to="/about" class="nav-link" :class="{ active: isActive('/about') }">About</router-link>
                                <hr>
                            </li> -->
                            <!-- Add more sidebar links as needed -->
                        </ul>
                    </div>




                    <div class="mb-4 mt-2 d-flex justify-content-center gap-3">

                        <div>
                            <i class="bi bi-sun-fill sun text-white" style="font-size: 1.3rem;"></i>
                            <i class="bi bi-moon stars text-white" style="font-size: 1.3rem;"></i>
                        </div>

                        <label class="switch mt-1">

                            <input type="checkbox" id="theme-toggle">
                            <span class="slider round"></span>
                        </label>


                    </div>

                    <div class="logout mt-auto">
                        <form action="">
                            <button class="btn btn-danger w-75" type="submit">Logout</button>

                        </form>
                    </div>


                </div>
            </div>
            <div class="col">
                <router-view>
                    <template v-slot="{ Component }">

                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </template>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Panel',

    data() {
        return {
            homeCollapse: false,
        }
    },

    methods: {
        isActive(route) {
            // return this.$route.path === route;
            return this.$route.path.startsWith(route);
            // return this.$route.matched.some(record => record.path === route || record.path.startsWith(route + '/'));
        },

        toggleCollapse(section) {
            this[section] = !this[section];
        },
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
</style>
