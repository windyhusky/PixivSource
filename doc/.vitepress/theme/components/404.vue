<script setup lang="ts">
import { withBase, useRouter, useData } from "vitepress";
import { computed } from "vue";

const router = useRouter();
const { lang } = useData();

const goHome = () => router.go(withBase('/'));
const goBack = () => window.history.back();

// 多语言字典
const i18n = {
  'zh-CN': {
    title: "404",
    emoji: "🐲💤",
    heading: "嘘！你走进了龙穴的深处……",
    desc: {
      line1: "你在这错综复杂的龙穴迷路了",
      line2: "<strong>唐龙龙</strong>正在角落里打盹，尾巴尖还一晃一晃的",
      line3: "趁他还没被你的脚步声吵醒，赶紧原路溜回去吧！"
    },
    btnHome: "🏰 逃回入口",
    btnBack: "🐾 回溯足迹",
    tip: "温馨提示：如果听到低沉的呼噜声，那是龙在做梦"
  },
  'zh-TW': {
    title: "404",
    emoji: "🐲💤",
    heading: "噓！你走進了龍穴的深處……",
    desc: {
      line1: "你在這錯綜複雜的龍穴迷路了",
      line2: "<strong>唐龍龍</strong>正在角落裡打盹，尾巴尖還一晃一晃的",
      line3: "趁他還沒被你的腳步聲吵醒，趕緊原路溜回去吧！"
    },
    btnHome: "🏰 逃回入口",
    btnBack: "🐾 回溯足跡",
    tip: "溫馨提示：如果聽到低沉的呼嚕聲，那是龍在做夢"
  },
  'en-US': {
    title: "404",
    emoji: "🐲💤",
    heading: "Shh! You've wandered into the depths of the Dragon's Lair...",
    desc: {
      line1: "You've lost your way in this maze of a dragon's den.",
      line2: "<strong>Downey Rem</strong> is dozing in the corner, his tail tip twitching.",
      line3: "Before you wake him, you'd better sneak back out!"
    },
    btnHome: "🏰 Escape to Entrance",
    btnBack: "🐾 Trace Steps Back",
    tip: "Tip: If you hear a low rumbling, that's just the dragon dreaming."
  }
};

// 自动根据 lang 计算当前显示的语言包，若无匹配项则回退到 zh-CN
const t = computed(() => i18n[lang.value as keyof typeof i18n] || i18n['zh-CN']);
</script>

<template>
  <div class="dragon-404-container">
    <div style="text-align: center; padding: 40px 20px; font-family: sans-serif;">

      <div style="position: relative; display: inline-block; margin-bottom: 20px;">
        <h1 style="font-size: 120px; margin: 0; color: #5d9b9d; opacity: 0.2; line-height: 1;">{{ t.title }}</h1>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60px;">
          {{ t.emoji }}
        </div>
      </div>

      <h2 style="color: #5d9b9d; margin-top: 0;">{{ t.heading }}</h2>

      <br><br>

      <p style="font-size: 1.1em; line-height: 1.8; max-width: 500px; margin: 0 auto 30px; opacity: 0.8; color: var(--vp-c-text-1);">
        {{ t.desc.line1 }}<br>
        <span v-html="t.desc.line2"></span><br>
        {{ t.desc.line3 }}
      </p>

      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button @click="goHome" class="btn-primary">
          {{ t.btnHome }}
        </button>

        <button @click="goBack" class="btn-secondary">
          {{ t.btnBack }}
        </button>
      </div>

      <p style="margin-top: 50px; font-size: 0.9em; opacity: 0.5; font-style: italic; color: var(--vp-c-text-2);">
        {{ t.tip }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.dragon-404-container {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg);
}

.btn-primary {
  background: #5d9b9d;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(93, 155, 157, 0.3);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(93, 155, 157, 0.5);
  background: #4a8284;
}

.btn-secondary {
  border: 2px solid #5d9b9d;
  background: transparent;
  color: #5d9b9d;
  padding: 10px 23px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(93, 155, 157, 0.1);
}
</style>