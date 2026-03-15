<template>
  <div class="text-ellipsis-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <!-- 标题骨架 -->
          <el-skeleton :loading="loading" animated :rows="2" v-if="loading" />
          <span class="card-title">{{ projectNameFromQuery }}</span>
          <div class="card-description">
            <p class="description-text">
              项目时间：{{ projectDetail?.beginAt || '未知' }} ~
              {{ projectDetail?.endAt || '未知' }}， 参与人数：{{
                projectDetail?.members?.length || 0
              }}人， 项目状态：{{ formatStatus(projectDetail?.status) }}。
            </p>
          </div>
        </div>
      </template>

      <div class="form-container">
        <!-- 项目介绍骨架 -->
        <div class="preview-section" v-if="loading">
          <div class="section-title">项目介绍</div>
          <div class="preview-content">
            <el-skeleton animated :rows="2" />
          </div>
        </div>

        <!-- 项目介绍 -->
        <div class="preview-section">
          <div class="section-title">
            <span>项目介绍</span>
          </div>
          <div class="preview-content">
            <TextEllipsis
              :text="projectDetail?.description || ''"
              :line="ellipsisForm.line"
              :width="ellipsisForm.width"
              :clickable="ellipsisForm.clickable"
              :copyable="ellipsisForm.copyable"
              :tooltip-type="ellipsisForm.tooltipType"
              :placement="ellipsisForm.placement"
              :effect="ellipsisForm.effect"
              :show-after="ellipsisForm.showAfter"
              :hide-after="ellipsisForm.hideAfter"
              :offset="ellipsisForm.offset"
            />
          </div>
        </div>

        <!-- 项目成员 -->
        <el-divider />
        <!-- 项目成员骨架 -->
        <div class="usage-section" v-if="loading">
          <div class="section-title">项目成员</div>
          <div class="usage-info">
            <el-skeleton animated :rows="4" />
          </div>
        </div>

        <div class="usage-section">
          <div class="section-title">项目成员</div>
          <div class="usage-info">
            <div class="usage-item">
              <div class="comparison-table">
                <el-table :data="memberTableData" border>
                  <el-table-column prop="name" label="姓名" width="150">
                    <template #default="{ row }">
                      <strong>{{ row.name }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column prop="responsibility" label="职责" width="200">
                    <template #default="{ row }">
                      <code>{{ row.responsibility }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="output" label="产量" width="150">
                    <template #default="{ row }">
                      <code>{{ row.output }}</code>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目文档 -->
        <el-divider />

        <div class="slot-section" v-if="loading">
          <div class="section-title">项目文档</div>
          <div class="slot-content">
            <el-skeleton animated :rows="2" />
          </div>
        </div>

        <div class="slot-section">
          <div class="section-title">项目文档</div>
          <div class="slot-content">
            <pdfViewer :pdfs="pdfList" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import pdfViewer from './PdfViewer.vue'
import { projectApi } from '@/api/project'

const route = useRoute()
const projectId = route.query.id as string
const projectNameFromQuery = route.query.name as string // 从 query 获取项目名称

const loading = ref(true) // 加载状态

const projectDetail = ref<any>(null)
const memberTableData = ref<any[]>([])
const pdfList = ref<{ url: string; title: string }[]>([])

// 格式化项目状态
const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    in_progress: '进行中',
    completed: '已完成',
  }
  return map[status] || status
}

// 加载项目详情
onMounted(() => {
  if (projectId) {
    projectApi
      .getProjectDetail(projectId)
      .then((res) => {
        if (res.code === 200) {
          projectDetail.value = res.data
          if (res.data.members) {
            memberTableData.value = res.data.members.map((m: any) => ({
              name: m.name,
              responsibility: m.responsibility,
              output: m.output,
            }))
          }
          if (res.data.fileLinks) {
            pdfList.value = res.data.fileLinks.map((url: string, index: number) => ({
              url: url.startsWith('http') ? url : `https://${url}`,
              title: `${projectNameFromQuery || '项目文档'} ${index + 1}`,
            }))
          }
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
})

// 文本省略组件的配置
const ellipsisForm = ref({
  line: 2,
  width: '100%',
  clickable: true,
  copyable: false,
  tooltipType: 'element' as const,
  placement: 'top',
  effect: 'dark' as const,
  showAfter: 0,
  hideAfter: 200,
  offset: 12,
})

defineOptions({ name: 'TextEllipsisView' })
</script>

<style scoped lang="scss">
.text-ellipsis-doc-container {
  .card-header {
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .card-description {
      margin-top: 8px;
      font-size: 0.875rem;
      color: var(--el-text-color-regular);
      line-height: 1.6;

      p {
        margin: 4px 0;
      }

      .description-text {
        color: var(--el-text-color-secondary);
        font-size: 0.8125rem;
      }
    }
  }

  .form-container {
    .form-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-divider {
      margin: 24px 0;
    }

    .slot-section {
      margin-top: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .slot-info {
        .slot-description {
          margin: 0 0 16px 0;
          color: var(--el-text-color-regular);
          font-size: 0.875rem;
        }

        .slot-list {
          display: flex;
          flex-direction: column;
          gap: 20px;

          .slot-item {
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 4px;
            padding: 16px;
            background-color: var(--el-bg-color-page);

            .slot-name {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;

              .slot-label {
                font-size: 0.875rem;
                color: var(--el-text-color-regular);
                font-weight: 500;
              }
            }

            .slot-code {
              pre {
                margin: 0;
                padding: 12px;
                background-color: var(--el-fill-color-dark);
                border-radius: 4px;
                overflow-x: auto;
                font-size: 0.8125rem;
                line-height: 1.6;

                code {
                  color: var(--el-text-color-primary);
                  font-family:
                    'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
                }
              }
            }
          }
        }
      }
    }

    .usage-section {
      margin-top: 24px;

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
      }

      .usage-info {
        .usage-item {
          margin-bottom: 32px;

          &:last-child {
            margin-bottom: 0;
          }

          .usage-title {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 12px;
          }

          .usage-description {
            margin: 0 0 12px 0;
            color: var(--el-text-color-regular);
            font-size: 0.875rem;
            line-height: 1.6;

            code {
              padding: 2px 6px;
              background-color: var(--el-fill-color-light);
              border-radius: 3px;
              font-size: 0.8125rem;
              color: var(--el-color-primary);
            }
          }

          .comparison-table {
            margin-top: 16px;
            width: 500px;
            :deep(.el-table) {
              .el-table__cell {
                padding: 12px 0;

                code {
                  padding: 2px 6px;
                  background-color: var(--el-fill-color-light);
                  border-radius: 3px;
                  font-size: 0.8125rem;
                  color: var(--el-color-primary);
                  font-family:
                    'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
                }
              }
            }
          }
        }
      }
    }

    .preview-section {
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);
        display: flex;
        align-items: center;
      }

      .preview-content {
        font-size: 0.875rem;
        padding: 1rem;
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 0.25rem;
      }
    }

    .el-form {
      .el-row {
        .el-col {
          .el-form-item {
            margin-bottom: 18px;

            .label-with-tooltip {
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .label-tooltip-icon {
              color: var(--el-text-color-secondary);
              cursor: help;
              font-size: 14px;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }
}
</style>
