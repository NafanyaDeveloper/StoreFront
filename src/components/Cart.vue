<template>
    <div class="cart">
        <div class="container">
            <Tbl :headers="titles" :items="itemList">
                <template v-slot:default="slotProps">
                    <td>
                        {{slotProps.index + 1}}
                    </td>
                    <td>
                        {{slotProps.item.name}}
                    </td>
                    <td>
                        {{slotProps.item.category}}
                    </td>
                    <td>
                        {{slotProps.item.price}} x {{slotProps.item.count}} = {{slotProps.item.count * slotProps.item.price}}
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary" @click="change(slotProps.item)">Изменить количество</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary" @click="remove(slotProps.item)">Убрать из корзины</button>
                    </td>
                </template>
            </Tbl>
            <div class="total-part">
                <div class="total float-right">
                    <h3>Итого: {{sum}}</h3>
                </div>
                <div class="float-right">
                    <button type="button" class="btn btn-secondary" @click="createOrder" :disabled="disable">Оформить заказ</button>
                </div>
            </div>
        </div>
        <modal v-if="showModal">
            <h3 slot="header">Ошибка</h3>
            <p slot="body">Что-то пошло не так. Перезагрузите страницу!</p>
            <div slot="footer" class="d-inline w-100">
                <router-link to="/" exact>
                    <button type="button" class="btn btn-secondary float-left">На главную</button>
                </router-link>
                <button type="button" class="btn btn-secondary float-right" @click="reload">Перезагрузить</button>
            </div>
        </modal>
        <modal v-if="cartModal" @close="cartModal = false">
            <h3 slot="header">Удаление товара из корзины</h3>
            <div slot="body">
                <p>Убрать {{item.name}} из корзины?</p>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="cartModal = false">Закрыть</button>
                <button type="button" class="btn btn-secondary float-right" @click="removeFromCart">Убрать</button>
            </div>
        </modal>
        <modal v-if="changeModal" @close="changeModal = false">
            <h3 slot="header">Изменение количества товара</h3>
            <div slot="body">
                <div class="form-group">
                    <label for="count">Количество</label>
                    <input type="number" class="form-control" id="count" name="count" min="1" v-model="item.count">
                </div>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="changeModal = false">Закрыть</button>
                <button type="button" class="btn btn-secondary float-right" @click="changeCount">Изменить</button>
            </div>
        </modal>
        <modal v-if="orderCreated" @close="orderCreated = false">
            <h3 slot="header">Информация о заказе</h3>
            <div slot="body">
                <p>{{orderInfo}}</p>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-right" @click="orderCreated = false">Закрыть</button>
            </div>
        </modal>
    </div>
</template>

<style>
    table{
        margin-top: 3%;
    }
    .total-part{
        display: grid;
    }
</style>

<script>

import Tbl from '@/components/Table.vue'
import axios from 'axios'
import modal from '@/components/Modal.vue'
import {BASE_URL}  from '@/settings.js'

export default {
  components: {
    Tbl,
    modal
  },
  data: function(){
      return {
          titles: ["Название", "Категория", "Цена", "", ""],
          item: null,
          showModal: false,
          cartModal: false,
          changeModal: false,
          disable: false,
          orderInfo: "",
          orderCreated: false
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        },
        change: function(item) {
            this.item = Object.assign({}, item);
            this.changeModal = true;
        },
        changeCount: function() {
            this.changeModal = false;
            this.$store.commit('CHANGE_COUNT', {id: this.item.id, count: this.item.count});
            this.item = null;
        },
        callback: function(res) {
            this.disable = false;
            if(res)
                this.orderInfo = "Заказ успешно добавлен!"
            else
                this.orderInfo = "Что-то пошло не так..."
            this.orderCreated = true;
        },
        remove: function(item) {
            this.item = item;
            this.cartModal = true;
        },
        removeFromCart: function() {
            this.cartModal = false;
            this.$store.commit('REMOVE_FROM_CART', this.item);
            this.item = null;
        },
        createOrder: async function() {
            if(this.$store.getters.CART_ITEMS != []){
                this.disable = true;
                let result = await this.$store.dispatch('BUY', this.callback);
            }
        }
    },
    computed: {
        itemList() {
            return this.$store.getters.CART_ITEMS;
        },
        sum() {
            let sum = 0;
            this.itemList.forEach(e => {
                sum += e.count * e.price;
            });
            return sum;
        }
    }
}

</script>