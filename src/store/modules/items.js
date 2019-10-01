import axios from 'axios';
import {BASE_URL}  from '@/settings.js'
import { async } from 'q';

const state = {
  items: [],
};

const getters = {
  ITEMS: state => {
    return state.items;
  },
};

const mutations = {
  SET_ITEMS: (state, payload) =>{
    state.items = payload;
  },
  CHANGE_ITEM: (state, payload) =>{
    let found = state.items.find(i => i.id == payload.id);
    if(found){
      found.category = payload.category;
      found.price = payload.price;
      found.name = payload.name;
    }
  },
  ADD_ITEM: (state, payload) =>{
    state.items.push(payload);
  },
  REMOVE_ITEM: (state, payload) =>{
    let index = state.items.findIndex(i => i.id == payload);
    if (index > -1) {
        state.items.splice(index, 1);
    }
  }
};

const actions = {
    GET_ITEMS: async (context, payload) => {
      await axios.get(BASE_URL + 'item')
        .then(function(response){
          context.commit('SET_ITEMS', response.data);
        })
        .catch(function(error){
          context.commit('SET_ITEMS', false);
        });
    },
    EDIT_ITEM: async(context, payload) => {
      await axios.put(BASE_URL + 'item', payload.item)
        .then(function(response){
          payload.callback(response.data);
          if(response.data){
            context.commit('CHANGE_ITEM', payload.item);
          }
        })
        .catch(function(error){
          payload.callback(false);
        });
    },
    CREATE_ITEM: async(context, payload) => {
      await axios.post(BASE_URL + 'item', payload.item)
        .then(function(response){
          payload.callback(true);
          context.commit('ADD_ITEM', response.data);
        })
        .catch(function(error){
          payload.callback(false);
        });
    },
    DELETE_ITEM: async(context, payload) => {
      await axios.delete(BASE_URL + 'item/' + payload.id)
        .then(function(response){
          payload.callback(response.data);
          if(response.data)
            context.commit('REMOVE_ITEM', payload.id);
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