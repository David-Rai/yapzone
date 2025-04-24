const socket = io("http://localhost:1111");

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});
