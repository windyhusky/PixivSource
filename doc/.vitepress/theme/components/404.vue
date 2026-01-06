<script setup lang="ts">
import { withBase, useRouter } from "vitepress";

const router = useRouter();
const goHome = () => router.go(withBase('/'));
const goBack = () => window.history.back();
</script>

<template>
  <div class="dragon-404-container">
    <div style="text-align: center; padding: 40px 20px; font-family: sans-serif;">

      <div style="position: relative; display: inline-block; margin-bottom: 20px;">
        <h1 style="font-size: 120px; margin: 0; color: #5d9b9d; opacity: 0.2; line-height: 1;">404</h1>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 60px;">
          🐲💤
        </div>
      </div>

      <h2 style="color: #5d9b9d; margin-top: 0;">嘘！你走进了龙穴的深处……</h2>

      <br><br>

      <p style="font-size: 1.1em; line-height: 1.8; max-width: 500px; margin: 0 auto 30px; opacity: 0.8; color: var(--vp-c-text-1);">
        你在这错综复杂的龙穴迷路了<br>
        <strong>唐龙龙</strong>正在角落里打盹，尾巴尖还一晃一晃的<br>
        趁他还没被你的脚步声吵醒，赶紧原路溜回去吧！
      </p>

      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button @click="goHome" class="btn-primary">
          🏰 逃回入口
        </button>

        <button @click="goBack" class="btn-secondary">
          🐾 回溯足迹
        </button>
      </div>

      <p style="margin-top: 50px; font-size: 0.9em; opacity: 0.5; font-style: italic; color: var(--vp-c-text-2);">
        温馨提示：如果听到低沉的呼噜声，那是龙在做梦
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