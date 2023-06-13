<template>
  <div id="userData">
    <p class="title">用户管理</p>
    <div class="main">
      <el-table :data="userData" border style="width: 100%">
        <el-table-column prop="name" label="名称" width="170" />
        <el-table-column prop="username" label="账号" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="time" label="时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <p class="func">
              <em class="editBtn" @click="openEdit(scope.row)">编辑</em>
              <em class="delBtn" @click="delUser(scope.row.id, scope.$index)"
                >删除</em
              >
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Teleport to="body">
      <Transition name="tran-221" mode="out-in">
        <div id="editUser" v-show="showEditUser">
          <p @click="closeEdit"></p>
          <div>
            <div>
              <p class="title">正在编辑用户 {{ userInfo.name }} 的信息:</p>
              <div>
                <i>名称</i>
                <input type="text" v-model="userInfo.name" />
              </div>
              <div>
                <i>邮箱</i>
                <input type="email" v-model="userInfo.email" />
              </div>
              <div>
                <i>账号</i>
                <input type="text" v-model="userInfo.username" />
              </div>
              <div>
                <i>密码</i>
                <input type="text" v-model="userInfo.password" />
              </div>
              <i class="btn" @click="sendEdit">确定修改</i>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { yumaoStore } from "@/store";
import { isReactive, onMounted, reactive, readonly, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import adminApi from "@/axios/admin";
import { ElMessage } from "element-plus";
import { adminStore } from "@/store/admin";

let aS = adminStore();
let showEditUser = ref(false);
let userInfo = reactive({
  id: "",
  name: "",
  email: "",
  username: "",
  password: "",
});
let userData;

if (aS.userData.length) {
  userData = reactive(aS.userData);
} else {
  let { data } = await adminApi.getAllUser();
  userData = reactive(data.reverse());
  aS.userData = data;
}

let openEdit = (v) => {
  userInfo = v;
  showEditUser.value = true;
};
let closeEdit = () => {
  showEditUser.value = false;
};
let sendEdit = async () => {
  let data = await adminApi.editUser(userInfo);
  let { state } = data;
  if (state == 200) {
    ElMessage({
      showClose: true,
      message: "修改成功",
      type: "success",
      duration: 3000,
    });
  }
};
let delUser = async (id, index) => {
  let data = await adminApi.delUser(id);
  let { state } = data;
  if (state == 200) {
    userData.splice(index, 1);
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
      duration: 3000,
    });
  }
};
</script>


<style lang="less" scoped>
#userData {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 95%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 25px;
    line-height: 30px;
    font-size: 20px;
    border-left: 3px solid #606266;
    border-radius: 3px;
    padding-left: 10px;
    color: #606266;
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
    .func {
      .editBtn {
        color: rgb(136, 158, 255);
        background: rgba(236, 245, 255, 1);
        padding: 3px 10px;
        border-radius: 3px;
        &:hover {
          background: rgba(95, 150, 213, 0.2);
        }
      }
      .delBtn {
        color: white;
        background: rgba(245, 108, 108, 0.6);
        padding: 3px 10px;
        border-radius: 4px;
        &:hover {
          background: rgba(245, 108, 108, 1);
        }
      }
      em {
        transition: all 1s;
        margin-right: 25px;
        cursor: pointer;
      }
    }
  }
}
#editUser {
  position: fixed;
  z-index: 3;
  top: 0;
  width: 100vw;
  height: 100vh;
  > p {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.3;
    background: rgb(0, 0, 0);
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background: white;
    border-radius: 3px;
    > div {
      width: 550px;
      margin-top: 15px;
      margin-bottom: 15px;
      .title {
        margin-bottom: 20px;
      }
      .btn {
        padding: 3px 10px;
        background: rgb(64, 158, 255);
        color: white;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
        opacity: 1;
        transition: all 0.5s;
        &:hover {
          opacity: 0.8;
        }
      }
      > div {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        i {
          color: rgb(104, 106, 109);
          font-size: 14px;
          margin-bottom: 5px;
        }
        input {
          width: 200px;
          height: 28px;
          padding: 0 10px;
          border: 1px solid rgb(223, 225, 232);
          border-radius: 3px;
          transition: all 1s;
          &:hover {
            border: 1px solid rgb(64, 158, 255);
          }
        }
      }
    }
  }
}
.tran-221-enter-active,
.tran-221-leave-active {
  transition: all 0.5s;
}
.tran-221-enter-from,
.tran-221-leave-to {
  opacity: 0;
}
</style>