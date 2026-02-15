<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({
    // 目标容器 ID，通常是 giscus
    targetId: {
        type: String,
        default: "giscus"
    }
});

const showDiscuss = ref(false);

/**
 * 核心优化：持续平滑滚动到底部
 * 这种方法可以确保在极长页面下也能一直滚动，直到触达目标或页面尽头
 */
const scrollToComments = () => {
    const el = document.getElementById(props.targetId);
    // 获取目标位置，如果找不到目标则以文档底部为准
    const targetPosition = el
        ? el.getBoundingClientRect().top + window.scrollY - 20
        : document.documentElement.scrollHeight;

    // 使用原生平滑滚动
    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });

    /** * 针对部分浏览器对 smooth 滚动距离限制的补丁：
     * 如果页面实在太长（例如超过 10000px），单次 smooth 可能停在中途。
     * 我们可以监听一次滚动停止，如果没到位再补一次。
     */
    const checkScrollEnd = () => {
        const currentPos = window.scrollY + window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;

        // 如果还没到目标附近，且还没撞到页面底部，则再次触发
        if (Math.abs(window.scrollY - targetPosition) > 100 && currentPos < totalHeight - 5) {
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    };

    // 延迟检查，防止单次平滑滚动未完成
    setTimeout(checkScrollEnd, 800);
};

const handleScroll = () => {
    // 检查评论区容器是否存在，不存在则隐藏按钮
    const el = document.getElementById(props.targetId);
    if (!el) {
        showDiscuss.value = false;
        return;
    }

    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;

    // 接近底部 350px 时隐藏，避免挡住评论输入框
    const atBottom = (scrollY + innerHeight) > (scrollHeight - 350);

    showDiscuss.value = scrollY > 100 && !atBottom;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
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
                title="直达底部评论"
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
    bottom: 90px;
    right: 20px;
    width: 60px;
    height: 60px;
    z-index: 999;
    user-select: none;
}

.discuss-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #10b981;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.discuss-main:hover {
    background-color: #059669;
    transform: translate(-50%, -60%);
    box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
}

.discuss-main:active {
    transform: translate(-50%, -50%) scale(0.9);
}

.icon {
    width: 22px;
    height: 22px;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}
</style>