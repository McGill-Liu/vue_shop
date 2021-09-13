<template>
<div class="login_container">
    <div class="box">
        <div class="logo">
            <img src="@/assets/logo.png" alt="">
        </div>
        <el-form ref="form" :model="formData" class="login_form" :rules="rules">
            <!-- name -->
            <el-form-item prop="username">
                <el-input v-model="formData.username" prefix-icon="el-icon-user-solid" class="form_input"></el-input>
            </el-form-item>
            <!-- password -->
            <el-form-item prop="password">
                <el-input placeholder="请输入密码" v-model="formData.password" show-password prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="onSubmit('form')">登录</el-button>
                <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return ;
        } else {
          const { data:res } = await this.$http.post('login', this.formData)
          if (res.meta.status === 200) {
            this.$message({
              showClose: true,
              message: '登陆成功',
              type: 'success'
            });
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message({
              showClose: true,
              message: '登陆失败',
              type: 'error'
            });
          }
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2A4A64;
    height: 100%;
}
.box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .logo {
        position: absolute;
        width: 130px;
        height: 130px;
        left: 50%;
        transform: translate(-50%,-50%);
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 3px #ddd;
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    float: right;
}
</style>
