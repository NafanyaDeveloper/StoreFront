import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import items from './modules/items';
import users from './modules/users';
import cart from './modules/cart'
import orders from './modules/orders'
import customers from './modules/customers'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    items,
    orders,
    cart,
    users,
    customers
  }
 });