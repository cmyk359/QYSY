<template>
  <div>
    <BaseCard class="container">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="项目时间">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="项目成员">
          <el-select
            v-model="form.members"
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
        <el-form-item label="项目描述">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="项目文档">
          <el-upload
            class="upload-demo"
            drag
            multiple
            action="http://localhost:8080/api/files/upload"
            name="file"
            :data="() => ({ projectName: form.name })"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-remove="handleRemove"
            :file-list="fileList"
            accept=".pdf"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">创建</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/card/BaseCard.vue'
import { reactive } from 'vue'
import { ref } from 'vue'
import {
  type UploadFile,
  type UploadFiles,
  type UploadRawFile,
  type UploadUserFile,
  ElNotification,
} from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { projectApi } from '@/api/project'
import { fileApi } from '@/api/files'

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
  date: ['', ''] as [string, string],
  members: [] as string[],
  desc: '',
  fileLinks: [] as string[], // 用于存储上传成功后的文件链接
})
const options: { value: string; label: string }[] = []
// 已上传文件列表（用于展示）
const fileList = ref<UploadUserFile[]>([])

// 上传前的校验
const beforeUpload = (file: UploadRawFile): boolean => {
  // 1. 文件类型校验：只允许 PDF
  const isPdf = file.type === 'application/pdf'
  if (!isPdf) {
    ElNotification({
      title: '错误',
      message: '只能上传 PDF 格式的文件',
      type: 'error',
    })
    // ElMessage.error('只能上传 PDF 格式的文件')
    return false
  }

  // 2. 文件大小限制（20MB）
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) {
    ElNotification({
      title: '错误',
      message: '文件大小不能超过 20MB',
      type: 'error',
    })
    // ElMessage.error('文件大小不能超过 20MB')
    return false
  }

  return true
}

// 上传成功回调
const handleSuccess = (response: UploadResponse, file: UploadFile, files: UploadFiles) => {
  if (response.code === 0) {
    ElNotification({
      title: '成功',
      message: '上传成功',
      type: 'success',
    })
    // 将后端返回的 URL 赋值给 file.url，以便在列表中显示链接
    file.url = response.data.url
    // 将当前文件追加到文件列表
    fileList.value.push(file)
    // 将文件链接添加到表单数据中
    form.fileLinks.push(response.data.url)
    console.log('文件访问地址：', response.data.url)
  } else {
    ElNotification({
      title: '错误',
      message: response.message || '上传失败',
      type: 'error',
    })
  }
}

// 上传失败回调
const handleError = (err: Error, file: UploadFile, files: UploadFiles) => {
  ElNotification({
    title: '错误',
    message: err.message || '上传出错，请重试',
    type: 'error',
  })
  // ElMessage.error('上传出错，请重试')
  console.error('上传错误：', err)
}

// 文件移除时的处理
const handleRemove = async (file: UploadFile, files: UploadFiles) => {
  // 如果文件没有 URL（比如上传失败的文件），直接移除本地记录即可
  if (!file.url) {
    return
  }

  // 保存当前文件副本，以便失败后恢复（浅拷贝即可，因为只需要保留引用）
  const fileCopy = { ...file }

  try {
    const response = await fileApi.deleteFile(file.url)
    if (response.code === 200) {
      ElNotification({
        title: '成功',
        message: '文件已删除',
        type: 'success',
      })
      // 从 fileLinks 中移除对应的 URL
      const index = form.fileLinks.findIndex((link) => link === file.url)
      if (index !== -1) {
        form.fileLinks.splice(index, 1)
      }
      // fileList 由 el-upload 自动更新，无需额外操作
    } else {
      ElNotification({
        title: '错误',
        message: '删除失败：' + response.message,
        type: 'error',
      })
      // 删除失败，需要将文件重新添加到列表中
      fileList.value.push(fileCopy)
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '删除请求出错，请重试',
      type: 'error',
    })
    console.error('删除错误：', error)
    // 请求异常，恢复文件列表
    fileList.value.push(fileCopy)
  }
}

const onSubmit = () => {
  console.log('提交表单数据：', form)
  projectApi
    .addProject({
      name: form.name,
      date: form.date,
      members: form.members,
      desc: form.desc,
      fileLinks: form.fileLinks,
    })
    .then((response) => {
      if (response.code === 200) {
        ElNotification({
          title: '成功',
          message: '项目创建成功',
          type: 'success',
        })
        // 可选择清空表单或跳转到项目列表页
      } else {
        ElNotification({
          title: '错误',
          message: '项目创建失败',
          type: 'error',
        })
      }
    })
    .catch((error) => {
      ElNotification({
        title: '错误',
        message: '请求出错，请重试',
        type: 'error',
      })
      console.error('请求错误：', error)
    })
}

onMounted(() => {
  //从后端查询员工姓名列表
  projectApi
    .getUsers()
    .then((response) => {
      if (response.code === 200) {
        const users = response.data
        console.log('员工列表响应：', response)
        for (const user of users) {
          options.push({
            value: String(user.id),
            label: user.name,
          })
        }
        console.log('员工列表：', users)
      } else {
        ElMessage.error('获取员工列表失败')
      }
    })
    .catch((error) => {
      ElMessage.error('请求员工列表出错')
      console.error('请求错误：', error)
    })
})

const resetForm = () => {
  form.name = ''
  form.date = ['', ''] as [string, string]
  form.members = []
  form.desc = ''
  form.fileLinks = []
  fileList.value = []
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>
