<template>
  <div class="text-ellipsis-doc-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ name }}</span>
          <div class="card-description">
            <p>{{ desc }}</p>
            <!-- <p class="description-text">
              以下功能为扩展功能，其余功能支持 Element Plus Tooltip
              的相关属性（如：placement、effect、popper-class 等）， 更多详情请查看
              <el-link
                href="https://element-plus.org/zh-CN/component/tooltip"
                target="_blank"
                type="primary"
                :underline="false"
              >
                Element Plus Tooltip 文档
              </el-link>
              。
            </p>
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
const name = computed(() => route.query.name)
const desc = computed(() => route.query.desc)
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

// 写死的文本内容
const fixedText =
  '在一个宁静而古老的小镇上，少年李安每天放学后都会经过那棵矗立在街角的古老橡树。这棵橡树已有百年历史，枝干粗壮，枝叶繁茂，仿佛一位沉默的守护者，见证着小镇的变迁。夕阳西下时，金色的光芒透过层层叠叠的叶片洒落下来，为整个街道蒙上一层温暖的光晕。一天傍晚，当李安像往常一样经过这里时，他突然注意到树根旁有一个闪着微光的木盒子，盒子表面雕刻着精美的花纹，在夕阳的照耀下显得格外神秘。李安小心翼翼地打开盒子，发现里面静静地躺着一张泛黄的旧地图和一把小巧精致的铜钥匙。地图上标注着一条蜿蜒的路线，最终指向小镇另一端的一座废弃磨坊。怀着强烈的好奇心，李安决定跟随地图的指引去探索这个秘密。他穿过几条熟悉的小巷，来到那座已经荒废多年的磨坊前。推开吱呀作响的大门，里面布满了厚厚的尘埃，阳光从破碎的窗户斜射进来，在空气中形成一道道明亮的光柱。在磨坊的角落里，李安发现了一个古朴的木箱子，箱子上有一个锁孔，正好与手中的钥匙匹配。当他转动钥匙，箱子缓缓打开的那一刻，一束阳光恰好透过窗户洒在箱子里的金色信封上，信封在光线下闪闪发光。李安颤抖着双手打开信封，里面是一张精美的信纸，上面用优雅的字体写着："勇敢的人，终会找到属于自己的奇迹。每一次探索都是成长的足迹，每一份勇气都会照亮前行的路。"读完这段话，李安心里涌起一股暖流，他深深明白，这次冒险的意义不仅在于发现了什么，更在于他敢于踏出第一步的勇气，以及在这个过程中收获的希望与成长。'

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
  text: fixedText,
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
