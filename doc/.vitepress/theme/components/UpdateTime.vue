<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'


const { page, frontmatter, lang } = useData()

// 1. 语言文本字典（未来需要支持新语言，直接在这里往下加即可）
const i18nLabels: Record<string, string> = {
  'zh-CN': '更新时间',
  'zh-TW': '更新時間',
  'zh-HK': '更新時間',
  'en-US': 'Last Updated',
  'ja-JP': '最終更新'
}

// 2. 合并时间戳获取
const timestamp = computed(() => frontmatter.value.lastUpdated || page.value.lastUpdated)

// 3. 显示控制：只要 frontmatter 没显式禁用，且有有效时间戳就显示
const showLastUpdated = computed(() => {
  if (frontmatter.value.lastUpdated === false) return false
  return !!(frontmatter.value.lastUpdated || page.value.lastUpdated)
})

// 4. 精准查表获取标签，若找不到（比如未来的新语言还没配）则回退到简体中文
const label = computed(() => i18nLabels[lang.value] || i18nLabels['zh-CN'])

// 5. 格式化日期：toLocaleDateString 会自动根据当前 lang 渲染对应国家的日期格式（如美式/日式/中式）
const dateStr = computed(() => {
  if (!timestamp.value) return ''
  return new Date(timestamp.value).toLocaleDateString(lang.value)
})
</script>

<template>
  <div v-if="showLastUpdated" class="LastUpdated">
    <p>{{ label }}: {{ dateStr }}</p>
  </div>
</template>

<style>
.LastUpdated {
  color: var(--vp-c-text-2);
}
</style>