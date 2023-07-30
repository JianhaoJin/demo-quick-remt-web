<template>
  <div class="app-container">
    <!-- table -->
    <el-table
      :header-cell-style="{background: 'rgb(222, 223, 224)'}"
      v-loading="listLoading"
      :data="menuData"
      :default-expand-all="false"
      :expand-row-keys="expandArrays"
      row-key="id"
      border
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        label="名称"
        show-overflow-tooltip
        min-width="50"
        prop="name">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon"></svg-icon>
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="编码"
        show-overflow-tooltip
        min-width="45"
        prop="code" />
      <el-table-column
        label="页面路径"
        show-overflow-tooltip
        min-width="60"
        prop="url">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="api列表"
        min-width="35"
        prop="apis">
        <template slot-scope="scope">
          <span v-text="scope.row.apis"></span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="类型"
        min-width="20"
        prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'">顶级菜单</el-tag>
          <el-tag v-else-if="scope.row.type === '1'" type="success">子菜单</el-tag>
          <el-tooltip effect="light" content="此处的功能是按钮，也可以是页面上的某个事件" placement="bottom">
            <el-tag v-if="scope.row.type === '2'" type="danger" style="color:green">功能</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="50"
        label="操作">
        <template slot-scope="scope" >
          <el-button 
          icon="el-icon-circle-plus-outline"
          v-permission="'menu:add'"
          v-if="scope.row.type != '2'"
          type="text" 
          @click="openAddModel(scope.row)">新增
          </el-button>
          <span v-permission="'menu:add'">
            <el-divider direction="vertical" v-if="scope.row.type != '2'"/>
          </span>
          <el-button 
          type="text" 
          icon="el-icon-edit"
          v-permission="'menu:edit'" 
          @click="openEditModel(scope.row)">
          编辑</el-button>
          <span v-permission="'menu:edit'">
            <el-divider direction="vertical"/>
          </span>
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button 
                type="text" 
                icon="el-icon-delete"
                v-permission="'menu:delete'"  
                @click="deleteOpenModel(scope.row)" 
                style="color: #409eff">删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button 
                type="text" 
                icon="el-icon-more" 
                @click="openDetailsModel(scope.row)" 
                style="color: #409eff">详情</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 打开新增模态框 -->
    <el-dialog :visible.sync="addVisible" title="新增菜单/功能" center :top="openModelTop" width="55%" :before-close="closeAddModel">
      <el-form ref="addForm" :rules="formRules" :model="addData" label-width="85px" >
        <el-row>
          <el-col :span="12">
             <el-form-item label="名称:" prop="name">
                <el-input v-model="addData.name" placeholder="名称" clearable>
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" prop="type">
              <el-select v-model="addData.type" style="width:100%" @change="typeChange">
                <el-option v-if="currentRow.type === '0'" value="0" label="顶级菜单"/>
                <el-option v-if="currentRow.type === '0' || currentRow.type === '1'" value="1" label="子菜单"/>
                <el-option v-if="currentRow.type != '0' && currentRow.type != '2' && currentRow.funcationFlag"
                 value="2" label="功能"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="父级菜单:" prop="parentName">
              <el-input v-model="currentRow.parentName" placeholder="父级菜单(选择类型后自动带出)" readonly/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="编码:" prop="code">
              <el-input v-model="addData.code" placeholder="编码" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

         <el-row>
          <el-col :span="12">
            <el-form-item label="图标:" prop="icon">
              <el-input v-model="addData.icon" placeholder="点击选择图标" clearable readonly @focus="openIconModel">
                <template slot="append" v-if="addData.icon">
                  <svg-icon :icon-class="addData.icon" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="排序号:" prop="sort">
              <el-input v-model="addData.sort" placeholder="排序号" type="number" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isShowPageUrl">
          <el-col :span="24">
            <el-form-item label="页面路径:" prop="url">
              <el-input v-model="addData.url" placeholder="页面路径" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span v-if="addApiFlag">
        <div class="divLine">
          <el-button 
          type="text"
          style="color:black;font-size:14px;z-index=999999"
          icon="el-icon-circle-plus-outline" 
          @click="openApiModel">新增</el-button>
          <span style="margin-left: 6%;">
            <i class="el-icon-message-solid"></i>
            <span v-if="addData.type === '1'"> 说明：页面初始化加载API配置,如勾子函数created()或mounted()需要调用API时,可将API配在此处。</span>
            <span v-if="addData.type === '2'">说明：给当前功能绑定API,当按钮显隐时，会同步控制接口权限。</span>
          </span>
        </div>
        <el-table
          :header-cell-style="{background: 'rgb(222, 223, 224)'}"
          v-loading="listLoading"
          :data="selectionApiList"
          border
          :height="openAddModelHeigth"
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
          <el-table-column
          align="center"
          min-width="50"
          label="操作">
            <template slot-scope="scope" >
              <el-button type="text" @click="removeApiConfirm('add',scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-permission="'menu:add'" icon="el-icon-circle-check" size="mini" @click="addCommit">确认</el-button>
        <el-button type="info" icon="el-icon-circle-close" @click="closeAddModel" size="mini" >取消</el-button>
      </div>
    </el-dialog>

    <!-- 打开api列表模态框 -->
    <el-dialog :visible.sync="apiVisible" title="API列表选择" width="60%" center top="3vh">
      <List-selected id="selectedList" ref="sysApiDataList" descName="已选API列表"></List-selected>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="addVisible" type="primary" icon="el-icon-circle-check" size="mini" @click="addApiCommit()" >确认</el-button>
        <el-button v-if="editVisible" type="primary" icon="el-icon-check" size="mini" @click="updateApiCommit()" >修改确认</el-button>
        <el-button type="info" @click="apiVisible = false" icon="el-icon-circle-close" size="mini" >取消</el-button>
      </div>
    </el-dialog>

     <!-- 打开图标选择列表模态框 -->
    <el-dialog :visible.sync="iconVisible" title="图标选择" width="60%" center top="3vh">
      <div class="grid">
        <div v-for="item of svgIcons" :key="item" @click="handleClipboard(item,'add',$event)">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item-class">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span class="icon-item-name">{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-dialog>


    <!-- 打开编辑模态框 -->
    <el-dialog :visible.sync="editVisible" title="编辑菜单/功能" center :top="openModelTop" width="55%">
      <el-form ref="editForm" :rules="formRules" :model="editData" label-width="85px" >
        <el-row>
          <el-col :span="12">
             <el-form-item label="名称:" prop="name">
                <el-input v-model="editData.name" placeholder="名称" clearable>
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" prop="type">
              <el-input v-if="editData.type === '0'" disabled value="顶级菜单"></el-input>
              <el-select v-if="editData.type === '1' ||editData.type === '2'"
               v-model="editData.type" style="width:100%">
                <el-option  value="1" label="子菜单"/>
                <el-option v-if="editData.children.length === 0" value="2" label="功能"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="父级菜单:" prop="parentName">
              <el-input v-model="editData.parentName" readonly/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="编码:" prop="code">
              <el-input v-model="editData.code" placeholder="编码" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

         <el-row>
          <el-col :span="12">
            <el-form-item label="图标:" prop="icon">
              <el-input v-model="editData.icon" placeholder="点击选择图标" clearable readonly @focus="openIconModel">
                 <template slot="append" v-if="editData.icon">
                  <svg-icon :icon-class="editData.icon" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="排序号:" prop="sort">
              <el-input v-model="editData.sort" placeholder="排序号" type="number" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="editData.type != '2'">
          <el-col :span="24">
            <el-form-item label="页面路径:" prop="url">
              <el-input v-model="editData.url" placeholder="页面路径" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span v-if="editApiFlag">
        <div class="divLine">
          <el-button 
          type="text"
          style="color:black;font-size:14px;z-index=999999" 
          icon="el-icon-circle-plus-outline" 
          @click="openApiModel">新增</el-button>
          <span style="margin-left: 6%;">
            <i class="el-icon-message-solid"></i>
            <span v-if="editData.type === '1'"> 说明：页面初始化加载API配置,如勾子函数created()或mounted()需要调用API时,可将API配在此处。</span>
            <span v-if="editData.type === '2'">说明：给当前功能绑定API,当按钮显隐时，会同步控制接口权限。</span>
          </span>
        </div>
        <el-table
          :header-cell-style="{background: 'rgb(222, 223, 224)'}"
          :data="editData.menuAPIResponses"
          border
          :height="openAddModelHeigth"
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
          <el-table-column
          align="center"
          min-width="50"
          label="操作">
            <template slot-scope="scope" >
              <el-button type="text" @click="removeApiConfirm('update',scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="updateCommit">确认</el-button>
        <el-button type="info" @click="editVisibleClose" icon="el-icon-circle-close" size="mini" >取消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-drawer
     title="菜单详情"
     :visible.sync="detailsVisible"
     direction="rtl"
     size="40%"
     :before-close="detailsModelClose">
      <el-form :model="details" label-width="100px" style="margin:auto;width:100%;padding:5px 25px 30px">
        <el-form-item label="名称:">
          <el-input readonly v-model="details.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="编码:">
          <el-input readonly v-model="details.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="父类ID:">
          <el-input readonly v-model="details.parentId" autocomplete="off"></el-input>
        </el-form-item>

         <el-form-item label="父类名称:">
          <el-input readonly v-model="details.parentName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标:" prop="icon">
          <el-input readonly v-model="details.icon" placeholder="请求地址"></el-input>
        </el-form-item>
        <el-form-item v-if="details.type != '2'" label="URL:" prop="url">
          <el-input readonly v-model="details.url" placeholder="通配URL"/>
        </el-form-item>

        <el-form-item label="类型:" prop="url">
          <el-input readonly v-if="details.type === '0'" value="菜单" placeholder="菜单"/>
          <el-input readonly v-if="details.type === '1'" value="子菜单" placeholder="子菜单"/>
          <el-input readonly v-if="details.type === '2'" value="功能" placeholder="功能"/>
        </el-form-item>

        <el-form-item label="排序:" prop="sort">
          <el-input readonly v-model="details.sort" placeholder="全类名"/>
        </el-form-item>

        <el-form-item label="创建时间:" prop="createTime">
          <el-input readonly v-model="details.createTime" placeholder="权限标识"/>
        </el-form-item>
        <el-form-item label="修改时间:" prop="updateTime">
          <el-input readonly v-model="details.updateTime" placeholder="权限标识"/>
        </el-form-item>

        <el-form-item label="包含PAI接口列表:" prop="descriptions">
          <el-input
            v-model="details.apis"
            :autosize="{minRows:4,maxRows:6}"
            type="textarea"
            style="width: 100%;"
            prop="descriptions"
            :readonly="true"
            placeholder="包含PAI接口列表" />
        </el-form-item>
      </el-form>
    </el-drawer>


  </div>
