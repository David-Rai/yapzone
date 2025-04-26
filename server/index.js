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

app.get('/', (req, res) => {
  res.send('Hello World');
});


io.on('connection',client=>{
    console.log("new client",client.id)

         //************CREATING THE ROOM*************
    client.on("createRoom",roomName=>{
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
})


server.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});