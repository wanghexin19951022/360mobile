<template>
  <div class="selectPeople">
    <div class="selectPeople-serach">
        <div class="content">
            <div style="padding: 16px 0px 12px 16px;">
                <img src="@/assets/images/search@2x.png" alt="" class="searchImg">
            </div>
            <div style="width:88%">
                    <van-field
                    v-model='serachValue' 
                    type="text"
                    clearable
                    placeholder="请输入关键词"
                    @clear="clearSearch"
                    @input="serachEmployee"
                ></van-field>
            </div>
        </div>
    </div>
    <!-- 搜索框有值就切换页面 -->
    <div v-if="!show">
        <div class="split"></div>
        <div
            v-for="(item, index) in currentList"
            :key="index"
          >
           <div class="selectPeople-list" @click="selectRow(item, index)">
                <van-field
                    v-model="item.name"
                    readonly   
                />
                <img v-if="!item.status" src="@/assets/images/icon_lb@2x.png" class="img" alt="" />
                <img v-else src="@/assets/images/icon_sam_tx@2x.png" class="img" alt="" />
                <img v-if="!item.status" src="@/assets/images/icon_r@2x.png" class="img2" alt="" />
                <img v-if="item.selected===false"  src="@/assets/images/icon_wxz@2x.png" class="img2" alt="" />
                <img v-if="item.selected" src="@/assets/images/icon_xz@2x.png" class="img2" alt="" />
           </div>
        </div>
    </div>

<!-- 搜索展示的员工列表 -->
    <div v-if="show">
        <div class="split"></div>
        <div
            v-for="(item, index) in serachEmploy"
            :key="index"
          >
           <div class="selectPeople-listTwo" @click="selectSearchRow(item, index)">
                <van-field
                    v-model="item.name"
                    readonly   
                />
                <img v-if="item.selected===false" src="@/assets/images/icon_wxz@2x.png" class="img" alt="" />
                <img v-if="item.selected" src="@/assets/images/icon_xz@2x.png" class="img" alt="" />
                <img src="@/assets/images/icon_sam_tx@2x.png" class="img3" alt="" />   
           </div>
        </div>
    </div>

    <div class="alreadySelect">
        <div class="alreadySelect-content" style="display: flex">
            <div class="people">已选择{{ selectNum }}人</div>
            <div class="imgStyle" @click="openPopup">
                <img src="@/assets/images/icon_up@2x.png" class="img" alt="" />
            </div>
            <div class="enter" @click="confirm">
                <span>确定</span>
            </div>
        </div>
        <!-- 选择人下面的弹框 -->
        <van-popup
            v-model="selectShow"
            round
            position="bottom"
        >
        <div class="alreadySelect-opencontent">
            <div style="display: flex;">
                <div class="people">已选择{{ selectNum }}人</div>
                <div class="imgStyle" @click="closePopup">
                    <img src="@/assets/images/icon_down@2x.png" class="img" alt="" />
                </div>
            </div>
            <div class="split"></div>
            <div
                v-for="(item, index) in selectEmployee"
                :key="index"
            >
                <div class="list">
                    <div>
                        <div style="display: flex;">
                            <img src='@/assets/images/icon_sam_tx@2x.png'  class="img" alt="" />
                            <div class="departName">
                                <div>{{ item.name }}</div>
                                <div class="ellipsis">{{ item.departmentFullName }}</div>
                            </div>
                            <img src="@/assets/images/首页@2x.png" class="img2" alt="" @click="delEmployee(item)" />
                        </div>
                        <div class="split"></div>
                    </div>
                        
                </div>
            </div>
            <div class="enter" @click="confirm">
                <span>确定</span>
            </div>
        </div>
        
        </van-popup>
    </div>
    <div v-if="noPeopleDepart" class="noPeopleDepart">
        <div>
          <img src="@/assets/images/bg_jzkp.png" alt="" />
        </div>
        <div>
          <span>暂无员工或部门</span>
        </div>
      </div>
  </div>
</template>
<script>

