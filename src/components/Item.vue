<template>
    <div class="item">
        <div class="container">
            <button type="button" class="btn btn-secondary float-right mt-3 mb-2" :disabled="disable" @click="showEditModal()">Добавить</button>
            <Tbl :headers="titles" :items="itemList">
                <template v-slot:default="slotProps">
                    <td>
                        {{slotProps.index + 1}}
                    </td>
                    <td v-for="i in keys">
                        {{slotProps.item[i]}}
                    </td>
                    <td v-if="!isManager">
                        <button type="button" class="btn btn-secondary" @click="buy(slotProps.item)">В корзину</button>
                    </td>
                    <td v-if="isManager">
                        <button type="button" class="btn btn-secondary" :disabled="disable" @click="showEditModal(slotProps.item)">Изменить</button>
                    </td>
                    <td v-if="isManager">
                        <button type="button" class="btn btn-secondary" :disabled="disable" @click="showDeleteModal(slotProps.item)">Удалить</button>
                    </td>
                </template>
            </Tbl>
        </div>
        <modal v-if="showModal">
            <h3 slot="header">Ошибка</h3>
            <p slot="body">Что-то пошло не так. Перезагрузите страницу!</p>
            <div slot="footer" class="d-inline w-100">
                <router-link to="/home" exact>
                    <button type="button" class="btn btn-secondary float-left">На главную</button>
                </router-link>
                <button type="button" class="btn btn-secondary float-right" @click="reload">Перезагрузить</button>
            </div>
        </modal>
        <modal v-if="infoModal">
            <h3 slot="header">Информация</h3>
            <p slot="body">Изменения успешно внесены</p>
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="infoModal = false">Закрыть</button>
            </div>
        </modal>
        <modal v-if="cartModal" @close="cartModal = false">
            <h3 slot="header">Добавление товара в корзину</h3>
            <div slot="body">
                <p>Добавить {{item.name}} в корзину?</p>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="cartModal = false">Закрыть</button>
                <button type="button" class="btn btn-secondary float-right" @click="addToCart">В корзину</button>
            </div>
        </modal>
        <modal v-if="deleteModal" @close="deleteModal = false">
            <h3 slot="header">Удаление</h3>
            <div slot="body">
                <p>Вы действительно хотите удалить {{item.name}}?</p>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="deleteModal = false">Нет</button>
                <button type="button" class="btn btn-secondary float-right" @click="deleteItem">Да</button>
            </div>
        </modal>
        <modal v-if="editModal" @close="editModal = false">
            <h3 slot="header">Редактирование товара</h3>
            <div slot="body">
                <form>
                    <div class="form-group">
                        <label for="name" >Название</label>
                        <input class="form-control" id="name" v-model="item.name" required autofocus>
                        <small id="passwordHelpInline" class="text-muted" v-if="nameAlert">
                            Название должно быть не меньше 3х символов
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="category" >Категория</label>
                        <input class="form-control" id="category" v-model="item.category">
                    </div>
                    <div class="form-group">
                        <label for="price" >Цена</label>
                        <input class="form-control"  type="number" min="1" id="price" v-model="item.price" required>
                    </div>
                </form>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" :disabled="disable" class="btn btn-secondary float-left" @click="editModal = false">Закрыть</button>
                <button type="button" v-if="isEdit" :disabled="disable" class="btn btn-secondary float-right" @click="editItem">Изменить</button>
                <button type="button" v-if="!isEdit" :disabled="disable" class="btn btn-secondary float-right" @click="createItem">Создать</button>
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
          titles: ["Название", "Категория", "Цена", "Код", ""],
          keys: ["name", "category", "price", "code"],
          item: null,
          showModal: false,
          cartModal: false,
          editModal: false,
          deleteModal: false,
          nameAlert: false,
          disable: false,
          infoModal: false,
          isEdit: true
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        },
        buy: function(item) {
            this.item = item;
            this.cartModal = true;
        },
        addToCart: function() {
            this.cartModal = false;
            this.$store.commit('ADD_TO_CART', this.item);
            this.item = null;
            this.$store.commit('SAVE_CART');
        },
        showEditModal: function(item) {
            if(item == undefined)
            {
                this.item = {
                    name: "",
                    category: "",
                    price: 1
                };
                this.isEdit = false;
            }
            else{
                this.item = Object.assign({}, item);
                this.isEdit = true;
            }
            this.editModal = true;
        },
        showDeleteModal: function(item) {
            this.item = item;
            this.deleteModal = true;
        },
        validate: function() {
            let valid = true;
            if (this.item.name == undefined || this.item.name.replace(/\s+/g, '').length < 3) {
                this.nameAlert = true;
                valid = false;
            }
            else
                this.nameAlert = false;
            return valid;
        },
        callback: function(result) {
            this.disable = false;
            this.deleteModal = false;
            this.editModal = false;
            if(result)
                this.infoModal = true;
            else
                this.showModal = true;

        },
        editItem: function() {
            if(this.validate()){
                this.disable = true;
                this.$store.dispatch('EDIT_ITEM', {item: this.item, callback: this.callback});
            }
        },
        createItem: function() {
            if(this.validate()){
                this.disable = true;
                this.$store.dispatch('CREATE_ITEM', {item: this.item, callback: this.callback});
            }
        },
        deleteItem: function() {
            this.disable = true;
            this.$store.dispatch('DELETE_ITEM', {id: this.item.id, callback: this.callback});
        }
    },
    mounted() {
        this.$store.dispatch('GET_ITEMS');
    },
    created() {
        if(localStorage.getItem('role') == "manager")
            this.titles = ["Название", "Категория", "Цена", "Код", "", ""]
    },
    computed: {
        itemList() {
            let data = this.$store.getters.ITEMS;
            if(!data) {
                this.showModal = true;
                return [];
            }
            else
                return data;
        },
        isManager() {
            return localStorage.getItem('role') == "manager";
        }
    }
}

</script>