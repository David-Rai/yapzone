const socket = io("http://localhost:1111");
const createRoom = document.querySelector(".createRoom")
const roomId = document.querySelector(".chat .copying #roomId")
const handleCopy= document.querySelector("#handleCopy")


function getFormattedDate() {
    const now = new Date();
  
    const year = now.getFullYear();                          // e.g., 2025
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 01–12
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 00–59
  
    return `${year}-${month}-${seconds}`;
  }
  
//checking if connection established
socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

         //************CREATING THE ROOM*************
if (createRoom) {
    createRoom.addEventListener("click", () => {
        socket.emit("createRoom",getFormattedDate())
    })
}

    socket.on("room-created",({roomName,state})=>{
        alert(roomName)
        if(roomId){
            roomId.innerHTML=roomName
        }
    })


if(handleCopy){
    handleCopy.addEventListener("click",()=>{
        navigator.clipboard.writeText(roomId.innerHTML)
    })
}
