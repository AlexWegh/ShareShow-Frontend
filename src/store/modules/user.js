import axios from 'axios';
import shared from '../../shared';

const state = {
    user: {
        avatar: "/assets/default_profile_picture.png"
    }
};

const getters = {
    user(state) {
        return state.user;
    },
};

const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    updateUser(state, propertiesToUpdate) {
        for(var property in propertiesToUpdate){
            state.user[property] = propertiesToUpdate[property];
        }
    },
    removeUser(state) {
        state.user = {};
    }
};

const actions = {
    setUser({commit}, user) {
        user.avatar = shared.decodeAvatar(user.avatar);
        commit('setUser', user);  
    },
    updateUser({commit}, propertiesToUpdate) {
        return new Promise((resolve, reject) => {
            axios.post('/index/update_user_data',  { propertiesToUpdate })
            .then(res => {
                if(res.data.success) {
                    if(Object.keys(res.data.propertiesToUpdate)[0] == "avatar") {
                        res.data.propertiesToUpdate.avatar = shared.decodeAvatar(res.data.propertiesToUpdate.avatar);
                    }
                    commit('updateUser', res.data.propertiesToUpdate);
                    if(res.data.token) {
                        localStorage.setItem('jwtToken', res.data.token);
                        axios.defaults.headers.common['authorization'] = "Bearer " + res.data.token;
                    }
                    resolve(res);
                } else {
                    console.log("Error: " + res.data.msg)
                }
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    },
};

export default {
    state, getters, mutations, actions
}