// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";

import { h } from "vue";
import SponsorTable from "./components/SponsorTable.vue";
import DragonChat from './components/DragonChat.vue'
import NotFound from "./components/404.vue";
import HomeUnderline from "./components/HomeUnderline.vue"
import './style/index.css'

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound),
        }),
    enhanceApp({ app }) {
        app.component('SponsorTable', SponsorTable)
        app.component('DragonChat', DragonChat)
        app.component('HomeUnderline', HomeUnderline)
    }
};