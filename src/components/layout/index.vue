<template>
  <a-layout id="zhf-layout">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible width="256">
      <div class="logo">
        <a>
          <img src="../../assets/logo.svg" />
          <h1>行脉云后台管理</h1>
        </a>
      </div>
      <a-menu style="width:100%; padding: 16px 0;" 
        theme="dark" mode="inline" :default-selected-keys="[key]">
        <a-menu-item key="index">
          <router-link to="/index">
            <a-icon type="user" />
            <span>项目列表 </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="bannerList">
          <router-link to="/banner/list">
            <a-icon type="video-camera" />
            <span>banner列表</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout id="zhf-right-context">
      <a-layout-header class="zhf-layout-header">
        <div class="zhf-header-left">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        <div class="zhf-header-right">
          <a-tooltip>
            <template slot="title">
              退出登录
            </template>
            <a-icon 
              class="trigger"
              type="logout"
              @click="() => logout()" />
          </a-tooltip>
        </div>
      </a-layout-header>
      <a-layout-content>
        <slot></slot>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Hm Admin ©2020 Created by zhf UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  import Vue from 'vue'
  import {Layout, Menu, Tooltip } from 'ant-design-vue'
  Vue.use(Layout)
  Vue.use(Menu)
  Vue.use(Tooltip)

  export default {
    name: 'Layout',
    data() {
      return {
        key: localStorage.getItem('activeKey'),
        collapsed: false
      }
    },
    methods: {
      logout: function() {
        localStorage.removeItem('token');
        this.$router.push('/');
      }
    }
  }
</script>

<style lang="less">
  @import './index.less';
</style>