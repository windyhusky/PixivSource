<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const isRedirecting = ref(false)
const inputUrl = ref('')
const selectedType = ref('bookSource')

// --- 1. 顶级极速跳转逻辑 ---
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src') || ''

  if (src.startsWith('legado://')) {
    isRedirecting.value = true
    // 尝试多种跳转方式以绕过浏览器拦截
    const triggerJump = (url: string) => {
      // 方式 A: 直接赋值
      window.location.href = url
      // 方式 B: 模拟点击 (兼容性更好)
      const a = document.createElement('a')
      a.href = url
      a.click()
    }

    triggerJump(src)

    // 如果 2.5 秒后还没跳走，说明可能没装 App 或拦截了，切回手动模式
    setTimeout(() => {
      isRedirecting.value = false
    }, 2500)
  }
}

// --- 2. 其它逻辑 (与之前一致) ---
const typeMap = [
  { label: '书源', value: 'bookSource', icon: '📚' },
  { label: '订阅源', value: 'rssSource', icon: '📡' },
  { label: '替换规则', value: 'replaceRule', icon: '✂️' },
  { label: '目录规则', value: 'textTocRule', icon: '📖' },
  { label: '朗读引擎', value: 'httpTTS', icon: '🗣️' },
  { label: '主题样式', value: 'theme', icon: '🎨' },
  { label: '阅读排版', value: 'readConfig', icon: '📝' },
  { label: '加入书架', value: 'addToBookshelf', icon: '➕' }
]

function autoDetect(url: string) {
  const u = url.toLowerCase()
  if (u.includes('booksource') || u.includes('importonline')) return 'bookSource'
  if (u.includes('rss') || u.includes('subscribe')) return 'rssSource'
  if (u.includes('replacerule')) return 'replaceRule'
  if (u.includes('texttocrule')) return 'textTocRule'
  if (u.includes('tts')) return 'httpTTS'
  if (u.includes('theme')) return 'theme'
  if (u.includes('readconfig')) return 'readConfig'
  if (u.includes('addtobookshelf')) return 'addToBookshelf'
  return 'bookSource'
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src') || ''
  if (src && !src.startsWith('legado://')) {
    inputUrl.value = src
    selectedType.value = autoDetect(src)
  }
})

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
    <!-- 如果在跳转中，显示极简提示和手动重试按钮 -->
    <div v-if="isRedirecting" class="redirecting-minimal">
      <div class="spinner-small"></div>
      <p>正在尝试唤起阅读...</p>
      <a :href="new URLSearchParams($route?.query).get('src')" class="retry-link">没有反应？点击手动跳转</a>
    </div>

    <!-- 正常模式 -->
    <template v-else>
      <h1 class="vp-h1">🚀 一键导入 阅读资源</h1>
      <!-- ... 这里保留你之前的卡片 UI ... -->
      <div class="legado-card">
        <div class="type-grid">
          <button v-for="item in typeMap" :key="item.value" @click="selectedType = item.value" :class="{ active: selectedType === item.value }" class="type-item">
            <span class="type-icon">{{ item.icon }}</span>
            <span class="type-label">{{ item.label }}</span>
          </button>
        </div>
        <div class="input-area">
          <textarea v-model="inputUrl" placeholder="粘贴链接或协议..."></textarea>
        </div>
        <button class="submit-btn" :disabled="!ready" @click="doImport">确认导入</button>
      </div>
    </template>
  </div>
</template>


<style scoped>
.redirecting-minimal {
  padding-top: 120px;
  text-align: center;
}
.spinner-small {
  width: 24px;
  height: 24px;
  margin: 0 auto 16px;
  border: 3px solid var(--vp-c-brand-soft);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.retry-link {
  display: block;
  margin-top: 24px;
  font-size: 14px;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.legado-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 0;
  text-align: center;
}

.vp-h1 {
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 32px;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .vp-h1 {
    font-size: 40px;
    line-height: 48px;
  }
}

.legado-card {
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.legado-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.header-tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 20px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
}
.header-tag.is-ready {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 2px;
  background: var(--vp-c-bg);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.type-item.active {
  background: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px var(--vp-c-brand-soft);
}

.type-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.type-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.type-item.active .type-label,
.type-item.active .type-icon {
  color: #fff;
}

/* 粘贴框高度优化：150px (约 3/4) */
.input-area textarea {
  width: 100%;
  height: 150px;
  background: var(--vp-c-bg);
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  resize: none;
  line-height: 1.5;
}

.input-area textarea:focus {
  outline: 2px solid var(--vp-c-brand-soft);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
}

.footer-note {
  margin-top: 24px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* 手机端贴边优化 */
@media (max-width: 640px) {
  .legado-container {
    padding: 24px 8px;
  }

  .legado-card {
    padding: 16px;
    border-radius: 12px;
  }

  .type-grid {
    gap: 6px;
  }

  .type-label {
    font-size: 9px;
  }

  .input-area textarea {
    height: 150px; /* 保持 3/4 高度比例 */
    padding: 12px;
  }
}
</style>