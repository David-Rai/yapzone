const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;
const http=require("http")
const {Server}=require('socket.io')

const server=http.createServer(app)
const io=new Server(server)

//middlewares
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});


io.on('connection',client=>{
    console.log("new client",client.id)
})


app.listen(PORT, () => {
  console.log(`Server running on port PORT`);
});