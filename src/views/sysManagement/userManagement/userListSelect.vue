<template>
    <div class="filter-container">
        <el-dialog
        :visible.sync="dialogVisible" 
        :modal="true"
        :fullscreen="false"
        center
        v-if="visible"
        destroy-on-close
        title="选择用户"
        width="900px">
            <el-form
                :model="filterUserParam"
                :inline="true"
                :hide-required-asterisk="true"
                label-width="50px">
                <el-form-item
                label="工号:"
                prop="jobNumber">
                <el-input
                    v-model="filterUserParam.jobNumber"
                    clearable
                    size="mini"
                    style="width:150px;" 
                    @keyup.enter.native="searchUser()"/>
                </el-form-item>
                <el-form-item
                label="姓名:"
                prop="fullName">
                <el-input
                    v-model="filterUserParam.fullName"
                    clearable
                    size="mini"
                    style="width:130px;" 
                    @keyup.enter.native="searchUser()"/>
                </el-form-item>
                <el-form-item
                label="部门:"
                prop="deptName">
                <el-input
                    v-model="filterUserParam.deptName"
                    clearable
                    size="mini"
                    style="width:150px;" 
                    @keyup.enter.native="searchUser()"/>
                </el-form-item>
                <el-form-item>
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-search"
                    @click="searchUser()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="userDataList"
                v-loading="loading"
                ref="userDataTable"
                :header-cell-style="{background: 'rgb(222, 223, 224)'}"
                style="width:100%;margin-bottom:20px"
                border
                :highlight-current-row="!multiply"
                @current-change="handleCurrentChange"
                @select="selectDatas"
                @select-all="selectAll"
                >
                <el-table-column type="selection"  
                :show-overflow-tooltip="true"
                v-if="multiply"
                width="40">
                </el-table-column>

                <el-table-column
                type="index"
                prop="username"
                label="用户名"
                width="75"
                align="center" />

                <el-table-column
                prop="jobNumber"
                label="工号"
                width="140"
                align="center" />

                <el-table-column
                prop="fullName"
                label="姓名"
                width="140"
                align="center" />

                <el-table-column
                prop="deptName"
                show-overflow-tooltip
                label="部门"
                width="auto"
                align="center" />

                <el-table-column
                prop="status"
                label="状态"
                width="auto"
                align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                prop="updateTime"
                label="修改时间"
                width="auto"
                align="center">
                </el-table-column>
            </el-table>
            <span v-show="selectionData.length != 0">已选用户：</span>
            <el-tag v-for="item in selectionData" 
                :key="item.jobNumber" 
                closable @close="closeSelectionData(item)">{{item.fullName}}</el-tag>&nbsp;&nbsp;&nbsp;
            <el-pagination
                :current-page="pageParamUser.currentPageUser"
                :page-sizes="pageParamUser.pageSizesUser"
                :page-size="pageParamUser.pageSizeUser"
                :total="totalUser"
                class="pagination-container"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeUser"
                @current-change="currentPageChangeUser" />
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-check"
                    @click="saveUsers()">确认</el-button>
                <el-button size="mini" 
                    type="info" 
                    icon="el-icon-close"
                    @click="closeUsersModel">取消</el-button>
            </div>
        
        </el-dialog>
    </div>
</template>

