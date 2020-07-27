<template>
  <div id="app" style="width:100%;height:100%">
    <router-view v-if="$route.meta.login" />
    <zhf-Layout v-else>
      <router-view />
    </zhf-Layout>
  </div>
</template>

<script>
import Vue from 'vue'
import Layout from '@/components/layout/index'
Vue.component('zhf-Layout',Layout);
export default {
  name: 'App',
}
</script>
