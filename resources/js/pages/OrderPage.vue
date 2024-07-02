<template>
    <div class="col-md-11 mt-2">
        <h2 :class="['mb-4', textTheme]">Order Table</h2>
        <!-- <input type="text" id="searchInput" class="form-control mb-3" placeholder="Search orders..."
            @input="searchTable" /> -->
        <table id="orderTable" :class="['table table-striped table-bordered table-hover display', tableDark]">
            <thead class="text-center">
                <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Dish Name</th>
                    <th>Table ID</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody class="text-center">
                <tr v-for="(order, index) in orders" :key="order.id">
                    <td>{{ index + 1 }} .</td>
                    <td>order_{{ order.order_id }}</td>
                    <td>{{ order.dish_name }}</td>
                    <td>{{ order.table_id }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>{{ order.sub_total_price }} Ks</td>
                    <td class="w-25">
                        <!-- If order.status is 'done', display a small tag with the status -->
                        <template v-if="order.status === 'done'">
                            <h5 class="badge text-bg-success">{{ order.status }}</h5>
                        </template>
                        <!-- Otherwise, display the select dropdown -->
                        <template v-else>
                            <select v-model="order.status" class="btn btn-sm ms-3"
                                :class="{ 'btn-success': order.status === 'ready', 'btn-secondary': order.status !== 'ready' }">
                                <option value="processing">processing</option>
                                <option value="new_order">new_order</option>
                                <option value="ready">ready</option>
                                <option value="done">done</option>
                                <option value="cancel">cancel</option>
                            </select>
                            <button v-if="order.status !== 'done'" :class="['btn btn-sm btn-outline-dark ms-4']"
                                @click="changeOrderStatus(order)">
                                change
                            </button>
                        </template>
                    </td>
                    <td>
                        <button class="btn btn-sm edit-btn" :data-id="order.id"><i
                                class="bi bi-eye text-primary"></i></button>
                        <button class="btn btn-sm delete-btn" :data-id="order.id"><i
                                class="bi bi-trash text-danger"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { toast } from 'vue3-toastify';

export default {
    name: 'OrderPage',

    computed: {
        ...mapGetters(['getOrders', 'getTheme']),

        orders() {
            return this.getOrders;
        },

        textTheme() {
            return this.getTheme ? 'text-theme' : '';
        },

        tableDark() {
            return this.getTheme ? 'table-dark' : '';
        }
    },

    methods: {
        ...mapActions(['fetchOrders', 'changeOrderStatus']),

        searchTable(event) {
            const value = event.target.value;
            $('#orderTable').DataTable().search(value).draw();
        },

        async changeOrderStatus(order) {
            try {
                await this.$store.dispatch('changeOrderStatus', order);

                toast('Status Changed to ' + order.status, {
                    autoClose: 1000,
                    type: 'success',
                    transition: 'zoom'
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    },

    async mounted() {
        await this.fetchOrders();
        this.$nextTick(() => {
            $('#orderTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'excel', 'pdf', 'print'
                ],
                paging: true,
                searching: true,
                ordering: true,
                info: true,
                drawCallback: function () {
                    console.log('DataTable Data:', $('#orderTable').DataTable().data().toArray());
                }
            });
        });
    }
}
</script>

<style>
.table {
    margin-top: 20px;
}

.text-theme {
    color: white;
}
</style>
