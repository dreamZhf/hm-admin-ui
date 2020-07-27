<template>
  <div>
    <a-page-header class="zhf-page-header" 
      :breadcrumb="{ props: { routes } }"
      :title="`项目名称:` + project.name">
      <template slot="extra" v-if="project.examineStatus === 'IN_EXAMINE'">
        <a-button key="0" type="primary" @click="examineAdopt">
          通过
        </a-button>
        <a-button key="1" type="primary" @click="examineFail">
          不通过
        </a-button>
      </template>

      <a-descriptions size="small" :column="3" class="project-info">
        <a-descriptions-item label="项目logo">
          <img :src="project.logo" class="project-logo" />
        </a-descriptions-item>
        <a-descriptions-item label="项目行业"> {{ project.industry }} </a-descriptions-item>
        <a-descriptions-item label="状态">
          <label v-if="project.examineStatus === 'EXAMINE_ADOPT'">审核通过</label>
          <label v-else-if="project.examineStatus === 'IN_EXAMINE'">审核中</label>
          <label v-else>审核不通过</label>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ project.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="项目描述">
          {{ project.des }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <div class="zhf-page-wrap-content">
      <a-card title="用户信息" :bordered="false" class="zhf-msg-card">
        <a-descriptions :column="4" class="project-info">
          <a-descriptions-item label="昵称">{{ memberInfo.nickname }}</a-descriptions-item>
          <a-descriptions-item label="真实姓名"> {{ memberInfo.realName }} </a-descriptions-item>
          <a-descriptions-item label="身份证">{{ memberInfo.idCode }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ memberInfo.phone }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card title="审核内容" :bordered="false" class="zhf-msg-card" 
        v-if="project.examineStatus !== 'EXAMINE_ADOPT'">
        <a-descriptions title="项目基本信息" :column="3" class="project-info">
          <a-descriptions-item label="项目logo">
            <img :src="baseInfo.logo" class="project-logo" />
          </a-descriptions-item>
          <a-descriptions-item label="项目名称"> {{ baseInfo.name }} </a-descriptions-item>
          <a-descriptions-item label="行业名称"> {{ baseInfo.industry }} </a-descriptions-item>
          <a-descriptions-item label="项目介绍"> {{ baseInfo.des }} </a-descriptions-item>
        </a-descriptions>
        <h3 style="margin-top: 20px">营销消息</h3>
        <a-card
          :tab-list="marketingMsgTabList"
          :active-tab-key="examineActiveMarketingMsgTabKey"
          @tabChange="key => switchExamineMarketing(key)"
          :bordered="false">
            <a-descriptions :column="1">
              <a-descriptions-item v-for="(item, index) in examineMarketingMsg[examineActiveMarketingMsgTabKey]" 
                :key="item.id">
                <template v-if="item.type === 'IMAGE'">
                  {{ index + 1 }}. <img :src="item.content" style="width: 100px" />
                </template>
                <template v-else>
                  {{ index + 1 }}. {{ item.content }}
                </template>
              </a-descriptions-item>
            </a-descriptions>
        </a-card>
      </a-card>
      <a-card title="营销消息" 
        :tab-list="marketingMsgTabList"
        :active-tab-key="activeMarketingMsgTabKey"
        @tabChange="key => switchMarketing(key)"
        :bordered="false" class="zhf-msg-card">
          <a-descriptions :column="1">
            <a-descriptions-item v-for="(item, index) in marketingMsg[activeMarketingMsgTabKey]" 
              :key="item.id">
              <template v-if="item.type === 'IMAGE'">
                {{ index + 1 }}. <img :src="item.content" style="width: 100px" />
              </template>
              <template v-else>
                {{ index + 1 }}. {{ item.content }}
              </template>
            </a-descriptions-item>
          </a-descriptions>
      </a-card>
    </div>

    <a-modal
      title="不通过的理由"
      :visible="visibleFailModal"
      cancelText="取消"
      okText="确定"
      @ok="submitFail"
      @cancel="cancel"
    >
      <a-textarea v-model="reason" rows="4" />
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { PageHeader, Descriptions, Card, Tabs, Modal } from 'ant-design-vue'
  import { detail, examineDetail, memberInfoByProjectId, examineAdopt, examineFail} from '@/services/project'

  Vue.use(PageHeader)
  Vue.use(Card)
  Vue.use(Tabs)
  Vue.use(Descriptions)
  Vue.use(Modal)


  const routes = [
    {
      path: '/index',
      breadcrumbName: '项目列表',
    },
    {
      breadcrumbName: '项目详情',
    },
  ]

  export default {
    name: 'Detail',
    data() {
      return {
        routes,
        project: {},
        baseInfo: {},
        memberInfo: {},
        marketingMsg: {},
        activeMarketingMsgTabKey: null,
        marketingMsgTabList: [],
        examineMarketingMsg: {},
        examineActiveMarketingMsgTabKey: null,
        visibleFailModal: false,
        reason: null,
        loading: true,
      }
    },
    methods: {

      /**
       * 切换营销消息
       */
      switchMarketing: function(key) {
        this.activeMarketingMsgTabKey = key;
      },

      /**
       * 切换营销消息
       */
      switchExamineMarketing: function(key) {
        this.examineActiveMarketingMsgTabKey = key;
      },

      init: function() {
        this.getProjectDetail();
        this.getMemberInfo();
      },

      /**
       * 获取项目详情
       */
      getProjectDetail: function() {
        const param = {
          id: this.$route.query.id
        }
        detail(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.project = res.data;
          if (res.data.examineStatus !== 'EXAMINE_ADOPT') {
            this.getExamineDetail(param);
          }

          const { marketingList } = this.project;
          if (marketingList) {
            const marketingMsgTabList = [];
            const marketingMsg = {};
            let activeMarketingMsgTabKey;
            marketingList.forEach(marketing => {
              if (!activeMarketingMsgTabKey) {
                activeMarketingMsgTabKey = marketing.time
              }
              marketingMsgTabList.push({
                key: marketing.time,
                tab: marketing.time,
              })
              marketingMsg[marketing.time] = marketing.msgList
            });
            this.marketingMsgTabList = marketingMsgTabList;
            this.activeMarketingMsgTabKey = activeMarketingMsgTabKey;
            this.marketingMsg = marketingMsg;
          }
        })
      },

      /**
       * 获取审核详情
       */
      getExamineDetail: function(param) {
        examineDetail(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.baseInfo = res.data.baseInfo;
          const { marketingList } = res.data;
          if (marketingList) {
            const marketingMsg = {};
            let activeMarketingMsgTabKey;
            marketingList.forEach(marketing => {
              if (!activeMarketingMsgTabKey) {
                activeMarketingMsgTabKey = marketing.time
              }
              marketingMsg[marketing.time] = marketing.msgList
            });
            this.examineActiveMarketingMsgTabKey = activeMarketingMsgTabKey;
            this.examineMarketingMsg = marketingMsg;
          }
        })
      },

      /**
       * 获取会员信息
       */
      getMemberInfo: function() {
        const param = {
          projectId: this.$route.query.id
        }
        memberInfoByProjectId(param).then(res => {
          this.memberInfo = res.data;
        })
      },

      /**
       * 审核通过
       */
      examineAdopt: function() {
        const param = {
          projectId: this.$route.query.id
        }
        examineAdopt(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.$message.success('审核已通过');
          this.init();
        })
      },

      /**
       * 审核不通过
       */
      examineFail: function() {
        this.visibleFailModal = true;
      },

      /**
       * 提交审核不通过
       */
      submitFail: function() {
        const param = {
          projectId: this.$route.query.id,
          reason: this.reason
        }
        examineFail(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.$message.success('操作成功');
          this.visibleFailModal = false;
          this.init();
        })
      },

      /**
       * 取消
       */
      cancel: function() {
        this.visibleFailModal = false;
      }
    },

    created: function() {
      this.init();
    },
  }
</script>

<style lang="less">
  @import './index.less';
</style>