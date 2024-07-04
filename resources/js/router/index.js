import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/Layouts/IndexPage.vue'
import AboutPage from "../pages/AboutPage.vue";
import LoginPage from '../auth/LoginPage.vue';
import DishPage from '../pages/DishPage.vue';
import OrderPage from '../pages/OrderPage.vue';
import StaffMenu from '../pages/StaffMenu.vue';
import SignUp from '../auth/SignUp.vue';
import Panel from '../pages/Staff/HomePage.vue';
import MenuPage from '../pages/Staff/MenuPage.vue';
import MenuDetail from '../pages/Staff/MenuDetail.vue';
import store from "../store";

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'SignUp',
        component: SignUp
    },

    {
        path: '',
        component: HomePage,
        children: [
            {
                path: '/home',
                name: 'home',
                component: HomePage,
                meta: { requiresAuth: true, roles: ['admin'] }
            },
            {
                path: '/dishes',
                name: 'dish',
                component: DishPage,
                meta: { requiresAuth: true, roles: ['admin'] }
            },
            {
                path: '/orders',
                name: 'orders',
                component: OrderPage,
                meta: { requiresAuth: true, roles: ['admin'] }
            },
            {
                path: '/about',
                name: 'about',
                component: AboutPage,
                meta: { requiresAuth: true, roles: ['admin'] }
            },
            {
                path: '/staffs',
                name: 'StaffMenu',
                component: StaffMenu,
                meta: { requiresAuth: true, roles: ['admin'] }
            }
        ]
    },

    {
        path: '/menus',
        component: Panel,
        meta: { requiresAuth: true, roles: ['waiter'] },
        children: [
            {
                path: '',
                // name: 'menu',
                name: 'MenuPage',
                component: MenuPage,
                meta: { requiresAuth: true, roles: ['waiter'] }
            },
            {

                path: ':id',
                name: 'MenuDetail',
                component: MenuDetail,
                meta: { requiresAuth: true, roles: ['waiter'] }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = store.getters.getToken !== '';
    const userRole = store.getters.getUserRole;

    if (requiresAuth && !isAuthenticated) {
        // Redirect to login page if not authenticated and trying to access a protected route
        next('/login');

    } else if (requiresAuth && to.meta.roles && !to.meta.roles.includes(userRole)) {
        if (userRole === 'admin') {
            next('/dishes');
        } else {
            next('/menus');
        }
    } else {
        // Store the active route in localStorage
        localStorage.setItem('activeRoute', to.path);
        next();
    }
});


export default router;
