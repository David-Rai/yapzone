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
            trigger_toggle();
        });
    }


    //for creating the socket connection
    const create_user_trigger = document.querySelector('#trigger-create-button')
    if (create_user_trigger) {
        create_user_trigger.addEventListener('click', () => {
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
function render_chat(){
return  `
 <div class="chat">
<h1>chatting</h1>
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
