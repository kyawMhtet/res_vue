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

                                                <router-link to="/about" class="nav-link">Orders</router-link>
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
                        <form action="" @submit.prevent="userLogout">
                            <button class="btn btn-danger w-75" type="submit">Logout</button>

                        </form>
                    </div>


                </div>
            </div>
            <div class="col">
                <router-view>
                    <template v-slot="{ Component }">

                        <div class="d-flex mt-3 justify-content-end" style="margin-right: 80px;">
                            <button type="button" class="btn position-relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                    class="bi bi-cart-check text-success" viewBox="0 0 16 16" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal" type="button">
                                    <path
                                        d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
                                    <path
                                        d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                </svg>
                                <span
                                    class="position-absolute top-0 start-95 translate-middle badge rounded-pill bg-danger"
                                    v-if="cartItems.length > 0">
                                    {{ cartItems.length }}
                                    <span class="visually-hidden">unread messages</span>
                                </span>
                            </button>

                            <!-- <button type="button" class="btn position-relative">

                                <span
                                    class="position-absolute top-10 start-95 translate-middle p-1 bg-danger border border-light rounded-circle">
                                    <span class="visually-hidden">New alerts</span>
                                    {{ cartItems.length }}
                                </span>
                            </button> -->



                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                                aria-hidden="true">
                                <div class="modal-dialog">
                                    <form action="" @submit.prevent="checkout">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">
                                                    <label for="">Table No.</label>
                                                    <input type="number" v-model="table_id" class="form-control">
                                                </h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div v-for="cartItem in cartItems" :key="cartItem.id">
                                                    <template v-if="cartItem.dish">
                                                        <div class="d-flex gap-3 mb-4">
                                                            <img :src="cartItem.dish.image_url" alt=""
                                                                class="img-thumbnail cart-img">

                                                            <div>
                                                                <h5>
                                                                    {{ cartItem.dish.name }}

                                                                </h5>

                                                                <div>
                                                                    <button type="button"
                                                                        class="btn btn-sm btn-secondary"
                                                                        @click="subQty(cartItem)">-</button>
                                                                    <button class="btn btn-sm btn-outline-dark mx-1">
                                                                        {{ cartItem.quantity }}

                                                                    </button>
                                                                    <button type="button"
                                                                        class="btn btn-sm btn-secondary"
                                                                        @click="addQty(cartItem)">+</button>
                                                                </div>

                                                                <div class="mb-3">
                                                                    Price - {{ cartItem.dish.price * cartItem.quantity
                                                                    }}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </template>
                                                    <template v-else>
                                                        Dish information not available
                                                    </template>
                                                </div>

                                                <div class="">
                                                    <h5 class="fw-semibold">Total - {{ totalPrice }} Ks</h5>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
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
import { mapActions, mapGetters } from 'vuex';


export default {
    name: 'Panel',

    data() {
        return {
            homeCollapse: false,
            // cartItems: [],
            table_id: null,
            // sub_total_price: this.subTotalPrice,
        }
    },

    computed: {
        ...mapGetters(['getCartItems']),

        cartItems() {
            return this.getCartItems;
        },

        totalPrice() {
            return this.cartItems.reduce((total, item) => {
                return total + (item.dish ? item.dish.price * item.quantity : 0);
            }, 0);
        },


    },

    methods: {

        ...mapActions(['addToCart']),

        isActive(route) {
            // return this.$route.path === route;
            return this.$route.path.startsWith(route);
            // return this.$route.matched.some(record => record.path === route || record.path.startsWith(route + '/'));
        },

        toggleCollapse(section) {
            this[section] = !this[section];
        },

        async userLogout() {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Log token for debugging
                let res = await axios.post('http://localhost:8000/api/panel/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(res);
                this.logout;
                this.$router.push('/login');
            } catch (error) {
                console.log(error.message);
            }
        },

        async fetchCartItems() {
            try {
                await this.$store.dispatch('getCartItems');
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        },


        async subQty(cartItem) {
            try {
                await axios.post('http://localhost:8000/api/panel/cartInfo/sub-qty', {
                    id: cartItem.id
                });
                // console.log(res);
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;

                }
            } catch (error) {
                console.log(error.message);
            }

        },


        async addQty(cartItem) {
            try {
                await axios.post('http://localhost:8000/api/panel/cartInfo/add-qty', {
                    id: cartItem.id
                });
                // console.log(res);
                cartItem.quantity++;
            } catch (error) {
                console.log(error.message);
            }

        },


        async checkout() {
            console.log(this.subTotalPrice);
            const items = this.cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            console.log(items);
            let res = await axios.post('http://localhost:8000/api/panel/cartInfo/check-out', {
                table_id: this.table_id,
                sub_total_price: this.totalPrice,
                items


            });

            console.log(res);
            // console.log(res.data.order.sub_total_price);
            this.cartItems.length = 0;
        }

    },

    mounted() {
        // this.getCartItems
        this.fetchCartItems();

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

.cart-img {
    width: 120px;
    height: 120px;
}
</style>
