<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryParams.query" clearable @clear="getUsersList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList()">
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--  -->
             <el-table
                :data="users" border stripe
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="#"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <el-switch slot-scope="scope" v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" 
                        @click="updateUser(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"
                            @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryParams.pagenum"
                :page-sizes="[1,2,5,10]"
                :page-size="queryParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        
        <!-- 添加用户-对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        modal
        :close-on-click-modal="false"
        @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改-对话框 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="updateDialogVisible"
        width="50%"
        modal
        :close-on-click-modal="false">
        <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="updateForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="updateForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="updateForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateUserSubmit">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 删除对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%"
        modal
        :close-on-click-modal="false">
        <span>是否删除该用户？</span>
        <span slot="footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteUserSubmit">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog class="leftTextAlign"
        title="分配角色"
        :visible.sync="setRoleVisible"
        width="30%"
        >
        <p>当前用户：{{currentUserId}}</p>
        <p>当前角色：{{currentRole_name}}</p>
        <p>分配新角色：
            <template>
            <el-select v-model="currentRole_id" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>
            </template>
        </p>
        <span slot="footer">
            <el-button @click="setRoleVisible = false">取 消</el-button>
            <el-button type="primary" 
            @click="setUserRole">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        // 验证邮箱
        var checkEmail = (rule, value, callback) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regEmail.test(value)) {
                return callback()
            } else {
                return callback(new Error('邮箱格式错误'))
            }
        }
        // 验证手机号
        var CheckMobile = (rules, value, callback) => {
            const regMobile = /^1[3456789]\d{9}$/
            if (regMobile.test(value)) {
                return callback()
            } else {
                return callback(new Error('手机号格式错误'))
            }
        }
        return {
            queryParams: {
                query: '',
                // 当前页
                pagenum: 1,
                // 每页几条
                pagesize: 2
            },
            users: [],
            total: 0,
            // 控制添加对话框是否隐藏，默认隐藏
            addDialogVisible: false,
            addForm: {
                username: '',
                password:'',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [
                     { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在6-10字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '密码长度在6-18字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator: CheckMobile, trigger: 'blur'},
                ], 
            },
            // 修改对话框是否隐藏，默认隐藏
            updateDialogVisible: false,
            updateForm: {
                username: '',
                email: '',
                mobile: ''
            },
            updateId: 0,
            updateFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator: CheckMobile, trigger: 'blur'},
                ], 
            },
            deleteDialogVisible: false,
            deleteId: 0,
            setRoleVisible: false,
            currentUserId: 0,
            currentRole_name: '',
            options: [],
            // 已选中的
            currentRole_id: ''
        }
    },
    created () {
        this.getUsersList()
    },
    methods: {
        async getUsersList () {
            const { data:res } = await this.$http.get('users', { params: this.queryParams})
            if (res.meta.status !== 200) {
              return this.$message.error('获取用户列表失败！')
            }
            this.total = res.data.total
            this.users = res.data.users
        },
        // 监听每页几条
        handleSizeChange (val) {
            this.queryParams.pagesize = val
            // 每页几条变了，要重新发axios请求在页面按新的每页几条展示数据
            this.getUsersList()
        },
        // 监听 当前第几页
        handleCurrentChange (val) {
            this.queryParams.pagenum = val
            // console.log(`第 ${val} 页1`);
            this.getUsersList()
        },
        // 监听status变化，修改状态
        async userStateChanged (user) {
            const { data:res } = await this.$http.put('users/' + user.id + '/state/' + user.mg_state)
            if (res.meta.status !== 200) {
                user.mg_state = !user.mg_state
                return this.$message.error('修改状态失败！')
            }
            this.$message.success('更新状态成功！')
        },
        // 搜索框 以下API是根据id获取数据，我傻逼弄错了，这里@click直接就可以调用getUsersList()，根本不用再写一个，搜索框里的数据和data里的queryParams.query是双向绑定的
        // async queryData (query) {
        //     const { data:res } = await this.$http.get(`users/${query}`)
        // }
        addDialogClose () {
            this.$refs.addFormRef.resetFields();
        },
        addUser () {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return 
                const { data:res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) return this.$message.error('添加失败')
                this.$message.success('添加成功')
                this.addDialogVisible = false
                this.getUsersList()
            })
        },
        async updateUser (user) {
            this.updateDialogVisible = true
            const { data:res } = await this.$http.get(`users/${user.id}`)
            if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
            this.updateForm.username = res.data.username
            this.updateForm.email = res.data.email
            this.updateForm.mobile = res.data.mobile
            this.updateId = user.id
        },
        updateUserSubmit () {
            this.$refs.updateFormRef.validate(async valid => {
                if(!valid) return 
                const { data:res } = await this.$http.put("users/" + this.updateId, {email: this.updateForm.email, mobile: this.updateForm.mobile})
                if (res.meta.status !== 200) {
                    return this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                this.updateDialogVisible = false
                this.getUsersList()
            })
        },
        deleteUser (id) {
             this.deleteDialogVisible = true
             this.deleteId = id
             
        },
        async deleteUserSubmit () {
            const { data:res } = await this.$http.delete(`users/${this.deleteId}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.deleteDialogVisible = false
            this.getUsersList()
        },
        async setRole (user) {
            this.currentUserId = user.id
            this.currentRole_name = user.role_name
            // 下拉框里填充权限列表
            const { data:res } = await this.$http.get('roles')
            this.options = res.data
            // 当前角色的id
            const { data:res2 } = await this.$http.get('users/' + user.id)
            if(res.meta.status !== 200) {
                return this.$message.error('获取数据失败')
            }
            // this.currentRole_id = res2.data.role_id
            this.setRoleVisible = true
        },
        // 重新分配角色
        async setUserRole () {
            const { data:res } = await this.$http.put(`users/${this.currentUserId}/role`, {rid: this.currentRole_id})
            console.log(res);
            if(res.meta.status !== 200) {
                return this.$message.error('分配角色失败')
            }
            this.$message.success('分配角色成功')
            this.setRoleVisible = false
            this.getUsersList()
        }
    }
}
</script>

<style lang="less" scoped>
.leftTextAlign {
    text-align: left!important;
}
</style>
