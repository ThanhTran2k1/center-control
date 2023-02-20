var mysql = require("mysql")
var express = require("express")
var mqtt = require("mqtt")
var client = mqtt.connect('mqtt://192.168.140.191')
// var client = mqtt.connect('mqtt://192.168.240.104')

var app = express()
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:"",
    database: "wsn"
});

con.connect(function(err){
    if(err) throw err;
    console.log("mysql connected")
})

app.use('/public', express.static('public'));
app.set("view engine", "ejs")
app.set("views","./views")

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

app.get("/",function(req,res){
    res.render("main")
})

client.on('connect',function(){
    console.log("mqtt connected")
    client.subscribe("sensor")
})

client.on("message",function(topic,message){
    const data = JSON.parse(message);
    var state_1 = data.state_1;             
    var state_2 = data.state_2;
    var temp_data =  data.temperature.toFixed(2);
    var humi_data =  data.humidity.toFixed(2);
    var light_data = (data.light).toFixed(2);
   
    
    var sql = "insert into data_sensor(temp,humi,light) value ( "+temp_data+" , "+humi_data+" ,"+light_data+")"
    con.query(sql,function(err,result){
        if (err) throw err
        console.log( " temp: "+temp_data+" ,humi: "+humi_data+", light: "+light_data+" ")
    })
      

    io.emit("temp",temp_data)
    io.emit("humi",humi_data)
    io.emit("light",light_data)
    io.emit("led",state_1)
    io.emit("tv",state_2)
})



io.on("connection",function(socket){
    console.log('user ' + socket.id + " connected")
    socket.on("control_led",function(state1){
        if(state1 == "1"){
            client.publish("led","1")  
            con.query("insert into states(name, state) value ( 'LED' , 'ON') " )
        }else{
            client.publish("led","0")
            con.query("insert into states(name, state) value ( 'LED' , 'OFF') " )
        }
    })

    socket.on("control_tv",function(state2){
        if(state2 == "1"){
            client.publish("tv","1")
            con.query("insert into states(name, state) value ( 'TV' , 'ON') " )
        }else{
            client.publish("tv","0")
            con.query("insert into states(name, state) value ( 'TV' , 'OFF') " )
        }
    })
})