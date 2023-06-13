import { defineStore } from 'pinia'
export let yumaoStore = defineStore('yumao', {
    state() {
        return {
            isLogin: 0,
            adminIsLogin: 0,
            showLogin: 0,
            userInfo: {},
            adminInfo: {},
            userWhere: 'MyOrder',
            allBook: '',
        }
    },
    actions: {
        userLoginOut() {
            this.isLogin = 0
            localStorage.removeItem('userInfo')
            location.href = '/'
        },
        adminLoginOut() {
            this.isLogin = 0
            this.adminIsLogin = 0
            localStorage.removeItem('adminInfo')
            location.href = '/'
        },
        throttle(fn, wait) {
            let timer = null;
            return function () {
                if (timer) clearInterval(timer);
                timer = setTimeout(() => {
                    fn.apply(this, arguments);
                }, wait);
            };
        },
        debounce(fn, wait) {
            let timer = null;
            return function () {
                if (timer) return
                fn.apply(this, arguments);
                timer = setTimeout(() => {
                    timer = null
                }, wait);
            };
        },
        inClient(dom) {
            let domHeight = dom.clientHeight;
            let domOffsetTop = dom.offsetTop;
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            let windowWidth = window.innerHeight;
            return (
                scrollTop + windowWidth > domOffsetTop &&
                domOffsetTop + domHeight > scrollTop
            );
        },
        swapAttr(dom, attr1, attr2) {
            let attr1Value = dom.getAttribute(attr1);
            let attr2Value = dom.getAttribute(attr2);
            dom.setAttribute(attr1, attr2Value);
            dom.setAttribute(attr2, attr1Value);
        }
    }
})
