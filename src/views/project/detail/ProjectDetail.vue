<template>
  <div class="text-ellipsis-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ name }}</span>
          <div class="card-description">
            <p class="description-text">
              项目时间：2024-06-01 ~ 2024-12-31，参与人数：3人，项目状态：进行中。
            </p>
            <!--
            <p class="description-text">
              <strong>独立使用：</strong>
              如果你不想使用整个项目，也可以直接复制
              <code>TextEllipsis</code> 组件源码到自己的项目中使用。该组件主要依赖于
              <code>element-plus</code>（使用 <code>el-tooltip</code> 组件）和
              <code>@vueuse/core</code>（使用
              <code>useClipboard</code>，用于复制功能），使用前请确保已安装这些依赖。组件源码地址：
              <el-link
                href="https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/text/TextEllipsis.vue"
                target="_blank"
                type="primary"
                :underline="false"
              >
                TextEllipsis.vue
              </el-link>
              ，欢迎直接使用或根据需求进行二次开发。
            </p> -->
          </div>
        </div>
      </template>

      <div class="form-container">
        <div class="preview-section">
          <div class="section-title">
            <span>项目介绍</span>
          </div>
          <div class="preview-content">
            <TextEllipsis
              :text="ellipsisForm.text"
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
        <div class="usage-section">
          <div class="section-title">项目成员</div>
          <div class="usage-info">
            <div class="usage-item">
              <div class="comparison-table">
                <el-table :data="propsTableData" border>
                  <el-table-column prop="name" label="姓名" width="150">
                    <template #default="{ row }">
                      <strong>{{ row.name }}</strong>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="职责" width="200">
                    <template #default="{ row }">
                      <code>{{ row.type }}</code>
                    </template>
                  </el-table-column>
                  <el-table-column prop="default" label="产量" width="150">
                    <template #default="{ row }">
                      <code>{{ row.default }}</code>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="description" label="说明" min-width="200" /> -->
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目文档 -->
        <el-divider />
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
import pdfViewer from './PdfViewer.vue'
const route = useRoute()
const desc: string = route.query.desc as string
const name = computed(() => route.query.name)
//const desc = computed(() => route.query.desc)
const pdfList = [
  {
    url: 'https://project.catpaws.top/%E4%BB%BB%E5%8A%A15.3-%E7%BB%93%E6%9E%84%E5%8C%96%E6%A0%87%E6%B3%A8-%E6%96%87%E7%A7%91%E7%AD%94%E9%A2%98-%E6%A0%87%E6%B3%A8%E6%96%B9%E6%A1%881218.pdf',
    title: '文档一',
  },
  {
    url: 'https://project.catpaws.top/%E6%95%99%E8%BE%85%E5%8A%A0%E5%B7%A5-%E7%B2%BE%E6%A0%87.pdf',
    title: '文档二',
  },
  // ...
]
defineOptions({ name: 'TextEllipsisView' })

interface EllipsisForm {
  text: string
  line: number
  width: string | number
  clickable: boolean
  copyable: boolean
  tooltipType: 'element' | 'native' | 'none'
  placement: string
  effect: 'dark' | 'light'
  showAfter: number
  hideAfter: number
  offset: number
}

const ellipsisForm = ref<EllipsisForm>({
  text: desc,
  line: 2,
  width: '100%',
  clickable: true,
  copyable: false,
  tooltipType: 'element',
  placement: 'top',
  effect: 'dark',
  showAfter: 0,
  hideAfter: 200,
  offset: 12,
})

// 组件属性表格数据
const propsTableData = [
  {
    name: '王秒',
    type: '标注',
    default: '60',
  },
  {
    name: '苟国栋',
    type: '标注',
    default: '74',
  },
  {
    name: '杨宁宁',
    type: '标注',
    default: '57',
  },
]
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
