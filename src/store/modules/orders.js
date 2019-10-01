import axios from 'axios';
import {BASE_URL}  from '@/settings.js'

const state = {
  orders: [],
};

const getters = {
  ORDERS: state => {
    return state.orders;
  },
};

const mutations = {
  SET_ORDERS: (state, payload) =>{
    state.orders = payload;
  },
  REMOVE_ORDER: (state, payload) =>{
    let index = state.orders.findIndex(i => i.id === payload);

    if (index > -1) {
        state.orders.splice(index, 1);
    }
  },
  CHANGE_ORDER: (state, payload) =>{
    let found = state.orders.find(i => i.id == payload.id);
    if(found){
      found.status = payload.status;
      found.shipmentDate = payload.shipmentDate;
    }
  },
};

const actions = {
    GET_ORDERS: async (context, payload) => {
        await axios.get(BASE_URL + 'order')
          .then(function(response){
            context.commit('SET_ORDERS', response.data);
          })
          .catch(function(error){
            context.commit('SET_ORDERS', false);
          });
    },
    GET_USER_ORDERS: async (context, payload) => {
      await axios.get(BASE_URL + 'Account/GetOrders')
        .then(function(response){
          context.commit('SET_ORDERS', response.data);
        })
        .catch(function(error){
          context.commit('SET_ORDERS', false);
        });
    },
    DELETE_USER_ORDER: async (context, payload) => {
      await axios.delete(BASE_URL + 'Account/DeleteOrder/' + payload.id)
      .then(function(response){
          if(response.data)
            context.commit('REMOVE_ORDER', payload.id);
          payload.callback(response.data);
      })
      .catch(function(error){
        payload.callback(false);
      });
    },
    EDIT_ORDER: async (context, payload) => {
      await axios.put(BASE_URL + 'order', payload.item)
      .then(function(response){
          if(response.data)
            context.commit('CHANGE_ORDER', payload.item);
          payload.callback(response.data);
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