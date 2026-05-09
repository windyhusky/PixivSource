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
  { label: '阅读排版', value: 'readConfig', icon: '📝' }
]

// 顶级极速跳转
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''

  if (src) {
    isRedirecting.value = true
    let finalUrl = src.startsWith('legado://')
        ? src
        : `legado://import/importonline?src=${encodeURIComponent(src)}`

    window.location.href = finalUrl
    const a = document.createElement('a')
    a.href = finalUrl
    a.click()

    setTimeout(() => { isRedirecting.value = false }, 2500)
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
    <!-- 跳转中遮罩 -->
    <div v-if="isRedirecting" class="redirecting-minimal">
      <div class="spinner-small"></div>
      <p class="status-text">正在尝试唤起阅读...</p>

      <!-- 按钮化的手动跳转链接 -->
      <a
          :href="inputUrl.startsWith('legado://') ? inputUrl : `legado://import/importonline?src=${encodeURIComponent(inputUrl)}`"
          class="retry-btn"
      >
        没有反应？点击手动跳转
      </a>
    </div>

    <!-- 正常模式 -->
    <template v-else>
      <h1 class="vp-h1">🚀 一键导入 阅读资源</h1>

      <div class="legado-card">
        <div class="legado-header">
          <span class="header-title">请选择导入类型</span>
          <span class="header-tag" :class="{ 'is-ready': ready }">
            {{ selectedType === 'importonline' ? '自动模式' : '手动指定' }}
          </span>
        </div>

        <div class="type-grid">
          <button
              v-for="item in typeMap"
              :key="item.value"
              @click="selectedType = item.value"
              :class="{ active: selectedType === item.value }"
              class="type-item"
          >
            <span class="type-icon">{{ item.icon }}</span>
            <span class="type-label">{{ item.label }}</span>
          </button>
        </div>

        <div class="input-area">
          <textarea
              v-model="inputUrl"
              placeholder="在此粘贴 http(s) 链接或 legado:// 协议..."
              spellcheck="false"
          ></textarea>
        </div>

        <button class="submit-btn" :disabled="!ready" @click="doImport">
          确认导入至阅读
        </button>
      </div>

      <p class="footer-note">适配 阅读 3.0+，默认使用 importonline 协议</p>
    </template>
  </div>
</template>

<style scoped>
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
  .vp-h1 { font-size: 40px; line-height: 48px; }
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
  font-size: 14px; /* 调大后的字体 */
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.type-item.active .type-label,
.type-item.active .type-icon {
  color: #fff;
}

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

.redirecting-minimal { padding-top: 120px; text-align: center; }
.spinner-small {
  width: 24px; height: 24px; margin: 0 auto 16px;
  border: 3px solid var(--vp-c-brand-soft);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
.retry-link { display: block; margin-top: 24px; font-size: 14px; color: var(--vp-c-brand-1); text-decoration: underline; }

@media (max-width: 640px) {
  .legado-container { padding: 24px 8px; }
  .legado-card { padding: 16px; border-radius: 12px; }
  .type-grid { gap: 6px; }
}
</style>