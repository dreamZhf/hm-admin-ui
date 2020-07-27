<template>
  <div class="login-div">
    <div class="login">
      <div class="login-title">
        <img class="login-logo" src="../../assets/logo.svg" />
        <label class="login-title">行脉云后台管理</label>
      </div>
      <div class="login-form">
        <a-form-model layout="horizontal" ref="loginForm"
          :rules="rules"
          :model="formInline" @submit="handleSubmit" @submit.native.prevent>
            <a-form-model-item ref="username" prop="username">
              <a-input v-model="formInline.username" placeholder="Username">
                <a-icon slot="prefix" type="user" style="color:rgb(24, 144, 255)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input v-model="formInline.password" type="password" placeholder="Password">
                <a-icon slot="prefix" type="lock" style="color:rgb(24, 144, 255)" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                type="primary"
                html-type="submit"
                block
              >
                登录
              </a-button>
            </a-form-model-item>
          </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { FormModel } from 'ant-design-vue'
  import { login } from '@/services/login'
  Vue.use(FormModel);

  export default {
    name: 'Login',
    data() {
      return {
        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ]
        },
        formInline: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      handleSubmit() {
        const _this = this;
        this.$refs.loginForm.validate(valid => {
          if (!valid) {
            return false;
          }
          login(this.formInline).then(res => {
            if (res.errCode !=='1') {
              return;
            }
            localStorage.setItem('token', res.data.token)
            _this.$router.push('/index');
          });
        })
      }
    }
  }
</script>

<style lang="less">
  @import './login.less';
</style>