<template>
  <div class="admin">
    <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'

export default {
  name: 'admin',
  components: {
    Menu
  }
}
</script>
