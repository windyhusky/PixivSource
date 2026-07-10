if (!document.getElementById('open-yuedu-bookshelf')) {
    const style = document.createElement('style');
    style.textContent = `
        .yuedu-float-btn {
            z-index: 9999999999;
            position: fixed;
            bottom: 13%;
            padding: 10px 18px;
            border-radius: 8px;
            border: none;
            color: #fff;
            font-weight: 500;
            font-size: clamp(14px, 3.8vw, 17px);
            box-shadow: 0 4px 12px rgba(255, 153, 0, 0.35);
            transition: all 0.2s ease;
            cursor: pointer;
            user-select: none;
        }
        .yuedu-float-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 16px rgba(255, 153, 0, 0.45);
        }
        .yuedu-float-btn:active {
            transform: scale(0.96);
        }
    `;
    document.head.appendChild(style);

    // 「导入书源」按钮 - 左下
    const btn = document.createElement('button')
    btn.id = 'impotr-booksource'
    btn.className = 'yuedu-float-btn'
    btn.style.backgroundColor = '#ff9900'
    btn.style.left = '10%'
    btn.textContent = '导入书源'
    document.body.appendChild(btn)

    btn.onclick = () => {
        window.open('legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json', '_blank')
    }

    // 「加入书架」按钮 - 右下
    const btn2 = document.createElement('button')
    btn2.id = 'open-yuedu-bookshelf'
    btn2.className = 'yuedu-float-btn'
    btn2.style.backgroundColor = '#ff9900'
    btn2.style.right = '10%'
    btn2.textContent = '加入书架'
    document.body.appendChild(btn2)

    btn2.onclick = () => {
        window.open(`legado://import/addToBookshelf?src=${encodeURIComponent(window.location.href)}`, '_blank')
    }
}