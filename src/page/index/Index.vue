<template>
  <div>
    <a-page-header class="zhf-page-header" title="项目列表"/>
    <div class="zhf-context">
      <div class="zhf-search">
        <a-form-model :layout="`horizontal`" @submit="handleSearch"
          :model="param" class="zhf-search-form">
          <a-row :gutter="24">
            <a-col :span="8" :style="`block`">
              <a-form-model-item :label="`项目名称`">
                <a-input v-model="param.name" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" :style="`block`">
              <a-form-model-item :label="`所属行业`">
                <a-input v-model="param.industry" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" :style="`block`">
              <a-form-model-item :label="`会员昵称`">
                <a-input v-model="param.memberNickname" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" :style="`block`">
              <a-form-model-item :label="`会员手机号`">
                <a-input v-model="param.memberPhone" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" :style="`block`">
              <a-form-model-item :label="`状态`">
                <a-select v-model="param.examineStatus" placeholder="审核状态">
                  <a-select-option value="">
                    请选择
                  </a-select-option>
                  <a-select-option value="IN_EXAMINE">
                    审核中
                  </a-select-option>
                  <a-select-option value="EXAMINE_ADOPT">
                    审核通过
                  </a-select-option>
                  <a-select-option value="EXAMINE_NOT_ADOPT">
                    审核不通过
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'right' }">
              <a-button type="primary" html-type="submit">搜索</a-button>
              <a-button :style="{ marginLeft: '8px' }" >重置</a-button>
              <a :style="{ marginLeft: '8px', fontSize: '12px' }">
                收起 <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-table class="zhf-table" rowKey="id" :columns="columns" :data-source="data" 
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange">
        <template slot="examineStatus" slot-scope="text">
          <a-badge v-if="text === 'EXAMINE_ADOPT'" color="blue" text="审核通过" />
          <a-badge v-else-if="text === 'IN_EXAMINE'" color="green" text="审核中" />
          <a-badge v-else color="red" text="审核不通过" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <router-link :to="{ path:'/detail', query: {id: record.id} }">详情</router-link>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { PageHeader, FormModel, Row, Col, Table, Badge, Select } from 'ant-design-vue'
  import { list } from '@/services/project'

  Vue.use(PageHeader)
  Vue.use(FormModel)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Table)
  Vue.use(Badge)
  Vue.use(Select)

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '会员昵称',
      dataIndex: 'memberNickname',
      key: 'memberNickname'
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry'
    },
    {
      title: '营销者数量',
      dataIndex: 'marketingNum',
      key: 'marketingNum'
    },
    {
      title: '状态',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      scopedSlots: { customRender: 'examineStatus' }
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
    name: 'Index',
    data() {
      return {
        columns,
        data: [],
        pagination: {
          current: 1,
          defaultCurrent: 1,
          total: 0,
          pageSize: 10
        },
        expand: false,
        loading: true,
        param: {}
      }
    },
    methods: {
      initProjectList: function() {
        const param = this.getParam();
        this.getList(param);
      },

      /**
       * 获取参数
       */
      getParam: function() {
        const { param } = this;
        const params = {...param};
        return params;
      },

      /**
       * 添加分页参数
       */
      addPaginationParam: function(param, pagination) {
        param.currentPage = pagination.current;
        param.pageSize = pagination.pageSize;
      },

      /**
       * 搜索
       */
      handleSearch: function() {
        const param = this.getParam();
        this.addPaginationParam(param, this.pagination);
        this.getList(param);
      },

      /**
       * 分页加载
       */
      handleTableChange: function(pagination) {
        const param = this.getParam();
        this.addPaginationParam(param, pagination);
        this.getList(param);
      },

      /**
       * 获取项目列表数据
       */
      getList: function(param) {
        if (!this.loading) {
          this.loading = true;
        }
        list(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }

          const pagination = {
            current: param.currentPage,
            total: res.data.totalNum
          }
          this.pagination = pagination;
          this.data = res.data.dataList;
          this.loading = false;
        })
      }
    },
    created: function() {
      this.initProjectList();
    },
  }
</script>

<style lang="less">
  @import './index.less';
</style>