if(process.env.NOD_ENV === 'production') {   //개발 환경 production인 경우
    module.exports = require('./prod');
 } else {
     module.exports = require('./dev');            // development인 경우
 }