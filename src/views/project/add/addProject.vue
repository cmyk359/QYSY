<template>
  <div>
    <BaseCard class="container">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="项目开始时间">
          <el-date-picker
            v-model="value1"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="项目成员">
          <el-select
            v-model="value4"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Activity type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox value="Online activities" name="type"> Online activities </el-checkbox>
            <el-checkbox value="Promotion activities" name="type">
              Promotion activities
            </el-checkbox>
            <el-checkbox value="Offline activities" name="type"> Offline activities </el-checkbox>
            <el-checkbox value="Simple brand exposure" name="type">
              Simple brand exposure
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="项目描述">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="项目文档">
          <el-upload
            class="upload-demo"
            drag
            action="http://localhost:8080/api/upload"
            multiple
            name="file"
            :data="() => ({ projectName: form.name })"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            accept=".pdf"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">创建</el-button>
          <el-button>清空</el-button>
        </el-form-item>
      </el-form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/card/BaseCard.vue'
import { reactive } from 'vue'
import { ref } from 'vue'
import type { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

// 定义后端响应数据的类型
interface UploadResponse {
  code: number
  data: {
    url: string
  }
  message?: string
}

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

// 已上传文件列表（用于展示）
const fileList = ref<UploadUserFile[]>([])

// 上传前的校验
const beforeUpload = (file: UploadRawFile): boolean => {
  // 1. 文件类型校验：只允许 PDF
  const isPdf = file.type === 'application/pdf'
  if (!isPdf) {
    ElMessage.error('只能上传 PDF 格式的文件')
    return false
  }

  // 2. 文件大小限制（20MB）
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) {
    ElMessage.error('文件大小不能超过 20MB')
    return false
  }

  return true
}

// 上传成功回调
const handleSuccess = (response: UploadResponse, file: UploadFile, files: UploadFiles) => {
  if (response.code === 0) {
    ElMessage.success('上传成功')
    // 更新文件列表展示（只保留当前成功上传的文件）
    fileList.value = [file]
    const fileUrl = response.data.url
    console.log('文件访问地址：', fileUrl)
    // 可将 URL 赋值给其他响应式变量供后续使用
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败回调
const handleError = (err: Error, file: UploadFile, files: UploadFiles) => {
  ElMessage.error('上传出错，请重试')
  console.error('上传错误：', err)
}

const size = ref<'default' | 'large' | 'small'>('default')

const value1 = ref('')
// do not use same name with ref

const onSubmit = () => {
  console.log('submit!')
}
const value4 = ref([])
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>
