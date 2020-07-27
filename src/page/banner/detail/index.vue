<template>
  <div>
    <a-page-header class="zhf-page-header" title="Banner图片列表"/>
    <div class="zhf-context zhf-page-content">
      <a-button type="primary" style="margin-bottom: 16px;" @click="showModal"> 添加图片 </a-button>
      <a-table class="zhf-table" rowKey="id" 
        :pagination="false"
        :columns="columns" :data-source="data" 
        :loading="loading">
        <template slot="imageRander" slot-scope="text">
          <img :src="text" style="width: 100px" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:void(0)" @click="() => deleteBannerImage(record.id)">删除</a> |
          <a href="javascript:void(0)" @click="() => editBannerImage(record)">编辑</a>
        </template>
      </a-table>
    </div>

    <a-modal v-model="visible" 
      cancelText="取消" okText="确定"
      title="添加banner图" @ok="handleOk">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="上传banner">
          <a-upload
            name="file"
            :action="action"
            :default-file-list="fileList"
            :file-list="fileList"
            :data="uploadParam"
            :before-upload="beforeUpload"
            :remove="removeImage"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 上传banner </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="url">
          <a-input v-model="form.url" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import { PageHeader, Table, Modal, Upload, FormModel } from 'ant-design-vue'
  import { getPolicy } from '@/services/oss'
  import { detail, addBannerImage, deleteBannerImage, editBannerImage } from '@/services/banner'


  Vue.use(PageHeader)
  Vue.use(Table)
  Vue.use(Modal)
  Vue.use(Upload)
  Vue.use(FormModel)

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      scopedSlots: { customRender: 'imageRander' },
    },
    {
      title: 'url',
      dataIndex: 'url',
      key: 'url'
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
    name: 'BannerDetail',
    data() {
      return {
        columns,
        data: [],
        visible: false,
        loading: true,
        form: {},
        fileList: [],
        bannerImageId: null,
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
        action: null,
        uploadParam: {},
        tempImage: null,
        image: null,
      }
    },
    methods: {

      getDetail: function() {
        if (!this.loading) {
          this.loading = true;
        }
        const param = {
          id: this.$route.query.id
        }
        detail(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.data = res.data;
          this.loading = false;
        })
      },

      showModal: function() {
        // this.getOss();
        this.fileList = []
        this.visible = true
        this.bannerImageId = null
      },

      /**
       * 确定添加
       */
      handleOk: function() {
        const param = {
          bannerId: this.$route.query.id,
          image: this.image,
          url: this.form.url
        }
        if (!param.image) {
          this.$message.error("请上传Banner图")
          return;
        }
        if (this.bannerImageId) {
          // 编辑
          param.id = this.bannerImageId
          editBannerImage(param).then(res => {
            if (res.errCode !=='1') {
              return;
            }
            this.visible = false;
            this.$message.success('修改成功!');
            this.image = null;
            this.getDetail();
          })
        } else {
          addBannerImage(param).then(res => {
            if (res.errCode !=='1') {
              return;
            }
            this.visible = false;
            this.$message.success('添加成功!');
            this.image = null;
            this.getDetail();
          })
        }
      },

      /**
       * 删除 banner图片
       */
      deleteBannerImage: function(id) {
        const param = {
          bannerImageId: id
        }
        deleteBannerImage(param).then(res => {
          if (res.errCode !=='1') {
            return;
          }
          this.$message.success('删除成功!');
          this.getDetail();
        })
      },

      editBannerImage: function(record) {
        this.bannerImageId = record.id;
        const array = record.image.split('/');
        const fileList = [
          {
            uid: record.id,
            name: array[array.length - 1],
            status: 'done',
            url: record.image,
            thumbUrl: record.image
          }
        ]
        this.fileList = fileList;
        this.visible = true;
        this.form.url = record.url;
        this.image = record.image
      },

      handleChange: function(info) {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = fileList;
        if (info.file.status === 'done') {
          this.image = this.tempImage;
        }
      },

      beforeUpload: async function(file) {
        const fileArray = file.name.split('.');
        const time = new Date().getTime();
        await getPolicy().then(res => {
            const todayKey = moment().format('YYYYMMDD');
            const uploadParam = {
              key: 'banner/' + todayKey + '/' + time + '.' + fileArray[1],
              policy: res.policy,
              OSSAccessKeyId: res.accessid,
              success_action_status: '200',
              signature: res.signature
            }
            this.action = res.host;
            this.uploadParam = uploadParam;
            this.tempImage = res.host + "/" + uploadParam.key;
          })
        return true;
      },

      removeImage: function() {
        this.image = null;
      }
    },

    created: function() {
      this.getDetail();
    },
  }
</script>

<style lang="less">
  @import './index.less';
</style>