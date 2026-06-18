<template>
  <!-- 绑定计算后的对齐方式 -->
  <div :class="['dragon-chat-container', { 'align-right': computedConfig.align === 'right' }]">
    <div class="avatar-wrapper">
      <!-- 绑定计算后的头像路径 -->
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
// 1. 引入 withBase
import { withBase } from 'vitepress'
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  // 保留单张图的传参，方便特殊页面临时覆盖
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  badge: { type: String, default: '' },
  icon: { type: String, default: '' },
  align: { type: String, default: 'left' },

  // 核心改动：把你的多图随机池直接写成默认值
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

// 记录随机抽中的索引
const randomIndex = ref(-1)

onMounted(() => {
  if (props.avatarList && props.avatarList.length > 0) {
    randomIndex.value = Math.floor(Math.random() * props.avatarList.length)
  }
})

// 动态计算最终使用的头像和位置配置
const computedConfig = computed(() => {
  // 如果 Markdown 里单独传了单张 avatar，优先用传进来的（不随机）
  if (props.avatar) {
    return {
      avatar: props.avatar,
      align: props.align
    }
  }

  // 默认走组件内的多图随机池
  if (props.avatarList && props.avatarList.length > 0 && randomIndex.value !== -1) {
    const chosen = props.avatarList[randomIndex.value]
    return {
      avatar: chosen.img,
      align: chosen.align
    }
  }

  // 极端的兜底防错
  return {
    avatar: './DowneyRemToy.png',
    align: 'right'
  }
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