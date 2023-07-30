<template>
  <div class="app-container" style="height: 634px">
    <DragLayout>
      <template slot="leftSlot">
        <div class="dev-type-main-left" style="height: 615px">
          <div v-show="showRightMenu">
            <el-menu
              id="menu"
              class="right-menu"
              @select="menuSelect">
              <el-menu-item
                index="1"
                v-permission="'role:add'"
                class="menu-item">
                <span slot="title" icon="el-icon-plus">新增角色</span>
              </el-menu-item>
              <el-menu-item
                index="2"
                v-permission="'role:update'"
                v-if="currentClickNodeData.code != 'superAdmin'"
                class="menu-item">
                <span slot="title">修改当前角色</span>
              </el-menu-item>
              <el-menu-item
                index="3"
                v-permission="'role:delete'"
                v-if="currentClickNodeData.code != 'superAdmin'"
                class="menu-item">
                <span slot="title">删除当前角色</span>
              </el-menu-item>
            </el-menu>
          </div>

          <el-input
          placeholder="输入角色名称过滤"
          clearable
          v-model="roleFilterText">
          </el-input><p></p>
          <!-- 树形 -->
          <el-tree
            ref="roleTree"
            :data="roleData"
            :props="roleProps"
            :default-checked-keys="[-1]"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expanded-keys="[-1]"
            :filter-node-method="roleFilterNode"
            node-key="id"
            default-expand-all
            @node-contextmenu="rightClick"
            @node-click="leftClick">
            <span
              slot-scope="{node, data}"
              style="font-size:14px"
              class="custom-tree-node">
              <span v-if="data.type === '0'">
                <i class="el-icon-s-custom" aria-hidden="true" />
              </span>
              <span v-else>
                <i class="el-icon-user-solid" aria-hidden="true" />
              </span>
              <span style="font-size:15px">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </template>

      <!-- 权限管理 -->
      <template slot="midSlot">
        <el-tabs
          v-model="activeTab"
          @tab-click="tabClick">
          <el-tab-pane
            label="菜单/功能授权"
            name="menuPermission">
            <el-tree
              id="treeMenu"
              ref="menuTree"
              :show-checkbox="true"
              :data="menuData"
              :props="menuProps"
              :default-checked-keys="checkedMenusId"
              :highlight-current="true"
              :check-strictly="true"
              :expand-on-click-node="false"
              style="overflow-y: auto; height: calc(100vh - 237px);"
              node-key="id"
              @check="checkClick"
              default-expand-all>
              <span slot-scope="{node, data}" style="font-size:14px" class="custom-tree-node">
                <span style="font-size:15px;">
                    <span v-if="data.type === '0'">
                      <i class="fa fa-folder-o" aria-hidden="true" />
                    </span>
                    <span v-if="data.type === '1'">
                      <i class="fa fa-file-text-o" aria-hidden="true" />
                    </span>
                  {{ node.label }}
                </span>
                <span class="spanCLassDes">
                  <span v-if="data.type === '0'">
                    <i class="el-icon-bangzhu"></i>
                    顶级菜单
                  </span>
                  <span v-if="data.type === '1'">
                    <i class="el-icon-eleme"></i>
                    子菜单
                  </span>
                  <span v-if="data.type === '2'">
                    <i class="el-icon-guide"></i>
                    <span style="color:red;">功能</span>
                  </span>
                  <span class="subSpan">
                    <span v-if="data.type === '0' || data.menuAPIResponses.length === 0" style="color: #DEDFE0;font-size:12px;">
                      <i class="el-icon-remove-outline"></i>
                      没有关联API
                    </span>
                    <el-button
                      type="text"
                      v-if="data.type === '1' && data.menuAPIResponses.length != 0"
                      size="mini"
                      class="filter-item"
                      icon="el-icon-view"
                      @click="catApiList(data)">查看API列表
                    </el-button>
                    <el-button
                      type="text"
                      v-if="data.type === '2' && data.menuAPIResponses.length != 0"
                      size="mini"
                      class="filter-item"
                      icon="el-icon-view"
                      @click="catApiList(data)">查看API数据
                    </el-button>
                  </span>
                </span>
              </span>
            </el-tree>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-check"
              v-permission="'role:menu:function:submit'"
              style="margin-left: 50px; margin-top: 20px"
              @click="updateMenuPermission">确定</el-button>
          </el-tab-pane>

          <!-- 接口授权 -->
          <el-tab-pane
            label="接口授权"
            name="apiPermission">
            <div >
              <el-form
                :inline="true"
                size="mini"
                :model="filterData"
                label-position="left">
                <el-form-item label="所属模块:" >
                  <el-input v-model="filterData.module" clearable @keyup.enter.native="apiSearch()" style="width:150px;" placeholder="所属模块"/>
                </el-form-item>
                <el-form-item label="请求类型:">
                  <el-select  v-model="filterData.requestType" clearable @change="apiSearch()" style="width:120px;">
                    <el-option value="GET" label="GET"/>
                    <el-option value="POST" label="POST"/>
                    <el-option value="PUT" label="PUT"/>
                    <el-option value="DELETE" label="DELETE"/>
                    <el-option value="PATCH" label="PATCH"/>
                    <el-option value="TRACE" label="TRACE"/>
                    <el-option value="OPTIONS" label="OPTIONS"/>
                    <el-option value="AUTO" label="AUTO"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="URL:" style="width:200px;">
                  <el-input v-model="filterData.url" clearable @keyup.enter.native="apiSearch()" style="width:150px;" placeholder="URL"/>
                </el-form-item>
                 <el-form-item label="是否绑定或引用:" style="width:280px;">
                   <el-select v-model="filterData.bangDing" clearable @change="apiSearch()" style="width:120px;">
                     <el-option label="是" value="0"></el-option>
                     <el-option label="否" value="1"></el-option>
                   </el-select>
                </el-form-item>
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-search"
                    @click="apiSearch()">查询</el-button>
              </el-form>
            </div>
            <!-- 表格 -->
            <el-table
              :data="sysApiList"
              ref="sysApiDataTable"
              :header-cell-style="{background: 'rgb(222, 223, 224)'}"
              v-loading="apiListLoading"
              style="width:100%;"
              border
              height="calc(100vh - 336px)"
              highlight-current-row>
              <el-table-column 
                type="selection"
                :selectable="apiIsselected"
                width="40">
              </el-table-column>
              <el-table-column
                align="center"
                label="所属模块"
                min-width="80"
                prop="module">
                  <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.sysMenuResponses.length != 0" 
                    content="已被页面引用或按钮绑定的的权限不可删除，请到菜单管理中解除绑定！" 
                    effect="light" 
                    placement="top">
                      <span v-if="scope.row.module" v-text="scope.row.module"></span>
                    </el-tooltip>
                    <span v-else v-text="scope.row.module"></span>
                  </template>
                </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="请求地址"
                label="URL"
                prop="url" />
              <el-table-column
                align="center"
                label="请求类型"
                min-width="50"
                prop="requestType" />
              <el-table-column
                align="center"
                label="方法名"
                prop="methodName" />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="接口概述"
                prop="descriptions">
                <template slot-scope="scope">
                  <span 
                    v-if="scope.row.descriptions" 
                    v-text="scope.row.descriptions">
                  </span>
                </template>
              </el-table-column>
              <el-table-column
              align="center"
              label="是否绑定或引用"
              prop="isMenuInit">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="light" content="API是否再页面初始化时被引用或被按钮绑定？" placement="top">
                    <span style="color: red;" v-if="scope.row.sysMenuResponses.length != 0">是</span>
                    <span v-else>否</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                min-width="50"
                label="操作">
                <template slot-scope="scope" >
                  <el-tooltip class="item" effect="light" content="查看被引用或绑定的详细信息" placement="top">
                  <el-button 
                    type="text" 
                    @click="catMenuListModel(scope.row)" 
                    icon="el-icon-view"
                    v-if="scope.row.sysMenuResponses.length != 0">查看</el-button>
                  </el-tooltip>
                  <span v-if="scope.row.sysMenuResponses.length === 0">/</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- Pagination -->
            <div class="pagination-container">
              <el-pagination
                :current-page.sync="apiPageParams.currentPage"
                :page-sizes="apiPageParams.pageSizes"
                :page-size="apiPageParams.pageSize"
                :total="apiPageParams.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="apiCurrentPageChange"
                @size-change="apiPageSizeChange"/>
            </div>
            <div style="margin-top: 10px">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                v-permission="'role:permission:add'"
                @click="queryApiNotRoleId">新增</el-button>
              <el-button
                size="mini"
                type="danger"
                v-permission="'role:permission:delete'"
                icon="el-icon-delete"
                @click="deleteApiPermission">删除</el-button>
            </div>
          </el-tab-pane>

          <!-- 用户授权 -->
          <el-tab-pane
            label="用户授权"
            name="userPermission">
            <UserTable ref="userTable" 
            :total="roleUserPageParams.total" 
            :user-list="roleUserList"
            @getUserList="loadRoleUsersByRoleId"/>
            <div style="margin-top: 10px">
              <el-button
                size="mini"
                type="primary"
                v-permission="'role:user:add'"
                icon="el-icon-plus"
                @click="openUserAddModel">新增</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                v-permission="'role:user:delete'"
                @click="deleteRoleUserConfirm">删除</el-button>
            </div>
          </el-tab-pane>
        
        </el-tabs>
      </template>
    </DragLayout>

      <!-- 新增角色用户模态框 -->
      <userListSelect
      :key="addRoleUserVisible" 
      :visible="addRoleUserVisible"
      :totalUser="userListPageParams.total" 
      :userDataList="userList" 
      :multiply="true"
      @loadUserDatas="queryUserNotRoleId" 
      @saveUsers="saveUser" 
      @closeUserModal="closeRoleUserAddModel">
      </userListSelect>

    <!-- 新增API授权模态框 -->
    <el-dialog :visible.sync="addPermissionVisible" style="margin-top: -90px" center title="角色接口授权" width="60%">
      <ApiListNotRole 
        id="permissionNotByRole" 
        ref="permissionNotByRole" 
        :roleId="this.role.id"
        :sysApiList="apiRoleNotList"
        :total="this.apiNotRoleParams.total"
        descName="已选API列表" 
        @loadPermissionNotRole="loadApibyNotRoleList">
       </ApiListNotRole>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          @click="addApiPermission">确定</el-button>
        <el-button
          size="mini"
          type="info"
          icon="el-icon-close"
          @click="closePermissionVisible">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog :visible.sync="updateRoleVisible" :title="title" width="500px" center>
      <div style="width: 400px; margin: auto">
        <el-form :model="upRole" label-width="120px" ref="upRoleForm" :rules="formRoleRules">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="upRole.name"
              :required="true"
              placeholder="角色名称"
              clearable/>
          </el-form-item>
          <el-form-item label="角色编码" prop="code" >
            <el-input
              :required="true"
              v-model="upRole.code"
              placeholder="角色编码"
              clearable/>
          </el-form-item>
          <el-form-item label="父级ID">
            <el-input 
            v-model="this.currentClickNodeData.parentId"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          @click="updateRole">确定</el-button>
        <el-button
          size="mini"
          type="info"
          icon="el-icon-close"
          @click="closeRoleVisible('update')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog :visible.sync="addRoleVisible" :title="title" width="500px" center>
      <div style="width: 400px; margin: auto">
        <el-form :model="newRole" label-width="120px" ref="addRoleForm" :rules="formRoleRules">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="newRole.name"
              placeholder="角色名称"
              clearable/>
          </el-form-item>
          <el-form-item label="角色编码" prop="code" >
            <el-input
              v-model="newRole.code"
              placeholder="角色编码"
              clearable/>
          </el-form-item>
          <el-form-item label="类型" prop="type" >
            <el-select v-model="newRole.type" style="width:100%" @change="newRoleTypeChange">
              <el-option label="角色组" value="0"/>
              <el-option label="子角色" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="父级ID" prop="parentId">
            <el-input
              v-model="newRole.parentId"
              :readonly="true"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          @click="addRole">确定</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-close"
          @click="closeRoleVisible('add')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 查看api列表 -->
    <el-dialog :visible.sync="catAPiVisible" center :title="apiTitle">
      <el-table
          :header-cell-style="{background: 'rgb(222, 223, 224)'}"
          :data="apiDataList"
          border
          highlight-current-row>
          <el-table-column
            align="center"
            label="所属模块"
            min-width="60"
            prop="module" />
          <el-table-column
            align="请求地址"
            label="URL"
            prop="url" />
          <el-table-column
            align="center"
            label="请求类型"
            min-width="35"
            prop="requestType" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="接口概述"
            prop="descriptions">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.descriptions" effect="light" placement="bottom">
                <span 
                  v-if="scope.row.descriptions" 
                  v-text="scope.row.descriptions">
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>


    <!-- 查看api被应用的菜单/功能列表 -->
    <el-dialog :visible.sync="catAPiMenuVisible" center :title="apiMenuTitle">
      <el-table
          :header-cell-style="{background: 'rgb(222, 223, 224)'}"
          :data="apiMenuList"
          border
          highlight-current-row>
          <el-table-column
            align="center"
            label="菜单/功能名称"
            min-width="70"
            prop="name" />
          <el-table-column
            align="请求地址"
            label="URL"
            min-width="120"
            prop="url" />
          <el-table-column
            align="center"
            label="菜单/功能编码"
            min-width="70"
            prop="code" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="类型"
            min-width="40"
            prop="type">
            <template slot-scope="scope">
              <span v-if="scope.row.type === '1'">子菜单</span>
              <span v-if="scope.row.type === '2'">功能</span>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import * as roleApi from '@/api/sysManagement/sysRoleApi'
