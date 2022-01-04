// 백엔드 서버의 시작점 index.js
// MongoDB 연결

const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

// body-Parser는 클라이언트에서 오는 정보를 서버에서 분석해 가져올 수 있게함
// application/x-www-form-urlencoded  <-- 이런 데이터를 분석해 가져옴
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
 .then(() => console.log('MongoDB Connected. . .'))
 .catch(err => console.log(err))



app.get('/', (req, res) => { res.send('Hello World! ') })


// 회원가입을 위한 route
app.post('/register', (req, res) => {

        // 회원가입 할 때 필요한 정보들을 client에서 가져오면
        // 그것들을 데이터베이스에 넣어준다.

         const user = new User(req.body)  

         user.save((err, userInfo) => {
             if(err) return res.json({ success: false, err })
             return res.status(200).json({
                 success: true
             })
         })  // user model에 정보 저장
    })

app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })