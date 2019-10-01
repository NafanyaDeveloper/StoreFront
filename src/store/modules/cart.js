import axios from 'axios';
import {BASE_URL}  from '@/settings.js'

let cart = window.localStorage.getItem('cart');

const state = {
  cartItems: cart ? JSON.parse(cart) : []
};

const getters = {
  CART_ITEMS: state => {
    return state.cartItems;
  }
};

const mutations = {
  ADD_TO_CART: (state, payload) =>{
    let data = window.localStorage.getItem('cart');
    state.cartItems = data ? JSON.parse(data) : [];
    let index = state.cartItems.findIndex(i => i.id === payload.id);
    payload.count = 1;
    if(index > -1){
        state.cartItems[index].count += 1;
    }
    else{
        state.cartItems.push(payload);
    }
    window.localStorage.setItem('cart', JSON.stringify(state.cartItems));
  },
  REMOVE_FROM_CART(state, payload) {
    let index = state.cartItems.indexOf(payload);

    if (index > -1) {
        let product = state.cartItems[index];
        state.cartItems.splice(index, 1);
    }
    window.localStorage.setItem('cart', JSON.stringify(state.cartItems));
  },
  CHANGE_COUNT(state, payload) {
    let found = state.cartItems.find(i => i.id === payload.id);
    if (found)
        found.count = payload.count;
    window.localStorage.setItem('cart', JSON.stringify(state.cartItems));
  },
  SAVE_CART(state){
    window.localStorage.setItem('cart', JSON.stringify(state.cartItems));
  },
  CLEAN_CART(state){
      window.localStorage.removeItem('cart');
      state.cartItems = [];
  }
};

const actions = {
  BUY: async (context, payload) => {
    let data = [];
    context.state.cartItems.forEach(e => {
      data.push({itemId: e.id, itemCount: e.count, itemPrice: e.price});
    });
    await axios.post(BASE_URL + 'Account/AddOrder', {orderItems: data})
    .then(function(response){
        if(response.data)
          context.commit('CLEAN_CART');
        payload(response.data)
    })
    .catch(function(error){
        payload(false);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};