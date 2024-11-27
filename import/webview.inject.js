// 是蓝奏云链接时
href = window.location.href;
if(/lanzou/.test(href)){
    Array.from(document.querySelectorAll(`
	.mt2:last-of-type,.appreport,.n_login,
	div[style*="color: #8a6d3b;"]
`),$=>$.style.display='none');

    href = encodeURIComponent(`https://gj.legado.cc/legado?url=${href.replace('/tp/','/')}&type=down`);

    const widthIsMax = window.innerWidth > window.innerHeight;
    let size, unit = 1500;
    if (widthIsMax) {
        size = window.innerWidth / unit;
        unit = "vw";
    } else {
        size = window.innerHeight / unit;
        unit = "vh"
    }

    const pubStyle = `background-color: rgb(255, 153, 0);border-radius:5px;border: 1px solid rgb(255, 153, 0);color: #fff;line-height:1;font-size:${4 * size}${unit};font-weight: 400;padding: ${size}${unit} ${size}${unit};`;

    const pubBtn = (btns) => {
        let text = "";
        for (let i in btns) {
            text += `${i}`
        }
        return text
    };

    const autoBtn = document.createElement('div');
    autoBtn.style.display = "none";

    autoBtn.innerHTML = `
        ${pubBtn({
            自动识别: "auto",
            导入书源: "bookSource",
            导入订阅: "rssSource",
            替换净化: "replaceRule"
        })}
        ${decodeURIComponent(href)}
        长按按钮可以关闭弹窗`;

    let time, isLong;
    function onBtnStart(evt) {
        evt.preventDefault();
        time = setTimeout(() => {
            isLong = true;
            autoBtn.style.display = "block";
        }, 600);
    };
    function onBtnEnd(evt) {
        evt.preventDefault();
        if (isLong) {
            isLong = undefined;
        } else {
            clearTimeout(time);
            time = undefined;
        }
    }
    btn = document.querySelector('.mdo');
    btn.addEventListener('touchstart', onBtnStart);
    btn.addEventListener('touchend', onBtnEnd);
    btn.addEventListener('touchcancel', onBtnEnd);
    btn.addEventListener('mousedown', onBtnStart);
    btn.addEventListener('mouseup', onBtnEnd);


    let time2, isLong2;
    function onBtnStart2(evt) {
        time2 = setTimeout(() => {
            isLong2 = true;
            autoBtn.style.display = "none";
        }, 600);
    };
    function onBtnEnd2(evt) {
        if (isLong2) {
            evt.preventDefault();
            isLong2 = undefined;
        } else {
            clearTimeout(time2);
            time2 = undefined;
        }
    }

    autoBtn.addEventListener('touchstart', onBtnStart2);
    autoBtn.addEventListener('touchend', onBtnEnd2);
    autoBtn.addEventListener('touchcancel', onBtnEnd2);
    autoBtn.addEventListener('mousedown', onBtnStart2);
    autoBtn.addEventListener('mouseup', onBtnEnd2);
    document.body.appendChild(autoBtn);
}