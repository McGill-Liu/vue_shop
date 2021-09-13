<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片-内容 -->
        <el-card class="box-card">
            <el-table
            :data="rolesList" border
            style="width: 100%">
            <el-table-column
                width="50"
                type="expand">
                <template slot-scope="scope">
                    <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['boder_bottom', index==0?'boder_top':'', 'vcenter']">
                        <!-- 第一列 -->
                        <el-col :span="6">
                            <el-tag closable @close="removeRightById(scope.row, item.id)">{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 第二列-循环第二层 -->
                        <el-col :span="18">
                            <el-row v-for="item2,index2 in item.children" :key="item2.id" :class="[index2==0?'':'boder_top', 'vcenter']">
                                <!-- 第一列，放二层循环的值 -->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>   
                                <!-- 第二列 -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="item3,index3 in item2.children" :key="item3.id" closable
                                    @close="removeRightById(scope.row, item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                        
                    </el-row>
                    <pre>{{scope.row}}</pre>
                </template>
            </el-table-column>
            <el-table-column
                type="index"
                label="#"
                width="50">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述"
                width="180">
            </el-table-column>
            <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限-对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="showSetRightDialogVisible"
        width="30%"
        @close="closeSetRightDialog">
        <!-- 分配权限tree -->
        <el-tree :data="rightListTree" :props="roleProps" show-checkbox default-expand-all :default-checked-keys="defaultRightList" node-key="id"
        ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            rolesList: [],
            showSetRightDialogVisible: false,
            rightListTree: [],
            roleProps: {
                children: 'children',
                label: 'authName'
            },
            defaultRightList: [],
            currentRoleId: 0
        }

    },
    created () {
        this.getRolesList()
    },
    methods: {
        async getRolesList () {
            const { data:res } = await this.$http.get('/roles')
            if(res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            this.rolesList = res.data
        },
        async removeRightById (role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm') {
                return this.$message.warning('取消了删除')
            }
            const { data:res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
            if(res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            role.children = res.data
        },
        async showSetRightDialog (role) {
            const { data:res } = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) {
                return this.$message.error('获取权限列表失败')
            }
            this.rightListTree = res.data
            // 通过递归，获得当前角色的三级权限id列表
            this.getLeafKeys(role, this.defaultRightList)
            this.showSetRightDialogVisible = true
            // 记录当前role的id
            this.currentRoleId = role.id
        },
        getLeafKeys (node, arr) {
            // 当前node不包含children，就是第三级权限
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        closeSetRightDialog () {
            this.defaultRightList = []
        },
        async allotRights () {
            const keys = [...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()]
            const keysStr = keys.join(',')
            const { data:res } = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids:keysStr })
            if(res.meta.status !== 200) {
                return this.$message.error('授权失败')
            }
            this.showSetRightDialogVisible = false
            this.getRolesList()
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 10px 0;
}
.boder_top {
    border-top: 1px solid #ddd;
}
.boder_bottom {
    border-bottom: 1px solid #ddd;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
