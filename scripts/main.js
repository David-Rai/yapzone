
// GLOBAL VARIABLE
let trigger;
let mainBody
let btnState = false;
const imgSrc = chrome.runtime.getURL("icons/48.png");
const sendSrc = chrome.runtime.getURL("icons/send-message.png");


//main starting point
window.addEventListener("load", () => {
    document.title = "yapzone";

    //creating the shadow host
    const host = document.createElement("div")
    host.id="host"
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: "open" })//the shadow root


    // Create trigger container
    trigger = document.createElement("div");
    trigger.id = "trigger";

    //creating the manin body
    mainBody = document.createElement("div")
    mainBody.id = "mainBody"
    mainBody.classList = "mainBody"
    mainBody.style.right = "-100%"


    // Add CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/main.css");

    // Render the UI
    render_trigger();

    //setting up main
    main_setup()

   setTimeout(()=>{
    shadow.appendChild(link)
       // Add trigger to the shadow dom
       shadow.appendChild(trigger);
       shadow.appendChild(mainBody);
   },100)


//accessing the shadow root
const shadowRoot=document.querySelector("#host").shadowRoot


    //Adding the eventlistener in the trigger button
    const trigger_btn = shadowRoot.querySelector('#trigger-button');
    if (trigger_btn) {
        trigger_btn.addEventListener("click", () => {
            if (btnState) {
                btnState = false
                mainBody.style.right = "-100%"
                return
            }

            mainBody.style.right = "0%"
            btnState = true
            loadChatScripts()//for adding the socket connection

        })
    }

    document.body.appendChild(shadow)
    // check_click()
});


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
            const create_user_trigger = document.querySelector('#trigger-create-button')
            if (create_user_trigger) {
                create_user_trigger.addEventListener('click', () => {
                    // alert("creating the user")
                    if (save_user() === false) {
                        alert("name is required")
                        return null
                    } else {
                        mainBody.innerHTML = `
                        ${render_chat()}
                            `

                        //adding the user name
                        get_user_name((username) => {
                            const userId = document.querySelector('#chat-room #yap-userId')
                            userId.innerHTML = username
                        });
                    }
                })
            }
        } else {
            // alert("user exist")
            mainBody.innerHTML = `
           ${render_chat()}
            `
            const createRoom = document.querySelector('.chat .createRoom')
            if (createRoom) {
                createRoom.addEventListener("click", () => {
                    mainBody.innerHTML = `${render_chat_room()}`
                })
            }
            join_room()

            //adding the user name
            get_user_name((username) => {
                const userId = document.querySelector('#chat-top #yap-userId')
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
    const joinRoom = document.querySelector(".chat .joinRoom")
    if (joinRoom) {
        joinRoom.addEventListener("click", () => {
            const roomName = document.querySelector('#joinRoom')
            if (roomName.value.trim() === "") {
                return
            }
            mainBody.innerHTML = `${render_chat_room()}`
        })
    }

}

function loadChatScripts() {

    const socketScript = document.createElement("script");
    socketScript.src = chrome.runtime.getURL("scripts/socket.io.min.js");
    socketScript.onload = () => {
        const chatScript = document.createElement("script");
        chatScript.src = chrome.runtime.getURL("scripts/chat.js");
        document.body.appendChild(chatScript);
    };
    document.body.appendChild(socketScript);
}

//saving the user into the chrome.storage.local
function save_user() {
    const data = document.querySelector('.main-top #username')

    if (data.value.trim() === "") {
        return false
    }

    chrome.storage.local.set({ username: data.value }, () => {
        // alert(data.value)
        return true
    })
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
    <div class="chat-room">

    <div class="chat-room-top">
     <div class="chat-room-top-left">
         <i class="fa-solid fa-bars"></i>
            <h1 id="yap-chat-room-name">username</h1>
     </div>
        <i class="fa-solid fa-microphone audio"></i>
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


// Check if Font Awesome is already included
if (!document.querySelector('link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"]')) {
    // Create a link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';

    // Append the link to the head of the document
    document.head.appendChild(link);

    console.log('Font Awesome CDN injected');
}

// Getting the username (using a callback to handle the async result)
function get_user_name(callback) {
    chrome.storage.local.get(['username'], (result) => {
        // Call the callback with the username (or default to "Guest")
        callback(result.username || "Guest");
    });
}

//draggable trigger

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
    document.querySelectorAll('.drop-zone').forEach(zone => {
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
    document.addEventListener('dragover', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        element.style.position = 'fixed';
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    });
}


function check_click() {


}