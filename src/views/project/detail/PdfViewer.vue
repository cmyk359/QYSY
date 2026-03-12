<template>
  <div class="pdf-preview-container">
    <div class="toolbar">
      <div class="controls">
        <el-button @click="prevPage" :disabled="page <= 1">上一页</el-button>
        <span>第 {{ page }} / {{ pageCount }} 页</span>
        <el-button @click="nextPage" :disabled="page >= pageCount">下一页</el-button>
      </div>

      <div class="mode-switch">
        <label> <input type="checkbox" v-model="showAllPages" /> 显示全部页面 </label>
      </div>
    </div>

    <div v-if="isLoading" class="loading-tip">
      <div class="spinner"></div>
      <p>正在努力加载 PDF...</p>
    </div>

    <div class="pdf-content">
      <vue-pdf-embed
        ref="pdfRef"
        :source="pdfSource"
        :page="showAllPages ? null : page"
        :scale="scale"
        @rendered="handleDocumentRender"
        @loaded="handleLoaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

// 1. PDF 源文件地址 (可以是 URL、本地路径或 Uint8Array)
const pdfSource = ref(
  'https://project.catpaws.top/%E4%BB%BB%E5%8A%A15.3-%E7%BB%93%E6%9E%84%E5%8C%96%E6%A0%87%E6%B3%A8-%E6%96%87%E7%A7%91%E7%AD%94%E9%A2%98-%E6%A0%87%E6%B3%A8%E6%96%B9%E6%A1%881218.pdf',
)

// 2. 状态变量
const pdfRef = ref(null)
const page = ref(1)
const pageCount = ref(0)
const scale = ref(1.0)
const showAllPages = ref(false)
const isLoading = ref(true)

// 3. 事件处理
const handleLoaded = () => {
  isLoading.value = false
}

const handleDocumentRender = () => {
  // 获取总页数
  if (pdfRef.value) {
    pageCount.value = pdfRef.value.doc.numPages
  }
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const nextPage = () => {
  if (page.value < pageCount.value) page.value++
}
</script>

<style scoped>
.pdf-preview-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.toolbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background: #ffffff;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ddd;
  z-index: 10;
}

.toolbar button {
  margin: 0 10px;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  color: #333;
  transition: background-color 0.2s;
}

.toolbar button:hover:not(:disabled) {
  background: #e0e0e0;
}

.toolbar button:disabled {
  background: #fafafa;
  color: #999;
  border-color: #ddd;
  cursor: not-allowed;
}

.toolbar span,
.toolbar label {
  color: #333;
}

.pdf-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  background: #f5f5f5;
}

:deep(.vue-pdf-embed) {
  width: 100%;
  max-width: 900px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 1.2rem;
}
</style>
