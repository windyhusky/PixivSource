<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const isRedirecting = ref(false)
const inputUrl = ref('')
const selectedType = ref('importonline')
const containerRef = ref<HTMLElement | null>(null)

// 🌟 请在此处配置你部署好的 Cloudflare Worker 地址
const CF_WORKER_URL = 'https://legado.tnt-wwxs-tz.workers.dev/'

// 状态控制
const isUploading = ref(false)
const generatedLegadoUrl = ref('')

const typeMap = [
  { label: '自动', value: 'importonline', icon: '⚡️' },
  { label: '书源', value: 'bookSource', icon: '📚' },
  { label: '订阅源', value: 'rssSource', icon: '📡' },
  { label: '替换规则', value: 'replaceRule', icon: '✂️' },
  { label: '目录规则', value: 'textTocRule', icon: '📖' },
  { label: '朗读引擎', value: 'httpTTS', icon: '🗣️' },
  { label: '主题样式', value: 'theme', icon: '🎨' },
  { label: '阅读排版', value: 'readConfig', icon: '📝' },
  { label: '添加书架', value: 'book', icon: '➕' }
]

// ── 深度清洗判定：过滤掉前端可能存在的空白、换行、或开头的意外噪点 ──
const cleanedInput = computed(() => {
  return inputUrl.value.replace(/^\s+/, '').replace(/\s+$/, '')
})

// ── 智能判断输入内容是否疑似为纯 JSON 源码（增强鲁棒性） ──
const looksLikeJsonInput = computed(() => {
  const val = cleanedInput.value
  return val.startsWith('{') || val.startsWith('[')
})

// ── 防御加固：使用独立变量承载错误，避免计算属性在输入大文本时导致频繁 Parse 发生卡死 ──
const jsonError = ref('')
let debounceTimer: any = null

// 监听输入，采用防抖机制（300ms 延迟校验），大文本粘贴时绝不卡顿
watch(inputUrl, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!looksLikeJsonInput.value) {
      jsonError.value = ''
      return
    }
    try {
      let raw = cleanedInput.value
      if (raw.startsWith('{') && raw.endsWith('}')) {
        raw = `[${raw}]`
      }
      JSON.parse(raw)
      jsonError.value = ''
    } catch {
      jsonError.value = 'JSON 格式错误，请检查后再导入'
    }
  }, 300)
})

// ── 是否为完全合法的 JSON 输入 ──
const isValidJsonInput = computed(() => {
  return looksLikeJsonInput.value && !jsonError.value
})

// ── 一键清空输入框 ──
function clearInput() {
  inputUrl.value = ''
  jsonError.value = ''
}

