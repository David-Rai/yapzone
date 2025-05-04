const socket = io("http://localhost:1111");
const shadowRoot = document.querySelector("#host").shadowRoot
const createRoom = shadowRoot.querySelector(".createRoom")
const joinRoom = shadowRoot.querySelector(".joinRoom")
const joining_roomId = shadowRoot.querySelector("#joinRoom")
const userName = shadowRoot.querySelector(".chat #yap-userId")

let client_roomName;
let username

//generating the unique id for room id
function getFormattedDate() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');   // 00–23
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 00–59
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 00–59

    return `${hours}:${minutes}:${seconds}`;
}

//checking if connection established
socket.on("connect", () => {
    // alert("connected to the server")
    console.log("Connected to server:", socket.id);
});

//*********CONNECTION ERROR********* */
socket.on("connect_error", err => {
    if (err) {
        // alert("connection error")
        window.postMessage({
            source: "chat.js",
            type: "connect_error",
            payload: "server is busy"
        },
            "*"
        )
    }
})

//************CREATING THE ROOM*************
if (createRoom) {
    username = userName.innerHTML
    createRoom.addEventListener("click", () => {
        const roomName = getFormattedDate();
        socket.emit("createRoom", roomName);
    });
}


//if room is created
socket.on("room-created", ({ roomName, state }) => {
    window.postMessage({//send to content scripts 
        source: "chat.js",
        type: "room-created",
        payload: {
            state: true,
            name: roomName
        }
    },
        "*")

    client_roomName = roomName
    sending()

})

//**********SENDING THE MESSAGE************ */
window.addEventListener("message", (e) => {

    if (e.data?.source === "main.js" && e.data?.type === "send_message") {
        console.log(e.data.payload)
    }
})


//*********JOINING ROOM */
if (joinRoom) {
    if (joining_roomId) {
        joining_roomId.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if (joining_roomId.value.trim() === "") {
                    return
                }
                let_join()
            }
        })
    }


    joinRoom.addEventListener("click", () => {
        if (joining_roomId.value.trim() === "") {
            return
        }
        let_join()
    })
}

function let_join() {
    // alert(joining_roomId.value)
    client_roomName = joining_roomId.value

    const chat_room_name = shadowRoot.getElementById('yap-chat-room-name'); // get it fresh
    if (chat_room_name) {
        chat_room_name.innerHTML = `${client_roomName}`;
    }
    sending()
    username = userName.innerHTML
    socket.emit("joinRoom", { roomId: joining_roomId.value, name: userName.innerHTML })

}

socket.on("joined-message", ({ message }) => {
    // Find the chat room container
    const chat_room_center = shadowRoot.querySelector(".chat-room-center");

    if (chat_room_center) {
        // Create the message element
        const messageElement = `<p class="join-message">${message}</p>`;
        // Append the message to the chat room center
        chat_room_center.innerHTML += messageElement;
    } else {
        // Retry after 100ms if chat_room_center is not available
        setTimeout(() => {
            const chat_room = shadowRoot.querySelector(".chat-room-center");
            if (chat_room) {
                const messageElement = `<p class="join-message">${message}</p>`;
                // Append the message to the chat room center
                chat_room.innerHTML += messageElement;
            }
        }, 100);
    }
});


// function sending() {
//     // alert("sending valid")
//     const message = shadowRoot.querySelector(".chat-room-bottom #message")
//     if (message) {
//         message.addEventListener("keydown", (e) => {
//             alert(message.value)
//             if (e.key === "Enter") {
//                 if (message.value.trim() === "") {
//                     return
//                 }
//                 socket.emit("sendMessage", { roomName: client_roomName, message: message.value, name: username })
//                 message.value = ""
//             }
//         })
//     }

//     const send_message = shadowRoot.querySelector("#send-message")
//     if (send_message) {
//         send_message.addEventListener('click', () => {
//             const message = shadowRoot.querySelector(".chat-room-bottom #message")
//             if (message.value.trim() === "") {
//                 return
//             }
//             socket.emit("sendMessage", { roomName: client_roomName, message: message.value, name: username })
//             message.value = ""
//         })
//     }
// }

//*********RECEIVING THE MESSAGE
socket.on("message", ({ message, name }) => {
    const chat_room_center = shadowRoot.querySelector(".chat-room-center");

    const messageElement = `
        <div class="message-body">
            <p class="username">${name}</p>
            <h1>${message}</h1>
        </div>
    `;

    chat_room_center.innerHTML += messageElement;

    // Auto-scroll to bottom
    chat_room_center.scrollTop = chat_room_center.scrollHeight;
});
