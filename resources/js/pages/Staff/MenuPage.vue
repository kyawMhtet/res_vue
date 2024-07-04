<template>
    <div>

        <Loader v-if="loading" />

        <div class="mt-4 py-2 menus d-flex flex-wrap gap-3" v-else>
            <router-link :to="'/menus/' + category.id" v-for="category in categories" :key="category.id">
                <div class="card">
                    <img :src="category.image" class="card-img-top" alt="...">
                    <h5 class="text-center">
                        {{ category.name }}
                    </h5>
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the</p>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loader from '../../components/Loader.vue';

export default {
    name: 'MenuPage',
    components: { Loader },
    data() {
        return {
            categories: [],
            loading: false
        }
    },

    methods: {
        async getCategories() {
            this.loading = true;
            try {
                let res = await axios.get('http://localhost:8000/api/panel/categories');
                console.log(res.data.categories);
                this.categories = res.data.categories;
                this.loading = false;
            } catch (error) {
                console.error('Error fetching categories:', error.message);
                this.loading = false;
            }
        }
    },

    mounted() {
        this.getCategories();
    }
}
</script>

<style>
a {
    text-decoration: none !important;
}

.card {
    width: 18rem;
}

@media (max-width: 920px) {
    .menus {
        margin-left: 125px;
    }

    .card {
        width: 10rem;
    }
}
</style>