// ── 顶级极速跳转 ──
const hasRedirected = ref(false)
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''

  if (src && !hasRedirected.value) {
    isRedirecting.value = true
    hasRedirected.value = true
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
  if (u.startsWith('{') || u.startsWith('[')) return // 避免解析纯 JSON 源码

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

// ── ResizeObserver 对齐 ──
//
// VitePress 布局（≥960px）：| sidebar(sticky) |←── 内容区 ──→| aside |
// VitePress 布局（<960px） ：sidebar 为浮层，不占文档流，忽略
//
// 策略：只在 ≥960px 时才将 sidebar 计入左边界计算，
//       aside 始终计入（它在任何断点下都不是浮层）。
function alignToContent() {
  const container = containerRef.value
  if (!container) return
  const parent = container.parentElement!
  const parentRect = parent.getBoundingClientRect()

  // < 960px：sidebar 是浮层，不参与布局计算
  const isDesktop = window.innerWidth >= 960
  const hasAside  = window.innerWidth >= 1280

  // < 960px：sidebar 是浮层，不占文档流，忽略
  const sidebar = isDesktop
      ? (document.querySelector('.VPSidebar') as HTMLElement | null)
      : null
  // < 1280px：aside 是浮层 nudge，不占文档流，忽略
  const aside = hasAside
      ? (document.querySelector('.VPDocAside') as HTMLElement | null)
      : null

  const contentLeft  = sidebar ? sidebar.getBoundingClientRect().right : parentRect.left
  const contentRight = aside   ? aside.getBoundingClientRect().left    : parentRect.right

  container.style.paddingLeft  = `${Math.max(contentLeft  - parentRect.left,  0)}px`
  container.style.paddingRight = `${Math.max(parentRect.right - contentRight, 0)}px`
}

let ro: ResizeObserver | null = null

function observeLayout() {
  if (!ro) return
  // 重新观察：documentElement 负责捕获窗口尺寸变化
  ro.observe(document.documentElement)
  // aside 出现 / 消失 / 尺寸变化时立即重算
  const aside = document.querySelector('.VPDocAside')
  if (aside) ro.observe(aside)
}

onMounted(() => {
  const src = new URLSearchParams(window.location.search).get('src')?.trim() || ''
  if (src) { inputUrl.value = src; parseUrlLogic(src) }

  ro = new ResizeObserver(alignToContent)
  nextTick(() => { observeLayout(); alignToContent() })
})

onUnmounted(() => ro?.disconnect())

watch(() => route.path, () => {
  // 路由切换后 aside 需要重新渲染，nextTick 后重新绑定观察 + 延迟保底
  nextTick(() => { observeLayout(); alignToContent() })
  setTimeout(alignToContent, 300)
})
watch(inputUrl, parseUrlLogic)

// ── 核心执行逻辑 ──
async function doImport() {
  let val = cleanedInput.value
  if (!val) return

  // 触发最终校验，若防抖计时器未完成则立即行使拦截
  if (looksLikeJsonInput.value && jsonError.value) {
    alert(jsonError.value)
    return
  }

  // 情况 A：处理大体积 JSON 配置源码
  if (looksLikeJsonInput.value) {
    isUploading.value = true
    try {
      // 🌟 【核心纠错补丁】：解析前检查，如果是单对象形式 {}，自动为其首尾添加 [] 包装为标准书源数组
      let parsedJson = JSON.parse(val)
      if (!Array.isArray(parsedJson)) {
        parsedJson = [parsedJson]
      }

      // 异步向部署在 Cloudflare 上的私有边缘节点投递合法的标准数组配置
      const response = await fetch(CF_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TNT-Secure': 'tnt_sec_2026'
        },
        body: JSON.stringify(parsedJson)
      })

      if (!response.ok) throw new Error()

      const resData = await response.json()
      // 拿到 Worker 内存构建的极短链接（形如 https://xxx.workers.dev/?id=哈希值）
      const shortUrl = resData.url
      const finalUrl = `legado://import/${selectedType.value}?src=${encodeURIComponent(shortUrl)}`

      generatedLegadoUrl.value = finalUrl
      isRedirecting.value = true
      window.location.href = finalUrl
      setTimeout(() => { isRedirecting.value = false }, 2800)
    } catch (e) {
      alert('云端数据流转通道建立失败，请检查网络或重新点击尝试。')
    } finally {
      isUploading.value = false
    }
    return
  }

  // 情况 B：处理常规的 http(s) 链接或原生 legado 协议
  isRedirecting.value = true
  const finalUrl = val.startsWith('legado://')
      ? val
      : `legado://import/${selectedType.value}?src=${encodeURIComponent(val)}`
  generatedLegadoUrl.value = finalUrl
  window.location.href = finalUrl
  setTimeout(() => { isRedirecting.value = false }, 2800)
}

const ready = computed(() => cleanedInput.value.length > 0 && !isUploading.value)
</script>

<template>
  <div class="legado-outer">
    <div class="legado-container" ref="containerRef">

      <div v-if="isRedirecting" class="legado-card redirect-mode">
        <div class="loader-wrapper">
          <div class="loader-ring"></div>
          <div class="loader-ring-inner"></div>
          <span class="loader-icon">🚀</span>
        </div>
        <h2 class="redirect-title">正在拉起阅读 App</h2>
        <p class="redirect-desc">如果已安装开源阅读，应用将立即拉起...</p>
        <a
            :href="generatedLegadoUrl || (inputUrl.startsWith('legado://') ? inputUrl : `legado://import/importonline?src=${encodeURIComponent(inputUrl)}`)"
            class="retry-btn-styled"
        >
          没有反应？点击手动跳转
        </a>
      </div>

      <template v-else>
        <h1 class="vp-h1">🚀 一键导入 阅读资源</h1>

        <div class="legado-card main-mode">
          <div class="legado-header">
            <span class="header-title">请选择导入类型</span>
            <button v-if="inputUrl" class="clear-action-btn" @click="clearInput">清空内容</button>
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
                placeholder="粘贴 http(s) 链接、legado:// 协议，或者直接粘贴书源 JSON 源码..."
                spellcheck="false"
                :disabled="isUploading"
            ></textarea>
            <div v-if="jsonError" class="json-error-banner">⚠️ {{ jsonError }}</div>
          </div>

          <button class="submit-btn" :disabled="!ready" @click="doImport">
            {{ isUploading ? '⏳ 正在通过 Cloudflare 分流打包...' : '确认导入至阅读' }}
          </button>
        </div>

        <p class="footer-note">适配 开源阅读 3.0 及其兼容版本</p>
      </template>

    </div>
  </div>
</template>

<style scoped>
.legado-outer {
  width: 100%;
}

.legado-container {
  box-sizing: border-box;
  width: 100%;
  text-align: center;
}

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

@media (max-width: 400px) {
  .vp-h1 { font-size: 26px; margin-bottom: 16px; }
  .type-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .type-item.only-mobile { display: flex; }
  .type-icon { font-size: 20px; }
  .type-label { font-size: 14px; }
}
</style>