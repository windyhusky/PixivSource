import { createContentLoader } from 'vitepress'

export default createContentLoader('**/FriendLink.md', {
    transform(rawData) {
        const dataMap: Record<string, any> = {
            root: [],
            en: [],
            'zh-TW': []
        }

        rawData.forEach((page) => {
            // 确定该文件属于哪个语言
            let lang = 'root'
            if (page.url.startsWith('/en/')) lang = 'en'
            else if (page.url.startsWith('/zh-TW/')) lang = 'zh-TW'

            // 处理数据
            const groups = (page.frontmatter.friendGroups || []).map((group: any) => ({
                ...group,
                // 只保留没有 hide 属性，或者 hide 不为 true 的友链
                items: (group.items || []).filter((item: any) => item.hide !== true)
            })).filter((group: any) => group.items.length > 0)

            dataMap[lang] = groups
        })

        return dataMap
    }
})