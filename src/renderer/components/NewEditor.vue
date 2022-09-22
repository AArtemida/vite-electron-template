<template>
  <v-md-editor class="code-editor" v-model="text" height="100%"></v-md-editor>
</template>

<script setup>
import { watch, ref } from 'vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlightjs
import hljs from 'highlight.js'
VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

const props = defineProps({
  value: String,
})

let text = ref('')
if (props && props.value) {
  text = value
}

// const emit = defineEmits(['change'])
// // 监听数据变化
watch(
  () => props.value,
  () => {
    // emit('change', text.value)
    text.value = props.value
  },
  { deep: true }
)

defineExpose({
  text,
})
</script>

<style lang="scss" scoped>
.code-editor {
  text-align: left;
}
.v-md-editor {
  :deep(.v-md-icon-fullscreen),
  :deep(.v-md-icon-save),
  :deep(.v-md-icon-img),
  :deep(.v-md-icon-sync) {
    display: none !important;
  }
}
</style>