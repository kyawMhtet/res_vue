<template>
    <div class="col-md-11 mt-2">
        <h2 :class="['mb-4', textTheme]">Order Table</h2>


        <input type="text" id="searchInput" class="form-control mb-3 w-50" placeholder="Search orders..."
            @input="searchTable" />

        <button class="btn btn-sm btn-primary float-end me-3" data-bs-toggle="modal"
            data-bs-target="#exampleModal">Create
            Invoice (+)</button>


        <!-- modal -->

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="createInvoice">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="">Table No :</label>
                                <input type="text" class="form-control" v-model="table_id">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!--  -->

        <div class="modal fade" id="invoiceDetailsModal" tabindex="-1" aria-labelledby="invoiceDetailsModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="invoiceDetailsModalLabel">Invoice Details</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="invoice-content" v-if="invoiceOrders">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Menu</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                <tr v-for="invoiceOrder in invoiceOrders" :key="invoiceOrder.id">
                                    <td>{{ invoiceOrder.dish.name }}</td>
                                    <td>{{ invoiceOrder.quantity }}</td>
                                    <td>{{ invoiceOrder.dish.price }} Ks</td>
                                    <td>{{ invoiceOrder.quantity * invoiceOrder.dish.price }} Ks</td>
                                </tr>
                                <tr class="table-group-divider">
                                    <td></td>
                                    <td></td>
                                    <td class="text-end">
                                        <strong>
                                            Sub-total :
                                        </strong>
                                    </td>
                                    <td>
                                        <strong>
                                            {{ totalPrice }} Ks
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td class="text-end">
                                        <strong>Tax :</strong>
                                    </td>
                                    <td>
                                        <strong>
                                            -
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="table-group-divider">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td class="text-end">
                                        <strong>
                                            Total :
                                        </strong>
                                    </td>
                                    <td>
                                        <strong>
                                            {{ totalPrice }} Ks
                                        </strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        <button class="btn btn-secondary" @click="printInvoice">Print</button>
                    </div>
                </div>
            </div>
        </div>

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
import axios from 'axios';

export default {
    name: 'OrderPage',

    data() {
        return {
            table_id: '',
            invoiceOrders: [],
        }
    },

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
        },

        totalPrice() {
            return this.invoiceOrders.reduce((total, order) => total + (order.quantity * order.dish.price), 0);
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
        },


        async createInvoice() {
            try {
                let res = await axios.post('http://localhost:8000/api/invoice', {
                    table_id: this.table_id
                });

                console.log(res.data.orders);
                this.invoiceOrders = res.data.orders;

                console.log(this.invoiceOrders);
                // this.invoiceOrders = Array.isArray(res.data.orders) ? res.data.orders : [];
                let firstModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (firstModal) firstModal.hide();

                let secondModal = new bootstrap.Modal(document.getElementById('invoiceDetailsModal'));
                secondModal.show();
            } catch (error) {
                console.log(error.message);
            }
        },



        printInvoice() {
            const printContent = document.getElementById('invoice-content').innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;

            this.$nextTick(() => {
                let secondModal = new bootstrap.Modal(document.getElementById('invoiceDetailsModal'));
                secondModal.show();
            });



        }
    },

    async mounted() {
        await this.fetchOrders();
        this.$nextTick(() => {
            $('#orderTable').DataTable({
                dom: 'Bfrtip',
                // buttons: [
                //     'copy', 'excel', 'pdf', 'print'
                // ],
                paging: true,
                searching: false,
                ordering: true,
                info: true,
                pageLength: 20,
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
