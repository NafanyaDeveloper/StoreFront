<template>
    <div class="tbl">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th v-for="i in headers">{{i}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items">
                    <slot v-bind:item="item" v-bind:index="index">Привет</slot>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
  name: 'Tbl',
  props: {
      headers: {
        type: Array,
        required: true,
        },
    items: {
        type: Array,
        required: true,
        }
    },

}
</script>
