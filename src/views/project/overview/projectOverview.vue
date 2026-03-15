<template>
  <div class="flex-1 h-full flex flex-col gap-6">
    <BaseCard title="正在进行的项目" title-icon="HOutline:SquaresPlusIcon">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 pt-3">
        <!-- 加载骨架 -->
        <template v-if="loading">
          <div v-for="n in 5" :key="n" class="skeleton-card">
            <el-skeleton animated :rows="4" />
          </div>
        </template>
        <!-- 实际卡片 -->
        <ProjectCard
          v-for="project in proceededProjects"
          v-else
          :key="project.id"
          :project="project"
          @click="
            router.push({ name: 'DetailView', query: { id: project.id, name: project.name } })
          "
        />
      </div>
    </BaseCard>

    <BaseCard title="已完成的项目" title-icon="HOutline:SquaresPlusIcon">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 pt-3">
        <!-- 加载骨架 -->
        <template v-if="loading">
          <div v-for="n in 3" :key="n" class="skeleton-card">
            <el-skeleton animated :rows="4" />
          </div>
        </template>
        <!-- 实际卡片 -->
        <ProjectCard
          v-for="project in finishedProjects"
          v-else
          :key="project.id"
          :project="project"
          @click="
            router.push({ name: 'DetailView', query: { id: project.id, name: project.name } })
          "
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import type { IProjectItem } from '@/types/profile'
import { projectApi } from '@/api/project'
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'

// 正在进行的项目
const proceededProjects = ref<IProjectItem[]>([])
// 已完成的项目
const finishedProjects = ref<IProjectItem[]>([])
// 加载状态
const loading = ref(true)

onMounted(() => {
  projectApi
    .getProjectList()
    .then((response) => {
      if (response.code === 200) {
        const allProjects = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          desc: item.description,
          time: item.beginAt,
          icon: item.icon,
          color: item.color,
          progress: item.progress,
          status: item.status,
          members: item.members,
        }))
        proceededProjects.value = allProjects.filter((p) => p.progress < 100)
        finishedProjects.value = allProjects.filter((p) => p.progress === 100)
      } else {
        ElNotification.error('获取项目列表失败')
      }
    })
    .catch(() => ElNotification.error('请求出错'))
    .finally(() => {
      loading.value = false
    })
})
</script>

<style scoped lang="scss">
.skeleton-card {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  padding: 16px;
  box-sizing: border-box;
}
</style>
