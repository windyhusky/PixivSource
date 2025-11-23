---
layout: page
---
<script setup>
import {
    VPTeamPage,
    VPTeamPageTitle,
    VPTeamMembers
} from 'vitepress/theme';

const members = [
    {
        avatar: 'https://www.github.com/DowneyRem.png',
        name: 'DowneyRem',
        title: '唐尼瑞姆',
        desc: "项目创始、主要维护",
        actionText: "赞助",
        sponsor: "/Sponsor",
        links: [
            { icon: 'github', link: 'https://github.com/DowneyRem' },
            { icon: 'codeberg', link: 'https://codeberg.org/DowneyRem' },
            { icon: 'telegram', link: 'https://t.me/DowneyRem' },
            { icon: 'twitter', link: 'https://x.com/DowneyRemDragon' },
        ]
    },
    {
        avatar: 'https://www.github.com/windyhusky.png',
        name: 'WindyHusky',
        title: '狗子',
        desc: "早期开发",
        links: [
            { icon: 'github', link: 'https://github.com/windyhusky' },
        ]
    },

    {
        avatar: 'https://www.github.com/eigeen.png',
        name: 'Eigeen',
        title: '本征',
        desc: "TypeScript 重构",
        links: [
            { icon: 'github', link: 'https://github.com/eigeen' },
        ]
    },
];
</script>

<VPTeamPage>
    <VPTeamPageSection>
        <VPTeamPageTitle>
            <template #title> 开发团队 </template>
            <template #lead>
                Pixiv 书源项目 开发团队
            </template>
        </VPTeamPageTitle>
        <VPTeamMembers size="small" :members="members"/>
    </VPTeamPageSection>
</VPTeamPage>

