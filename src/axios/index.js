import axios from 'axios'
let indexAxios = axios.create({
    method: 'post',
    baseURL: 'http://127.0.0.1:3000/api/index',
})
export default {
    async indexInit() {
        let { data } = await indexAxios({
            url: "/indexInit",
        })
        return data
    },
    async login(username, password, code = 0) {
        let { data } = await indexAxios({
            url: "/login",
            data: {
                username,
                password,
                code,
            }
        })
        return data
    },
    async register(username, password, email) {
        let { data } = await indexAxios({
            url: "/register",
            data: {
                username,
                password,
                email,
            }
        })
        return data
    },
    async buyGoods(Gid, mode, num) {
        let { data } = await indexAxios({
            url: '/buyGoods',
            data: { Gid, mode, num },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async loveGoods(Gid) {
        let { data } = await indexAxios({
            url: '/loveGoods',
            data: { Gid },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async getUserData() {
        let { data } = await indexAxios({
            url: '/getUserData',
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async getUserLove() {
        let { data } = await indexAxios({
            url: '/getUserLove',
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async editUser(userInfo) {
        let { data } = await indexAxios({
            url: '/editUser',
            data: {
                userInfo,
            },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async getNotice() {
        let { data } = await indexAxios({
            url: '/getNotice',
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async getAllBook(num) {
        let { data } = await indexAxios({
            url: '/getAllBook',
            data: {
                num,
            },
        })
        return data
    },
    async delLove(gid) {
        let { data } = await indexAxios({
            url: '/delLove',
            data: { gid },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async delGoods(id) {
        let { data } = await indexAxios({
            url: '/delGoods',
            data: { id },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async getUserGoods(id) {
        let { data } = await indexAxios({
            url: '/getUserGoods',
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async konwNotice(id) {
        let { data } = await indexAxios({
            url: '/konwNotice',
            data: { id },
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            }
        })
        return data
    },
    async searchBook(obj) {
        let { data } = await indexAxios({
            url: '/searchBook',
            data: obj
        })
        return data
    },
    async sendGood(formData) {
        let { data } = await indexAxios({
            url: "/sendGood",
            data: formData,
            headers: {
                authorization: JSON.parse(localStorage.getItem('userInfo')).token
            },
        })
        return data
    },
}