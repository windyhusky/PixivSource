<template>
  <div class="sponsor-wrapper">
    <div v-if="links.length" class="links-container">
      <a
          v-for="(link, index) in links"
          :key="'link-' + index"
          :href="link.url"
          target="_blank"
          class="sponsor-btn"
          :style="{ '--btn-color': link.color || '#946ce6' }"
      >
        <span class="icon">{{ link.icon }}</span> &nbsp; {{ link.text }}
      </a>
    </div>

    <div v-if="qrs.length" class="qrs-container">
      <div
          v-for="(qr, index) in qrs"
          :key="'qr-' + index"
          class="qr-card"
      >
        <div class="qr-header">
          <img v-if="qr.logo" :src="withBase(qr.logo)" class="qr-logo" />
          <span class="qr-title">{{ qr.name }}</span>
        </div>
        <div class="qr-body">
          <img :src="qr.image" :alt="qr.name" class="qr-image" />
        </div>
        <p v-if="qr.desc" class="qr-desc">{{ qr.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 1. 引入 withBase
import { withBase } from 'vitepress'
const props = defineProps({
  // 独立定义的链接按钮
  links: {
    type: Array,
    default: () => [
      { text: '爱发电', icon: '💜', url: 'https://afdian.com/a/DowneyRem', color: '#946ce6' },
      { text: '引力圈', icon: '💫', url: 'https://app.unifans.io/c/downeyrem', color: '#28235b' },
      { text: 'Buy me a Coffee', icon: '☕️', url: 'https://ko-fi.com/downeyrem', color: '#ff5f5f' },
    ]
  },
  // 独立定义的二维码卡片
  qrs: {
    type: Array,
    default: () => [
      {
        name: '支付宝转账',
        image: './img/SponsorAlipay.png',
        logo: './img/Alipay.svg',
      },
      {
        name: '微信赞赏',
        image: './img/SponsorWechatReward.png',
        logo: './img/WechatPay.svg',
      }
    ]
  }
})
</script>

<style scoped>
.sponsor-wrapper {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* 按钮组样式 */
.links-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.sponsor-btn {
  text-decoration: none !important;
  display: flex;
  align-items: center;
  padding: 10px 24px;
  background-color: var(--btn-color);
  color: #fff !important;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.sponsor-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

/* 二维码卡片样式 */
.qrs-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.qr-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px;
  width: 200px;
  text-align: center;
  transition: border-color 0.3s;
}

.qr-card:hover {
  border-color: var(--vp-c-brand-1);
}

.qr-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.qr-logo { width: 18px; height: 18px; }
.qr-title { font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }

.qr-image {
  width: 100%;
  border-radius: 8px;
  background: white;
  padding: 4px;
}

.qr-desc {
  margin-top: 8px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.thanks-text {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  font-style: italic;
}

/* 深色模式修正 */
:deep(.dark) .qr-image {
  filter: brightness(0.9);
}
</style>