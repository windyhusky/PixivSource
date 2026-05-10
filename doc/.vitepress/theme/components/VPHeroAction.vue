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
      <!-- 头部标题风格完全对齐 -->
      <div class="legado-header">
        <span class="header-title">{{ title }}</span>
      </div>

      <!-- 按钮网格：支持自动换行，居中对齐 -->
      <div class="actions-grid">
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
/* 容器：与你的 legato-card 逻辑对齐 */
.legado-actions-outer {
  max-width: 640px;
  margin: 24px auto;
  width: 100%;
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: all 0.3s ease;
}

.legado-header {
  display: flex;
  justify-content: flex-start; /* 改为左对齐，保持与导入框一致 */
  margin-bottom: 16px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* 按钮网格布局 */
.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

/* 基础按钮样式：复用你的 type-item 逻辑但宽度自适应 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 12px; /* 与 type-item 圆角一致 */
  text-decoration: none !important;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* 主题颜色：复用你的 submit-btn / active 逻辑 */
.action-btn.brand {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.action-btn.brand .btn-text {
  color: white;
}

/* 悬停效果 */
.action-btn:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.action-btn.brand:hover {
  opacity: 0.85;
}

/* 窄屏适配：每行两个 */
@media (max-width: 480px) {
  .action-btn {
    flex: 1 1 calc(50% - 10px);
  }
}
</style>