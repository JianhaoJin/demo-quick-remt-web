<template>
  <div class="app-container">
    <el-form
      ref="newForm"
      :model="newForm"
      :rules="newFormRules"
      label-width="140px"
      label-position="right">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构代码" prop="code">
            <el-input
              v-model="newForm.code"
              placeholder="机构代码(十位)"
              maxlength="10"
              @blur="reCheckOrgCode"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构名称" prop="location">
            <el-input
              v-model="newForm.location"
              placeholder="机构名称"
              maxlength="20"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属上级机构" prop="parentName">
            <el-input
              v-model="newForm.parentName"
              :readonly="true"
              placeholder="所属上级机构"
              maxlength="20"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构级别" prop="grade">
            <el-select style="width:100%" v-model="newForm.grade">
              <el-option v-for="item in gradeList"
              :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="机构负责人" prop="director">
            <el-dialog
              :close-on-click-modal="false"
              :modal="false"
              :visible.sync="orgChargeIdDialog"
              style="height: 800px"
              top="2vh"
              class="chargeClass"
              title="选择机构负责人">
              <EmployeeSearchDialog :org-id="parentOrg.orgId" @onUserSelect="confirmUserInfo"/>
            </el-dialog>
            <el-button
              class="choice-button"
              @click="orgChargeIdDialog = true"
            >{{ newForm.directorName || "请选择负责人" }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="newForm.remark" :rows="5" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { createOrg, modifyOrg, checkOrgCode } from '@/api/sysManagement/orgManagement/sysOrganizationApi'
import EmployeeSearchDialog from '@/views/sysManagement/components/employeeSearchDialog'

const Qs = require('qs')
export default {
  components: {
    EmployeeSearchDialog
  },
  data() {
    /**
     * 校验机构代码 10 位编码值
     */
    const validatorOrgCode = (rule, value, callback) => {
      if (value) {
        if (this.some === -1) {
          callback(new Error("该机构代码已存在！"));
        } else {
          callback();
        }
      }
    };

    /**
     * 校验机构名称
     */
    const validatorOrgName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入机构名称"));
      } else {
        callback();
      }
    };
    const validatorOrgLevel = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入机构级别"));
      } else {
        callback();
      }
    };
    return {
      gradeList: [
        {
          id: 1,
          name: "一级"
        },
        {
          id: 2,
          name: "二级"
        },
        {
          id: 3,
          name: "三级"
        }
      ],
      parentName: "",
      type: 0, // 0新建 1修改
      newForm: {
        displayCode: "", // 4位编码
        location: "",
        parentName: "",
        parentId: "",
        grade: "",
        directorName: "",
        director: "",
        remark: "",
        code: "" // 10位代码
      },
      //子对象传过来的
      parentOrg: {
        orgId: ""
      },
      // 0：正常,-1:字段不符合规则
      some: 0,
      //表代校验
      newFormRules: {
        // 10位机构代码验证
        code: [
          { required: true, validator: validatorOrgCode, trigger: "blur" },
          { min: 10, max: 10, message: "长度必须为10位", trigger: "blur" }
        ],
        location: [
          { required: true, validator: validatorOrgName, trigger: "blur" }
        ],
        grade: [
          { required: true, validator: validatorOrgLevel, trigger: "blur" }
        ]
      },
      orgChargeIdDialog: false
    };
  },

  /**
   * 初始化钩子函数
   */
  created() {},

  /**
   * 自定义方法列表
   */
  methods: {
    /**
     * 初始化
     */
    init(query) {
      if (query) {
        if (query.type === 0) {
          //新增
          this.parentOrg.orgId = query.orgId;
          this.newForm.parentName = query.parentName;
          this.newForm.parentId = query.parentId;
        }
        this.type = query.type;
        //如果等于0是系只能
        if (query.type === 1) {
          //否则是修改，需要将内容反显出来
          let updateOrg = JSON.stringify(query);
          this.newForm = JSON.parse(updateOrg);
          this.parentOrg.orgId = query.id;
        }
      }
    },

    /**
     * 表单初始化
     */
    reset() {
      this.$refs.newForm.resetFields();
    },

    /**
     * 确认选择的机构负责人
     */
    confirmUserInfo(userInfo) {
      this.newForm.director = userInfo.id;
      this.newForm.directorName = userInfo.name;
      this.orgChargeIdDialog = false;
    },

    /**
     * 处理提交按钮
     */
    handleConfirm() {
      // 表单校验
      this.$refs["newForm"].validate(valid => {
        if (valid) {
          // '新建'
          if (this.type === 0) {
            this.submit();
          } else if (this.type === 1) {
            // '修改'
            this.modify();
          }
        }
      });
    },

    /**
     * 提交信息
     */
    submit() {
      createOrg(this.newForm).then(res => {
          if (res.data.errorCode === '000000') {
            this.$emit('saveSuccess', {
              ...res.data.results,
              orgChargeName: this.newForm.orgChargeName,
              parentName: this.newForm.parentName
            }, true)
            this.$message({
              message: "机构创建成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.errorMsg,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 修改信息
     */
    modify() {
      var _this = this;
      modifyOrg(Qs.stringify(this.newForm))
        .then(res => {
          if (res.data.errorCode === "000000") {
            _this.$emit(
              "saveSuccess",
              {
                ...res.data.results,
                orgChargeName: _this.newForm.orgChargeName,
                parentName: _this.newForm.parentName
              },
              false
            );
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "failed"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * 核查机构代码是否有效
     */
    reCheckOrgCode() {
      this.some = 0;
      if (this.newForm.code) {
        checkOrgCode(this.newForm.code).then(response => {
          if (response.data.errorCode != "000000") {
            this.some = -1;
            //清除字段的值
            this.$refs.newForm.validateField("code");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.choice-button {
  width: 100%;
  text-align: left;
  overflow-x: hidden;
}
</style>
