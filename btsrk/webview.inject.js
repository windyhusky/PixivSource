if (!/^https:\/\/(so\.toutiao\.com\/search\/?|quark\.sm\.cn\/s|wap\.sogou\.com\/web\/searchList\.jsp|m\.so\.com\/s|cn\.bing\.com\/search|www\.baidu\.com\/s)\?/.test(window.location.href) && !document.getElementById('open-yuedu-bookshelf')) {
    const btn = document.createElement('div');
    btn.innerHTML = `<button type="button" id='open-yuedu-bookshelf' style="z-index: 9999999999;
    position: fixed;bottom: 8.1%;right: 7%;background-color: rgb(255, 153, 0);border-radius: 2px;border: 1px solid rgb(255, 153, 0);color: #fff;
    font-size:${window.innerWidth/80}vw;font-weight: 400;padding: ${window.innerWidth/400}vw ${window.innerWidth/150}vw;
    "onclick="window.open('legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json','_blank');">导入书源</button>`;
    document.body.appendChild(btn);
}

let time, num=0;
const herfs = new Map();
function onTouchStart(evt) {
    for (const el of evt.path) {
        if (el.tagName === "A") {
            if (el.href !== 'javascript:void(0)') {
                const inner = el.href;
                herfs.set(el, inner);
                el.setAttribute('href', 'javascript:void(0)');
                time = setTimeout(() => {	window.open(`legado://import/addToBookshelf?src=${encodeURIComponent(inner)}`, '_blank')
                }, 600);
            }
            break;
        }
    }
}

function onTouchEnd(evt) {
    if (time) {
        clearTimeout(time);
        time = undefined;
    }
    for (const el of evt.path) {
        if (el.tagName === "A") {
            if (el.href === 'javascript:void(0)') {
                const herf = herfs.get(el);
                if (herf) {
                    el.setAttribute('href', herf)
                }
            }
            break;
        }
    }
}

function addListener(els){
    Array.from(els, (item) => {
        if (item.getAttribute('add-yuedu-bookshelf') !== 'add-yuedu-bookshelf' && item.innerText && item.href && !/^#|^javascript:/.test(item.href)) {
            item.setAttribute('add-yuedu-bookshelf', 'add-yuedu-bookshelf');
            item.addEventListener('touchstart', onTouchStart);
            item.addEventListener('touchend', onTouchEnd);
            item.addEventListener('touchcancel', onTouchEnd);
            item.addEventListener('mousedown', onTouchStart);
            item.addEventListener('mouseup', onTouchEnd);
        }
    });
    num= els.length;
}

function reAdd(){
    const els = document.getElementsByTagName('a');
    if(els.length>num)addListener(els);
}

reAdd();

const observer = new ResizeObserver(reAdd);
observer.observe(document.body);