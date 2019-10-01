import axios from 'axios';
import {BASE_URL}  from '@/settings.js'
import { async } from 'q';
import customers from './customers'

const state = {
  users: [],
};

const getters = {
  USERS: state => {
    return state.users;
  },
  USER_BY_ID: state => id => {
      return state.users.find(i => i.id == id);
  }
};

const mutations = {
  SET_USERS: (state, payload) =>{
    state.users = payload;
  },
  CHANGE_USER: (state, payload) =>{
    let found = state.users.find(i => i.id == payload.id);
    if(found){
      found.name = payload.name;
      found.surname = payload.surname;
    }
  },
  ADD_USER: (state, payload) =>{
    state.users.push(payload);
  },
  REMOVE_USER: (state, payload) =>{
    let index = state.users.findIndex(i => i.id == payload);
    if (index > -1) {
        state.users.splice(index, 1);
    }
  }
};

const actions = {
    GET_USERS: async (context, payload) => {
      await axios.get(BASE_URL + 'user')
        .then(function(response){
          context.commit('SET_USERS', response.data);
        })
        .catch(function(error){
          context.commit('SET_USERS', false);
        });
    },
    EDIT_USER: async(context, payload) => {
      await axios.put(BASE_URL + 'user', payload.item)
        .then(function(response){
          payload.callback(response.data);
          if(response.data){
            context.commit('CHANGE_USER', payload.item);
          }
        })
        .catch(function(error){
          payload.callback(false);
        });
    },
    CREATE_USER: async(context, payload) => {
      await axios.post(BASE_URL + 'user', payload.item)
        .then(function(response){
          payload.callback(true);
          context.commit('ADD_USER', response.data);
        })
        .catch(function(error){
          payload.callback(false);
        });
    },
    DELETE_USER: async(context, payload) => {
      await axios.delete(BASE_URL + 'user/' + payload.id)
        .then(function(response){
          payload.callback(response.data);
          if(response.data)
            context.commit('REMOVE_USER', payload.id);
        })
        .catch(function(error){
          payload.callback(false);
        });
    }
};

export default {
  state,
  getters,
  mutations,
  actions,
};