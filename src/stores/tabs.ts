import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { IMenuItem } from '@/types/system/menu'

export interface TabItem {
  path: string
  fullPath: string
  title: string
  icon?: string
  closable: boolean
  name?: string | symbol
}

export const useTabsStore = defineStore('tabs', () => {
  const menuStore = useMenuStore()
  const router = useRouter()

  // 标签页列表
  const tabs = ref<TabItem[]>([])
  // 当前激活的完整路径（包含参数）
  const activePath = ref<string>('')

  const findMenuByPath = (menus: IMenuItem[], path: string): IMenuItem | null => {
    for (const item of menus) {
      if (item.type === 'menu' && item.path === path) return item
      if (item.children?.length) {
        const child = findMenuByPath(item.children, path)
        if (child) return child
      }
    }
    return null
  }

  /**
   * 添加标签页
   * 修改点：使用 fullPath 作为唯一标识，支持同页面多参数共存
   */
  const addTab = (route: RouteLocationNormalizedLoaded) => {
    if (!route.meta?.keepAlive && route.name !== 'RedirectView') return

    // 检查 fullPath 是否已存在
    const isExist = tabs.value.some((tab) => tab.fullPath === route.fullPath)

    if (!isExist) {
      const menuItem = findMenuByPath(menuStore.menuList, route.path)

      tabs.value.push({
        path: route.path,
        fullPath: route.fullPath, // 记录完整路径
        // 动态标题逻辑：优先取 query 中的 name（用于详情页），否则取菜单标题
        title:
          (route.query.name as string) ||
          (route.meta?.title as string) ||
          menuItem?.title ||
          '未命名',
        icon: (route.meta?.icon as string) || menuItem?.icon,
        closable: route.path !== '/dashboard/home',
        name: route.name || undefined,
      })
    }
    activePath.value = route.fullPath // 激活当前完整路径
  }

  /**
   * 关闭标签页
   * 修改点：基于 fullPath 进行删除和跳转
   */
  const removeTab = (fullPath: string) => {
    const index = tabs.value.findIndex((tab) => tab.fullPath === fullPath)
    if (index === -1) return

    const isCurrent = activePath.value === fullPath
    tabs.value.splice(index, 1)

    if (isCurrent && tabs.value.length > 0) {
      // 关闭当前页后，跳转到临近的标签
      const nextTab = tabs.value[Math.min(index, tabs.value.length - 1)]
      if (nextTab) {
        router.push(nextTab.fullPath)
        activePath.value = nextTab.fullPath
      }
    }
  }

  const closeOtherTabs = (fullPath: string) => {
    tabs.value = tabs.value.filter((tab) => tab.fullPath === fullPath || !tab.closable)
    activePath.value = fullPath
    router.push(fullPath)
  }

  const closeAllTabs = () => {
    tabs.value = tabs.value.filter((tab) => !tab.closable)
    if (tabs.value.length > 0) {
      const home = tabs.value[0]!
      activePath.value = home.fullPath
      router.push(home.fullPath)
    }
  }

  const closeLeftTabs = (fullPath: string) => {
    const index = tabs.value.findIndex((tab) => tab.fullPath === fullPath)
    if (index !== -1) {
      tabs.value = tabs.value.filter((tab, i) => i >= index || !tab.closable)
      activePath.value = fullPath
      router.push(fullPath)
    }
  }

  const closeRightTabs = (fullPath: string) => {
    const index = tabs.value.findIndex((tab) => tab.fullPath === fullPath)
    if (index !== -1) {
      tabs.value = tabs.value.filter((tab, i) => i <= index || !tab.closable)
      activePath.value = fullPath
      router.push(fullPath)
    }
  }

  return {
    tabs,
    activePath,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
    closeLeftTabs,
    closeRightTabs,
  }
})