import { Field, Toast, Popup } from "vant";
import { departmentChild } from "@/api/api";
export default {
  name: "SelectPeople",
  components: {
    'van-field': Field,
    'van-popup': Popup
  },
  data() {
    return {
        serachValue: '', // 搜索框绑定值
        show: false, // 页面切换状态
        currentList: [], // 
        selectShow: false, // 已选人的弹框状态
        selectEmployee: [], // 已选员工数组
        selectNum: 0, // 已选人数
        serachEmploy: [], // 通过搜索获取的员工列表
        noPeopleDepart: false, // 展示没有人，没有部门页面
        timer: null,
        len: false
    };
  },
  created() {
    // this.initData();
  },
  watch: {
      $route:{
          handler(newVal, old){
              console.log(newVal,old)
              this.initData()
          },
          deep: true,
          immediate: true
            
      }
  },
  methods: {
    initData() {
        console.log(this.$route.query)
      let route = this.$route.query
      // 如果已选了数据，对其进行回显
      if (JSON.parse(localStorage.getItem('selectArr'))) {
          this.selectEmployee = JSON.parse(localStorage.getItem('selectArr'))
          this.selectNum = this.selectEmployee.length
      }
      const local = JSON.parse(localStorage.getItem('userInfo'))
      const obj = {
          departmentId: '',
          name: '',
          evaluatedEmpno: ''
      }
      if (route.depart) {
          route = JSON.parse(route.depart)
          obj.departmentId = route.departmentId
          obj.evaluatedEmpno = local.ehrCode
      }
      // 获取员工和部门
      this.getEmployeeOrDepart(obj)
      
    },
    // 点击清除按钮页面切换
    clearSearch() {
        this.show = false
    },  
    getEmployeeOrDepart(obj) {
        departmentChild(obj).then(res => {
        let depart = res.childDepartMents // 部门
        // 通过 status 区分部门（false）和员工（true）
        if (depart.length > 0) {
            depart = depart.map(item => {
                item.status = false
                return item
            })
        }
        let employee = res.employees
        if (employee.length > 0) {
            employee = employee.map(item => {
                item.status = true
                item.selected = false
                return item
            })
        }
        this.currentList = [...employee, ...depart]

        if (this.currentList.length > 0) {
            this.noPeopleDepart = false
        } else {
            this.noPeopleDepart = true
        }
        // 在不同页面，判断当前页的人是否已经被选中过，选中对其进行回显
        if (employee.length > 0 && this.selectEmployee.length > 0) {
            this.selectEmployee.forEach(element => {
                if (this.currentList.findIndex(item => item.id === element.id) !== -1) {
                    this.currentList[this.currentList.findIndex(item => item.id === element.id)].selected = true
                }
            })
        }
      })
    },
    selectRow(item, index) {
        if (!item.status) {       
            this.$router.push({ path: "/selectPeople", query: { depart: JSON.stringify(item), evaluationId: this.$route.query.evaluationId, id: this.$route.query.id } });
        } else {
            // 如果item.selected是true说明现在是选中状态，选中状态则取消
            if (item.selected) {
                let that = this
                this.$set(this.currentList[index], 'selected', false)
                // 找出存储已选的数组中当前选中元素的索引，存在则删除
                if (this.selectEmployee.length > 0) {                   
                    if (that.selectEmployee.findIndex(element => item.id === element.id) !== -1) {
                       
                        that.selectEmployee.splice(that.selectEmployee.findIndex(element => item.id === element.id), 1)  
                    }                    
                 }
                this.selectNum -= 1
            } else {
                if (this.selectNum >= 6) {
                    // 超过6人提示
                    Toast('人数已满')
                } else {
                    this.$set(this.currentList[index], 'selected', true)
                    this.selectEmployee.push(item)
                    this.selectNum += 1    
                }
            }  
        }     
    },
    openPopup() {
        this.selectShow = true
    },
    closePopup() {
        this.selectShow = false
    },
    confirm() {
        localStorage.setItem('selectArr', JSON.stringify(this.selectEmployee))
        
        this.$router.push({ path: "/ChooseDepartment", query: { evaluationId: this.$route.query.evaluationId, id: this.$route.query.id } });
    },
    delEmployee(item) {
        if (this.selectEmployee.findIndex(element => item.id === element.id) !== -1) {
            this.selectEmployee.splice(this.selectEmployee.findIndex(element => item.id === element.id), 1)  
        } 
        if (this.currentList.findIndex(element => item.id === element.id) !== -1) {
            this.currentList[this.currentList.findIndex(element => item.id === element.id)].selected = false
        } 
        if (this.serachEmploy.findIndex(element => item.id === element.id) !== -1) {
            this.serachEmploy[this.serachEmploy.findIndex(element => item.id === element.id)].selected = false
        }     
        this.selectNum -= 1
    },
    serachEmployee(str) {
        this.clearTimer()
        if (str !== '') {
            this.show = true
            this.timer = setTimeout(() => {
                const local = JSON.parse(localStorage.getItem('userInfo'))
                const obj = {
                    // departmentId: '',
                    name: str,
                    evaluatedEmpno: local.ehrCode
                }
                departmentChild(obj).then(res => {   
                    this.serachEmploy = res.employees
                    console.log(this.serachEmploy)
                    if (this.serachEmploy.length > 0) {
                        this.serachEmploy = this.serachEmploy.map(item => {
                            item.selected = false
                            return item
                        })
                    }
                    // 通过搜索获取到的员工要和已选择的员工进行比较，如果有已选择的，对其进行回显
                    this.selectEmployee.forEach(element => {
                        if (this.serachEmploy.findIndex(item => item.id === element.id) !== -1) {
                            this.serachEmploy[this.serachEmploy.findIndex(item => item.id === element.id)].selected = true
                        }
                    })   
                })
            }, 500)
        } else {
            this.show = false
        }
    },
    selectSearchRow(item, index) {
        if (item.selected) {
            let that = this
            this.$set(this.serachEmploy[index], 'selected', false)
            // 找出存储已选的数组中当前选中元素的索引，存在则删除
            if (this.serachEmploy.length > 0) {                   
                if (that.selectEmployee.findIndex(element => item.id === element.id) !== -1) {
                    
                    that.selectEmployee.splice(that.selectEmployee.findIndex(element => item.id === element.id), 1)  
                }                    
                }
            this.selectNum -= 1
        } else {
            if (this.selectNum >= 6) {
                // 超过6人提示
                Toast('人数已满')
            } else {
                this.$set(this.serachEmploy[index], 'selected', true)
                this.selectEmployee.push(item)
                this.selectNum += 1    
            }
        }  
    },
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-field__clear {
    color: #000000;
}
.selectPeople {
    padding-bottom: 75px;
    &-serach {
        padding: 16px;
        .content {
            background: #F9F9F9;
            height: 40px;
            // padding: 12px 8px 12px 16px;
            border-radius: 16px;
            display: flex;
            width: 100%;
            position: relative;
            /deep/ .van-cell {
                padding: .21rem 0px .21rem .33rem;
                border-radius: .21rem;
                background: #F8F8F8;
            }
        }
        .searchImg {
            width: 16px;
            height: 16px;
        }
    }
    &-list {
        font-size: 14px;
        color: #333333;
        line-height: 12px;
        position: relative;
        /deep/ .van-cell {
                padding-left: 42px;
                background: #fff;
            }
        .depart {
            
        }
        .img {
            width: 16px;
            height: 16px;
            position: absolute;
            left: 16px;
            top: 14px;
        }
        .img2 {
            width: 12px;
            height: 12px;
            position: absolute;
            right: 18px;
            top: 16px;
        }
        .img3 {
            width: 32px;
            height: 32px;
        }


    }
    &-listTwo {
        font-size: 14px;
        color: #333333;
        line-height: 12px;
        position: relative;
        /deep/ .van-cell {
                padding-left: 88px;
                background: #fff;
            }
        .img {
            width: 16px;
            height: 16px;
            position: absolute;
            left: 16px;
            top: 14px;
        }
        .img2 {
            width: 12px;
            height: 12px;
            position: absolute;
            right: 18px;
            top: 16px;
        }
        .img3 {
            width: 32px;
            height: 32px;
            position: absolute;
            top: 7px;
            left: 48px;
        }
    }
    .split {
        margin: 1px 16px;
        border-top: 1px solid  #F5F5F5;
    }
}

.alreadySelect {
    font-size: 16px;
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 100%;
    &-content {
        padding: 0px 16px 19px 24px;
        .people {
            color: #4697FF;
            padding: 12px 0px 12px 0px;
        }
        .imgStyle {
            padding: 15px 46px 0px 5px;
            // padding-top: 15px;
            // padding-right: 29px;
            // padding-left: 5px;
            .img {
                width: 12px;
                height: 12px;  
            }
        }
        .enter {
            background: #4697FF;
            text-align: center;
            // padding: 13px 0px;
            border-radius: 4px;
            color: #fff;
            padding: 13px 92px;
            position: fixed;
            right: 16px;
            bottom: 17px;
        }
    }

    &-opencontent {
        padding-bottom: 85px;
        .people {
            color: #4697FF;
            padding: 16px 0px 16px 16px;
        }
        .imgStyle {
            position: absolute;
            top: 22px;
            right: 16px;
            .img {
                width: 12px;
                height: 12px;
            }
        }
        .enter {
            background: #4697FF;
            text-align: center;
            padding: 13px 0px;
            border-radius: 4px;
            color: #fff;
            padding: 13px 92px;
            position: fixed;
            bottom: 24px;
            right: 16px;
        }
        .list {
            font-size: 12px;
            color: #333333;
            line-height: 12px;
            position: relative;
            padding: 16px 8px 0px 16px;
            .img {
                width: 32px;
                height: 32px;
                
            }
            .img2 {
                width: 12px;
                height: 12px;
                position: absolute;
                right: 16px;
                top: 26px;
            }
            .departName {
                line-height: 16px;
                margin-left: 8px;
                :nth-child(1) {
                    color: #333333;
                }
                :nth-child(2) {
                    width: 90%;
                    color: #999999;
                }
            }
            .split {
                margin: 16px 0px 0px 0px;
                border-top: 1px solid  #F5F5F5; 
                
            }
        }
    }
}
.noPeopleDepart {
    text-align: center;
    color: #666666;

    img {
      width: 320px;
      height: 136px;
    }
}
</style>
