import axios from 'axios'
let token = JSON.parse(localStorage.getItem('adminInfo')).token
let adminAxios = axios.create({
    method: 'post',
    baseURL: 'http://127.0.0.1:3000/api/admin',
    headers: {
        authorization: token
    }
})
export default {
    async getAllBook(num) {
        let data = await adminAxios({
            url: '/getAllBook',
            data: {
                num,
            },
        })
        return data
    },
    async setAdminInfo(adminInfo) {
        let data = await adminAxios({
            url: '/setAdminInfo',
            data: {
                adminInfo,
            },
        })
        return data
    },
    async sendBook(formData) {
        let data = await adminAxios({
            url: "/sendBook",
            data: formData,
        });
        return data
    },
    async sendNotice(message) {
        let data = await adminAxios({
            url: '/sendNotice',
            data: {
                message,
            },
        })
        return data
    },
    async getAllUser() {
        let { data } = await adminAxios({
            url: '/getAllUser',
        })
        return data
    },
    async editUser(userInfo) {
        let { data } = await adminAxios({
            url: '/editUser',
            data: {
                userInfo,
            }
        })
        return data
    },
    async delUser(id) {
        let { data } = await adminAxios({
            url: '/delUser',
            data: {
                id,
            }
        })
        return data
    },
    async delBook(id) {
        let { data } = await adminAxios({
            url: '/delBook',
            data: {
                id,
            }
        })
        return data
    },
    async editBook(formData) {
        let { data } = await adminAxios({
            url: '/editBook',
            data: formData
        })
        return data
    },
    async getWebInfo() {
        let { data } = await adminAxios({
            url: '/getWebInfo',
        })
        return data
    },
    async setWeb(formData) {
        let { data } = await adminAxios({
            url: '/setWeb',
            data: formData
        })
        return data
    },
}