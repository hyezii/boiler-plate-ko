// mongoose 모듈 가져옴
const mongoose = require('mongoose');

// Schema 생성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,      //  hyeji ahn@naver.com --> 공백 없애주는 역할
        unique: 1      // 이메일 중복 X
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {                     // 유저가 관리자, 일반유저 될 수 있는데 .
        type: Number,     //  관리자는 일반유저를 관리할 수 있음
        default: 0           // Number가 1이면 관리자, 0이면 일반유저 .. 이런식
    },                         // default -> role 지정하지 않을 시 0으로 줌
    image: String,
    token: {                // 유효성 관리
        type: String
    },
    tokenExp: {           // 유효기간 ( 토큰 사용할 수 있는 기간)
        type: Number
    }
})

// schema를 model로 감싸줌
const User = mongoose.model('User', userSchema)    

// 이 model을 다른 파일에서도 사용할 수 있게함
module.exports = { User }