// GLOBAL VARIABLE
let trigger;
let btnState = true;
const imgSrc = chrome.runtime.getURL("icons/48.png");

window.addEventListener("load", () => {
    document.title = "yapzone";

    // Create trigger container
    trigger = document.createElement("div");
    trigger.id = "trigger";

    // Add CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/trigger.css");
    document.head.appendChild(link);

    // Render the UI
    render_trigger();

    // Add trigger to DOM
    document.body.appendChild(trigger);
});

// Rendering function
function render_trigger() {
    if (btnState) {
        trigger.innerHTML = `
            <div class="trigger-bottom">
                <button id="trigger-button">
                    <img src="${imgSrc}" alt="image" class="trigger-image">
                </button>
            </div>
        `;
    } else {
        trigger.innerHTML = `
            <div class="trigger-top">
                <input type="text" name="username" id="username" placeholder="username">
                <button id="trigger-create-button">Create</button>
            </div>
            <div class="trigger-bottom">
                <button id="trigger-button">
                    <img src="${imgSrc}" alt="image" class="trigger-image">
                </button>
            </div>
        `;
    }

    // Attach event listener AFTER rendering
    const trigger_btn = trigger.querySelector('#trigger-button');
    if (trigger_btn) {
        trigger_btn.addEventListener("click", () => {

            check_user((exists) => {
                if (exists === false) {
                    // alert('no User exists!');
                    return trigger_toggle();
                } else {
                    // alert('user found.');
                    trigger.innerHTML = `
           ${render_chat()}
            <div class="trigger-bottom">
                <button id="trigger-button">
                    <img src="${imgSrc}" alt="image" class="trigger-image">
                </button>
            </div>
                `
                    
                chrome.storage.local.get(['username'],(result) => {
                    const userId=document.querySelector('.chat #userId')
                  userId.innerHTML=result.username
                })
                    loadChatScripts()
                }
            });



        });
    }


    //for creating the socket connection
    const create_user_trigger = document.querySelector('#trigger-create-button')
    if (create_user_trigger) {
        create_user_trigger.addEventListener('click', () => {

            if (save_user() === false) {
                alert("name is required")
                return null
            }

            trigger.innerHTML = `
           ${render_chat()}
            <div class="trigger-bottom">
                <button id="trigger-button">
                    <img src="${imgSrc}" alt="image" class="trigger-image">
                </button>
            </div>
                `

            loadChatScripts()
        })
    }

}

// Toggling function
function trigger_toggle() {
    btnState = !btnState;
    render_trigger(); // re-render and rebind
}

//rendering chat
function render_chat() {

    return `
 <div class="chat">
<h1 id="userId">chatting</h1>
<button class="createRoom">
create room
</button>

<div class="copying">
<p id="roomId">
here
</p>
<button id="handleCopy">copy</button>
</div>

<input type="text" placeholder="join room" id="joinRoom">
<button class="joinRoom">   
join room
</button>
</div>
`
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
    const data = document.querySelector('.trigger-top #username')

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
