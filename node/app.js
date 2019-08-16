/*
 * @Author: w
 * @Date: 2019-08-10 15:47:29
 * @LastEditors: w
 * @LastEditTime: 2019-08-13 17:47:16
 */
const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');



app.use('/client',function(req,res,next){
	console.log("请求的req.url",req.url);
	next();
});
app.use('/client',express.static(path.join(__dirname, 'client'))); 

// 读取更新文件列表中间件
app.get('/update',async (req,res,next)=>{
	console.log("更新文件");
	var data = await readdir();
	var buf = Buffer.from(data);
	var text = buf.toString();
	res.send(text)
})

// 读取更新文件
function readdir(){
	return new Promise((resolve,reject)=>{
		return fs.readFile('./daily.json',function(err,data){
			if(err) return reject(err);
			return resolve(data);
		})	
	})
}

var server = app.listen(888,()=>{
	var host = server.address().address;
	var port = server.address().port;
	console.log(`host:${host},port"${port}`);
})