import * as constants from '@/utils/constant.js'
import Utils from "@/utils/util"
import DragLayout from '@/components/DragLayout'
import ListSelected from '@/views/sysManagement/apiManagement/component/selectApi'
import ApiList from '@/views/sysManagement/apiManagement/component/apiList'
import userListSelect from '@/views/sysManagement/userManagement/userListSelect'
import ApiListNotRole from '@/views/sysManagement/apiManagement/component/apiListNotRole'
import UserTable from '@/views/sysManagement/userManagement/userTable'
import { getMenusId, loadMenuTree } from '@/api/sysManagement/sysMenu/sysMenuApi'
import { pageList, updateDesc,details } from '@/api/sysManagement/sysApiManageApi'
import { loadApibyRoleList,loadApibyNotRoleList,addApiPermission,deleteApiPermission } from '@/api/sysManagement/sysPermissionApi'
import { fetchDictItemByTypeCode } from '@/api/sysManagement/sysDictItemApi'
import { getUsersByRoleCode, getUsersNotRoleId } from '@/api/sysManagement/sysUserApi'
import {  loadUserByRoleData,queryUserNotRoleId,saveUser,deleteUserPermission } from '@/api/sysManagement/sysRoleUserApi'
export default {
   watch : {
    roleFilterText(val){
      this.$refs.roleTree.filter(val)
    }
  },
  name: 'roleManagement',
  components: { 
    DragLayout, 
    UserTable,
    ListSelected,
    ApiList,
    ApiListNotRole,
    userListSelect 
    },
  data() {
    return {
      upRole: {
        id: '',
        name: '',
        code: '',
        parentId : '',
        type : ''
      },
      newRole: {
        code: '',
        name: '',
        parentId : '',
        type : ''
      },
      role: {
        id: '',
        code: '',
        name: '',
        delFlag: '',
        parentId : '',
        createTime: '',
        updateTime: ''
      },
      //角色筛选列表
      roleFilterText : '',
      //api列表
      sysApiList : [],
      apiListLoading : false,
      apiSelectDataList : [],
      checkedDicts: [],
      modelList: [],
      apiDataList : [],
      apiMenuList : [],
      apiRoleNotList : [],
      title: '',
      apiTitle : "",
      apiMenuTitle : "",
      addRoleVisible: false,
      updateRoleVisible: false,
      addPermissionVisible: false,
      catAPiVisible: false,
      catAPiMenuVisible : false,
      showRightMenu: false,
      tableLoading: false,
      currentClickNodeData: {},
      activeTab: 'menuPermission',
      userList: [],
      filterData: {
        module : '',
        requestType : '',
        methodName: '',
        url: '',
        bangDing: ''
      },
      apiPageParams : {
        currentPage: 1,
        pageSizes: constants.pageSizes,
        pageSize: 10,
        total: 0,
      },
      apiNotRoleParams : {
        currentPage: 1,
        pageSizes: constants.pageSizes,
        pageSize: 10,
        total: 0,
      },
      roleUserPageParams : {
        currentPage: 1,
        pageSizes: constants.pageSizes,
        pageSize: 10,
        total: 0,
      },
      userListPageParams : {
        currentPage: 1,
        pageSizes: constants.pageSizes,
        pageSize: 10,
        total: 0,
      },
      formRoleRules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空！', trigger: 'blur' }
        ],
        type : [
          {required: true, message: '菜单类型不能为空！', trigger: 'blur'}
        ],
        parentId : [
          {required: true, message: '父类菜单ID不能为空！', trigger: 'blur'}
        ]
      },
      checkedMenusId: [],
      menuData: [],
      roleData: [],
      roleProps: {
        children: 'children',
        label: 'name'
      },
      menuProps: {
        children: 'children',
        label: 'name'
      },
      filterPermissionData: {
        module : '',
        requestType : '',
        methodName: '',
        url: ''
      },
      filterUserData: {
        jobNumber : "",
        fullName : "",
        deptName: ""
      },
      roleUserList: [],
      addRoleUserVisible : false,
      roleTip: '',
    }
  },

  /**
   * 初始化钩子函数
   */
  created() {
  },

  /**
   * 初始化钩子函数
   */
  mounted() {
    this.getRoleList()
  },

  /**
   * 自定义API列表
   */
  methods: {
    /**
     * 加载角色列表
     */
    getRoleList() {
      roleApi.fetchRoleList().then(res => {
        if (res.data.errorCode === '000000') {
          this.roleData = res.data.data
          this.role = this.roleData[0]
          this.$nextTick(() => {
            this.$refs.roleTree.setCurrentKey(this.role.id)
          })
          //获取菜单列表
          this.fetchMenuId();
        } else {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'error'
          })
        }
      })
    },


    /**
     * 角色筛选
     */
    roleFilterNode(value,data){
      if (!value){
        return true;
      } 
        return data.name.indexOf(value) !== -1;
    },


    /**
     * 当复选框被点击的时候触发	
     */
    checkClick(data,selectData){
      let tempData = JSON.stringify(selectData.checkedKeys);
      let selectDataList = JSON.parse(tempData);
      let indexFlag = selectDataList.indexOf(data.id);
      let keys = [];
      //如果是顶级菜单，并且没有选中，那么将该顶级菜单下的所有权限去掉
      if(data.type === '0' && indexFlag === -1){
        let resultKeys = this.getSelectKeys(data);
        //重新分配选中节点
        for(var i = 0; i < resultKeys.length; i++){
          this.remove(selectDataList,resultKeys[i])
        }
      }else if(data.type === '1' && indexFlag === -1){
        //如果是子菜单，indexFlag === -1 说明没有选择当前菜单，那么检测该菜单下的所有子菜单
        if(data.children && data.children.length != 0){
           for(var i = 0; i < data.children.length; i++){
            keys.push(data.children[i].id);
          }
        }
        //重新分配选中节点
        for(var i = 0; i < keys.length; i++){
          this.remove(selectDataList,keys[i])
        }
      }else if(data.type === '1' && indexFlag != -1){
        //如果子菜单，并且是选中状态，默认将父类选中
        selectDataList = selectDataList.concat(data.parentId);
      }else if(data.type === '2' && indexFlag != -1){
        //如果是按钮，并且状态是已选中的状态,默认将父类选中
        selectDataList.push(data.parentId);
      }
      //更新选择结果
      this.$refs.menuTree.setCheckedKeys(selectDataList);
    },


    /**
     * 找到父节点下所有的子节点
     */
    getSelectKeys(data){
      let menuData = this.menuData;
      let menu = [];
      let menuKeys = [];
      for(let i = 0; i < menuData.length; i ++){
        if(menuData[i].id === data.id){
          menu = menuData[i];
          break;
        }
      }
      this.getKeysList(menu,menuKeys);
      return menuKeys;
    },

    /**
     * 递归获取父节点下的所有子节点
     */
    getKeysList(menu,menuKeys){
      menuKeys.push(menu.id);
      if(menu.children && menu.children.length != 0){
        this.getkeys(menu.children,menuKeys)
      }
    },  


    /**
     * 递归获取父节点下的所有子节点
     */
    getkeys(menuList,menuKeys){
      for(let i = 0; i < menuList.length; i ++){
        menuKeys.push(menuList[i].id);
        if(menuList[i].children &&  menuList[i].children.length != 0){
          this.getkeys(menuList[i].children,menuKeys);
        }
      }
    },



    /**
     * 找到数组的下标
     */
    indexOfFlag(arrays,val){
      for(var i = 0; i < arrays.length; i++){
        if(arrays[i] === val){
          return i;
        }
      }
      return -1;
    },


    /**
     * 删除数组中指定元素
     */
    remove(arrays,val){
      let index = this.indexOfFlag(arrays,val);
      if(index > -1){
        arrays.splice(index,1);
      }
    },


    /**
     * 查看api列表
     */
    catApiList(data){
      this.catAPiVisible = true;
      if(data.type === '1'){
        this.apiTitle = "【" + data.name + "】菜单的初始化API列表";
      }else if(data.type === '2'){
        this.apiTitle = "【" + data.name + "】功能的API";
      }
      this.apiDataList = data.menuAPIResponses;
    },

    /**
     * 根据角色Code获取菜单列表
     */
    fetchMenuId() {
      getMenusId(this.role.id).then(res => {
        if (res.data.errorCode === '000000') {
          this.checkedMenusId = res.data.data
          this.loadMenuTree();
        }
      })
    },


    /**
     * 获取菜单列表树
     */
    loadMenuTree(){
      loadMenuTree().then(res => {
        if (res.data.errorCode === '000000') {
          this.menuData = res.data.data
        } else {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'error'
          })
        }
      })
    },


    /**
     * 根据角色ID获取权限列表
     */
    loadApibyRole(){
      this.apiListLoading = true;
      let params = {
        pageSize: this.apiPageParams.pageSize,
        pageNum: this.apiPageParams.currentPage,
        roleId : this.role.id,
        module : this.filterData.module,
        requestType : this.filterData.requestType,
        url : this.filterData.url,
        bangDing: this.filterData.bangDing
      }
      loadApibyRoleList(params).then(res => {
        this.apiListLoading = false;
        if (res.data.errorCode === '000000') {
          this.sysApiList = res.data.data.records
          this.apiPageParams.total = res.data.data.total
        }
      })
    },


    /**
     * 点击搜索时的方法
     */
    apiSearch(){
      this.apiPageParams.currentPage = 1;
      this.loadApibyRole();
    },

     /**
     * 当前页码发生变化的事件
     */
    apiCurrentPageChange(val) {
      this.apiPageParams.currentPage = val
      this.loadApibyRole()
    },

    /**
     * 页码总数发生变化的事件
     */
    apiPageSizeChange(val) {
      this.apiPageParams.pageSize = val
      this.loadApibyRole()
    },

    /**
     * 设置是否禁用勾选框
     */
    apiIsselected(row, index){
      if(row.sysMenuResponses.length != 0){
        return false;
      }else {
        return true;
      }
    },

    
    /**
     * 查看当前API被引用的页面
     */
    catMenuListModel(row){
      this.catAPiMenuVisible = true;
      this.apiMenuList = row.sysMenuResponses;
      var name = "";
      if(row.descriptions && row.descriptions.length <= 10){
        name = row.descriptions;
      }else {
        name = row.url;
      }
      this.apiMenuTitle = "API【" + name + "】引用/绑定列表";
    },



    /**
     * 右击菜单
     */
    rightClick(event, data, node, obj) {
      this.currentClickNodeData = node.data
      this.showRightMenu = true
      const menu = document.querySelector('#menu')
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetTop = this.$el.getBoundingClientRect().top
      menu.style.left = event.clientX - offsetLeft + 'px' // + 200; // 15: margin right
      let top = event.clientY - offsetTop + 10
      if (top > this.$el.clientHeight - 155) {
        top = this.$el.clientHeight - 155
      }
      menu.style.top = top + 'px'
      // 给整个document添加监听鼠标事件,点击任务位置执行closeRightMenu方法,及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)
    },

    /**
     * 关闭右击菜单
     */
    closeRightMenu() {
      this.showRightMenu = false
      document.removeEventListener('click', this.closeRightMenu)
    },

    /**
     * 树形菜单的点击事件
     */
    leftClick(obj, node, template) {
      if (obj.id !== this.$refs.roleTree.$children[0].node.data.id) {
        this.$refs.roleTree.$children[0].node.isCurrent = false
      }
      this.role = obj
      if (this.activeTab === 'menuPermission') {
        this.fetchMenuId()
      } else if (this.activeTab === 'apiPermission') {
        this.loadApibyRole()
      } else if (this.activeTab === 'userPermission') {
        this.loadUserByRole();
      }
    },




    /**
     * 点击角色属性菜单时出现的选择框
     */
    menuSelect(index) {
      if (index === '1') {
        // 增加角色
        this.title = '增加角色'
        this.addRoleVisible = true
      } else if (index === '2') {
        // 修改角色
        this.title = '修改角色'
        this.upRole.id = this.currentClickNodeData.id
        this.upRole.code = this.currentClickNodeData.code
        this.upRole.name = this.currentClickNodeData.name
        this.updateRoleVisible = true
      } else if (index === '3') {
        // 删除
        this.$confirm('确认删除角色<font color="blue">"' + this.currentClickNodeData.name + 
        '"</font>?删除后该角色下的所有子角色将全部删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'confirm-dialog-btn-calcel',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.removeRoleById();
        }).catch(() => {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            type: 'info',
            message: '取消修改'
          })
        })
      }
    },



    /**
     * 新增角色类型发生变化的change事件
     */
    newRoleTypeChange(val){
      if(val === "0"){
        this.newRole.parentId = "-1";
      }else if(val === '1'){
        this.newRole.parentId = this.currentClickNodeData.id;
      }
    },

    /**
     * 关闭新增和更新角色模态框
     */
    closeRoleVisible(type){
      if(type === 'add'){
        this.addRoleVisible = false;
        this.newRole.type = '';
        this.newRole.parentId = '';
      }else if(type === 'update'){
        this.updateRoleVisible = false;
        this.upRole.type = '';
        this.upRole.parentId = '';
      }
    },


     /**
     * 校验角色
     */
    checkRole(property, type) {
      roleApi.verifyRoleCode(param).then(res => {
        if (res.data.errorCode !== '000000') {
          this.roleTip = '* 角色编码已存在！'
          return false
        }
      })
      return true;
    },


    /**
     * 更新角色
     */
    updateRole() {
      this.$refs['upRoleForm'].validate((valid) => {
        if (valid) {
          roleApi.updateRole(this.upRole).then(res => {
            if (res.data.errorCode === '000000') {
              this.$message({
                showIcon: true,
                showClose: true,
                center: true,
                message: res.data.errorMsg,
                type: 'success'
              })
              this.updateRoleVisible = false
              this.getRoleList()
              this.$refs['upRoleForm'].resetFields();
            } else {
              this.$message({
                showIcon: true,
                showClose: true,
                center: true,
                message: res.data.errorMsg,
                type: 'error'
              })
            }
          })
        }
      })
    },

    /**
     * 添加角色
     */
    addRole() {
      this.$refs['addRoleForm'].validate((valid) => {
        if (valid) {
          roleApi.pushRole(this.newRole).then(res => {
            if (res.data.errorCode === '000000') {
              this.$message({
                showIcon: true,
                showClose: true,
                center: true,
                message: res.data.errorMsg,
                type: 'success'
              })
              this.addRoleVisible = false
              this.getRoleList();
              this.$refs['addRoleForm'].resetFields();
            } else {
              this.$message({
                showIcon: true,
                showClose: true,
                center: true,
                message: res.data.errorMsg,
                type: 'error'
              })
            }
          })
        }
      })
    },


    /**
     * 删除角色
     */
    removeRoleById(){
      roleApi.removeRoleById(this.currentClickNodeData.id).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'success'
          })
          this.getRoleList();
        } 
      })
    },


    /**
     * 切换tab的点击事件
     */
    tabClick(tab, event) {
      if (tab.name === 'menuPermission') {
        this.fetchMenuId();
      } else if (tab.name === 'apiPermission') {
        this.loadApibyRole();
      }else if(tab.name === 'userPermission'){
        this.loadUserByRole();
      }
    },


    /**
     * 更新菜单权限
     */
    updateMenuPermission() {
      this.$confirm('确认修改菜单功能授权？修改后菜单下绑定的API接口权限将同步修改！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'confirm-dialog-btn-calcel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.modifyMenuPermission();
      }).catch((e) => {
        this.$message({
          showIcon: true,
          showClose: true,
          center: true,
          message: '取消操作',
          type: 'info'
        })
      })
    },


    /**
     * 修改菜单权限
     */
    modifyMenuPermission(){
      var checkedNodes = this.$refs.menuTree.getCheckedNodes();
      var ids = this.$refs.menuTree.getCheckedKeys();
      var halfIds = this.$refs.menuTree.getHalfCheckedKeys();
      ids = ids.concat(halfIds)
      var apiIds = [];
      this.getTreeApidIds(apiIds,checkedNodes);
      var param = {
        roleId: this.role.id,
        menuIds: ids,
        apiIds : apiIds
      }
      roleApi.modifyMenuPermission(param).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'success'
          })
        } else {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'error'
          })
        }
      })
    },


    /**
     * 递归获取apiId数据
     */
    getTreeApidIds(apiIds,checkedNodes){
      for(var i = 0; i < checkedNodes.length; i++){
        //如果是子菜单或者功能，处理当前子菜单和功能的api列表
       if(checkedNodes[i].type === '1' || checkedNodes[i].type === '2'){
          //找到子菜单或功能下的api数据
          if(checkedNodes[i].menuAPIResponses && checkedNodes[i].menuAPIResponses.length != 0){
            this.getApidIds(apiIds,checkedNodes[i].menuAPIResponses)
          }
        }
      }
    },


    /**
     * 递归获取apiId数据
     */
    getApidIds(apiIds,menuAPIResponses){
      for(var i = 0; i < menuAPIResponses.length; i++){
        if(this.isContains(apiIds,menuAPIResponses[i].id)){
          apiIds.push(menuAPIResponses[i].id);
        }
      }
    },

    /**
     * 判断当前数组是否包含某个数值
     */
    isContains(apiIds,apiId){
      for(var k = 0; k < apiIds.length; k++){
        if(apiIds[k] === apiId){
          return false;
        }
      }
      return true;
    },


    /**
     * 打开新增权限模态款
     */
    queryApiNotRoleId() {
      this.addPermissionVisible = true;
      const params = {
        pageSize: this.apiNotRoleParams.pageSize,
        pageNum: this.apiNotRoleParams.currentPage,
        module: this.filterPermissionData.module,
        requestType: this.filterPermissionData.requestType,
        url : this.filterPermissionData.url,
        roleId : this.role.id,
        allowListFlag : false
      }
      this.loadApibyNotRoleList(params);
    },

    /**
     * 关闭权限分配模态框
     */
    closePermissionVisible(){
      let selectionData = this.$refs['permissionNotByRole'].closeApiVisibleModel();
      this.addPermissionVisible = false
    },


    /**
     * 加载当前角色下没有的api列表
     */
    loadApibyNotRoleList(params) {
      loadApibyNotRoleList(params).then(res => {
        if (res.data.errorCode === '000000') {
          this.apiRoleNotList = res.data.data.records
          this.apiNotRoleParams.total = res.data.data.total
        } else {
          this.$message({
            center: true,
            showClose: true,
            showIcon: true,
            message: res.data.errMsg,
            type: 'error'
          })
        }
      })
    },


    /**
     * 添加权限
     */
    addApiPermission() {
       //获取已选择的数据列表
      let selectionData = this.$refs['permissionNotByRole'].getSelectionData();
      if (selectionData.length === 0) {
        this.$message({
          showIcon: true,
          showClose: true,
          center: true,
          message: '至少选择一条数据',
          type: 'error'
        })
        return
      }
      const data = {
        roleId: this.role.id,
        apiIds: []
      }
      selectionData.forEach(element => {
        data.apiIds.push(element.id)
      })
      addApiPermission(data).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'success'
          })
          this.closePermissionVisible();
          this.loadApibyRole();
        } else {
          this.$message({
            showIcon: true,
            showClose: true,
            center: true,
            message: res.data.errorMsg,
            type: 'error'
          })
        }
      })
    },


     /**
     * 删除当前角色下的api列表
     */
    deleteApiPermission(){
      var selections = this.$refs.sysApiDataTable.selection
      var text = ''
      if (selections.length === 0) {
        this.$message({
          showIcon: true,
          showClose: true,
          center: true,
          message: '至少选择一条数据',
          type: 'error'
        })
        return
      }
      let selectDatas = JSON.stringify(selections);
      let selectDataList = JSON.parse(selectDatas);
      if (selectDataList.length > 1) {
        text = "确认删除所选角色的【<font color='blue'>" + selectDataList.length + '个</font>】API接口权限?'
      } else {
        text = "确认删除所选角色的【<font color='blue'>" + selectDataList[0].descriptions + '</font>】API接口权限?'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        const data = {
          roleId: this.role.id,
          apiIds: []
        }
        selectDataList.forEach(element => {
          data.apiIds.push(element.id)
        })
        deleteApiPermission(data).then(res => {
          if (res.data.errorCode === '000000') {
            this.$message({
              showIcon: true,
              showClose: true,
              center: true,
              message: res.data.errorMsg,
              type: 'success'
            })
            this.loadApibyRole();
          } 
        })
      }).catch((errorMsg) => {
        console.log("error:" + errorMsg)
      })
    },



    /**
     * 加载当用角色下的用户列表
     */
    loadUserByRole(){
       const param = {
        jobNumber : this.filterUserData.jobNumber,
        fullName: this.filterUserData.jobNumber,
        deptName: this.filterUserData.deptName,
        pageNum: this.roleUserPageParams.currentPage,
        pageSize: this.roleUserPageParams.pageSize
      }
      this.loadRoleUsersByRoleId(param);
    },


    /**
     * 根据角色id获取用户信息
     */
    loadRoleUsersByRoleId(param){
      param.roleId = this.role.id;
      loadUserByRoleData(param).then(res => {
        if (res.data.errorCode === '000000') {
          this.roleUserList = res.data.data.records
          Utils.$emit('getRoleUserList', this.roleUserList)
          this.roleUserPageParams.total = res.data.data.total
        } 
      })
    },
   

    /**
     * 打开新增用户模态框
     */
    openUserAddModel(){
      this.addRoleUserVisible = true;
      var param = {
        pageNum: this.userListPageParams.currentPage,
        pageSize: this.userListPageParams.pageSize,
        fullName: this.filterUserData.fullName,
        jobNumber: this.filterUserData.jobNumber,
        deptName: this.filterUserData.deptName
      }
      this.queryUserNotRoleId(param);
    },


    /**
     * 关闭新增人员模态框
     */
    closeRoleUserAddModel(){
      this.addRoleUserVisible = false;
    },


    /**
     * 根据角色获取用户列表
     */
    queryUserNotRoleId(param){
      param.roleId = this.role.id;
      queryUserNotRoleId(param).then(res =>{
        if (res.data.errorCode === '000000') {
          this.userList = res.data.data.records
          this.userListPageParams.total = res.data.data.total
        }else {
          this.$message({
            message: '获取数据失败！',
            type: 'error'
          })
        }
      })
    },


    /**
     * 保存用户
     */
    saveUser(userDatas){
      let userListSelect = JSON.stringify(userDatas);
      let userList = JSON.parse(userListSelect);
      let data = {
        roleId : this.role.id,
        jobNumberList : []
      };
      for(var i = 0; i < userList.length; i++){
        data.jobNumberList.push(userList[i].jobNumber);
      }
      saveUser(data).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: res.data.errorMsg,
            type: 'success'
          })
          this.addRoleUserVisible = false;
          this.loadUserByRole();
        } 
      })
    },


    /**
     * 删除用户权限
     */
    deleteRoleUserConfirm() {
      var selections = this.$refs.userTable.getSelections();
      var text = ''
      if (!selections || selections.length === 0) {
        this.$message({
          showIcon: true,
          showClose: true,
          center: true,
          message: '至少选择一条数据',
          type: 'warning'
        })
        return
      }
      if (selections.length > 1) {
        text = "确认删除<font color='blue'>【" + this.role.name + "】</font>角色下的<font color='blue'>【" + selections.length + '】</font>个用户的授权?'
      } else {
        text = "确认删除<font color='blue'>【" + this.role.name + "】</font>角色下的<font color='blue'>【" + selections[0].fullName + '】</font>用户的授权?'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.deleteUserPermission();
      }).catch((errorMsg) => {
        console.log("error:" + errorMsg)
      })
    },


     /**
     * 根据角色删除用户列表
     */
    deleteUserPermission(){
      var selections = this.$refs.userTable.getSelections();
      let userListSelect = JSON.stringify(selections);
      let userList = JSON.parse(userListSelect);
      let data = {
        roleId : this.role.id,
        jobNumberList : []
      };
      for(var i = 0; i < userList.length; i++){
        data.jobNumberList.push(userList[i].jobNumber);
      }
      deleteUserPermission(data).then(res => {
        if (res.data.errorCode === '000000') {
          this.$message({
            showClose: true,
            showIcon: true,
            center: true,
            message: res.data.errorMsg,
            type: 'success'
          })
          this.loadUserByRole();
        } 
      })
    }


  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  position: relative;
  top: 6px;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
.dev-type-main-left {
  overflow: auto;
  padding: 5px;
}

.dev-type-main-left .right-menu {
  z-index: 100;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: white;
}

.dev-type-main-left .right-menu .menu-item {
  height: 25px;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  width: 150px;
  color: #606266;
}
#treeMenu .custom-tree-node {
  flex: 1;
  display : flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.spanCLassDes{
  font-size: 12px;
  color: blueviolet
}
.subSpan{
  margin-left: 600px;
  color: red
}


</style>
