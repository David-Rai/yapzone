
// GLOBAL VARIABLE
let trigger;
let mainBody
let shadowRoot, shadow
let btnState = false;
let socketState = false;
const imgSrc = chrome.runtime.getURL("icons/48.png");
const sendSrc = chrome.runtime.getURL("icons/send-message.png");


//main starting point
window.addEventListener("load", () => {
    document.title = "yapzone";

    //creating the shadow host
    const host = document.createElement("div")
    host.id = "host"
    document.body.appendChild(host)
    shadow = host.attachShadow({ mode: "open" })//the shadow root

    //accessing the shadow root
    shadowRoot = document.querySelector("#host").shadowRoot

    //css styling
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/main.css");
    shadow.appendChild(link);



    // Create trigger container
    trigger = document.createElement("div");
    trigger.id = "trigger";

    //creating the manin body
    mainBody = document.createElement("div")
    mainBody.id = "mainBody"
    mainBody.classList = "mainBody"
    host.style.right = "-100%"
    // mainBody.style.transform = "translateX(150%)"


    // Render the UI

    render_trigger();

    //setting up main
    main_setup()

    setTimeout(() => {
        // Add trigger to the shadow dom
        shadow.appendChild(trigger);
        triggering()//toggling
        shadow.appendChild(mainBody);
        createRoom()
        join_room()

    }, 100)


    //*********WINDOW MESSAGES****** */

    //IF ROOM CREATED DO THIS
    window.addEventListener("message", event => {
        if (event.source !== window) return

        if (event.data?.source === "chat.js" && event.data?.type === "room-created") {
            if (event.data.payload.state) {

                mainBody.innerHTML = `${render_chat_room()}`
                add_send()

                const chat_room_name = shadowRoot.getElementById('yap-chat-room-name'); // get it fresh
                if (chat_room_name) {
                    chat_room_name.innerHTML = `${event.data.payload.name}`;
                }

            }
        }
    })




});//window load ending

//**********CREATING THR ROOM********* */
function createRoom() {
    const createBtn = shadowRoot.querySelector(".createRoom")
    if (createBtn) {
        createBtn.addEventListener("click", () => {
            // alert("Clicked")
            window.postMessage({
                source: "main.js",
                type: "create_room",
                payload: {
                    state: true
                }
            }, "*")
        })
    }
}

//*************Event listener for sending the message****************** */
function add_send() {
    const send_message = shadowRoot.querySelector(".chat-room-bottom #send-message");
    const message = shadowRoot.querySelector(".chat-room-bottom #message");

    if (message) {
        message.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if (message.value.trim() === "") return;

                get_user_name((name) => {
                    window.postMessage({
                        source: "main.js",
                        type: "send_message",
                        payload: {
                            message: message.value,
                            username: name
                        }
                    }, "*");
                })
            }
        });

        send_message.addEventListener("click", () => {
            if (message.value.trim() === "") return;

            get_user_name((name) => {
                window.postMessage({
                    source: "main.js",
                    type: "send_message",
                    payload: {
                        message: message.value,
                        username: name
                    }
                }, "*");
            })
        })
    }

}

//triggering 
function triggering() {
    //Adding the eventlistener in the trigger button
    const trigger_btn = shadowRoot.querySelector('#trigger-button');
    if (trigger_btn) {
        trigger_btn.addEventListener("click", () => {

            if (!socketState || socketState === false) {
                loadChatScripts()
                socketState = true
            }

            if (btnState) {
                btnState = false
                host.style.right = "-100%"
                // mainBody.style.transform = "translateX(150%)"

                return
            }

            host.style.right = "0%"
            btnState = true
        })
    }

}
//rendering the main
function render_main() {
    // alert("rendering the main")
    mainBody.innerHTML = `
        <div class="main-top">
        <input type="text" name="username" id="username" placeholder="username">
        <button id="trigger-create-button">Create</button>
    </div>
`
}

//setting up the main
function main_setup() {
    //checking user if exist or not
    check_user((exists) => {
        if (exists === false) {
            render_main()

            //creating the user
            setTimeout(() => {
                const create_user_trigger = shadowRoot.querySelector('#trigger-create-button')
                if (create_user_trigger) {

                    create_user_trigger.addEventListener('click', () => {
                        // alert("creating the user")
                        save_user((state) => {
                            if (!state) {
                                alert("name is required")
                                return null
                            }
                            else {
                                mainBody.innerHTML = `
                            ${render_chat()}
                            `
                                // content-script.js
                                setTimeout(() => {
                                    //adding the user name
                                    get_user_name((username) => {
                                        const userId = shadowRoot.querySelector('#chat-room #yap-userId')
                                        userId.innerHTML = username
                                    });

                                    createRoom()
                                    join_room()


                                }, 100); // Reload after 5 seconds

                            }
                        })

                    })
                }
            }, 100)
        } else {
            // alert("user exist")
            mainBody.innerHTML = `
           ${render_chat()}
            `
            //adding the user name
            get_user_name((username) => {
                const userId = shadowRoot.querySelector('#chat-top #yap-userId')
                userId.innerHTML = username
            });

        }
    })
}

//rendering the chat room
function render_chat() {
    return `
 <div class="chat">

<div id="chat-top">
<img src="${imgSrc}" alt="image" class="trigger-image">
<h1 id="yap-userId"></h1>
</div>

<button class="button createRoom ">
create room
</button>

<input type="text" placeholder="join room" id="joinRoom">
<button class="button joinRoom">   
join room
</button>
</div>
`
}

