<!--
 * @Descripttion: 
 * @Author: qt
 * @Date: 2021-03-09 08:27:16
 * @LastEditors: qt
 * @LastEditTime: 2021-03-16 16:18:30
-->
<!--  -->
<template>
  <div>
    <el-dialog
      title="选择协作部门参评人"
      :before-close="handleClose"
      :visible.sync="dialogTableVisible"
    >
      <div class="departmentBox">
        <div class="de_left">
          <div class="search">
            <el-input
              v-model="searchValue"
              prefix-icon="el-icon-search"
              placeholder="请输入内容"
              clearable
              @clear="searchClear"
            ></el-input>
            <el-button class="but" @click="search">搜索</el-button>
          </div>
          <el-tree v-if="searchType" :props="props" :load="loadNode" lazy>
            <p class="custom-tree-node" slot-scope="{ node, data }">
              <img
                :src="
                  data.logo
                    ? data.logo
                    : require('../assets/images/icon_sam_tx@3x.png')
                "
                class="logo"
                alt=""
                v-if="data.leaf"
              />
              <img
                src="../assets/images/icon_tab@3x.png"
                class="framwWork"
                alt=""
                v-else
              />

              <span>{{ node.label }}</span>
              <van-checkbox
                v-if="data.leaf"
                v-model="data.checked"
                icon-size="20px"
                @click="checkChange($event, data)"
              ></van-checkbox>
              <!-- <span>
                <el-button type="text" size="mini" @click="() => append(data)">
                  Append
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)"
                >
                  Delete
                </el-button>
              </span> -->
            </p></el-tree
          >
          <div v-else class="searchClass">
            <template v-if="this.searchData.length">
              <p
                class="custom-tree-node m_20"
                v-for="(item, index) in searchData"
                :key="index"
              >
                <img
                  :src="
                    item.logo
                      ? item.logo
                      : require('../assets/images/icon_sam_tx@3x.png')
                  "
                  class="logo"
                  alt=""
                />
                <span>{{ item.name }}</span>
                <van-checkbox
                  v-model="item.checked"
                  icon-size="20px"
                  @click="checkChange($event, item)"
                ></van-checkbox>
              </p>
            </template>
            <template v-else>
              <div class="notData">暂无数据</div>
            </template>
          </div>
        </div>
        <div class="de_right">
          <p>已选择{{ this.selectArr.length }}人</p>
          <div class="selectPeople">
            <div
              class="selectList"
              v-for="(item, index) in selectArr"
              :key="index"
            >
              <div class="list-content">
                <img
                  :src="
                    item.logo
                      ? item.logo
                      : require('../assets/images/icon_sam_tx@3x.png')
                  "
                  class="logo"
                  alt=""
                />
                <p>
                  <span>{{ item.name }}</span>
                  <span class="ellipsis">{{ item.departmentFullName }}</span>
                </p>
              </div>
              <img
                src="../assets/images/del.png"
                class="del"
                @click="del(item, index)"
                alt=""
              />
            </div>
          </div>
          <div class="selectBut">
            <el-button class="but" @click="handleClose">取消</el-button>
            <el-button class="but" type="primary" @click="addpeople"
              >添加</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkbox } from "vant";
