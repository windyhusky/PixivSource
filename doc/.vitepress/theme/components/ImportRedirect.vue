<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const inputUrl = ref('')
const manual   = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return
  const src = new URLSearchParams(location.search).get('src') || ''
  if (src) {
    inputUrl.value = src
  } else {
    manual.value = true
  }
})

function guessType(url: string) {
  if (!url) return '书源'
  if (url.includes('btsrk') || url.includes('rss') || url.includes('subscribe')) return '订阅源'
  if (url.includes('textTocRule')) return '目录规则'
  if (url.includes('replaceRule')) return '替换净化规则'
  return '书源'
}

function buildLegadoUrl(src: string) {
  const type = guessType(src)
  if (type === '订阅源')       return `legado://import/rssSource?src=${src}`
  if (type === '目录规则')     return `legado://import/textTocRule?src=${src}`
  if (type === '替换净化规则') return `legado://import/replaceRule?src=${src}`
  return `legado://import/bookSource?src=${src}`
}

const src   = computed(() => inputUrl.value.trim())
const type  = computed(() => guessType(src.value))
const ready = computed(() => src.value.startsWith('http'))

function doImport() {
  if (!ready.value) return
  window.location.href = buildLegadoUrl(src.value)
}
</script>

<template>
  <div class="ir-wrap">

    <!-- 输入区：有 src 参数时只读展示，无参数时可编辑 -->
    <div class="ir-card">
      <textarea
          v-model="inputUrl"
          class="ir-textarea"
          :readonly="!manual"
          :placeholder="manual ? 'https://cdn.jsdelivr.net/gh/...' : ''"
          rows="3"
          spellcheck="false"
      />
    </div>

    <!-- 按钮 -->
    <button
        class="ir-btn ir-btn-primary"
        :disabled="!ready"
        @click="doImport"
    >
      🚀 粘贴链接 导入{{ type }}
    </button>

  </div>
</template>

<style scoped>
.ir-wrap {
  max-width: 520px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ir-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 18px 20px;
}

.ir-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.ir-textarea {
  width: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--vp-c-text-1);
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.ir-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.ir-textarea[readonly] {
  cursor: default;
  color: var(--vp-c-text-2);
}

.ir-badge {
  display: inline-block;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.ir-preview-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
}

.ir-preview-url {
  font-size: 13px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--vp-c-text-2);
  word-break: break-all;
  line-height: 1.6;
}

.ir-btn {
  width: 100%;
  padding: 13px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s, transform 0.1s;
}

.ir-btn:active:not(:disabled) { transform: scale(0.98); }

.ir-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ir-btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ir-btn-primary:hover:not(:disabled) { opacity: 0.85; }

.ir-note {
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: center;
  line-height: 1.8;
}

.ir-note a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.ir-note a:hover { text-decoration: underline; }

.ir-note strong { color: var(--vp-c-text-2); }
</style>