const express = require('express')
const route = express.Router()
const { db } = require('./config')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const moment = require('moment')
let upload = multer({
    dest: './src/assets/images',//这个目录相对于项目文件中node_modules
    limits: {
        files: 1,
        fields: 5,
        fileSize: 10.5 * 1024 * 1024
    }
}).array('file', 9)

function setTableData(tableName, id, filed, value) {
    if (value == null) value = 0
    db.query(`update ${tableName} set ${filed} = ? where id = ?`, [value, id], (err, result) => {
        if (err) console.log(err)
    })
}
function getTableData(tableName, id, filed = '*') {
    return new Promise((solve, reject) => {
        db.query(`select ${filed} from ${tableName} where id = ?`, id, (err, result) => {
            if (result) solve(result[0][filed])
            else console.log(err.message, 7)
        })
    })
}
function setTableExtra(tableName, id, key, val, option = { mode: 0 }) {
    return new Promise(async (solve, reject) => {
        let mode = option.mode
        let extra = await getTableData(tableName, id, 'extra')
        if (!extra) extra = JSON.stringify({ yumao: 1 })
        extra = JSON.parse(extra)
        if (!(extra?.[key])) extra[key] = val
        if (option.mode == 0) { extra[key] = val; }
        else if (mode == 'add') { extra[key] += 1; }
        else if (mode == 'reduce') { extra[key] -= 1 }
        else if (mode == 'remove') { delete extra[key]; }
        setTableData(tableName, id, 'extra', JSON.stringify(extra))
        solve()
    })
}
function getToken(val, time) {
    return jwt.sign(val, 'yumao', { expiresIn: time })
}
function verifyToken(token) {
    return jwt.verify(token, 'yumao', (err, result) => {
        return result
    })
}
function getIndexBook(num) {
    return new Promise((solve, reject) => {
        db.query('select * from book order by id limit ?', [num], (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 54);
        })
    })
}
function getGoodsId(id) {
    return new Promise((solve, reject) => {
        db.query('select * from book where id = ?', id, (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 6);
        })
    })
}
function getUsers(num) {
    return new Promise((solve, reject) => {
        db.query('select * from user order by id limit ?', [num], (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 70);
        })
    })
}
function getAdmin(num) {
    return new Promise((solve, reject) => {
        db.query('select * from admin order by id limit ?', [num], (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 78);
        })
    })
}
function getUserInfo(id = 0, username = 0) {
    return new Promise((solve, reject) => {
        db.query("select * from user where id = ? or username = ?", [id, username], (err, result) => {
            if (result) solve(result[0])
            else console.log(err.message, 3);
        })
    })
}
function insertUser(username, password, email) {
    let name = '阳光彩虹小白马-' + Math.floor(Math.random() * 10000 + 1);
    let u = username
    let p = password
    let e = email
    let extra = JSON.stringify({
        state: 1,
        price: 1000,
        buyNum: 0,
        lookNum: 0,
        collectNum: 0,
        profile: 'default.jpg',
        address: '外星人-火星',
    })

    db.query('insert into user(name,username,password,email,extra) value(?,?,?,?,?)', [name, u, p, e, extra], (err, result) => {
        if (err) console.log(err.message, 97);
    })
}
async function insertBuy(uid, gid, name, des, image, price, num) {
    return new Promise((s) => {
        db.query('insert into buy(uid,bid,name,des,image,price,num) value(?,?,?,?,?,?,?)', [uid, gid, name, des, image, price, num], (err, result) => { if (err) { console.log(err.message) } else s(result) })
    })
}
function getDetailLove(uid, gid) {
    return new Promise((solve, reject) => {
        db.query('select * from love where uid = ? and gid = ?', [uid, gid], (err, result) => {
            if (result) solve(result.length)
            else console.log(err.message, 2)
        })
    })
}
function delLove(uid, gid) {
    db.query('delete from love where uid = ? and gid = ?', [uid, gid], (err, result) => {
        if (err) console.log(err)
    })
}
function randomStr(type = 'a', num = 10) {
    let data = ''
    for (let a = 0; a < num; a++) {
        if (type == 'a') data += String.fromCharCode(Math.ceil(Math.random() * 25 + 97))
        else data += String.fromCharCode(Math.ceil(Math.random() * 25 + 65))
    }
    return data
}
function insertGoods(uid, username, name, tag, des, sort, image, price, extra) {
    db.query('insert into book(uid,username,name,tags,des,sort,image,price,extra) value(?,?,?,?,?,?,?,?,?)', [uid, username, name, tag, des, sort, image, price, extra], (err, result) => {
        if (err) console.log(err.message, 144);
    })
}
function delGoods(id) {
    db.query('delete from book where id =?', id, (err, result) => {
        if (err) console.log(err.message, 126)
    })
}
async function searchBook(info) {
    let { text, mode } = info
    let data = `%${text}%`
    return new Promise((solve, reject) => {
        if (mode == 'keySearch') {
            db.query("select * from book where des like ? or name like ?", [data, data], (err, result) => {
                if (result) solve(result)
                else console.log(err.message, 160)
            })
        } else if (mode == 'sortSearch') {
            db.query("select * from book where sort like ?", data, (err, result) => {
                if (result) solve(result)
                else console.log(err.message, 165)
            })
        }
    })
}
async function insertLove(uid, gid, des, price) {
    db.query('insert into love(uid,gid,des,price) value(?,?,?,?)', [uid, gid, des, price], (err, result) => {
        if (err) console.log(err)
    })
}
async function buyGoods(uid, gid, num) {
    let buy = await getTableData('user', uid, 'buy')
    let temp = ''
    if (!buy) temp = gid
    else temp = buy.split(',').concat(gid).join(',')
    let des = await getTableData('book', gid, 'des')
    let image = await getTableData('book', gid, 'image')
    let price = await getTableData('book', gid, 'price')
    let name = await getTableData('book', gid, 'name')
    await insertBuy(uid, gid, name, des, image, price, num)
    setTableData('user', uid, 'buy', temp)
}
async function editPrice(uid, priceNum, option = { mode: 'normal' }) {
    let { mode } = option
    priceNum = Number(priceNum)
    let extra = await getTableData('user', uid, 'extra')
    let originPrice = JSON.parse(extra).price
    let price = ''
    let state = 200
    if (mode == 'add') {
        price = parseInt((originPrice + priceNum) * 100) / 100
        await setTableExtra('user', uid, 'price', price)
    } else if (mode == 'remove' && originPrice > priceNum) {
        price = parseInt((originPrice - priceNum) * 100) / 100
        await setTableExtra('user', uid, 'price', price)
    } else if (mode == 'remove' && originPrice < priceNum) { state = 500, price = originPrice }
    else if (mode == 'normal') await setTableExtra('user', uid, 'price', priceNum)
    return { state, price }
}
async function loveGoods(uid, gid) {
    let data = await getTableData('user', uid, 'love')
    let state = 500
    if (data == null) {
        state = 200
        setTableData('user', uid, 'love', gid)
    } else {
        state = 200
        setTableData('user', uid, 'love', data + ',' + gid)
    }
    return state
}
async function getUserOrder(uid) {
    return new Promise((solve, reject) => {
        db.query('select * from buy where uid = ?', uid, (err, result) => {
            if (result) solve(result)
            if (err) console.log(err.message)
        })
    })
}
async function getUserLove(uid) {
    return new Promise((solve, reject) => {
        //sql 有风险
        db.query(`select * from love where  uid = ?`, uid, (err, result) => {
            if (result) solve(result)
            if (err) console.log(err.message, 0)
        })
    })
}
async function setUserInfo(uid, name, username, oldPassword, newPassword) {
    let allUser = await getUsers(999)
    let userData = await getTableData('users', uid, 'password')
    let state = 500
    if (userData != oldPassword) {
        state = 300
        return state
    }
    for (let a = 0; a < allUser.length; a++)
        if (username == allUser[a].username && allUser[a].id != uid)
            return state
    db.query('update users set name=?,username=?,password=? where id = ?', [name, username, newPassword, uid], (err, data) => {
        if (err) console.log(err.message, 9)
    })
    state = 200
    return state

}
async function getUserGoods(uid) {
    return new Promise((solve, reject) => {
        db.query('select * from book where uid = ?', uid, (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 257)
        })
    })
}
async function getDetailBook(bidStr) {
    return new Promise((solve, reject) => {
        db.query(`select * from book where id in (${bidStr})`, (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 261)
        })
    })
}
//修改用户信息
function editUser(id, name, email, username, password) {
    db.query('update user set name=?,email=?,username=?,password=? where id = ?', [name, email, username, password, id], (err, result) => {
        if (err) console.log(err.message, 276);
    })
}
//获取公告信息
function getNotice() {
    return new Promise((solve, reject) => {
        db.query('select * from notice', (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 288)
        })
    })
}
//获取最新公告信息
function getNewNotice() {
    return new Promise((solve, reject) => {
        db.query('select * from notice order by id desc limit 1', (err, result) => {
            if (result) solve(result[0])
            else console.log(err.message, 288)
        })
    })
}
//获取全部书籍信息
function getAllBook(num) {
    return new Promise((solve, reject) => {
        db.query('select * from book order by id limit ?', [num], (err, result) => {
            if (result) {
                result.forEach((v) => {
                    v.extra = JSON.parse(v.extra)
                })
                solve(result)
            }
            else console.log(err.message, 293);
        })
    })
}
//获取书籍信息 
function getBookIn(idStr) {
    return new Promise((solve, reject) => {
        db.query(`select * from book where id in (${idStr}) order by field(id,${idStr})`, (err, result) => {
            if (result) {
                let sortArr = []
                result.forEach((v) => {
                    v.extra = JSON.parse(v.extra)
                })
                solve(result)
            }
            else console.log(err.message, 298);
        })
    })
}
//验证用户中间件
function checkAuthMiddle(req, res, next) {
    let token = req.headers.authorization
    let verifyData = verifyToken(token)
    req.flag = 0
    if (verifyData && 'u' in verifyData) {
        req.flag = 1
        req.u = verifyData.u
        req.id = verifyData.id
        req.name = verifyData.name
        next()
    } else console.log('我是checkAuthMiddle,出错了,239');
}
//获取首页初始化数据 接口
route.post('/indexInit', async (req, res) => {
    let swiper = await getTableData('mess', 1, 'content')
    let recommend = await getTableData('mess', 2, 'content')
    let headImg = await getTableData('mess', 3, 'content')
    let book = await getAllBook(100)
    let temp1 = await getBookIn(swiper)
    let temp2 = await getBookIn(recommend)
    let notice = await getNewNotice();
    notice.time = moment(notice.time).format('YYYY-MM-DD HH:mm:ss')
    temp2.forEach((v) => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
        v.tagData = v?.extra?.tagData ? JSON.parse(v.extra.tagData) : []
    })
    book.forEach((v) => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
        v.tagData = v?.extra?.tagData ? JSON.parse(v.extra.tagData) : []
    })
    book = book.filter(v => !recommend.split(',').includes(v.id + '')).reverse()
    let initData = { swiper: temp1, recommend: temp2, book, notice, headImg }
    res.send(initData)
})
//登陆 接口
route.post('/login', async (req, res) => {
    let u = req.body.username
    let p = req.body.password
    let code = req.body.code
    let userData = await getUsers(999)
    let adminData = await getAdmin(999)
    let token = 0
    let message = { message: '账号或者密码错误', state: 500, token }
    if (code)
        for (let i = 0; i < adminData.length; i++) {
            if (adminData[i].username == u && adminData[i].password == p) {
                token = getToken({ id: adminData[i].id, u, admin: u }, '12h')
                message = { username: u, state: 100, token }
                break;
            }
        }
    else
        for (let i = 0; i < userData.length; i++) {
            if (userData[i].username == u && userData[i].password == p) {
                let userData = await getUserInfo(0, u)
                delete userData.password
                let id = userData.id
                let name = userData.name
                let time = moment(userData.time).format('YYYY-MM-DD HH:mm:ss')
                token = getToken({ u, name, id }, '24h')
                message = { id, ...JSON.parse(userData.extra), ...userData, token, name, time, state: 200 }
                break;
            }
        }
    res.send(message)
})
//注册 接口
route.post('/register', async (req, res) => {
    let u = req.body.username
    let p = req.body.password
    let e = req.body.email
    let data = await getUsers(9999)
    let token = flag = 0
    let message = { message: '账号已经存在,请更换', state: 500, token }
    for (let i = 0; i < data.length; i++)
        if (data[i].username == u) {
            flag = 1
            break;
        } else if (data[i].email == e) {
            flag = 2
            break;
        }
    if (!flag) {
        insertUser(u, p, e)
        let userData = await getUserInfo(0, u)
        let id = userData.id
        let name = userData.name
        let love = userData.love
        let username = userData.username
        token = getToken({ u, id }, '24h')
        message = { id, message: '注册成功', token, ...JSON.parse(userData.extra), name, username, love, state: 200 }
    }
    if (flag == 1)
        message = { message: '账号已经存在,请更换', state: 500, token }
    else if (flag == 2)
        message = { message: '邮箱已经存在,请更换', state: 300, token };
    res.send(message)
})
//搜索书籍 接口
route.post('/searchBook', async (req, res) => {
    let data = await searchBook(req.body)
    data.forEach((v) => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
        v.extra = JSON.parse(v.extra)
    })
    res.send(data)
})
//增加收藏数量 接口
route.post('/addLoveNum', async (req, res) => {
    let gid = req.body.id
    await setTableExtra('goods', gid, 'love', 0, { mode: 'add' })
    res.send({ state: 200 })
})
//获取所有书籍信息 接口
route.post('/getAllBook', async (req, res) => {
    let { num } = req.body
    let data = await getAllBook(num)
    data.forEach(v => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
    })
    res.send({ data })
})
//购买书籍 接口
route.post('/buyGoods', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let loveStr = 0
    let { Gid, mode, num } = req.body
    console.log(Gid, mode, num);
    let goodsPrice = await getTableData('book', Gid, 'price')
    let { state, price } = await editPrice(uid, goodsPrice * num, { mode: 'remove' })
    await setTableExtra('book', Gid, 'buyNum', 0, { mode: 'add' })
    buyGoods(uid, Gid, num)
    await setTableExtra('user', uid, 'buyNum', 0, { mode: 'add' })
    if (mode == 'loveRemove') {
        loveStr = await getTableData('user', uid, 'love')
        let gid = Gid
        if (loveStr) {
            let temp = loveStr.split(',')
            temp.splice(temp.indexOf(gid), 1)
            loveStr = temp.join(',')
            setTableData('user', uid, 'love', loveStr)
        }
        delLove(uid, gid)
    }
    res.send({ state, price, loveStr })
})
//获取首页初始化数据 接口
route.post('/loveGoods', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let gid = req.body.Gid
    let flag = await getDetailLove(uid, gid)
    if (flag) {
        res.send({ state: 500 })
        return
    }
    let state = await loveGoods(uid, gid)
    let des = await getTableData('book', gid, 'des')
    let price = await getTableData('book', gid, 'price')
    await setTableExtra('book', gid, 'collectNum', 0, { mode: 'add' })
    await setTableExtra('user', uid, 'collectNum', 0, { mode: 'add' })
    if (state == 200)
        insertLove(uid, gid, des, price)
    res.send({ state })
})
//获取用户订单 接口
route.post('/getUserOrder', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let data = await getUserOrder(uid)
    res.send(data)
})
//获取用户收藏 接口
route.post('/getUserLove', checkAuthMiddle, async (req, res) => {
    let id = req.id
    let data = await getUserLove(id)
    data.forEach((v) => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
    })
    res.send(data)
})
//设置用户信息 接口
route.post('/setUserInfo', checkAuthMiddle, async (req, res) => {
    let state = await setUserInfo(req.id, req.body.name, req.body.username, req.body.oldPassword, req.body.newPassword)
    res.send({ state })
})
//设置用户地址 接口
route.post('/setUserAddress', checkAuthMiddle, async (req, res) => {
    await setTableExtra('users', req.id, 'address', req.query.address)
    res.send({ state: 200 })
})
//取消收藏 接口
route.post('/delLove', checkAuthMiddle, async (req, res) => {
    let gid = req.body.gid
    let uid = req.id
    let loveStr = await getTableData('user', uid, 'love')
    let temp = loveStr.split(',')
    temp.splice(temp.indexOf(gid), 1)
    loveStr = temp.join(',')
    delLove(uid, gid)
    setTableData('user', uid, 'love', loveStr)
    res.send({ state: 200 })
})
//用户添加书籍 接口
route.post('/sendGood', checkAuthMiddle, upload, (req, res) => {
    let uid = req.id
    let files = req.files
    let username = req.name
    let { bookName, bookDes, bookSort, bookTag, bookPrice, color,ratio } = JSON.parse(req.body.bookInfo)
    let type = req.files[0].mimetype
    let name = req.files[0].filename
    let dir = './src/assets/images/'
    if (!new RegExp(/^image\//).test(type)) return
    let newName = randomStr() + '.' + type.split('/')[1]
    // let imageFiled = JSON.stringify([{ name: newName }])
    let imageFiled = newName
    let extraFiled = JSON.stringify({ color, state: 1, buyNum: 0, lookNum: 0, collectNum: 0 ,ratio})
    fs.renameSync(dir + name, dir + newName)
    insertGoods(uid, username, bookName, bookTag, bookDes, bookSort, imageFiled, bookPrice, extraFiled)
    res.send({ state: 200 })
})
//获取用户上传的图书 接口
route.post('/getUserGoods', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let data = await getUserGoods(uid)
    data.forEach(v => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
    });
    res.send({ data })
})
//删除书籍 接口
route.post('/delGoods', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let gid = req.body.id
    let dir = './src/assets/images/'
    let originGoodsData = await getGoodsId(gid)
    let imgName = originGoodsData[0].image
    fs.unlinkSync(dir + imgName)
    delGoods(gid)
    res.send({ state: 200 })
})
//获取用户数据 接口
route.post('/getUserData', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let user = req.u
    let userOrder = await getUserOrder(uid)
    let bidStr = ''
    userOrder.forEach(v => {
        bidStr += v.id + ','
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss')
    });
    bidStr = bidStr.replace(/,$/, '')
    // console.log(bidStr);
    // let data = await getDetailBook(bidStr)
    // let data = await getTableData('user',uid,'buy')
    // console.log(data);
    res.send({ userOrder })
})
//编辑用户 接口
route.post('/editUser', checkAuthMiddle, async (req, res) => {
    let { name, username, oldPassword, newPassword, address } = req.body.userInfo
    let uid = req.id
    let state = 200
    let userData = await getUserInfo(uid, 0)
    let userAllData = await getUsers(999)
    userAllData = userAllData.filter(v => v.id != uid)
    if (userData.password != oldPassword) {
        state = 500
    } else {
        for (let i = 0; i < userAllData.length; i++) {
            userAllData[i].username == username ? state = 400 : a = 'yumao'
            break;
        }
        for (let i = 0; i < userAllData.length; i++) {
            userAllData[i].name == name ? state = 300 : a = 'yumao'
            break;
        }
    }
    if (state == 200) {
        await setTableExtra('user', uid, 'address', address)
        let userData = await getUserInfo(uid, 0)
        let id = userData.id
        let email = userData.email
        let password = userData.password
        let time = moment(userData.time).format('YYYY-MM-DD HH:mm:ss')
        delete userData.password
        if (!newPassword) newPassword = password
        editUser(uid, name, email, username, newPassword)
        token = getToken({ u: uid, name, id }, '24h')
        message = { id, ...JSON.parse(userData.extra), ...userData, token, name: userData.name, time, state: 200 }
        res.send(message)
    } else {
        res.send({ state })
    }

})
//获取公告 接口
route.post('/getNotice', checkAuthMiddle, async (req, res) => {
    let uid = req.id
    let data = await getNotice()
    data.forEach((v) => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
    })
    data = data.filter(v => !v.uid.split(',').includes(uid + ''))
    res.send(data)
})
//知道公告 接口
route.post('/konwNotice', checkAuthMiddle, async (req, res) => {
    let { id } = req.body
    let uid = req.id
    let temp = await getTableData('notice', id, 'uid')
    setTableData('notice', id, 'uid', temp + `,${uid}`)
    res.send({ state: 200 })
})
module.exports = route