import { departmentChild } from "@/api/api";
export default {
  props: {
    dVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogTableVisible: this.dVisible || false,
      searchType: true,
      treeArr: [],
      selectArr: [],

      searchValue: "",
      searchData: [],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
      depTree: {},
    };
  },

  watch: {
    dVisible: {
      handler: function(newVal, oldVal) {
        // console.log(newVal);
        // console.log(this);
        this.dialogTableVisible = newVal;
        this.departmentData();
      },
      deep: true,
      // immediate: true,
    },
  },
  components: {
    "van-checkbox": checkbox,
  },

  methods: {
    searchClear() {
      this.searchType = true;
    },
    async search() {
      console.log(this.selectArr);
      if (this.searchValue.length) {
        var data = await this.departmentData({ name: this.searchValue });
        data.employees.forEach((item, index) => {
          this.selectArr.forEach((ite, ind) => {
            if (ite.id == item.id) {
              data.employees[index] = ite;
            }
          });
        });
        this.searchData = data.employees;
        this.searchType = false;
        console.log(this.searchData);
      } else {
        this.searchType = true;
      }
    },
    addpeople() {
      this.$emit("close", false);
      this.$emit("selectArr", this.selectArr);
      localStorage.setItem("selectArr", JSON.stringify(this.selectArr));
    },
    del(item, index) {
      var ind = this.selectArr.findIndex((ite) => {
        return item.id == ite.id;
      });
      if (ind !== -1) {
        item.checked = false;
        this.selectArr.splice(ind, 1);
      }
      console.log(item);
      // localStorage.setItem("selectArr", JSON.stringify(this.selectArr));
    },
    checkChange(val, data) {
      if (this.selectArr.length > 5 && data.checked) {
        this.$message({
          message: "人数已满",
          type: "warning",
          duration: 800,
        });
        data.checked = false;
      } else {
        if (data.checked) {
          this.selectArr.push(data);
        } else {
          console.log(this.selectArr);
          console.log(data);
          // this.selectArr.push(data);
          // var ind = this.selectArr.indexOf(data);
          var ind = this.selectArr.findIndex((item) => {
            return item.id == data.id;
          });
          console.log(ind);
          if (ind !== -1) {
            this.selectArr.splice(ind, 1);
          }
        }
      }
      // localStorage.setItem("selectArr", JSON.stringify(this.selectArr));
    },
    async loadNode(node, resolve) {
      // setTimeout(() => {
      var obj = await this.departmentData();
      console.log(obj);
      // var data = [...obj.employees, ...obj.childDepartMents];
      // const data = [
      //   {
      //     name: "leaf",
      //   },
      //   {
      //     name: "zone",
      //   },
      // ];
      // resolve(data);

      console.log(node);
      var id = "";
      if (node.data) {
        id = node.data.departmentId || "";
      }
      // var
      var obj = await this.departmentData({ id });
      console.log(obj);
      // var employees=obj.employees
      var employees = obj.employees.map((item, index) => {
        console.log(item);
        console.log(this.selectArr);
        item.leaf = true;
        // var ind = this.selectArr.findIndex((ite) => {
        //   return ite.id == item.id;
        // });
        // if (ind !== -1) {
        //   item.checked = true;
        // } else {
        //   item.checked = false;
        // }

        return item;
      });
      console.log(employees);
      var arr = [...employees, ...obj.childDepartMents];
      arr.forEach((item, index) => {
        if (item.leaf) {
          this.selectArr.forEach((ite, ind) => {
            if (ite.id == item.id) {
              console.log(item);
              console.log(ite);
              arr[index] = ite;
            }
          });
        }
      });
      console.log(arr);
      // this.treeArr = arr;
      return resolve(arr);
    },

    departmentData(data) {
      console.log(data);
      // console.log(JSON.parse(localStorage.getItem("userInfo")));
      var params = {
        evaluatedEmpno: JSON.parse(localStorage.getItem("userInfo")).ehrCode,
        evaluationid: this.$route.query.evaluationId,
        // name: JSON.parse(localStorage.getItem("userInfo")).name,
      };
      if (data && data.id) {
        params.departmentId = data.id;
      }
      if (data && data.name) {
        params.name = data.name;
      }
      return new Promise((resolve, reject) => {
        departmentChild(params).then((res) => {
          resolve(res);
        });
      });
    },
    handleClose() {
      this.$emit("close", false);
      // this.$emit("selectArr", this.selectArr);
      // localStorage.setItem("selectArr", JSON.stringify(this.selectArr));
    },
  },
  created() {
    if (localStorage.getItem("selectArr")) {
      this.selectArr = JSON.parse(localStorage.getItem("selectArr"));
    }
  },
};
</script>
<style lang="scss">
@function pcRem($args) {
  @return $args/1.44;
}
.el-message {
  .el-message__icon {
    font-size: pcRem(18px) !important;
  }
}
</style>
<style lang="scss" scoped>
@function pcRem($args) {
  @return $args/1.44;
}
.m_20 {
  margin: pcRem(20px) 0;
}
/deep/ .el-dialog__wrapper {
  .notData {
    font-size: pcRem(20px);
    line-height: pcRem(300px);
    text-align: center;
    height: pcRem(300px);
  }
  .el-dialog {
    width: pcRem(784px);
    height: pcRem(720px);

    display: flex;
    flex-direction: column;
  }
  .el-dialog__body {
    padding: 0px;
    flex: 1;

    padding-top: 0;
  }
  .el-dialog__title {
    font-size: 12px;
  }
  .departmentBox {
    display: flex;
    height: 100%;
    overflow-y: hidden;
    .de_left {
      flex: 1;

      border-right: 1px solid #ccc;
      .search {
        margin-left: pcRem(20px);
        .el-input {
          width: pcRem(243px);
          font-size: pcRem(14px);
          .el-input__inner {
            height: pcRem(36px);
            border: none;
            background: #f9f9f9;
            border-radius: pcRem(16px);
          }
          .el-input__icon {
            line-height: pcRem(36px);
          }
        }
        .el-button {
          margin-left: pcRem(20px);
          border-radius: pcRem(77px);
          background: #299ffc;
          font-family: SourceHanSansCN-Regular;
          font-size: pcRem(12px);
          color: #ffffff;
          text-align: center;
        }
      }
    }
    .de_right {
      position: relative;
      flex: 1;
      > p {
        font-family: PingFangSC-Medium;
        font-size: pcRem(16px);
        color: #4697ff;
        margin: pcRem(27px) 0 pcRem(8px) pcRem(24px);
      }
      .selectPeople {
        .selectList {
          margin: 0 pcRem(30px) 0 pcRem(24px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: pcRem(17px) 0;
          border-bottom: 1px solid #f5f5f5;
          .list-content {
            display: flex;
            align-content: center;
            img {
              width: pcRem(32px);
              height: pcRem(32px);
            }
            p {
              margin-left: 8px;

              span {
                font-family: PingFangSC-Regular;
                font-size: pcRem(14px);
                color: #333333;
                letter-spacing: 0;
                line-height: pcRem(14px);
                display: block;

                margin-bottom: 4px;
                &:last-child {
                  // width: pcRem(250px);
                  font-family: PingFangSC-Regular;
                  font-size: pcRem(12px);
                  width: pcRem(250px);
                  color: #999999;
                  letter-spacing: 0;
                  line-height: pcRem(12px);
                }
              }
            }
          }
          .del {
            width: pcRem(8px);
            height: pcRem(8px);
            cursor: pointer;
          }
        }
      }
      .selectBut {
        text-align: right;
        overflow: hidden;

        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: pcRem(1px) solid #ccc;
        .el-button {
          margin: 10px 10px;
          width: pcRem(98px);
          height: pcRem(48px);
          padding: 0;
          line-height: pcRem(48px);
          text-align: center;
        }
      }
    }
  }
  .custom-tree-node {
    padding-left: pcRem(20px);
    display: block;
    width: 100%;

    .framwWork {
      width: pcRem(16px);
      height: pcRem(16px);
      margin-right: pcRem(8px);
      vertical-align: middle;
    }
    .logo {
      width: pcRem(32px);
      height: pcRem(32px);
      margin-right: pcRem(8px);
      vertical-align: middle;
    }
    span {
      font-family: PingFangSC-Regular;
      vertical-align: middle;
      font-size: pcRem(14px);
      color: #333333;
      letter-spacing: 0;
      line-height: pcRem(14px);
    }
    .van-checkbox {
      float: right;
      margin-right: pcRem(30px);
      margin-top: 5px;
      // width: pcRem(16px);
      // height: pcRem(16px);
    }
  }
  .searchClass {
    height: pcRem(600px);
    overflow-y: auto;
  }
  .el-tree {
    height: pcRem(600px);

    overflow: auto;
    .el-tree-node__content {
      margin: pcRem(11px) 0 !important;
    }
    .el-tree-node__expand-icon {
      display: none;
    }
  }
}
</style>
