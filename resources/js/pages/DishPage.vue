<template>
    <div class="py-2 row gap-3">

        <div>
            <div class="w-25 float-end d-flex search">
                <input type="text" class="form-control" v-model="searchValue" @keyup.enter="searchDish">
                <button class="btn btn-secondary" @click="searchDish">Search</button>
            </div>
        </div>

        <div :class="['col-3 p-3 shadow-sm rounded mb-5 form', themeClass, borderClass]">
            <div>
                <label for="image">Image:</label>
                <input type="file" class="form-control" @change="handleFileUpload">
            </div>

            <div class="my-3">
                <label for="name">Dish Name:</label>
                <input type="text" class="form-control" placeholder="Name of the dish" v-model="newDish.name">
            </div>

            <div class="mb-3">
                <label for="category">Category</label>
                <select id="category" class="form-control mt-1" v-model="newDish.category_id">
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                </select>
            </div>

            <div>
                <label for="description">Description</label>
                <textarea name="description" rows="2" class="form-control mt-1" placeholder="..."
                    v-model="newDish.description"></textarea>
            </div>

            <div class="my-3">
                <label for="price">Price:</label>
                <input type="text" class="form-control" placeholder="Ks" v-model="newDish.price">
            </div>

            <button class="btn btn-dark w-100 mb-2" @click="postDishes">Create</button>
        </div>

        <div class="col">
            <Loader v-if="loading" />

            <div v-else>
                <div v-if="isSearching && dishes.length === 0 && !loading" class="e-message">
                    <strong class="fs-5">No Result Found!</strong>
                </div>

                <div class="d-flex flex-wrap gap-3 " v-else>
                    <div :class="['dish-card rounded', borderClass]" v-for="dish in dishes" :key="dish.id"
                        style="width: 18rem; ">


                        <div v-if="dish">
                            <img :src="dish.image_url" class="card-img-top" style="width: 100%; max-height: 17rem;">
                            <div :class="['card-body p-2', cardClass]">
                                <div :class="['d-flex justify-content-between', themeClass]">
                                    <h5 class="card-title">{{ dish.name }}</h5>
                                    <strong class="mt-1">{{ dish.price }} Ks</strong>
                                </div>
                                <small v-if="dish.category" class="badge text-bg-dark">{{ dish.category.name }}</small>
                                <p :class="['card-text mt-2', themeClass]">Some quick example text to build on the card
                                    title and make up
                                    the
                                    bulk of the card's content.</p>

                                <div class="d-flex justify-content-center gap-2">
                                    <button type="button" :class="['btn btn-sm', themeClass]" data-bs-toggle="modal"
                                        :data-bs-target="'#exampleModal' + dish.id">
                                        Detail
                                    </button>
                                    <!-- <router-link>
                                        Edit
                                    </router-link> -->
                                    <button type="button" class="btn btn-sm btn-danger"
                                        @click="confirmDelete(dish.id)">Delete</button>
                                </div>

                            </div>
                        </div>


                        <div class="modal fade" :id="'exampleModal' + dish.id" tabindex="-1" data-bs-keyboard="false"
                            aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                            <div class="modal-dialog">
                                <div class="modal-content" @click.stop>
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ dish.name }}</h1>

                                        <button class="btn btn-sm btn-secondary ms-1" type="button"
                                            @click="editDish(dish)">
                                            <i class="bi bi-pen"></i>
                                        </button>

                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close" @click="close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <img :src="dish.image_url" class="img-fluid"
                                            style="height: 150px; width: 150px;" alt="">


                                        <h5 class="mt-3" v-if="!isEdit">
                                            {{ dish.category.name }}
                                        </h5>

                                        <p v-if="!isEdit">
                                            {{ dish.description }}
                                        </p>

                                        <strong v-if="!isEdit">
                                            {{ dish.price }} Ks
                                        </strong>


                                        <form @submit.prevent="update" v-if="isEdit">
                                            <div class="my-3">
                                                <label for="name">Dish Name:</label>
                                                <input type="text" class="form-control" placeholder="Name of the dish"
                                                    v-model="currentDish.name">
                                            </div>

                                            <div class="mb-3">
                                                <label for="category">Category</label>
                                                <select id="category" class="form-control mt-1"
                                                    v-model="currentDish.category_id">
                                                    <option v-for="category in categories" :key="category.id"
                                                        :value="category.id">{{ category.name }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label for="description">Description</label>
                                                <textarea name="description" rows="2" class="form-control mt-1"
                                                    placeholder="..." v-model="currentDish.description"></textarea>
                                            </div>

                                            <div class="my-3">
                                                <label for="price">Price:</label>
                                                <input type="text" class="form-control" placeholder="Ks"
                                                    v-model="currentDish.price">
                                            </div>
                                            <button type="submit" class="btn btn-primary">Save changes</button>

                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                            @click="close">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-3 d-flex justify-content-center gap-3" v-if="dishes.length != 0">
                    <button class="btn btn-secondary btn-sm" @click="prevPage"
                        :disabled="currentPage === 1 || loading">Prev</button>

                    <button class="btn btn-dark btn-sm" disabled>
                        {{ pagination.current_page }}
                    </button>

                    <button class="btn btn-secondary btn-sm" @click="nextPage"
                        :disabled="currentPage === lastPage || loading">Next</button>
                </div>
            </div>
        </div>


    </div>
</template>


<script>


import axios from 'axios';
import Loader from '../components/Loader.vue';
import DishDetail from '../components/DishDetail.vue'
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';

export default {
    name: 'DishPage',
    components: {
        Loader,
        DishDetail
    },
    data() {
        return {
            dishes: [],
            categories: [],
            searchValue: '',
            loading: false,
            isSearching: false,
            isEdit: false,
            modalId: null,
            pagination: {
                current_page: 1,
                first_page_url: '',
                last_page: 1,
                per_page: 6,
                total: 0,
            },

            currentDish: {
                category_id: null,
                image: null,
                name: '',
                description: '',
                price: ''
            },

            newDish: {
                category_id: null,
                image: null,
                name: '',
                description: '',
                price: ''
            }
        }
    },

    computed: {
        ...mapGetters(['getTheme']),

        currentPage() {
            return this.pagination.current_page;
        },

        lastPage() {
            return this.pagination.last_page;
        },


        themeClass() {
            return this.getTheme ? 'text-theme' : '';
        },

        cardClass() {
            return this.getTheme ? 'card-theme' : '';
        },

        borderClass() {
            return this.getTheme ? 'border-theme' : '';
        }

    },

    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            // console.log(file.name);
            this.newDish.image = file;
        },



        async getDishes(page = 1) {
            this.loading = true;
            try {
                let res = await axios.get(`http://localhost:8000/api/dishes?page=${page}`);
                // console.log(res.data.data);

                this.first_page_url = res.data.data.first_page_url;
                this.dishes = res.data.data.data;
                this.categories = res.data.category;
                this.pagination.current_page = res.data.data.current_page;
                this.pagination.last_page = res.data.data.last_page;
                this.pagination.per_page = res.data.data.per_page;
                this.pagination.total = res.data.data.total;
                // console.log(this.dishes);

                this.loading = false;
            } catch (error) {
                console.log(error);
                this.loading = false;
            }
        },

        async postDishes() {
            const formData = new FormData();
            formData.append('image', this.newDish.image);
            formData.append('name', this.newDish.name);
            formData.append('description', this.newDish.description);
            formData.append('price', this.newDish.price);
            formData.append('category_id', this.newDish.category_id);


            try {
                let res = await axios.post('http://localhost:8000/api/dishes', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(res.data);
                // this.getDishes();
                // let image_url = res.data.data.image_url;

                let createdDish = {
                    id: res.data.data.id,
                    image: res.data.data.image,
                    image_url: res.data.data.image_url,
                    name: res.data.data.name,
                    price: res.data.data.price,
                    description: res.data.data.description,
                    category: this.categories.find(category => category.id === this.newDish.category_id)
                }

                // this.dishes.unshift(createdDish);
                // this.$router.push('/dishes');
                this.getDishes();

                setTimeout(toast('Dish Created Successfully!', {
                    autoClose: 2000,
                    type: 'success',
                    transition: 'zoom'
                }), 2000);

                // let image_url = res.data.data.image_url;

                // this.newDish.image_url = image_url;

                // this.dishes.unshift(this.newDish);
                this.newDish = {
                    category_id: null,
                    image: null,
                    name: '',
                    image_url: '',
                    description: '',
                    price: ''
                };

            } catch (error) {
                console.error(error);
            }
        },


        async searchDish(page = 1) {
            this.loading = true;
            this.isSearching = true;
            try {
                let res = await axios.post(`http://localhost:8000/api/dishes/search?page=${page}`, { key: this.searchValue });
                this.dishes = res.data.data.data;
                this.pagination.current_page = res.data.data.current_page;
                this.pagination.last_page = res.data.data.last_page;
                this.pagination.per_page = res.data.data.per_page;
                this.pagination.total = res.data.data.total;
                this.loading = false;

            } catch (error) {
                console.error(error.message);
                this.loading = false;
            }
        },


        // edit


        editDish(dish) {
            // console.log(id);
            this.isEdit = !this.isEdit;
            this.currentDish = { ...dish }

            // console.log(this.currentDish);
            // this.isEdit = true;
            // this.$set(dish, 'isEdit', true);
        },


        async update() {
            let updateDish = {
                name: this.currentDish.name,
                category_id: this.currentDish.category_id,
                description: this.currentDish.description,
                price: this.currentDish.price
            }
            // console.log(updateDish);

            try {
                let res = await axios.patch(`http://localhost:8000/api/dishes/${this.currentDish.id}`, updateDish);

                // console.log(res.data.data);
                let updatedDish = res.data.data;

                // this.dishes = this.dishes.map(dish => {
                //     if (dish.id === this.currentDish.id) {
                //         return res.data.data;
                //     }

                //     return dish;
                // })
                this.dishes = this.dishes.filter(dish => {
                    if (dish.id === updatedDish.id) {
                        // Replace the updated dish with the new data
                        dish.name = updatedDish.name;
                        dish.category_id = updatedDish.category_id;
                        dish.description = updatedDish.description;
                        dish.price = updatedDish.price;

                        let updatedCategory = this.categories.find(category => category.id === updatedDish.category_id);

                        if (updatedCategory) {
                            dish.category = updatedCategory;
                        }
                        return true; // Keep this dish in the array
                    }
                    return true; // Keep other dishes unchanged
                });
                this.isEdit = false;
            } catch (error) {
                console.log(error);
            }
        },

        async deleteDish(dishId) {
            try {
                await axios.delete(`http://localhost:8000/api/dishes/${dishId}`);
                this.dishes = this.dishes.filter(dish => dish.id !== dishId);

            } catch (error) {
                console.error(error);
            }
        },

        confirmDelete(dishId) {
            if (confirm('Are you sure you want to delete this dish?')) {
                this.deleteDish(dishId);
                this.getDishes(this.currentPage);
            }
        },

        close() {
            setTimeout(() => {
                this.isEdit = false;
            }, 1000);
        },

        setPage(page) {
            this.pagination.current_page = page;
            localStorage.setItem('currentPage', page);
            this.getDishes(page);
        },

        nextPage() {
            if (this.currentPage < this.lastPage) {
                this.setPage(this.currentPage + 1);
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.setPage(this.currentPage - 1);
            }
        }
    },

    mounted() {
        const savedPage = localStorage.getItem('currentPage');
        const page = savedPage ? parseInt(savedPage, 10) : 1;
        this.getDishes(page);
    },
}
</script>

<style>
input {
    color: gray;
    margin-top: 3px;
}

.form {
    position: sticky;
    border: 1px solid #ccc;
}

.card img {
    max-height: 18rem;
    cursor: pointer;
}

.search {
    margin-right: 32px;
}

.e-message {
    height: 400px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.edit-btn:hover {
    background-color: rgb(40, 107, 252);
}

.text-theme {
    color: white;
}

.card-theme {
    background-color: #0f1114;

}

.border-theme {
    border: 1px solid #444;

}
</style>
