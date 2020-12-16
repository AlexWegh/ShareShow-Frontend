import axios from 'axios';
import router from '../../router'

const state = {
    error: '',
    isLoggedIn: !!localStorage.getItem('jwtToken')
}

const getters = {
    isLoggedIn: state => state.isLoggedIn,
    error: state => state.error
}

const mutations = {
    auth_success(state) {
        state.error = ''
        state.isLoggedIn = true;
    },
    auth_error(state, error){
        state.error = error
    },
    logout(state){
        state.isLoggedIn = false;
    },
}

const actions = {
    login({commit, dispatch}, user) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/login', user)
            .then(res => {
                if(res.data.success) {
                    const jwtToken = res.data.token;
                    localStorage.setItem('jwtToken', jwtToken);
                    axios.defaults.headers.common['authorization'] = "Bearer " + jwtToken;
                    const user = res.data.userData;
                    commit('auth_success', user);
                    dispatch('setUser', user, { root: true });
                    resolve(true);
                } else {
                    console.log("Error: " + res.data.msg);
                    commit('auth_error', "Error: " + res.data.msg);
                    resolve(false);
                }
            })
            .catch(err => {
                console.log(err);
                commit('auth_error', "Error: " + err);
                reject(err);
            })
        })
    },
    register({commit, dispatch}, user) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/register', user)
            .then(res => {
                if(res.data.success) {
                    const jwtToken = res.data.token;
                    localStorage.setItem('jwtToken', jwtToken);
                    axios.defaults.headers.common['authorization'] = "Bearer " + jwtToken
                    const user = res.data.userData;
                    commit('auth_success', user);
                    dispatch('setUser', user, { root: true });
                    resolve(true);
                } else {
                    console.log("Error: " + res.data.msg);
                    commit('auth_error', "Error: " + res.data.msg);
                    resolve(false);
                }
            })
            .catch(err => {
                console.log(err);
                commit('auth_error', "Error: " + err);
                reject(err);
            })
        })
    },
    logout({commit}){
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('jwtToken');
                delete axios.defaults.headers.common['authorization'];
                commit('logout');
                commit('removeUser', null, { root: true });
                router.push('/welcome');
                resolve();
            } catch(e) {
                reject(e);
            }
        })
    }
}

export default {
    state, getters, mutations, actions
}