<script>
import * as Constant from '@/utils/constant.js'
export default {
    name: 'UserList',
    props: {
        visible: Boolean,
        userDataList: Array,
        totalUser: Number,
        multiply: Boolean
    },
    data() {
        return {
            dialogVisible: false,
            //新增人员时搜索表单
            filterUserParam: {
                fullName: null,
                jobNumber: null,
                deptName: null
            },
            //选择用户多选框
            selectionData : [],
            //用户分页对象
            pageParamUser : {
                pageSizesUser: [5, 10],
                pageSizeUser: 5,
                currentPageUser: 1,
            },
            //当前页
            currentPage: 1,
            pageSize: 10,
            pageSizes: Constant.pageSizes,
            total: 0,
            loading: false,
        }
    },
    created() {
        this.dialogVisible = JSON.parse(JSON.stringify(this.visible));
    },
    watch: {
        dialogVisible(val){
            if(!val){
                this.$emit("closeUserModal")
            }
        }
    },
    methods: {
        // 切换分页，自动勾选table数据
        defaultSelectTable(){
            var temp = {};
            for(var x=0;x<this.selectionData.length;x++){
                temp[this.selectionData[x].jobNumber] = 1;
            }
            this.$nextTick(()=>{
                for(var i=0;i<this.userDataList.length;i++){
                    if(temp[this.userDataList[i].jobNumber] == 1){
                        this.$refs.userDataTable.toggleRowSelection(this.userDataList[i]);
                    }
                }
            }); 
        },
        /**
         * 搜索用户
         */
        searchUser(){
            var query = {
                pageSize: this.pageParamUser.pageSizeUser,
                pageNum: this.pageParamUser.currentPageUser,
                fullName: this.filterUserParam.fullName,
                jobNumber: this.filterUserParam.jobNumber,
                deptName: this.filterUserParam.deptName,
                roleId : this.roleId ? this.roleId : null,
            }
            this.$emit("loadUserDatas", query, (res)=>{
                this.defaultSelectTable();
            });
        },
        //单选事件
        selectDatas(objs){
            //先移除
            var isDel = false;
            var curUser = [];
            for(let a  = 0; a < this.selectionData.length; a++){
                for(let i=0;i<this.userDataList.length;i++){
                    if(this.selectionData[a].jobNumber == this.userDataList[i].jobNumber){
                        isDel = true;
                    }
                }
                if(!isDel){
                    curUser.push(this.selectionData[a]);
                }
                isDel = false;
            }
            this.selectionData = curUser
            //重新增加
            let data  = objs
            let users = this.selectionData
            let flag = false
            for(let i = 0; i < data.length; i++){
                for(let a  = 0; a < users.length; a++){
                    if(data[i].jobNumber === users[a].jobNumber){
                        flag = true
                        continue
                    }
                }
                if(!flag){

                    this.selectionData.push(data[i])
                }
                flag = false
            }
        },
        selectAll(all){
            var tempData={};
            for(let i = 0; i < this.selectionData.length; i++){
                tempData[this.selectionData[i].jobNumber]=1;
            }
            if(all.length > 0){
                //全选则新增
                for(let a  = 0; a < all.length; a++){
                if(tempData[all[a].jobNumber] !== 1){
                    this.selectionData.push(all[a])
                }
                } 
            }else{ //反选则移除
                var flag = false;
                var curUser = [];
                for(let a  = 0; a < this.selectionData.length; a++){
                    for(let i=0;i<this.userDataList.length;i++){
                        if(this.selectionData[a].jobNumber == this.userDataList[i].jobNumber){
                        flag = true;
                        }
                    }
                    if(!flag){
                        curUser.push(this.selectionData[a]);
                    }
                    flag = false;
                }
                this.selectionData = curUser
            }
        },
        /**
         * 清除掉已选择的数据
         */
        closeSelectionData(value){
            for(var i=0;i<this.userDataList.length;i++){
                if(this.userDataList[i].jobNumber == value.jobNumber){
                    this.$refs.userDataTable.toggleRowSelection(this.userDataList[i],false);
                }
            }
            this.selectionData.splice(this.selectionData.indexOf(value),1);
        },
        /**
         * 分页功能 - 检测当前User页变化
         */
        currentPageChangeUser(val) {
            this.pageParamUser.currentPageUser = val
            this.searchUser()
        },
        /**
         * 分页功能 - 检测PageSizeUser变化
         */
        pageSizeChangeUser(val) {
            this.pageParamUser.pageSizeUser = val
            this.searchUser()
        },
        saveUsers() {
            var data = this.selectionData
            if (data.length === 0) {
                this.$message({
                    message: '请选择用户！',
                    type: 'error'
                })
                return
            } 
            this.$emit("saveUsers", this.selectionData)
        },
        closeUsersModel() {
            this.$emit("closeUserModal")
        },
        handleCurrentChange(row) {
            if(!this.multiply){
                this.selectionData = [];
                this.selectionData.push(row)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.filter-container {
  position: relative;
  top : 5px;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
</style>

