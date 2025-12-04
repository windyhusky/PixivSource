// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
// ⬇️ 确保这行导入路径是正确的！
import SponsorTable from './components/SponsorTable.vue'
// 确保您没有使用其他插件的 enhanceApp 覆盖了您的组件注册

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        // ⬇️ 确保这行注册是存在的
        app.component('SponsorTable', SponsorTable)
        // ... 如果您有其他 enhanceApp 逻辑，放在这里
    }
}