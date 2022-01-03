// 백엔드 서버의 시작점 index.js
// MongoDB 연결

const express = require('express')
const app = express()
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hyejiahn:dksgPwl2707!@boilerplate.tdpnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
).then(() => console.log('MongoDB Connected. . .'))
 .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})