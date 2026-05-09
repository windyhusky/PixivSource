<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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

const inputUrl = ref('')
const manual = ref(false)
const selectedType = ref('bookSource')

function autoDetect(url: string) {
  const u = url.toLowerCase()
  if (u.includes('booksource')) return 'bookSource'
  if (u.includes('rss') || u.includes('subscribe')) return 'rssSource'
  if (u.includes('replacerule')) return 'replaceRule'
  if (u.includes('texttocrule')) return 'textTocRule'
  if (u.includes('tts')) return 'httpTTS'
  if (u.includes('theme')) return 'theme'
  if (u.includes('readconfig')) return 'readConfig'
  if (u.endsWith('.epub') || u.endsWith('.txt') || u.includes('addtobookshelf')) return 'addToBookshelf'
  return 'bookSource'
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(location.search)
  const src = params.get('src') || ''
  if (src) {
    inputUrl.value = src
    selectedType.value = autoDetect(src)
  } else {
    manual.value = true
  }
})

watch(inputUrl, (val) => {
  if (manual.value && val.startsWith('http')) {
    selectedType.value = autoDetect(val)
  }
})

const ready = computed(() => inputUrl.value.trim().startsWith('http'))

function doImport() {
  if (!ready.value) return
  const src = encodeURIComponent(inputUrl.value.trim())
  window.location.href = `legado://import/${selectedType.value}?src=${src}`
}
</script>

<template>
  <div class="legado-container">
    <!-- VP 风格一级标题 -->
    <h1 class="vp-h1">🚀 一键导入 阅读资源</h1>

    <div class="legado-card">
      <div class="legado-header">
        <span class="header-title">请选择导入内容</span>
        <span class="header-tag" :class="{ 'is-ready': ready }">
          {{ ready ? '已检测' : '未就绪' }}
        </span>
      </div>

      <div class="type-grid">
        <button
            v-for="item in typeMap"
            :key="item.value"
            class="type-item"
            :class="{ active: selectedType === item.value }"
            @click="selectedType = item.value"
        >
          <span class="type-icon">{{ item.icon }}</span>
          <span class="type-label">{{ item.label }}</span>
        </button>
      </div>

      <!-- 调整后的粘贴框高度 -->
      <div class="input-area">
        <textarea
            v-model="inputUrl"
            :readonly="!manual"
            placeholder="在此粘贴 http(s) 链接..."
            spellcheck="false"
        ></textarea>
      </div>

      <button class="submit-btn" :disabled="!ready" @click="doImport">
        {{ ready ? '确认导入至阅读' : '等待粘贴有效链接' }}
      </button>
    </div>

    <p class="footer-note">支持 开源阅读 3.0 及其分支版本</p>
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