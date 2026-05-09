<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const isRedirecting = ref(false)
const inputUrl = ref('')
const selectedType = ref('importonline')
const containerRef = ref<HTMLElement | null>(null)

const typeMap = [
  { label: '自动', value: 'importonline', icon: '⚡' },
  { label: '书源', value: 'bookSource', icon: '📚' },
  { label: '订阅源', value: 'rssSource', icon: '📡' },
  { label: '替换规则', value: 'replaceRule', icon: '✂️' },
  { label: '目录规则', value: 'textTocRule', icon: '📖' },
  { label: '朗读引擎', value: 'httpTTS', icon: '🗣️' },
  { label: '主题样式', value: 'theme', icon: '🎨' },
  { label: '阅读排版', value: 'readConfig', icon: '📝' },
  { label: '添加书架', value: 'book', icon: '➕' }
]

// ── 顶级极速跳转 ──
const hasRedirected = ref(false)
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''

  if (src && !hasRedirected.value) {
    isRedirecting.value = true
    hasRedirected.value = true // 标记已跳转
    const finalUrl = src.startsWith('legado://')
        ? src
        : `legado://import/importonline?src=${encodeURIComponent(src)}`
    window.location.href = finalUrl
    setTimeout(() => { isRedirecting.value = false }, 2800)
  }
}

// ── 根据 URL 内容自动推断类型 ──
function parseUrlLogic(url: string) {
  const u = url.trim()
  if (!u) return
  if (u.startsWith('legado://')) {
    const match = u.match(/legado:\/\/import\/([a-zA-Z]+)/)
    if (match?.[1]) {
      const found = typeMap.find(item => item.value === match[1])
      selectedType.value = found ? found.value : 'importonline'
    }
    return
  }
  const lower = u.toLowerCase()
  const found = typeMap.find(item => item.value !== 'importonline' && lower.includes(item.value.toLowerCase()))
  selectedType.value = found ? found.value : 'importonline'
}

// ── ResizeObserver 对齐：将卡片居中于「sidebar 右边界」到「aside 左边界」之间的区域 ──
//
// VitePress 布局：  | sidebar |←── 内容区 ──→| aside |
// 目标：无论 sidebar / aside 是否存在，卡片始终在可用内容区内视觉居中。
function alignToContent() {
  const container = containerRef.value
  if (!container) return
  const parent = container.parentElement!
  const parentRect = parent.getBoundingClientRect()

  const sidebar = document.querySelector('.VPSidebar') as HTMLElement | null
  const aside   = document.querySelector('.VPDocAside') as HTMLElement | null

  // 内容区左右边界（相对视口）
  const contentLeft  = sidebar ? sidebar.getBoundingClientRect().right : parentRect.left
  const contentRight = aside   ? aside.getBoundingClientRect().left    : parentRect.right

  // 转为相对于 parent 的偏移，确保不为负
  container.style.paddingLeft  = `${Math.max(contentLeft  - parentRect.left,  0)}px`
  container.style.paddingRight = `${Math.max(parentRect.right - contentRight, 0)}px`
}

let ro: ResizeObserver | null = null

onMounted(() => {
  const src = new URLSearchParams(window.location.search).get('src')?.trim() || ''
  if (src) { inputUrl.value = src; parseUrlLogic(src) }

  nextTick(alignToContent)
  ro = new ResizeObserver(alignToContent)
  ro.observe(document.documentElement)
})

onUnmounted(() => ro?.disconnect())

watch(() => route.path, () => nextTick(alignToContent))
watch(inputUrl, parseUrlLogic)

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
  <!-- outer wrapper 撑满宽度，inner container 负责居中对齐 -->
  <div class="legado-outer">
    <div class="legado-container" ref="containerRef">

      <!-- 状态 A：跳转中 -->
      <div v-if="isRedirecting" class="legado-card redirect-mode">
        <div class="loader-wrapper">
          <div class="loader-ring"></div>
          <div class="loader-ring-inner"></div>
          <span class="loader-icon">🚀</span>
        </div>
        <h2 class="redirect-title">正在拉起阅读 App</h2>
        <p class="redirect-desc">如果已安装开源阅读，应用将立即拉起...</p>
        <a
            :href="inputUrl.startsWith('legado://') ? inputUrl : `legado://import/importonline?src=${encodeURIComponent(inputUrl)}`"
            class="retry-btn-styled"
        >
          没有反应？点击手动跳转
        </a>
      </div>

      <!-- 状态 B：主交互 -->
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

        <p class="footer-note">适配 开源阅读 3.0+ 及其兼容版本</p>
      </template>

    </div>
  </div>
</template>

<style scoped>
/* 撑满内容区宽度，对齐交给 JS 动态注入 padding */
.legado-outer {
  width: 100%;
}

.legado-container {
  /* padding-left / padding-right 由 alignToContent() 动态注入 */
  box-sizing: border-box;
  width: 100%;
  text-align: center;
}

/* 卡片本身限宽居中 */
.legado-card,
.vp-h1,
.footer-note {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.vp-h1 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--vp-c-text-1);
  padding-top: 40px;
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* ── 跳转模式 ── */
.redirect-mode {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── 主交互模式 ── */
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

/* ── 类型网格：默认 4 列 ── */
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

.type-item.only-mobile { display: none; }

.type-item.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
.type-icon { font-size: 24px; margin-bottom: 4px; }
.type-label { font-size: 14px; font-weight: 700; white-space: nowrap; }

/* ── 输入框 ── */
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
  box-sizing: border-box;
}

/* ── 提交按钮 ── */
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
  transition: opacity 0.15s;
}
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.submit-btn:not(:disabled):hover { opacity: 0.85; }

/* ── 加载动画 ── */
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
.redirect-desc  { color: var(--vp-c-text-3); font-size: 13px; margin-bottom: 24px; }

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
  padding-bottom: 40px;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* ── 手机端（< 400px）：3 列布局 ── */
@media (max-width: 400px) {
  .vp-h1 { font-size: 26px; margin-bottom: 16px; }
  .type-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .type-item.only-mobile { display: flex; }
  .type-icon { font-size: 20px; }
  .type-label { font-size: 14px; }
}
</style>