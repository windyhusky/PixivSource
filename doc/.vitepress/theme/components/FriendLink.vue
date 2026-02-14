<template>
    <div class="friends-wrapper">
        <div v-for="group in friendGroups" :key="group.title" class="friend-group">
            <h3 :id="group.title" class="group-title">{{ group.title }}</h3>

            <div class="friends-container">
                <a
                    v-for="friend in group.items"
                    :key="friend.link"
                    :href="friend.link"
                    target="_blank"
                    rel="noopener"
                    class="friend-card"
                >
                    <img
                        :src="friend.icon || defaultIcon"
                        :alt="friend.name"
                        class="icon"
                        @error="handleImgError"
                    />
                    <div class="info">
                        <span class="name">{{ friend.name }}</span>
                        <p class="desc">{{ friend.desc || '这个伙伴很神秘，什么都没写' }}</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 响应式获取 Markdown 中的 friendGroups 数据
const friendGroups = computed(() => frontmatter.value.friendGroups || [])

// 默认头像地址
const defaultIcon = './pic/Blog.png'
// 处理图片加载失败的情况（如对方网站挂了或防盗链）
const handleImgError = (e) => {
    const target = e.target
    if (target.src !== defaultIcon) {
        target.src = defaultIcon
    }
}
</script>

<style scoped>
.friend-group {
    margin-bottom: 32px;
}

/* 三级标题样式适配 VitePress 风格 */
.group-title {
    display: flex;
    align-items: center;
    margin: 32px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--vp-c-divider);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.friends-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
}

.friend-card {
    display: flex;
    align-items: center;
    padding: 16px;
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

.icon {
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 移动端适配：单列显示 */
@media (max-width: 640px) {
    .friends-container {
        grid-template-columns: 1fr;
    }
}
</style>