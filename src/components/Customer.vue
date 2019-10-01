<template>
    <div class="customer">
        <div class="container">
            <Tbl :headers="titles" :items="customerList">
                <template v-slot:default="slotProps">
                    <td>
                        {{slotProps.index + 1}}
                    </td>
                    <td v-for="i in keys">
                        {{slotProps.item[i]}}
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary" :disabled="disable" @click="showAddUserModal(slotProps.item)">Прикрепить пользователя</button>
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
        <modal v-if="addingModal" @close="addingModal = false">
            <h3 slot="header">Прикрепление пользователя</h3>
            <div slot="body">
                <form>
                    <div class="form-group">
                        <label for="user">Пользователь</label>
                        <select class="form-control" name="user" v-model="item.userId">
                            <option v-for="u in userList" v-bind:value="u.id">{{u.surname}} {{u.name}}</option>
                        </select>
                    </div>
                </form>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" :disabled="disable" class="btn btn-secondary float-left" @click="addingModal = false">Закрыть</button>
                <button type="button" :disabled="disable" class="btn btn-secondary float-right" @click="addUser">Прикрепить</button>
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
          titles: ["Имя", "Логин", "Код", "Адрес", "Пользователь", ""],
          keys: ["name", "userName", "code", "address", "storeUserName"],
          item: null,
          showModal: false,
          addingModal: false,
          disable: false,
          infoModal: false
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        },
        showAddUserModal: function(item) {
            this.item = Object.assign({}, item);
            this.addingModal = true;
        },
        callback: function(result) {
            this.disable = false;
            this.addingModal = false;
            if(result)
                this.infoModal = true;
            else
                this.showModal = true;

        },
        addUser: function() {
            if(this.item.userId == undefined){
                this.addingModal = false;
            }
            else {
                this.disable = true;
                let user = this.$store.getters.USER_BY_ID(this.item.userId);
                this.item.storeUserName = user.surname + ' ' + user.name;
                this.$store.dispatch('EDIT_CUSTOMER', {item: this.item, callback: this.callback});
            }
        }
    },
    mounted() {
        this.$store.dispatch('GET_CUSTOMERS');
        this.$store.dispatch('GET_USERS');
    },
    computed: {
        userList() {
            let data = this.$store.getters.USERS;
            if(!data) {
                this.showModal = true;
                return [];
            }
            else
                return data;
        },
        customerList() {
            let data = this.$store.getters.CUSTOMERS;
            if(!data) {
                this.showModal = true;
                return [];
            }
            else
                return data;
        }
    }
}

</script>