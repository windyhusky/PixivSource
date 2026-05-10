<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps({
  actions: {
    type: Array,
    default: null
  },
  title: {
    type: String,
    default: '相关链接'
  }
})

const { frontmatter } = useData()

const computedActions = computed(() => {
  return props.actions || frontmatter.value.hero?.actions || []
})
</script>

<template>
  <div v-if="computedActions.length > 0" class="legado-actions-outer">
    <div class="legado-card main-mode">
      <div class="legado-header">
        <span class="header-title">{{ title }}</span>
      </div>

      <div class="actions-container">
        <a
            v-for="action in computedActions"
            :key="action.link"
            :href="withBase(action.link)"
            :target="action.target"
            :class="['action-btn', action.theme || 'alt']"
        >
          <span class="btn-text">{{ action.text }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legado-actions-outer {
  max-width: 640px;
  margin: 32px auto; /* 增加上下外边距，拉开与上方组件的距离 */
  width: 100%;
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  padding: 24px; /* 略微增加卡片内边距 */
  box-sizing: border-box;
}

.legado-header {
  display: flex;
  margin-bottom: 20px; /* 标题与按钮组的间距增大 */
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.actions-container {
  display: flex;
  flex-wrap: wrap;
  /* 增大间距：第一个值是行间距 (row)，第二个是列间距 (column) */
  gap: 14px 16px;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 略微增加按钮的尺寸 */
  padding: 12px 22px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 14px; /* 随尺寸增大圆角，视觉更协调 */
  text-decoration: none !important;
  transition: all 0.25s ease;

  white-space: nowrap;
  flex-shrink: 0;
}

.btn-text {
  font-size: 15px; /* 字号略微提升 */
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.action-btn.brand {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.action-btn.brand .btn-text {
  color: #ffffff;
}

.action-btn:hover {
  transform: translateY(-3px); /* 悬浮位移感更明显点 */
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.action-btn.brand:hover {
  opacity: 0.9;
}

@media (max-width: 480px) {
  .legado-card {
    padding: 20px 16px;
  }
  .actions-container {
    gap: 12px 12px; /* 移动端保持适中的大间距 */
  }
  .action-btn {
    padding: 10px 18px;
    font-size: 14px;
  }
}
</style>