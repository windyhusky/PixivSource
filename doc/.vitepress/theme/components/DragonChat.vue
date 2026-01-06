<template>
  <div class="dragon-chat-container">
    <div class="avatar-wrapper">
      <img :src="withBase(avatar)" :alt="name" class="avatar-img" />
      <div class="avatar-badge">{{ badge }}</div>
    </div>

    <div class="chat-bubble">
      <div class="chat-header">
        <span class="header-icon">{{ icon }}</span>
        <span class="header-name">{{ name }}</span>
      </div>

      <div class="chat-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
// 1. 引入 withBase
import { withBase } from 'vitepress'

defineProps({
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  badge: { type: String, default: '' },
  icon: { type: String, default: '' },
})
</script>

<style scoped>
/* 保持你原来的样式不变 */
.dragon-chat-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 30px auto;
  max-width: 600px;
  /* 建议添加：适配默认主题的文字颜色 */
  color: var(--vp-c-text-1);
}

.avatar-wrapper {
  flex-shrink: 0;
  position: relative;
  width: 200px;
  height: 200px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  border: 3px solid #5d9b9d;
  object-fit: cover;
  display: block;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.avatar-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 28px;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* 深色模式适配建议：将背景改为使用 CSS 变量，否则在深色模式下背景可能过亮 */
.chat-bubble {
  position: relative;
  flex: 1;
  min-width: 280px;
  background: var(--vp-c-bg-soft); /* 使用默认主题的柔和背景色 */
  border: 1px solid rgba(93, 155, 157, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.header-name {
  font-size: 18px;
  font-weight: bold;
  color: #5d9b9d;
}

.chat-content {
  font-size: 15px;
  line-height: 1.7;
}

/* --- 核心修改部分 --- */
.chat-content :deep(strong) {
  font-weight: bold;
  color: inherit;
}

.chat-content :deep(.quote-area) {
  margin-top: 8px;
  padding-left: 15px;
  border-left: 2px solid rgba(93, 155, 157, 0.3);
}

.chat-content :deep(.quote-area strong) {
  color: #5d9b9d;
}

.chat-content :deep(a) {
  color: #5d9b9d;
  text-decoration: none;
  font-weight: bold;
}

.chat-content :deep(a:hover) {
  text-decoration: underline;
}
</style>