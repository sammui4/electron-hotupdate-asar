<!--
 * @Author: w
 * @Date: 2019-08-05 16:11:20
 * @LastEditors: w
 * @LastEditTime: 2019-08-15 14:44:29
 -->
<template>
  <transition name="fade">
    <el-dialog
      :visible.sync="msg.show"
      :close-on-click-modal="false"
      @closed="close"
      append-to-body
      class="update"
      width="480px">
      <p v-text="msg.title" class="title"></p>
      <div class="progress-wrapper">
        
        <ul class="update-list">
          <li v-for="(item,v) in msg.updateList" :key="v">
            <span v-text="v+1"></span>.<span v-text="item.text"></span>
          </li>
        </ul>
        <el-progress :percentage="msg.percent"></el-progress>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button size="small" @click="updateApp" type="primary" :loading="msg.loading">确定</el-button>
        <el-button size="small" @click="cancel()" v-if="msg.loading==false">取消</el-button>
      </div>
    </el-dialog>
    
  </transition>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "update",
  props: {
    msg:{
      type:Object,
      required:true,
      default(){
        return {
          show:false,
          percent:0,
          updateList:[],
          title:'',
          loading:false  
        }
      }
    }
  },
  data(){
    return{
      
    }
  },
  methods: {
    close() {
      // ipcRenderer.removeAllListeners(["message", "downloadProgress", "isUpdateNow"]);//remove只能移除单个事件，单独封装removeAll移除所有事件
      this.$emit("update:show", false);
    },
    updateApp() {
      // ipcRenderer.send("checkForUpdate");
      this.$emit('updateApp');
    },
    cancel(){
      this.msg.show = false
    }
  },
  
}
</script>


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


// .bg{
//   position: relative;
//   top:-60px;
//   left:-20px;
//   width: 420px;
//   height: 300px;
//   background: url('../assets/download.png');
// }
.update{
  /deep/ .el-dialog__header{
    background: url('../assets/images/download.png');
  }
  /deep/ .el-dialog__body{
    background: url('../assets/images/download.png');
    background-position-y: -30px;
  }
  /deep/ .el-icon-close{
    color: #fff;
  }
  .progress-wrapper{
    margin-top: 40px;
  }
  .update-list{
    margin-bottom: 30px;
    li{
      margin-bottom: 10px;
      color:#5A5A5A;
    }
  }
  .title{
    position: relative;
    top:-25px;
    color:#fff;
    font-size: 24px;
  }
}
</style>