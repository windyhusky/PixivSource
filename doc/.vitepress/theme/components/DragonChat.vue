<template>
  <!-- 1. 动态绑定 isEnglish 类名 -->
  <div :class="[
    'dragon-chat-container',
    { 'align-right': computedConfig.align === 'right' },
    { 'is-english': isEnglish }
  ]">
    <div class="avatar-wrapper">
      <img :src="withBase(computedConfig.avatar)" :alt="name" class="avatar-img" />
      <div v-if="badge" class="avatar-badge">{{ badge }}</div>
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
import { withBase, useData } from 'vitepress'
import { ref, onMounted, computed } from 'vue'

// 获取 VitePress 页面数据
const { page } = useData()

// 2. 动态判断当前页面是不是英文版
const isEnglish = computed(() => {
  return page.value.relativePath.startsWith('en/')
})

const props = defineProps({
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  badge: { type: String, default: '' },
  icon: { type: String, default: '' },
  align: { type: String, default: 'left' },
  avatarList: {
    type: Array,
    default: () => [
      { img: '/DowneyRem1.png', align: 'left' },
      { img: '/DowneyRem2.png', align: 'left' },
      { img: '/DowneyRemLeft1.png', align: 'right' },
      { img: '/DowneyRemLeft2.png', align: 'right' },
      { img: '/DowneyRemLeft3.png', align: 'right' },
      { img: '/DowneyRemLeft4.png', align: 'right' },
    ]
  }
})

const randomIndex = ref(-1)

onMounted(() => {
  if (props.avatarList && props.avatarList.length > 0) {
    randomIndex.value = Math.floor(Math.random() * props.avatarList.length)
  }
})

const computedConfig = computed(() => {
  if (props.avatar) {
    return { avatar: props.avatar, align: props.align }
  }
  if (props.avatarList && props.avatarList.length > 0 && randomIndex.value !== -1) {
    const chosen = props.avatarList[randomIndex.value]
    return { avatar: chosen.img, align: chosen.align }
  }
  return { avatar: './DowneyRemToy.png', align: 'right' }
})
</script>

<style scoped>
/* ================= 中文默认样式（保持你原有的紧凑精美） ================= */
.dragon-chat-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 30px auto;
  max-width: 600px; /* 中文最大 600px */
  color: var(--vp-c-text-1);
}

.dragon-chat-container.align-right {
  flex-direction: row-reverse;
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

.chat-bubble {
  position: relative;
  flex: 1;
  min-width: 280px;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(93, 155, 157, 0.3);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.dragon-chat-container.is-english {
  max-width: 720px; /* 英文环境下，容器变宽 */
}
.dragon-chat-container.is-english .chat-bubble {
  flex: 2;          /* 英文环境下，气泡框分到更多宽度，伸展更长 */
  min-width: 320px;
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