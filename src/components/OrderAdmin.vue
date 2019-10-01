<template>
    <div class="order">
        <div class="container">
            <Tbl v-bind:headers="titles" v-bind:items="orderList" >
                <template v-slot:default="slotProps">
                    <td>
                        {{slotProps.index + 1}}
                    </td>
                    <td>
                        {{slotProps.item.orderNumber}}
                    </td>
                    <td>
                        {{slotProps.item.customerName}}
                    </td>
                    <td>
                        {{slotProps.item.orderDate | date}}
                    </td>
                    <td>
                        {{slotProps.item.shipmentDate | date}}
                    </td>
                    <td>
                        {{slotProps.item.status}}
                    </td>
                </template>
            </Tbl>
        </div>
        <modal v-if="showModal" @close="showModal = false">
            
            <h3 slot="header">Ошибка</h3>
            <p slot="body">Что-то пошло не так. Перезагрузите страницу!</p>
            <div slot="footer" class="d-inline w-100">
                <router-link to="/home" exact>
                    <button type="button" class="btn btn-secondary float-left">На главную</button>
                </router-link>
                <button type="button" class="btn btn-secondary float-right" @click="reload">Перезагрузить</button>
            </div>
        </modal>
    </div>
</template>

<style>
    table{
        margin-top: 3%;
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
          titles: ["Код", "Заказчик", "Дата заказа", "Дата доставки", "Статус"],
          keys: ["orderNumber", "customerName", "orderDate", "shipmentDate", "status"],
          showModal: false
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        }
    },
    mounted() {
        this.$store.dispatch('GET_ORDERS');
    },
    computed: {
        orderList() {
            let data = this.$store.getters.ORDERS;
            if(!data) {
                this.showModal = true;
                return [];
            }
            else
                return data;
        },
    }
}

</script>