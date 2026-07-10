if (!document.getElementById('open-yuedu-bookshelf')) {
    const style = document.createElement('style');
    style.textContent = `
        .yuedu-float-btn {
            z-index: 9999999999;
            position: fixed;
            bottom: 13%;
            padding: 11px 20px;
            border-radius: 8px;
            border: none;
            color: #fff;
            font-weight: 500;
            font-size: clamp(14px, 3.8vw, 17px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.25s ease;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
        }

        .yuedu-float-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        }
        .yuedu-float-btn:active {
            transform: scale(0.96);
        }
    `;
    document.head.appendChild(style);

    // 域名判断
    const currentUrl = window.location.href;
    const isPixiv = /pixiv\.net/i.test(currentUrl);
    const isLinpx = /linpx\.ink/i.test(currentUrl);
    const isFurryNovel = /furrynovel\.com/i.test(currentUrl);

    // 书源地址
    let bookSourceUrl
    if (isPixiv) {
        bookSourceUrl = 'https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json'
    } else {
        bookSourceUrl = 'https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json'
    }

    // 按钮颜色（pixiv 用蓝色，其他用黄色）
    const mainColor = isPixiv ? '#1da5f9' : '#ff9900';
    const hoverColor = isPixiv ? '#40b6ff' : '#ffaa22';

    // 「导入书源」按钮 - 左下
    const btn = document.createElement('button');
    btn.id = 'impotr-booksource';
    btn.className = 'yuedu-float-btn';
    btn.style.backgroundColor = mainColor;
    btn.style.left = '10%';
    btn.textContent = '导入书源';
    document.body.appendChild(btn);

    btn.onclick = () => {
        window.open(`legado://import/bookSource?src=${encodeURIComponent(bookSourceUrl)}`, '_blank');
    };

    // 「加入书架」按钮 - 右下
    if (!isFurryNovel && !isLinpx) {
        const btn2 = document.createElement('button');
        btn2.id = 'open-yuedu-bookshelf';
        btn2.className = 'yuedu-float-btn';
        btn2.style.backgroundColor = mainColor;
        btn2.style.right = '10%';
        btn2.textContent = '加入书架';
        document.body.appendChild(btn2);

        btn2.onclick = () => {
            window.open(`legado://import/addToBookshelf?src=${encodeURIComponent(window.location.href)}`, '_blank');
        };
    }

    // Hover 颜色
    const hoverStyle = document.createElement('style');
    hoverStyle.textContent = `
        #impotr-booksource:hover,
        #open-yuedu-bookshelf:hover {
            background-color: ${hoverColor} !important;
        }
    `;
    document.head.appendChild(hoverStyle);
}