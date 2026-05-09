<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter } = useData()
const showLastUpdated = computed(() => {
  if (frontmatter.value.lastUpdated === false) return false
  return !!page.value.lastUpdated
})

const date = computed(() => {
  return page.value.lastUpdated ? new Date(page.value.lastUpdated) : null
})
</script>

<template>
  <div v-if="showLastUpdated" class="LastUpdated">
    <p>更新时间: {{ date?.toLocaleDateString() }}</p><br>
  </div>
</template>

<style>
.LastUpdated {
    color: var(--vp-c-text-2);
}
</style>