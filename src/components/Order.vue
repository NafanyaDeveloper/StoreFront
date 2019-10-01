<template>
    <div class="order">
        <div class="container">
            <div class="categories">
                <div class="form-check form-check-inline">
                    <input v-model="selectedCategories" class="form-check-input" type="checkbox" id="inlineCheckbox1" value="Новый" checked>
                    <label class="form-check-label" for="inlineCheckbox1">Новый</label>
                </div>
                <div class="form-check form-check-inline">
                    <input v-model="selectedCategories" class="form-check-input" type="checkbox" id="inlineCheckbox2" value="Выполняется" checked>
                    <label class="form-check-label" for="inlineCheckbox2">Выполняется</label>
                </div>
                <div class="form-check form-check-inline">
                    <input v-model="selectedCategories" class="form-check-input" type="checkbox" id="inlineCheckbox3" value="Выполнен" checked>
                    <label class="form-check-label" for="inlineCheckbox3">Выполнен</label>
                </div>
            </div>
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
                    <td v-if="slotProps.item.status=='Новый' && !isManager">
                        <button type="button" :disabled="deletion" class="btn btn-secondary" @click="cancel(slotProps.item.id)">Отменить</button>
                    </td>
                    <td v-if="slotProps.item.status!='Выполнен' && isManager">
                        <button type="button" :disabled="deletion" class="btn btn-secondary" @click="showEditModal(slotProps.item)">Изменить</button>
                    </td>
                    <td v-if="slotProps.item.status=='Выполнен' && isManager"></td>
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
        <modal v-if="editModal" @close="editModal = false">
            <h3 slot="header">Редактирование заказа</h3>
            <div slot="body">
                <form>
                    <div class="form-group">
                        <label for="status">Статус</label>
                        <select class="form-control" name="status" v-model="item.status">
                            <option v-for="s in statuses" v-bind:value="s">{{s}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="date">Дата доставки</label>
                        <input type="date" class="form-control" id="date" :min="today" name="date" v-model="item.shipmentDate">
                        <small id="passwordHelpInline" class="text-muted" v-if="dateAlert">
                            Введите дату
                        </small>
                    </div>
                </form>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" :disabled="disable" class="btn btn-secondary float-left" @click="editModal = false">Закрыть</button>
                <button type="button" :disabled="disable" class="btn btn-secondary float-right" @click="editOrder">Изменить</button>
            </div>
        </modal>
    </div>
</template>

<style>
    .categories{
        margin-top: 3%;
        margin-bottom: 1%;
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
          titles: ["Код", "Заказчик", "Дата заказа", "Дата доставки", "Статус", ""],
          keys: ["orderNumber", "customerName", "orderDate", "shipmentDate", "status"],
          showModal: false,
          deletion: false,
          editModal: false,
          disable: false,
          dateAlert: false,
          today: null,
          infoModal: false,
          selectedCategories: ["Новый", "Выполняется", "Выполнен"],
          item: {}
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        },
        cancel: function(id) {
            this.deletion = true;
            this.$store.dispatch('DELETE_USER_ORDER', {id: id, callback: this.callback});
        },
        callback: function(result) {
            this.disable = false;
            this.editModal = false;
            if(result)
                this.infoModal = true;
            else
                this.showModal = true;
        },
        showEditModal: function(item) {
            this.item = Object.assign({}, item);
            this.editModal = true;
        },
        validate: function() {
            if(this.item.status != "Новый" && this.item.shipmentDate == null){
                this.dateAlert = true;
                return false;
            }
                return true;
        },
        editOrder: function() {
            if(this.validate()){
                this.disable = true;
                this.$store.dispatch('EDIT_ORDER', {item: this.item, callback: this.callback});
            }
        }
    },
    created() {
        if(localStorage.getItem('role') == "manager")
            this.$store.dispatch('GET_ORDERS');
        else
            this.$store.dispatch('GET_USER_ORDERS');

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        this.today = yyyy + '-' + mm + '-' + dd;
    },
    computed: {
        orderList() {
            let data = this.$store.getters.ORDERS;
            if(!data) {
                this.showModal = true;
                return [];
            }
            else {
                return data.filter(item => this.selectedCategories.includes(item.status));
            }
        },
        isManager() {
            return localStorage.getItem('role') == "manager";
        },
        statuses() {
            if(this.item.status == "Новый")
                return ["Новый", "Выполняется", "Выполнен"];
            else if(this.item.status == "Выполняется")
                return ["Выполняется", "Выполнен"];
            else return ["Выполнен"];
        }
    }
}

</script>