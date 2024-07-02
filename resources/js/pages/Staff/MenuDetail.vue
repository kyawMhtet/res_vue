<template>
    <div class="menus mt-3">
        <div>
            <Loader v-if="loading" />
            <div v-else>

                <button class="btn btn-dark mt-1 mb-3" @click="goBack"> Back</button>

                <div class="text-center mt-5" v-if="menus.length < 1 && !loading">
                    <strong class="fs-5">No Result Found!</strong>

                </div>

                <table class="table" v-else>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(menu, index) in menus" :key="menu.id">
                            <th scope="row">{{ index + 1 }}.</th>
                            <td class="table-img">
                                <img :src="menu.image_url" class="img-thumbnail" alt="">

                            </td>
                            <td>{{ menu.name }}</td>
                            <td>{{ menu.price * menu.quantity }} Ks</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" @click="subQty(menu)">-</button>
                                <button class="btn btn-sm btn-outline-secondary mx-1">
                                    {{ menu.quantity }}
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="plusQty(menu)">+</button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-dark" @click="addToCart(menu)">Add To Cart</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loader from '../../components/Loader.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MenuDetail',
    components: { Loader },
    data() {
        return {
            loading: false,
            menus: [],
            // cartMenus: [],
        }
    },

    // computed: {
    //     ...mapGetters(['getCartItems'])
    // },

    methods: {
        ...mapActions(['addToCart']),


        goBack() {
            // this.$router.go(-1);
            this.$router.push('/menus');
        },


        async getMenus() {
            this.loading = true;
            try {
                let id = this.$route.params.id;
                let res = await axios.get('http://localhost:8000/api/panel/categories/menus/' + id);

                // console.log(res.data.menus);
                this.menus = res.data.menus.map(menu => ({
                    ...menu,
                    quantity: 1
                }));
                this.loading = false;
                // console.log(this.menus.length);
            } catch (error) {
                console.log(error.message);
                this.loading = false;
            }
        },


        // async addToCart(menu) {

        //     try {
        //         let res = await axios.post(`http://localhost:8000/api/panel/categories/menus/${menu.id}`, {
        //             quantity: menu.quantity
        //         })

        //         console.log(res);
        //         menu.quantity = 1;
        //     } catch (error) {
        //         console.log(error.message);
        //     }
        // },







        plusQty(menu) {
            menu.quantity++;
        },

        subQty(menu) {
            if (menu.quantity > 1) {
                menu.quantity--;
            }
        },

    },

    mounted() {
        this.getMenus();
        // this.getCartMenus();
    }
}
</script>

<style>
.table-img>img {
    width: 100px;
    height: 100px;
}
</style>