//for joining the room
function join_room() {
    setTimeout(() => {
        const joinRoom = shadowRoot.querySelector(".chat .joinRoom")

        if (joinRoom) {
            const roomName = shadowRoot.querySelector('#joinRoom')
            if (roomName) {
                roomName.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        if (roomName.value.trim() === "") {
                            return
                        }
                        get_user_name((username) => {
                            window.postMessage({
                                source: "main.js",
                                type: "join_room",
                                payload: {
                                    roomName: roomName.value.trim(),
                                    name: username
                                }
                            }, "*")
                            add_send()
                        })

                        mainBody.innerHTML = `${render_chat_room()}`
                    }
                })
            }

            joinRoom.addEventListener("click", () => {
                const roomName = shadowRoot.querySelector('#joinRoom')
                if (roomName.value.trim() === "") {
                    return
                }

                get_user_name((username) => {
                    window.postMessage({
                        source: "main.js",
                        type: "join_room",
                        payload: {
                            roomName: roomName.value.trim(),
                            name: username
                        }
                    }, "*")
                    add_send()
                })

                mainBody.innerHTML = `${render_chat_room()}`

            })
        }
    }, 100)


}

function loadChatScripts() {
    const socketScript = document.createElement("script");
    socketScript.src = chrome.runtime.getURL("scripts/socket.io.min.js");
    socketScript.onload = () => {
        const chatScript = document.createElement("script");
        chatScript.src = chrome.runtime.getURL("scripts/chat.js");
        shadowRoot.appendChild(chatScript);

        window.addEventListener("message", (event) => {
            if (event.source !== window) return

            if (event.data?.source === "chat.js" && event.data?.type === "connect_error") {
                // alert(event.data.payload)
                mainBody.innerHTML = `
                <div id="error">
                <h1>${event.data.payload}</h1>
                </div>
                `
            }
        })
    };
    shadowRoot.appendChild(socketScript);
}

//saving the user into the chrome.storage.local
function save_user(callback) {
    const data = shadowRoot.querySelector('.main-top #username');
    if (data.value.trim() === "") {
        callback(false);
        return;
    }

    chrome.storage.local.set({ username: data.value }, () => {
        callback(true);
    });
}

//checking if the user exist already
function check_user(callback) {
    chrome.storage.local.get(['username'], (result) => {
        if (!result.username || result.username.trim() === "") {
            callback(false);
        } else {
            callback(true);
        }
    });
}

//rendering the chatting room
function render_chat_room() {
    return `
    <div class="chat-room" id="chat-room">

    <div class="chat-room-top">
     <div class="chat-room-top-left">
     
     <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
           
<h1 id="yap-room-id">RoomID-<p id="yap-chat-room-name">room name</p></h1>
     </div>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7zm-1-2v3h2v-3h-2z"/>
</svg>
        </div>

        
<div class="chat-room-center">
</div>

<div class="chat-room-bottom">
<input type="text" class="input" placeholder="send message" id="message">
<button id="send-message">
<img src="${sendSrc}" alt="send">
</button>
</div>
    </div>
    `
}


// Getting the username (using a callback to handle the async result)
function get_user_name(callback) {
    setTimeout(() => {
        chrome.storage.local.get(['username'], (result) => {
            // Call the callback with the username (or default to "Guest")
            callback(result.username || "Guest");
        });
    }, 100)
}


// Rendering function
function render_trigger() {
    trigger.innerHTML = `
        <div class="trigger-container" draggable="true">
            <div class="trigger-bottom">
                <button id="trigger-button">
                    <img src="${imgSrc}" alt="image" class="trigger-image" 
                         draggable="false" oncontextmenu="return false">
                </button>
            </div>
        </div>
    `;

    setupDragAndDrop(trigger.querySelector('.trigger-container'));
}

function setupDragAndDrop(element) {
    let offsetX, offsetY;
    let isDragging = false;

    // ===== PREVENT GOOGLE LENS =====
    // Block all image interaction vectors
    element.querySelector('img').addEventListener('dragstart', (e) => e.preventDefault());
    element.querySelector('img').addEventListener('mousedown', (e) => {
        if (e.button === 1 || e.button === 2) e.preventDefault(); // Block middle/right click
    });

    // ===== DRAGGABLE =====
    element.addEventListener('dragstart', (e) => {
        isDragging = true;
        const rect = e.target.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Required for Firefox
        e.dataTransfer.setData('text/plain', '');
        e.target.classList.add('dragging');

        // Create transparent drag image (25x25px transparent PNG)
        const dragImg = new Image();
        dragImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        e.dataTransfer.setDragImage(dragImg, 0, 0);
    });

    element.addEventListener('dragend', () => {
        isDragging = false;
        element.classList.remove('dragging');
    });

    // ===== DROPPABLE =====
    // Create drop zones (add this class to elements that should accept drops)
    shadowRoot.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drop-highlight');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drop-highlight');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drop-highlight');

            // Handle the drop - example: append the dragged element
            if (isDragging) {
                const rect = zone.getBoundingClientRect();
                element.style.position = 'absolute';
                element.style.left = (e.clientX - rect.left - offsetX) + 'px';
                element.style.top = (e.clientY - rect.top - offsetY) + 'px';
                zone.appendChild(element);
            }
        });
    });

    // Update position during drag
    shadowRoot.addEventListener('dragover', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        element.style.position = 'fixed';
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    });
}
