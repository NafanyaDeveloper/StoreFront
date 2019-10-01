import axios from 'axios';
import {BASE_URL}  from '@/settings.js'
import { async } from 'q';

const state = {
  customers: [],
};

const getters = {
  CUSTOMERS: state => {
    return state.customers;
  },
};

const mutations = {
  SET_CUSTOMERS: (state, payload) =>{
    state.customers = payload;
  },
  CHANGE_CUSTOMER: (state, payload) =>{
    let found = state.customers.find(i => i.id == payload.id);
    if(found){
      found.userId = payload.userId;
      found.storeUserName = payload.storeUserName;
    }
  },
  REMOVE_USER_FROM_CUSTOMERS: (state, payload) =>{
      state.customers.forEach(element => {
          if(element.userId == payload){
              element.userId = undefined;
              element.storeUserName = undefined;
          }
      });
  }
};

const actions = {
    GET_CUSTOMERS: async (context, payload) => {
      await axios.get(BASE_URL + 'customer')
        .then(function(response){
          context.commit('SET_CUSTOMERS', response.data);
        })
        .catch(function(error){
          context.commit('SET_CUSTOMERS', false);
        });
    },
    EDIT_CUSTOMER: async(context, payload) => {
      await axios.put(BASE_URL + 'customer', payload.item)
        .then(function(response){
          payload.callback(response.data);
          if(response.data){
            context.commit('CHANGE_CUSTOMER', payload.item);
          }
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