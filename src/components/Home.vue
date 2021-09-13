<template>
    <div class="div-container">
        <el-container class="top-container">
            <el-header class="header">
                <img src="@/assets/logo.png" alt="" class="header-img">
                <div class="header-title">电商后台管理系统</div>
                <el-button type="info" @click='loginOut' class="login-out">退出</el-button>
            </el-header>
            <el-container>
                <!-- 侧边区域 -->
                <el-aside :width="asideWidth">
                    <div class="collapseBtn" @click="openAndClose">|||</div>
                    <!-- 侧边栏菜单区域 -->
                    <el-menu text-color="#fff" background-color="#303440" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" mode="vertical" :collapse-transition="false" :router="true" :default-active="activePath">
                        <!-- 一级菜单+二级菜单整个的容器 -->
                        <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
                            <template slot="title" class="menu-title">
                                <i :class="iconJson[item.id]"></i>
                                <span slot="title">{{item.authName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/'+subItem.path" v-for="(subItem) in item.children" :key="subItem.id" @click="defaultActiveIndex('/'+subItem.path)">
                                <template slot="title"><i class="el-icon-menu"></i>{{subItem.authName}}</template>
                            </el-menu-item>      
                        </el-submenu>                      
                    </el-menu>
                </el-aside>
                <!-- 主区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

export default {
    data () {
        return {
            asideWidth: '200px',
            isCollapse: false,
            menuList: [],
            iconJson: {
                125: 'el-icon-user',
                103: 'el-icon-key',
                101: 'el-icon-chat-line-square',
                102: 'el-icon-truck',
                145: 'el-icon-s-marketing',
            },
            activePath: ''
        }
    },
    created () {
        this.getMenuList()
        this.activePath = sessionStorage.getItem('defaultActivePath')
    },
    methods: {
        loginOut () {
            sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList () {
            const { data:res } = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        openAndClose () {
            this.isCollapse = !this.isCollapse
            if(!this.isCollapse){
                this.asideWidth = '200px'
            } else {
                this.asideWidth = '64px'
            }
        },
        defaultActiveIndex (path){
            sessionStorage.setItem('defaultActivePath', path)
        }
    }
}
</script>

<style scoped>
.menu {
    /* background-color: #303440; */
}
.div-container,.top-container {
    height: 100%;
}
.el-header {
    background-color: #353C3C;
    color: #fff;
    text-align: center;
    position: relative;
}
.header .header-title {
    font-size: 24px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    left: 60px;
    position: absolute;
}
.header .header-img {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 0;
}
.header .login-out {
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translate(-50%, -50%);
}
.el-aside {
    background-color: rgb(48, 52, 64);
    color: #333;
    text-align: center;
}
  
.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
}
/* 侧边菜单栏 */
.el-menu {
    border-right: none;
}

.collapseBtn {
    width: 100%;
    height: 22px;
    line-height: 22px;
    color: #E9EEF3;
    background-color: #47505F;
    font-size: 14px;
    letter-spacing: .2em;
    cursor: pointer;
}
</style>
