<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const isRedirecting = ref(false)
const inputUrl = ref('')
const selectedType = ref('importonline')

const typeMap = [
  { label: '自动', value: 'importonline', icon: '⚡' },
  { label: '书源', value: 'bookSource', icon: '📚' },
  { label: '订阅源', value: 'rssSource', icon: '📡' },
  { label: '替换规则', value: 'replaceRule', icon: '✂️' },
  { label: '目录规则', value: 'textTocRule', icon: '📖' },
  { label: '朗读引擎', value: 'httpTTS', icon: '🗣️' },
  { label: '主题样式', value: 'theme', icon: '🎨' },
  { label: '阅读排版', value: 'readConfig', icon: '📝' },
  // 新增第九个按钮，仅在窄屏 3 列布局时显示以填充空格
  { label: '添加书架', value: 'book', icon: '📖' }
]

// 1. 【顶级极速跳转】
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''

  if (src) {
    isRedirecting.value = true
    const finalUrl = src.startsWith('legado://')
        ? src
        : `legado://import/importonline?src=${encodeURIComponent(src)}`

    window.location.href = finalUrl
    const a = document.createElement('a')
    a.href = finalUrl
    a.click()

    setTimeout(() => { isRedirecting.value = false }, 2800)
  }
}

function parseUrlLogic(url: string) {
  const u = url.trim()
  if (!u) return
  if (u.startsWith('legado://')) {
    const match = u.match(/legado:\/\/import\/([a-zA-Z]+)/)
    if (match && match[1]) {
      const found = typeMap.find(item => item.value === match[1])
      selectedType.value = found ? found.value : 'importonline'
    }
    return
  }
  const lowerU = u.toLowerCase()
  const found = typeMap.find(item => item.value !== 'importonline' && lowerU.includes(item.value.toLowerCase()))
  selectedType.value = found ? found.value : 'importonline'
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''
  if (src) {
    inputUrl.value = src
    parseUrlLogic(src)
  }
})

watch(inputUrl, (newVal) => parseUrlLogic(newVal))

function doImport() {
  const val = inputUrl.value.trim()
  if (!val) return
  const finalUrl = val.startsWith('legado://')
      ? val
      : `legado://import/${selectedType.value}?src=${encodeURIComponent(val)}`
  window.location.href = finalUrl
}

const ready = computed(() => inputUrl.value.trim().length > 0)
</script>

<template>
  <div class="legado-container">
    <!-- 状态 A：加载中卡片 -->
    <div v-if="isRedirecting" class="legado-card redirect-mode">
      <div class="loader-wrapper">
        <div class="loader-ring"></div>
        <div class="loader-ring-inner"></div>
        <span class="loader-icon">🚀</span>
      </div>
      <h2 class="redirect-title">正在拉起阅读 App</h2>
      <p class="redirect-desc">如果已安装阅读，应用将立即拉起...</p>

      <a
          :href="inputUrl.startsWith('legado://') ? inputUrl : `legado://import/importonline?src=${encodeURIComponent(inputUrl)}`"
          class="retry-btn-styled"
      >
        没有反应？点击手动跳转
      </a>
    </div>

    <!-- 状态 B：主交互大卡片 -->
    <template v-else>
      <h1 class="vp-h1">🚀 一键导入 阅读资源</h1>

      <div class="legado-card main-mode">
        <div class="legado-header">
          <span class="header-title">请选择导入类型</span>
        </div>

        <div class="type-grid">
          <button
              v-for="item in typeMap"
              :key="item.value"
              @click="selectedType = item.value"
              :class="['type-item', { active: selectedType === item.value, 'only-mobile': item.value === 'book' }]"
          >
            <span class="type-icon">{{ item.icon }}</span>
            <span class="type-label">{{ item.label }}</span>
          </button>
        </div>

        <div class="input-area">
          <textarea
              v-model="inputUrl"
              placeholder="粘贴 http(s) 链接或 legado:// 协议..."
              spellcheck="false"
          ></textarea>
        </div>

        <button class="submit-btn" :disabled="!ready" @click="doImport">
          确认导入至阅读
        </button>
      </div>

      <p class="footer-note">适配 阅读 3.0+ · 纯前端极速版</p>
    </template>
  </div>
</template>

<style scoped>
/* 容器 */
.legado-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 16px;
  text-align: center;
}

.vp-h1 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--vp-c-text-1);
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.redirect-mode {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-mode {
  padding: 20px;
  text-align: left;
}

.legado-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* 网格按钮逻辑：默认 4 列 */
.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 2px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

/* 宽屏默认隐藏“添加书架” */
.type-item.only-mobile {
  display: none;
}

.type-item.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
.type-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.type-label {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.input-area textarea {
  width: 100%;
  height: 130px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
  resize: none;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

/* 加载动画 */
.loader-wrapper { position: relative; width: 70px; height: 70px; margin-bottom: 20px; }
.loader-ring {
  position: absolute; width: 100%; height: 100%;
  border: 4px solid var(--vp-c-brand-soft);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loader-ring-inner {
  position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px;
  border: 3px solid transparent;
  border-bottom-color: var(--vp-c-brand-2);
  border-radius: 50%;
  animation: spin 1.5s linear reverse infinite;
  opacity: 0.6;
}
.loader-icon {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
}

.redirect-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.redirect-desc { color: var(--vp-c-text-3); font-size: 13px; margin-bottom: 24px; }

.retry-btn-styled {
  background: var(--vp-c-brand-1);
  color: white !important;
  padding: 10px 30px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 13px;
  text-decoration: none !important;
}

.footer-note {
  margin-top: 20px;
  font-size: 14px;
  color: var(--vp-c-text-3);
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* 窄屏手机优化 (小于 480px) */
@media (max-width: 480px) {
  .legado-container {
    padding: 0px 10px;
  }
  .vp-h1 {
    font-size: 26px;
    margin-bottom: 16px;
  }
  /* 窄屏切换为 3 列 布局，总计 9 个按钮 */
  .type-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  /* 窄屏显示“添加书架” */
  .type-item.only-mobile {
    display: flex;
  }
  .type-icon {
    font-size: 20px;
  }
  .type-label {
    font-size: 12px;
  }
}

/* 极窄屏优化 (针对旧款 iPhone SE 等 320px 宽度) */
@media (max-width: 340px) {
  .type-label {
    font-size: 11px;
    letter-spacing: -0.5px;
  }
  .type-grid {
    gap: 4px;
  }
}
</style>