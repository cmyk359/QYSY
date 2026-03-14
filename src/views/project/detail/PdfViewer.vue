<template>
  <div class="pdf-preview-container">
    <!-- 缩略图区域：显示所有 PDF 的第一页 -->
    <div class="thumbnail-bar" v-if="pdfs.length > 1">
      <div
        v-for="(pdf, index) in pdfs"
        :key="index"
        class="thumbnail-item"
        :class="{ active: selectedIndex === index }"
        @click="selectPdf(index)"
      >
        <div class="thumbnail-wrapper">
          <vue-pdf-embed
            :source="pdf.url"
            :page="1"
            :scale="0.2"
            @loaded="onThumbnailLoaded(index)"
          />
          <div class="thumbnail-title" v-if="pdf.title">{{ pdf.title }}</div>
        </div>
      </div>
    </div>
    <!-- 工具栏：分页控制 + 全页模式开关 -->
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

    <!-- 加载提示（仅主 PDF 加载时显示） -->
    <div v-if="isLoading" class="loading-tip">
      <div class="spinner"></div>
      <p>正在努力加载 PDF...</p>
    </div>

    <!-- 主 PDF 显示区域 -->
    <div class="pdf-content">
      <vue-pdf-embed
        ref="pdfRef"
        :source="currentPdfSource"
        :page="showAllPages ? null : page"
        :scale="scale"
        @rendered="handleDocumentRender"
        @loaded="handleLoaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

// 定义 props：接收 PDF 列表
const props = defineProps<{
  pdfs: Array<{ url: string; title?: string }>
}>()

// 主 PDF 相关状态
const pdfRef = ref(null)
const page = ref(1)
const pageCount = ref(0)
const scale = ref(1.0) // 保留缩放状态（但未在界面中控制，可后续添加按钮）
const showAllPages = ref(false)
const isLoading = ref(true)

// 当前选中的 PDF 索引
const selectedIndex = ref(0)

// 当前 PDF 的源地址
const currentPdfSource = computed(() => {
  return props.pdfs[selectedIndex.value]?.url
})

// 切换 PDF 时重置状态
watch(selectedIndex, () => {
  page.value = 1
  scale.value = 1.0
  showAllPages.value = false
  isLoading.value = true
})

// 事件处理
const handleLoaded = () => {
  isLoading.value = false
}

const handleDocumentRender = () => {
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

// 选择 PDF
const selectPdf = (index: number) => {
  if (selectedIndex.value !== index) {
    selectedIndex.value = index
  }
}

// 缩略图加载完成时的回调（可用来优化占位，此处留空）
const onThumbnailLoaded = (index: number) => {
  // 可根据需要添加逻辑，例如隐藏加载占位
}
</script>

<style scoped>
.pdf-preview-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 工具栏样式 */
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

/* 缩略图区域 */
.thumbnail-bar {
  display: flex;
  overflow-x: auto;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  gap: 12px;
  scrollbar-width: thin;
}

.thumbnail-item {
  flex: 0 0 auto;
  width: 100px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.thumbnail-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-item.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.thumbnail-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.thumbnail-wrapper :deep(.vue-pdf-embed) {
  width: 100%;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
}

.thumbnail-wrapper :deep(.vue-pdf-embed canvas) {
  width: 100%;
  height: auto;
  display: block;
}

.thumbnail-title {
  margin-top: 6px;
  font-size: 12px;
  color: #606266;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 主 PDF 内容区域 */
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

/* 加载动画 */
.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
