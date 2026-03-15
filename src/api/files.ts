import new_request from '@/utils/new_request'

export const fileApi = {
  /**
   * 删除文件
   * @param fileUrl 文件的完整 URL
   */
  deleteFile(fileUrl: string) {
    return new_request.delete('/files', { params: { fileUrl } })
  },
}
