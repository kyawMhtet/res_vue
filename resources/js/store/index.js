import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from 'axios';

export default createStore({
    plugins: [createPersistedState()],
    state: {
        userData: {},
        token: '',
        darkMode: false,
        panelTheme: false,
        role: '',
        cartItems: [],
        orders: [],
    },
    getters: {
        getToken(state) {
            return state.token;
        },

        getUserData(state) {
            return state.userData;
        },

        getTheme(state) {
            return state.darkMode;
        },

        getUserRole(state) {
            return state.role;
        },

        getCartItems(state) {
            return state.cartItems;
        },

        getOrders(state) {
            return state.orders;
        }
    },

    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },

        setUserData(state, data) {
            state.userData = data;
        },

        clearUserData(state) {
            state.userData = {};
            state.token = '';
            localStorage.removeItem('token');
            localStorage.removeItem('activeRoute');
        },

        setDarkMode(state, theme) {
            state.darkMode = theme;
            localStorage.setItem('theme', theme);
        },

        setRole(state, role) {
            state.role = role;
        },

        setCartItems(state, cartItems) {
            state.cartItems = cartItems;
        },

        addToCart(state, cartItem) {
            state.cartItems.push(cartItem);
        },

        setOrders(state, orders) {
            state.orders = orders;
        },

        updateOrderStatus(state, order) {
            const updateOrder = state.orders.find(o => o.id === order.id);
            if (order) {
                updateOrder.status = order.status;
            }
        }
    },

    actions: {
        async fetchOrders({ commit }) {
            try {
                let res = await axios.get('http://localhost:8000/api/orders');
                // console.log(res.data);
                commit('setOrders', res.data.orders.map(order => ({
                    id: order.id,
                    order_id: order.order_id,
                    dish_name: order.dish.name,
                    table_id: order.table_id,
                    quantity: order.quantity,
                    sub_total_price: order.sub_total_price,
                    status: order.status
                })));
            } catch (error) {
                console.log(error.message);
            }
        },

        async changeOrderStatus({ commit }, order) {
            const formData = new FormData();
            formData.append('oid', order.id);
            formData.append('status', order.status);

            try {
                let res = await axios.post('http://localhost:8000/api/orders/change-status', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 200) {
                    commit('updateOrderStatus', order);
                }
            } catch (error) {
                console.log(error.message);
            }
        },


        setToken({ commit }, token) {
            commit('setToken', token);
        },

        setUserData({ commit }, data) {
            commit('setUserData', data);
        },

        setRole({ commit }, role) {
            commit('setRole', role);
        },

        logout({ commit }) {
            commit('clearUserData');
        },

        async addToCart({ commit, dispatch }, menu) {
            try {
                let res = await axios.post(`http://localhost:8000/api/panel/categories/menus/${menu.id}`, {
                    quantity: menu.quantity
                });

                console.log(res);
                commit('addToCart', res.data.cartMenus);
                menu.quantity = 1;
                await dispatch('getCartItems');
            } catch (error) {
                console.log(error.message);
            }
        },

        async getCartItems({ commit }) {
            try {
                let res = await axios.get('http://localhost:8000/api/panel/cartInfo');
                console.log('Response from API:', res.data);
                commit('setCartItems', res.data.cartMenus);
            } catch (error) {
                console.log(error.message);
            }
        },

        async refreshToken({ commit }) {
            const refreshToken = localStorage.getItem('refreshToken');

            try {
                const response = await axios.post('http://localhost:8000/api/auth/refresh', { refresh_token: refreshToken });

                if (response.data.token) {
                    commit('setToken', response.data.token);
                    localStorage.setItem('token', response.data.token);
                    return { success: true };
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (error) {
                commit('clearUserData');
                return { success: false, error };
            }
        },

        changeTheme({ commit }, theme) {
            commit('setDarkMode', theme);
        }
    },
});
