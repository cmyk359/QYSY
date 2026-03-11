<template>
  <template v-if="!item.hidden">
    <el-sub-menu v-if="hasChildren" :index="item.id">
      <template #title>
        <el-icon v-if="item.icon">
          <component :is="menuStore.iconComponents[item.icon]" />
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>

    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.icon">
        <component :is="menuStore.iconComponents[item.icon]" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
// 定义接收的属性
const props = defineProps(['item'])

const menuStore = useMenuStore()

// 判断是否有子菜单
const hasChildren = computed(() => props.item.children?.length)
</script>
