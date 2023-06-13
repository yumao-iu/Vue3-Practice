const express = require('express')
const route = express.Router()
const { db } = require('./config')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const moment = require('moment')
let upload = multer({
    dest: './src/assets/images',
    limits: {
        files: 1,
        fields: 5,
        fileSize: 10.5 * 1024 * 1024
    }
}).array('file', 9)

//设置token
function setToken(val, time) {
    return jwt.sign(val, 'yumao', { expiresIn: time })
}
//解密token
function verifyToken(token) {
    return jwt.verify(token, 'yumao', (err, result) => {
        return result
    })
}
//设置表数据
function setTableData(tableName, id, filed, value) {
    db.query(`update ${tableName} set ${filed} = ? where id = ?`, [value, id], (err, result) => {
        if (err) console.log(err)
    })
}
//获取表数据
function getTableData(tableName, id, filed = '*') {
    return new Promise((solve, reject) => {
        db.query(`select ${filed} from ${tableName} where id = ?`, id, (err, result) => {
            if (result) solve(result[0][filed])
            else console.log(err.message, 7)
        })
    })
}
//获取表的额外数据
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
//获取所有管理员信息
function getAdmin() {
    return new Promise((solve, reject) => {
        db.query('select * from admin', (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 32);
        })
    })
}
//获取某个管理员信息
function getAdminOne(id) {
    return new Promise((solve, reject) => {
        db.query('select * from admin where id=?', id, (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 32);
        })
    })
}
//设置某个管理员信息
function setAdmin(id, username, password) {
    return new Promise((solve, reject) => {
        db.query('update admin set username=?,password=? where id=?', [username, password, id], (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 32);
        })
    })
}
//添加书籍
function addBook(uid, username, name, tag, des, sort, image, price, extra) {
    db.query('insert into book(uid,username,name,tags,des,sort,image,price,extra) value(?,?,?,?,?,?,?,?,?)', [uid, username, name, tag, des, sort, image, price, extra], (err, result) => {
        if (err) console.log(err.message, 57);
    })
}
//添加公告
function addNotice(uid, message, extra) {
    db.query('insert into notice(uid, message,extra) value(?,?,?)', [uid, message, extra], (err, result) => {
        if (err) console.log(err.message, 63);
    })
}
//修改用户信息
function editUser(id, name, email, username, password) {
    db.query('update user set name=?,email=?,username=?,password=? where id = ?', [name, email, username, password, id], (err, result) => {
        if (err) console.log(err.message, 69);
    })
}
//修改书籍信息
function editBook(name, time, price, id) {
    db.query('update book set name=?,time=?,price=? where id = ?', [name, time, price, id], (err, result) => {
        if (err) console.log(err.message, 75);
    })
}
//删除用户
function delUser(id) {
    db.query('delete from user where id = ?', id, (err, result) => {
        if (err) console.log(err.message, 81);
    })
}
//删除书籍
function delBook(id) {
    db.query('delete from book where id = ?', id, (err, result) => {
        if (err) console.log(err.message, 81);
    })
}
//随机十位字符串
function randomStr(type = 'a', num = 10) {
    let data = ''
    for (let a = 0; a < num; a++) {
        if (type == 'a') data += String.fromCharCode(Math.ceil(Math.random() * 25 + 97))
        else data += String.fromCharCode(Math.ceil(Math.random() * 25 + 65))
    }
    return data
}
//获取所有用户
function getAllUser() {
    return new Promise((solve, reject) => {
        db.query('select * from user', (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 80);
        })
    })
}
//获取某个书籍信息
function getBookId(id) {
    return new Promise((solve, reject) => {
        db.query('select * from book where id = ?', id, (err, result) => {
            if (result) solve(result[0])
            else console.log(err.message, 107);
        })
    })
}
//获取全部书籍信息
function getAllBook(num) {
    return new Promise((solve, reject) => {
        db.query('select * from book order by id limit ?', [num], (err, result) => {
            if (result) solve(result)
            else console.log(err.message, 122);
        })
    })
}
//中间件 接口
route.use((req, res, next) => {
    let token = req.headers.authorization
    let verifyData = verifyToken(token)
    if ('admin' in verifyData) {
        req.username = verifyData.u
        req.id = verifyData.id
        next()
    }
})
//修改管理员信息 接口
route.post('/setAdminInfo', async (req, res) => {
    let oldUsername = req.username
    let id = req.id
    let { username, oldPassword, newPassword } = req.body.adminInfo
    let adminData = await getAdmin()
    let state = 200
    let myData = adminData.filter((v) => id == v.id)[0]
    let otherData = adminData.filter((v) => id != v.id)
    if (myData.password != oldPassword) {
        state = 500
    }
    for (let i = 0; i < otherData.length; i++) {
        let v = otherData[i]
        if (v.username == username) {
            state = 300
            break
        }
    }
    if (state == 200) {
        token = setToken({ id, u: username, admin: username }, '12h')
        await setAdmin(id, username, newPassword)
        res.send({ state, token })
    } else
        res.send({ state })
})
//发布图书 接口
route.post('/sendBook', upload, async (req, res) => {
    let uid = req.id
    let files = req.files
    let username = '管理员'
    let { bookName, bookDes, bookSort, bookTag, bookPrice, color ,ratio} = JSON.parse(req.body.bookInfo)
    let type = files[0].mimetype
    let name = files[0].filename
    let dir = './src/assets/images/'
    if (!new RegExp(/^image\//).test(type)) return
    let newName = randomStr() + '.' + type.split('/')[1]
    let imageFiled = newName
    let extraFiled = JSON.stringify({ color, state: 1, buyNum: 0, lookNum: 0, collectNum: 0 ,ratio})
    fs.renameSync(dir + name, dir + newName)
    addBook(0, username, bookName, bookTag, bookDes, bookSort, imageFiled, bookPrice, extraFiled)
    res.send({ state: 200 })
})
//发布公告 接口
route.post('/sendNotice', async (req, res) => {
    let id = req.id
    let username = '管理员'
    let message = req.body.message
    let extra = ''
    addNotice(id, message, extra)
    res.send({ state: 200 })
})
//获取所有用户 接口
route.post('/getAllUser', async (req, res) => {
    let data = await getAllUser()
    data.forEach(v => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
    });
    res.send({ data })
})
//修改用户信息 接口
route.post('/editUser', async (req, res) => {
    let { id, name, email, username, password } = req.body.userInfo
    editUser(id, name, email, username, password)
    res.send({ state: 200 })
})
//修改书籍信息 接口
route.post('/editBook', upload, async (req, res) => {
    let { bookInfo, file } = req.body
    let dir = './src/assets/images/'
    bookInfo = JSON.parse(bookInfo)
    let { bookName, bookPrice, bookTime, id, color, tagData } = bookInfo
    let bookData, imgName, newImgName
    if (req.files.length == 1) {
        bookData = await getBookId(id)
        imgName = bookData.image
        newImgName = req.files[0].filename
        fs.renameSync(dir + newImgName, dir + imgName)
    }
    await setTableExtra('book', id, 'color', color, { mode: 0 })
    if (tagData.length) await setTableExtra('book', id, 'tagData', JSON.stringify(tagData), { mode: 0 })
    editBook(bookName, bookTime, bookPrice, id)
    res.send({ state: 200, image: imgName })
})
//删除用户 接口
route.post('/delUser', async (req, res) => {
    let id = req.body.id
    delUser(id)
    res.send({ state: 200 })
})
//删除书籍 接口
route.post('/delBook', async (req, res) => {
    let { id } = req.body
    let dir = './src/assets/images/'
    let originBookData = await getBookId(id)
    let imgName = originBookData.image
    fs.unlinkSync(dir + imgName)
    delBook(id)
    res.send({ state: 200 })

})
//获取全部书籍 接口
route.post('/getAllBook', async (req, res) => {
    let { num } = req.body
    let data = await getAllBook(num)
    data.forEach(v => {
        v.time = moment(v.time).format('YYYY-MM-DD HH:mm:ss');
        v.extra = JSON.parse(v.extra)
    })
    res.send({ data })
})
//获取网站信息 接口
route.post('/getWebInfo', async (req, res) => {
    let swiper = await getTableData('mess', 1, 'content')
    let recommend = await getTableData('mess', 2, 'content')
    let headImg = await getTableData('mess', 3, 'content')
    res.send({ swiper, recommend, headImg })
})
//设置网站信息 接口
route.post('/setWeb', upload, async (req, res) => {
    let { swiper, recommend } = req.body
    let files = req.files[0]
    let dir = './src/assets/images/'
    if (files) {
        let fileType = files.mimetype.split('/')[1]
        let headImg = randomStr() + '.' + fileType
        let newImgName = files.filename
        fs.renameSync(dir + newImgName, dir + headImg)
        setTableData('mess', 3, 'content', headImg)
    }
    setTableData('mess', 1, 'content', swiper)
    setTableData('mess', 2, 'content', recommend)
    res.send({ state: 200 })
})

module.exports = route
