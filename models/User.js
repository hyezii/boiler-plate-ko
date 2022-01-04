// mongoose 모듈 가져옴
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10


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

// user model에 유저 정보 저장하기 전에 하는 일
userSchema.pre('save', function( next ){
    var user = this;  // userSchema 가리킴

    if(user.isModified('password')){  // 이메일, 이름 변경할 때 말고 비밀번호 변경할 때만

        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {    // saltRounds를 사용해 salt 생성
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                // Store hash in your password DB.
                next() // index.js의 유저 정보 저장으로 넘어감
            })
        })
    }
})
    

// schema를 model로 감싸줌
const User = mongoose.model('User', userSchema)    

// 이 model을 다른 파일에서도 사용할 수 있게함
module.exports = { User }