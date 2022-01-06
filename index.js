// 백엔드 서버의 시작점 index.js
// MongoDB 연결

const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require("./models/User");

// body-Parser는 클라이언트에서 오는 정보를 서버에서 분석해 가져올 수 있게함
// application/x-www-form-urlencoded  <-- 이런 데이터를 분석해 가져옴
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());  // cookieparser 사용할 수 있게함

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
 .then(() => console.log('MongoDB Connected. . .'))
 .catch(err => console.log(err))



app.get('/', (req, res) => { res.send('Hello World! ') })


// 회원가입을 위한 route   register route
app.post('/register', (req, res) => {

        // 회원가입 할 때 필요한 정보들을 client에서 가져오면
        // 그것들을 데이터베이스에 넣어준다.

         const user = new User(req.body)  

         // 유저 정보 저장
         user.save((err, userInfo) => {
             if(err) return res.json({ success: false, err })
             return res.status(200).json({
                 success: true
             })
         })  // user model에 정보 저장
    })


// login route
app.post('/login', (req, res) => {

    // 요청된 이메일이 데이터베이스에 있는지 찾음
    User.findOne({ email: req.body.email }, (err, user) =>{
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 데이터베이스에 있으면 비밀번호 맞는지 확인

         user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
            return res.json( {loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // 비밀번호 일치하면 Token 생성
            user.generateToken((err, user) =>{
                if (err) return res.status(400).send(err);  // 400 에러

                // 토큰을 저장한다  -> 쿠키, 로컬스토리지에
                      res.cookie("x_auth", user.token)
                        .status(200)   // 성공
                        .json({ loginSuccess: true, userId: user._id })

            })
         })
     })
 })

app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })