<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Store</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link v-if="!isManager" to="/home/items" class="nav-link" exact>Товары</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="isManager" to="/admin/items" class="nav-link" exact>Товары</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="!isManager" to="/home/orders" class="nav-link" exact>Заказы</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="isManager" to="/admin/orders" class="nav-link" exact>Заказы</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="!isManager" to="/home/cart" class="nav-link" exact>Корзина</router-link>
      </li>
      <li v-if="isManager"   class="nav-item">
        <router-link to="/admin/users" class="nav-link" exact>Пользователи</router-link>
      </li>
      <li v-if="isManager"   class="nav-item">
        <router-link to="/admin/customers" class="nav-link" exact>Заказчики</router-link>
      </li>
    </ul>
  </div>
  <ul class="navbar-nav">
    <li class="nav-item float-right" @click="logout">
          <a class="nav-link" href="#">Выйти</a>
    </li>
  </ul>
</nav>
</template>

<style scoped>
  a{
    color: white;
  }
</style>

<script>
export default {
  name: 'Menu',
  methods: {
    logout: function() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      localStorage.removeItem('cart');
      window.location.reload();
    }
  },
  computed:{
    isManager() {
      return localStorage.getItem('role') == "manager";
    }
  }
}
</script>


