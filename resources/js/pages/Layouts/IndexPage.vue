<template>
    <div :class="['app', themeClass]">
        <div class="row g-0">
            <div class="col-md-2">
                <SideBar />
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

import SideBar from '../../components/SideBar.vue'
import { mapGetters } from 'vuex';

export default {
    name: 'home',
    components: { SideBar },

    computed: {
        // ...mapGetters(['admin/getToken', 'admin/getTheme']),
        ...mapGetters(['getToken', 'getTheme']),
        themeClass() {
            return this.getTheme ? 'dark-theme' : '';
        }
    },

    mounted() {
        // console.log('token:', this.getToken);
        localStorage.setItem('activeRoute', this.$router.currentRoute.value.path);
    }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.app {
    overflow-x: hidden;
    min-height: 100vh;
}

.dark-theme {
    background-color: #0f1114;
}
</style>
