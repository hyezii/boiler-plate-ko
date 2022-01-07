// mongoose 모듈 가져옴
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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
    } else {
        next()
    }
})
    

userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword 1234567   
    // 암호화된(저장된) 비밀번호  $2b$10$51wWLlQ9n5F61l9FuZ6ppezQuF9/grr2KGEOygXOi.CTmQrvEfxHe
   // 복호화 불가능하므로 plainPassword 암호화해서 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);   // 비밀번호 다름
            cb(null, isMatch)   // 에러 없으며 비밀번호 같음
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebtoken을 이용해 token 생성

   var token =  jwt.sign(user._id. toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // user._id + 'secretToken' = token
    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해 유저를 찾은 후
        // 클라이언트에서 가져온 token과 DB에 보관된 token 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

// schema를 model로 감싸줌
const User = mongoose.model('User', userSchema)    

// 이 model을 다른 파일에서도 사용할 수 있게함
module.exports = { User }