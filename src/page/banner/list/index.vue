<template>
  <div>
    <a-page-header class="zhf-page-header" title="Banner列表"/>
    <div class="zhf-context zhf-page-content">
      <a-table class="zhf-table" rowKey="id" 
        :pagination="false"
        :columns="columns" :data-source="data" 
        :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <router-link :to="{ path:'/banner/detail', query: {id: record.id} }">详情</router-link>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { PageHeader, Table } from 'ant-design-vue'
  import { list } from '@/services/banner'

  Vue.use(PageHeader)
  Vue.use(Table)

  const columns = [
    {
      title: 'Banner名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'BannerCode',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'operation',
      scopedSlots: { customRender: 'operation' },
    }
  ]

  export default {
    name: 'BannerList',
    data() {
      return {
        columns,
        data: [],
        loading: true,
        param: {}
      }
    },
    methods: {
      getList: function() {
        if (!this.loading) {
          this.loading = true;
        }
        list().then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.data = res.data;
          this.loading = false;
        })
      }
    },
    created: function() {
      this.getList();
    },
  }
</script>

<style lang="less">
  @import './index.less';
</style>