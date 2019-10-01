<template>
    <div class="user">
        <div class="container">
            <button type="button" class="btn btn-secondary float-right mt-3 mb-2" :disabled="disable" @click="showEditModal()">Добавить</button>
            <Tbl :headers="titles" :items="userList">
                <template v-slot:default="slotProps">
                    <td>
                        {{slotProps.index + 1}}
                    </td>
                    <td v-for="i in keys">
                        {{slotProps.item[i]}}
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary" :disabled="disable" @click="showEditModal(slotProps.item)">Изменить</button>
                    </td>
                    <td>
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
        <modal v-if="deleteModal" @close="deleteModal = false">
            <h3 slot="header">Удаление</h3>
            <div slot="body">
                <p>Вы действительно хотите удалить пользователя {{item.surname}} {{item.name}}?</p>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-left" @click="deleteModal = false">Нет</button>
                <button type="button" class="btn btn-secondary float-right" @click="deleteUser">Да</button>
            </div>
        </modal>
        <modal v-if="editModal" @close="editModal = false">
            <h3 slot="header">Редактирование товара</h3>
            <div slot="body">
                <form>
                    <div class="form-group">
                        <label for="name" >Имя</label>
                        <input class="form-control" id="name" v-model="item.name" required autofocus>
                        <small id="passwordHelpInline" class="text-muted" v-if="nameAlert">
                            Имя должно быть не меньше 2х символов
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="surname" >Фамилия</label>
                        <input class="form-control" id="name" v-model="item.surname" required>
                        <small id="passwordHelpInline" class="text-muted" v-if="surnameAlert">
                            Фамилия должна быть не меньше 2х символов
                        </small>
                    </div>
                </form>
            </div>
            
            <div slot="footer" class="d-inline w-100">
                <button type="button" :disabled="disable" class="btn btn-secondary float-left" @click="editModal = false">Закрыть</button>
                <button type="button" v-if="isEdit" :disabled="disable" class="btn btn-secondary float-right" @click="editUser">Изменить</button>
                <button type="button" v-if="!isEdit" :disabled="disable" class="btn btn-secondary float-right" @click="createUser">Создать</button>
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
          titles: ["Имя", "Фамилия", "", ""],
          keys: ["name", "surname"],
          item: null,
          showModal: false,
          editModal: false,
          deleteModal: false,
          nameAlert: false,
          surnameAlert: false,
          disable: false,
          infoModal: false,
          isEdit: true
      }
    },
    methods: {
        reload: function() {
            window.location.reload();
        },
        showEditModal: function(item) {
            if(item == undefined)
            {
                this.item = {
                    name: "",
                    surname: "",
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
            if (this.item.name == undefined || this.item.name.replace(/\s+/g, '').length < 2) {
                this.nameAlert = true;
                valid = false;
            }
            else
                this.nameAlert = false;
            if (this.item.surname == undefined || this.item.surname.replace(/\s+/g, '').length < 2) {
                this.surnameAlert = true;
                valid = false;
            }
            else
                this.surnameAlert = false;    
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
        deleteCallback: function(result) {
            this.disable = false;
            this.deleteModal = false;
            this.editModal = false;
            if(result){
                this.infoModal = true;
                this.$store.commit('REMOVE_USER_FROM_CUSTOMERS', this.item.id);
            }
            else
                this.showModal = true;

        },
        editUser: function() {
            if(this.validate()){
                this.disable = true;
                this.$store.dispatch('EDIT_USER', {item: this.item, callback: this.callback});
            }
        },
        createUser: function() {
            if(this.validate()){
                this.disable = true;
                this.$store.dispatch('CREATE_USER', {item: this.item, callback: this.callback});
            }
        },
        deleteUser: function() {
            this.disable = true;
            this.$store.dispatch('DELETE_USER', {id: this.item.id, callback: this.deleteCallback});
        }
    },
    mounted() {
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
        }
    }
}

</script>