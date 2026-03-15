import new_request from '@/utils/new_request'

// 项目相关接口
export const projectApi = {
  //获取所有员工姓名列表
  getUsers() {
    return new_request.get('/users/all')
  },
  // 添加项目
  addProject(data: {
    name: string
    date: [string, string]
    members: string[]
    desc: string
    fileLinks: string[]
  }) {
    return new_request.post('/project/add', data)
  },

  // 获取项目列表（卡片用）
  getProjectList() {
    return new_request.get('/project/list')
  },
  // 获取项目详情
  getProjectDetail(id: string) {
    return new_request.get('/project/detail', { params: { id } })
  },
}
