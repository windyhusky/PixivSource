<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({
    // Giscus 插件默认容器 ID 通常是 'giscus'
    targetId: {
        type: String,
        default: "giscus"
    }
});

const showDiscuss = ref(false);

const scrollToComments = () => {
    const el = document.getElementById(props.targetId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};

const handleScroll = () => {
    // 滚动超过 100px 显示，快到底部时（离底部 300px）隐藏，避免挡住评论区
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    const atBottom = (scrollY + innerHeight) > (scrollHeight - 300);

    showDiscuss.value = scrollY > 100 && !atBottom;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
    <Transition name="fade">
        <div class="discuss-btn-container" v-show="showDiscuss">
            <div
                class="discuss-main"
                title="直达评论"
                @click="scrollToComments"
            >
                <svg class="icon" viewBox="0 0 1024 1024">
                    <path d="M512 64C264.6 64 64 221.3 64 416c0 108.3 61.2 205.1 157.1 270.8L160 896l191.1-95.5c50.3 14.7 104.1 22.8 160.9 22.8 247.4 0 448-157.3 448-352S759.4 64 512 64z" fill="#FFF"/>
                </svg>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.discuss-btn-container {
    position: fixed;
    bottom: 90px; /* 位于 BackTop 上方 (20px + 60px + 10px 间距) */
    right: 20px;
    width: 60px;
    height: 60px;
    z-index: 999;
}

.discuss-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    width: 44px; /* 与 BackTop 内部圆大小一致 */
    height: 44px;
    border-radius: 50%;
    background-color: #10b981; /* 漂亮的翠绿色 (Emerald 500) */
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.discuss-main:hover {
    background-color: #059669; /* 悬停颜色加深 */
    transform: translate(-50%, -60%); /* 悬停时稍微往上浮动，增加动感 */
}

.icon {
    width: 22px;
    height: 22px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>