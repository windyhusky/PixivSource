<template>
  <div class="home-friends" v-if="friendGroups.length > 0">
    <div class="container" ref="containerRef">
      <hr class="divider" />
      <div class="header">
        <a href="/FriendLink" class="footer-title">
          <span class="title-emoji">🤝</span>
          <span class="title-text">{{ t.title }}</span>
        </a>
      </div>
      <div class="grid" :style="{ '--min-width': gridMinWidth }">
        <a v-for="f in friendGroups" :key="f.link" :href="f.link" target="_blank" rel="noopener" class="card">
          <img :src="resolveIcon(f.icon)" class="icon" v-if="f.icon" loading="lazy" />
          <span class="name">{{ f.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as allLangData } from './FriendLink.data.ts'
import { friendLinkI18n as translations} from './FriendLinkLocales.ts'

const { localeIndex } = useData()
const containerRef = ref(null)
const t = computed(() => translations[localeIndex.value] || translations['root'])

// 根据语言动态计算首页卡片宽度
const gridMinWidth = computed(() => localeIndex.value === 'en' ? '180px' : '160px')

const friendGroups = computed(() => {
  const lang = localeIndex.value || 'root'
  const groups = allLangData[lang] || allLangData['root'] || []
  return groups.flatMap(g => g.items || [])
})

const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

function alignToHomeContent() {
  const container = containerRef.value
  if (!container) return
  const homeContent = document.querySelector('.VPHomeContent') || document.querySelector('.VPContent')
  if (!homeContent) return
  const rect = homeContent.getBoundingClientRect()
  const parentRect = container.parentElement.getBoundingClientRect()
  container.style.paddingLeft = `${Math.max(rect.left - parentRect.left, 0)}px`
  container.style.paddingRight = `${Math.max(parentRect.right - rect.right, 0)}px`
}

let ro
onMounted(() => {
  nextTick(alignToHomeContent)
  ro = new ResizeObserver(alignToContentAnimationFrame)
  ro.observe(document.documentElement)
})

function alignToContentAnimationFrame() {
  window.requestAnimationFrame(alignToHomeContent)
}

onUnmounted(() => ro?.disconnect())
</script>

<style scoped>
.home-friends {
  width: 100%;
  padding-top: 64px;
  padding-bottom: 0px;
  margin-bottom: -90px;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  box-sizing: border-box;
  max-width: 1152px;
  margin: 0 auto;
}

.divider {
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 24px;
  opacity: 0.5;
}

.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.footer-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-title:hover {
  color: var(--vp-c-brand-1);
}

.title-emoji {
  width: 40px;
  margin-left: 7px;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  font-size: 18px;
}

.grid {
  display: grid;
  /* 使用 CSS 变量控制最小宽度 */
  grid-template-columns: repeat(auto-fill, minmax(var(--min-width, 160px), 1fr));
  gap: 16px;
}

.card {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
  object-fit: cover;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card:hover .name {
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .home-friends {
    padding-top: 40px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>