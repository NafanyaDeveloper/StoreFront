<template>
  <div class="register">
    <div class="container mt-5">
        <h4>Регистрация</h4>
        <div class="row">
            <div class="col-0 col-sm-1 col-md-3"></div>
            <form class="mt-5 col-12 col-sm-10 col-md-6">
                <div class="form-group">
                    <label for="login" >Логин</label>
                    <input class="form-control" id="login" v-model="login" required autofocus placeholder="Логин">
                    <small id="passwordHelpInline" class="text-muted" v-if="loginAlert">
                        Логин должен быть не менее 3х символов
                    </small>
                </div>
                <div class="form-group">
                    <label for="name" >Имя</label>
                    <input class="form-control" id="name" v-model="name" required autofocus placeholder="Имя">
                    <small id="passwordHelpInline" class="text-muted" v-if="nameAlert">
                        Имя должно быть не менее 2х символов
                    </small>
                </div>
                <div class="form-group">
                    <label for="address" >Адрес</label>
                    <input class="form-control" id="address" v-model="address" required autofocus placeholder="Адрес">
                </div>
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input id="password" type="password" v-model="password" required class="form-control" placeholder="Пароль">
                    <small id="passwordHelpInline" class="text-muted" v-if="passwordAlert">
                        Пароль должен быть длиной от 6 символов
                    </small>
                </div>
                <button type="submit" :disabled="disable" class="btn btn-primary mt-3" @click="handleSubmit">Зарегистрироваться</button>
                <div class="mt-3">
                    <router-link to="/login">Есть аккаунт</router-link>
                </div>
            </form>
            <div class="col-0 col-sm-1 col-md-3"></div>
        </div>
    </div>
    <modal v-if="showModal">
            <h3 slot="header">Ошибка</h3>
            <p slot="body">Что-то пошло не так. Проверьте ваши данные.</p>
            <div slot="footer" class="d-inline w-100">
                <button type="button" class="btn btn-secondary float-right" @click="showModal=false">Закрыть</button>
            </div>
    </modal>
  </div>
</template>

<script>
import axios from 'axios';
import {BASE_URL} from '@/settings.js'
import VueJwtDecode from 'vue-jwt-decode'
import modal from '@/components/Modal.vue'

  export default {
    components: {
        modal
    },
    data(){
      return {
        login : "",
        password : "",
        name: "",
        address: "",
        nameAlert: false,
        passwordAlert: false,
        loginAlert: false,
        disable: false,
        showModal: false
      }
    },
    methods : {
        reload: function() {
            window.location.reload();
        },
        validate: function() {
            let valid = true;
            if (this.password.replace(/\s+/g, '').length < 6) {
                this.passwordAlert = true;
                valid = false;
            }
            else
                this.passwordAlert = false;
            if (this.login.replace(/\s+/g, '').length < 3) {
                this.loginAlert = true;
                valid = false;
            }
            else
                this.loginAlert = false;
            if (this.name.replace(/\s+/g, '').length < 2) {
                this.nameAlert = true;
                valid = false;
            }
            else
                this.nameAlert = false    
            return valid;
        },
        handleSubmit(e){
            e.preventDefault();
            if(this.validate()){
                this.disable = true;
                axios.post(BASE_URL + 'register', {
                    userName: this.login,
                    password: this.password,
                    name: this.name,
                    address: this.address
                })
                .then(response => {
                        let role = VueJwtDecode.decode(response.data)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                        localStorage.setItem('role', role)
                        localStorage.setItem('jwt', response.data)
                        if (role == "manager")
                            this.$router.push('/admin');
                        else
                            this.$router.push('/home');
                        this.disable = false;
                    })
                .catch(error => {
                        this.disable = false;
                        this.showModal = true;
                    })
        }
      }
    }
  }
</script>