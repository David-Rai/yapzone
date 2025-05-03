const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;
const http=require("http")
const {Server}=require('socket.io')
const cors=require('cors')

const server=http.createServer(app)
const io=new Server(server,{
  cors:{
    origin:"*"
  }
})

//middlewares
app.use(express.json());
app.use(cors({
  origin:[
    '*'
  ]
}))

let data={
  number:0,
  users:[],
  rooms:[]
}

app.get('/', (req, res) => {
  res.json(data);
});


io.on('connection',client=>{
     data.number +=1
     data.users.push(client.id)
    console.log("new client",client.id)

         //************CREATING THE ROOM*************
    client.on("createRoom",roomName=>{
      data.rooms.push(roomName)
      console.log("created room",roomName)
      client.join(roomName)
       client.emit('room-created',{roomName,state:"success"})
    })

     //***********JOINING ROOM************
     client.on('joinRoom',({roomId,name})=>{
      console.log("joined-room",roomId)
      client.join(roomId)

      io.to(roomId).emit("joined-message",{message:`${name} joined`})
     })

     //******SENDING MESSAGE */
     client.on("sendMessage",({roomName,message,name})=>{
      console.log(`${message} by ${name} in room ${roomName}`)
      io.to(roomName).emit("message",{message,name})
     })
})


server.listen(PORT, () => {
  data={}
  console.log(`Server running on ${PORT}`);
});