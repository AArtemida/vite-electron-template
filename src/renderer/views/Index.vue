<template>
  <content class="content">
    <!-- S 左侧列表 -->
    <section class="section-left">
      <div id="btn" @click="click">发送</div>
      <!-- 左侧菜单 -->
      <div class="section-tab">
        <span
          v-for="(label, type) in leftTabs"
          :key="'left_tab_' + type"
          class="section-tab-item"
          :class="{ actived: selectTab === type }"
          @click="changeTab(type)"
        >
          {{ label }}
        </span>
      </div>
      <!-- 左侧内容 -->
      <div class="no-name">没有打开的文件</div>
    </section>
    <!-- E 左侧列表 -->

    <!-- S 中间区域 -->
    <section class="section-center">
      <Editor
        ref="editorBox"
        :value="contentText"
        @change="changeText"
      ></Editor>
    </section>
    <!-- E 中间区域 -->
  </content>
</template>

<script setup>
import Editor from '../components/NewEditor.vue'
import { ref } from 'vue'
// import { useIpcRenderer } from "@vueuse/electron";
import { ipcRenderer } from 'electron'

const selectTab = ref('file')
const leftTabs = {
  file: '文件',
  menu: '大纲',
}

const changeTab = type => {
  selectTab.value = type
}

let contentText = ref('')
const editorBox = ref(null)

// 监听保存文件内容
ipcRenderer.on('send-save-file', () => {
  console.log('-------------------------------')
  let dom = editorBox.value
  let btn = document.getElementById('btn')
  btn = 'test'
  if (dom) {
    let v = dom.value

    btn.innerText = v
    ipcRenderer.send('start-save-file', v)
  }
})

// 监听读取文件内容
ipcRenderer.on('get-md-content', (event, file) => {
  contentText.value = file.toString()
})

function click() {
  ipcRenderer.send('sendMessage', 'abc')
}
ipcRenderer.on('receiveMessage', (event, args) => {
  console.log('aaaaaaaaaaaaaaaaaa', args)
  let btn = document.getElementById('btn')
  btn.innerText = args
})

// 改变内容
const changeText = function (txt) {
  ipcRenderer.send('send-md-content', txt)
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  height: calc(100% - 60px);
  background: #fafafa;
  height: 100vh;
  width: 100vw;
  .section-left {
    width: 24%;
    border: 1px solid #e8e8e8;
    position: relative;
  }
  .section-center {
    flex: 1 auto;
    background: #fff;
    text-align: left;
  }
}
.section-tab {
  display: flex;
  padding: 5px 0;
  .section-tab-item {
    padding: 5px 0;
    margin: 0 20px;
    flex: 1 auto;
    cursor: pointer;
    display: inline-block;
    &.actived {
      border-bottom: 5px solid #333;
    }
  }
}
.no-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>