</template>

<script>
import DragLayout from '@/components/DragLayout'
import ListSelected from '@/views/sysManagement/apiManagement/component/selectApi'
import treeTable from '@/components/TreeTable'
import Utils from "@/utils/util"
import svgIcons from '@/api/sysManagement/sysMenu/svg-icons'
import { fetchDictItemByTypeCode } from '@/api/sysManagement/sysDictItemApi'
import { loadMenuTree, saveMenu, updateMenu, verify, queryMenuById, deleteMenu,details } from '@/api/sysManagement/sysMenu/sysMenuApi'
import * as constants from '@/utils/constant.js'

//菜单
const MENU_TYPE_MENU = "0";
//子菜单
const MENU_TYPE_SUBMENU = "1";
//功能
const MENU_FUNCTION = "2";
export default {
  name: "menuManagement",
  components : {
    ListSelected
  },
  data() {
    return {
      //默认展开的列
      expandArrays : [],
      svgIcons,
      openAddModelHeigth : "150px",
      //添加模态框顶部距离
      openModelTop: "10vh",
      //已勾选中的数据列表
      selectionApiList : [],
      menuData : [],
      menuAPIResponses : [],
      detailsTitle : '',
      detailsVisible : false,
      addVisible : false,
      editVisible : false,
      apiVisible : false,
      iconVisible : false,
      //是否可以添加api的显示或隐藏标识
      addApiFlag : false,
      editApiFlag : false,
      isShowPageUrl : true,
      apiList : [],
      currentRow : {
        id : '',
        type : '0',
        parentId : '',
        parentName: '',
        children : [],
        funcationFlag : true,
      },
      details : {
        parentName: ''
      },
      sysMenu: {
        id: '',
        name: '',
        parentId: '',
        icon: '',
        code: '',
        type: '',
        sort: '',
        url: ''
      },
      addData : {
        type : "",
        sort: 0,
        name: '',
        parentId: '',
        icon: '',
        code: '',
        type: '',
        sort: '',
        url: ''
      },
      editData : {},
      listLoading : false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formRules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空！', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空！', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '图标不能为空！', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '页面路径不能为空！', trigger: 'blur' }
        ]
      },
    }
  },

  /**
   * mounted钩子函数，用于初始化数据
   */
  mounted() {
    this.loadMenuTree()
  },



  /**
   * 自定义方法列表
   */
  methods: {

    /**
     * 加载元素树 
     */
    loadMenuTree() {
      this.listLoading = true
      loadMenuTree().then(res => {
        this.listLoading = false
        if (res.data.errorCode === '000000') {
          this.menuData = res.data.data
          this.setExpand();
        } else {
          this.$message({
            message: res.data.errorMsg,
            type: 'error' }
          )
        }
      })
    },


    /**
     * 设置默认展开的行
     */
    setExpand(){
      let rows = this.menuData;
      for(let i = 0; i < rows.length; i++){
        this.expandArrays.push(rows[i].id)
      }
    },

    /**
     * 删除菜单提醒
     */
    deleteOpenModel(row) {
      let text = "";
      if(row.type === "0"){
        text = "确认删除顶级菜单<<font color='blue'>" + row.name + '</font>>吗？确认后该菜单下的子菜单和功能项会全部删除！';
      }else if(row.type === "1"){
        text = "确认删除子菜单<<font color='blue'>" + row.name + '</font>>吗？确认后该菜单下的子菜单和功能项会全部删除！';
      }else if(row.type === "2"){
        text = "确认删除功能<<font color='blue'>" + row.name + '</font>>吗？';
      }
      this.$confirm(text, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.deleteMenu(row)
      }).catch((error) => {
        console.log(error)
      })
    },


    /**
     * 删除菜单api
     */
    deleteMenu(row){
      deleteMenu(row.id,'N').then(res => {
        this.$message({
          center: true,
          showClose: true,
          showIcon: true,
          message: res.data.errorMsg,
          type: res.data.errorCode === '000000' ? 'success' : 'error'
        })
        if(res.data.errorCode === '000000'){
          this.loadMenuTree();
        }
      })
    },

    /**
     * 打开详情模态框
     */
    openDetailsModel(row){
      this.details = row;
      this.details.parentName = this.getParentName(row);
      this.detailsVisible = true
    },

    /**
     * 关闭详情模态框
     */
    detailsModelClose(){
      this.detailsVisible = false
    },

    /**
     * 打开选择图标模态框
     */
    openIconModel(){
      this.iconVisible = true;
    },

    /**
     * 生成图标(SVG)
     */
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },


    /**
     * 点击选择图标后的事件
     */
    handleClipboard(text, event) {
      this.addData.icon = text;
      this.editData.icon = text;
      this.iconVisible = false;
    },

    /**
     * 关闭api模态框
     */
    closeApiVisibleModel(){
      //异步请求子组件方法
      Utils.$emit("selectedList",true);
      this.apiVisible = false
    },


    /**
     * 添加api列表确认按钮
     */
    addApiCommit(){
      //获取已选择的数据列表
      let selectionData = this.$refs['sysApiDataList'].getSelectionData();
      let selectData = JSON.stringify(selectionData);
      //排除掉重复的
      let apiDataList = JSON.parse(selectData);
      let selectedList = this.selectionApiList;
      let flag = false;
      if(!selectedList || selectedList.length === 0){
        this.selectionApiList = apiDataList;
      }else {
        for(var i = 0; i < apiDataList.length; i++){
          for(var k = 0; k < selectedList.length; k++){
            if(apiDataList[i].id === selectedList[k].id){
              flag = true;
              break;
            }
          }
          if(!flag){
            this.selectionApiList.push(apiDataList[i]);
          }
          flag = false;
        }
      }

      //根据数据量调整添加模态框的位置
      if(this.selectionApiList.length >= 3){
        this.openModelTop = "3vh";
        this.openAddModelHeigth = "calc(100vh - 280px)";
      }else {
        this.openModelTop = "10vh";
        this.openAddModelHeigth = "150px";
      }
      this.apiVisible = false;
    },


    /**
     * 移除API提示
     */
    removeApiConfirm(code,row){
      let content = row.descriptions ? row.url : row.descriptions;
      const text = "确认移除<<font color='blue'>" + content + '</font>>API吗？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'comfirm-dialog-btn-cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.removeApi(code,row)
      }).catch((error) => {
        console.log(error)
      })
    },

    /**
     * 移除所选api
     */
    removeApi(cdoe,row){
      let data = [];
      if(cdoe === 'add'){
        data = this.selectionApiList;
      }else if('update'){
        data = this.editData.menuAPIResponses;
      }
      let index;
      for(var i = 0; i < data.length; i++){
        if(row.id === data[i].id){
           index = i;
           break;
        }
      }
      if(cdoe === 'add'){
        this.selectionApiList.splice(index,1);
      }else if('update'){
        this.editData.menuAPIResponses.splice(index,1);
      }
      
    },

    /**
     * 打开添加菜单模态框
     */
    openAddModel(row){
      this.currentRow = row;
      this.currentRow.parentName = "";
      this.currentRow.funcationFlag = true;
      for(var i = 0; i < row.children.length; i++){
        if(row.children[i].type === '1'){
          this.currentRow.funcationFlag = false
          break;
        }
      }
      this.addData.type = "";
      this.addVisible = true;
    },


    /**
     * 关闭新增模态框
     */
    closeAddModel(){  
      this.addVisible = false;
      this.selectionApiList = [];
      this.openModelTop = "10vh";
      this.openAddModelHeigth = "150px";
      this.addApiFlag = false;
      this.closeApiVisibleModel();
    },

    /**
     * 打开编辑模态框
     */
    openEditModel(row){
      //深拷贝复制对象
      let data = JSON.stringify(row);
      this.editData = JSON.parse(data);
      //优先确定按钮，优先判断，是按钮一定需要展示
      if(this.editData.type === "2"){
        this.editApiFlag = true;
      }else if(this.editData.type === "1"){
        this.editApiFlag = this.isShowEditApiByType1(this.editData);
      }else {
        this.editApiFlag = false;
      }
      //获取父类节点名称
      this.editData.parentName = this.getParentName(row);
      if(this.editData.menuAPIResponses.length >= 3){
        this.openModelTop = "3vh";
        this.openAddModelHeigth = "calc(100vh - 280px)";
      }else {
        this.openModelTop = "10vh";
        this.openAddModelHeigth = "150px";
      }
      this.editVisible = true;
    },


    /**
     * 当菜单类型为子菜单时判断是否显示api编辑框
     */
    isShowEditApiByType1(editData){
      //如果apis不为空，并且子菜单下面没有按钮或者孙子菜单那么，直接显示编辑
      if(editData.apis || editData.children.length === 0){
        return true;
      }
      //如果
      if(editData.children.length != 0){
        var childrenDatas = editData.children;
        for(var i = 0; i < childrenDatas.length; i++){
          if(childrenDatas[i].type === "1"){
            return false;
          }
        }
      }
      return true;
    },
    


    /**
     * 修改api列表确认按钮
     */
    updateApiCommit(){
      //获取已选择的数据列表
      let selectionData = this.$refs['sysApiDataList'].getSelectionData();
      let selectData = JSON.stringify(selectionData);
      //排除掉重复的
      let apiDataList = JSON.parse(selectData);
      let selectedList = this.editData.menuAPIResponses;
      let flag = false;
      if(!selectedList || selectedList.length === 0){
        this.editData.menuAPIResponses = apiDataList;
      }else {
        for(var i = 0; i < apiDataList.length; i++){
          for(var k = 0; k < selectedList.length; k++){
            if(apiDataList[i].id === selectedList[k].id){
              flag = true;
              break;
            }
          }
          if(!flag){
            this.editData.menuAPIResponses.push(apiDataList[i]);
          }
          flag = false;
        }
      }

      //根据数据量调整添加模态框的位置
      if(this.editData.menuAPIResponses.length >= 3){
        this.openModelTop = "3vh";
        this.openAddModelHeigth = "calc(100vh - 280px)";
      }else {
        this.openModelTop = "10vh";
        this.openAddModelHeigth = "150px";
      }
      this.apiVisible = false;
    },

    /**
     * 关闭编辑模态框
     */
    editVisibleClose(){
      this.editVisible = false;
      this.addData.icon = "";
    },

    /**
     * 获取父类节点的名称
     */
    getParentName(row){
      var parentName = "";
      let menuDataList = this.menuData;
      let rowParentId = row.parentId;
      if(row.type === "0" && row.parentId === -1){
          return "root根节点";
      }
      return this.getParentNameTree(parentName,row.parentId,menuDataList);
    },

    /**
     * 递归获取父类菜单名称
     */
    getParentNameTree(parentName,rowParentId,dataList){
      for(var i = 0; i < dataList.length; i++){
        if(rowParentId === dataList[i].id){
          parentName = dataList[i].name
          return parentName;
        }
        if(!parentName){
          if(dataList[i].children.length != 0){
            parentName = this.getParentNameTree(parentName,rowParentId,dataList[i].children);
          }
        }
      }
      return parentName;
    },


    /**
     * 修改提交
     */
    updateCommit(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          let data = this.editData;
          data.updateLowCodePage = 'N'
          var apiIds = [];
          var selectDataList = data.menuAPIResponses;
          for(var i = 0; i < selectDataList.length ; i++){
            apiIds.push(selectDataList[i].id);
          }
          data.apiIds = apiIds;
          updateMenu(data).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? 'success' : 'error'
            })
            if(res.data.errorCode === '000000'){
              this.editVisible = false
              this.openModelTop = "10vh";
              this.openAddModelHeigth = "150px";
               //异步请求子组件方法
              this.closeApiVisibleModel();
              //重新渲染菜单树
              this.loadMenuTree();
            }
          })
        }
      })
    },

    /**
     * 新增提交
     */
    addCommit(){
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let data = this.addData;
          if(data.type === '0'){
            data.parentId = "-1";
          }else {
            data.parentId = this.currentRow.id;
          }
          var apiIds = [];
          var selectDataList = this.selectionApiList;
          for(var i = 0; i < selectDataList.length ; i++){
            apiIds.push(selectDataList[i].id);
          }
          data.apiIds = apiIds;
          saveMenu(data).then(res => {
            this.$message({
              center: true,
              showClose: true,
              showIcon: true,
              message: res.data.errorMsg,
              type: res.data.errorCode === '000000' ? 'success' : 'error'
            })
            if(res.data.errorCode === '000000'){
              this.addVisible = false
              this.selectionApiList = [];
              this.openModelTop = "10vh";
              this.openAddModelHeigth = "150px";
              //关闭模态框
              this.closeApiVisibleModel();
              //重新渲染菜单树
              this.loadMenuTree();
              //清除字段内容
              this.$refs['addForm'].resetFields();
            }
          })
        }
      })
    },

    /**
     * 打开api列表弹框
     */
    openApiModel(){
      this.apiVisible = true;
    },


    /**
     * 类型发生变化后的变更事件
     */
    typeChange(value){
      if(value === '0'){
        this.currentRow.parentName = 'root(根节点)';
        this.addApiFlag = false;
        this.isShowPageUrl = true;
        this.addData.url = ""
      }else if(value === '1') {
        this.currentRow.parentName = this.currentRow.name;
        this.addApiFlag = true;
        this.isShowPageUrl = true;
        this.addData.url = ""
      }else if(value === '2'){
        this.currentRow.parentName = this.currentRow.name;
        this.addApiFlag = true;
        this.isShowPageUrl = false;
        this.addData.url = "/"
      }
    },


  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  position: relative;
  // bottom: 5px;
  .add-btn {
    position: relative;
    top: 0px;
    right: -10px;
  }
}
.el-form--inline .el-form-item {
  margin: 0 10px 0 0;
}
.app-container .el-table--medium td {
  padding: 5px 0;
}
.app-container .el-tag {
  margin: 0 3px 0 0;
}
.app-container .el-dialog__body {
  height: 400px;
  overflow-y: scroll;
}
.popoverDiv {
  text-align: right;
  margin: 0;
}
.app-container .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: calc(100% - 30px);
  height: 500px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.divLine{
  margin-bottom : 10px;
  background-color: rgb(229, 224, 240);
  height: 40px;
  border: 1px solid rgb(198, 184, 238);
  padding: 1px 15px;
  border-radius: 5px;
}
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 2fr));
}
.icon-item-class {
  margin: 8px;
  height: 50px;
  text-align: center;
  width: 80px;
  float: left;
  font-size: 22px;
  color: #24292e;
  cursor: pointer;
}

.disabled {
  pointer-events: none;
}

.icon-item-name {
  display: block;
  font-size: 12px;
  margin-top: 10px;
}

/deep/ .el-drawer__body{
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar{
  display: none;
}
</style>