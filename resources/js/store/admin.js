
// import createPersistedState from 'vuex-persistedstate';

// const adminModule = {
//     plugins: [createPersistedState()],
//     state: {
//         userData: {},
//         token: '',
//         darkMode: false
//     },
//     getters: {
//         getToken(state) {
//             return state.token;
//         },

//         getUserData(state) {
//             return state.userData;
//         },

//         getTheme(state) {
//             return state.darkMode;
//         }
//     },

//     mutations: {
//         setToken(state, token) {
//             state.token = token;
//             localStorage.setItem('token', token);
//         },

//         setUserData(state, data) {
//             state.userData = data;
//         },

//         clearUserData(state) {
//             state.userData = {};
//             state.token = '';
//             localStorage.removeItem('token');
//             localStorage.removeItem('activeRoute');
//         },

//         setDarkMode(state, theme) {
//             state.darkMode = theme;
//             localStorage.setItem('theme', theme);
//         }
//     },

//     actions: {
//         setToken({ commit }, token) {
//             commit('setToken', token);
//         },

//         setUserData({ commit }, data) {
//             commit('setUserData', data);
//         },


//         logout({ commit }) {
//             commit('clearUserData');
//         },


//         async refreshToken({ commit }) {
//             const refreshToken = localStorage.getItem('refreshToken');

//             try {
//                 const response = await axios.post('http://localhost:8000/api/auth/refresh', { refresh_token: refreshToken });

//                 if (response.data.token) {
//                     commit('setToken', response.data.token);
//                     localStorage.setItem('token', response.data.token);
//                     return { success: true };
//                 } else {
//                     throw new Error('Token refresh failed');
//                 }
//             } catch (error) {
//                 commit('clearUserData');
//                 return { success: false, error };
//             }
//         },

//         changeTheme({ commit }, theme) {
//             // const newDarkMode = !state.darkMode;
//             commit('setDarkMode', theme);
//         }
//     },
// };

// export default adminModule
