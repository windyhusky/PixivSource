<template>
    <div class="friends-container">
        <a
            v-for="friend in friends"
            :key="friend.link"
            :href="friend.link"
            target="_blank"
            rel="noopener"
            class="friend-card"
        >
            <img :src="friend.avatar" :alt="friend.name" class="avatar" />
            <div class="info">
                <span class="name">{{ friend.name }}</span>
                <p class="desc">{{ friend.desc || '这个小伙伴很神秘，什么都没写' }}</p>
            </div>
        </a>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 使用 computed 确保数据是响应式的，并从 frontmatter 中读取 friends 字段
const friends = computed(() => frontmatter.value.friends || [])
</script>

<style scoped>
.friends-container {
    display: grid;
    /* 自动填充，最小宽度 240px，间距 16px */
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.friend-card {
    display: flex;
    align-items: center;
    padding: 16px;
    /* 使用 VitePress 变量以适配深色模式 */
    border: 1px solid var(--vp-c-bg-soft);
    border-radius: 12px;
    background-color: var(--vp-c-bg-soft);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    text-decoration: none !important;
    color: var(--vp-c-text-1) !important;
}

.friend-card:hover {
    border-color: var(--vp-c-brand-1);
    background-color: var(--vp-c-bg-mute);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-right: 16px;
    object-fit: cover;
    flex-shrink: 0;
    background-color: var(--vp-c-neutral-soft);
}

.info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.name {
    font-weight: 600;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.desc {
    font-size: 13px;
    color: var(--vp-c-text-2);
    margin: 4px 0 0;
    line-height: 1.4;
    /* 文本超过两行时显示省略号 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 适配移动端 */
@media (max-width: 640px) {
    .friends-container {
        grid-template-columns: 1fr;
    }
}
</style>