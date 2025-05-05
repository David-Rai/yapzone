

//*************Event listener for sending the message****************** */
function add_send() {
    const send_message = shadowRoot.querySelector("#send-message");
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
    }

    if (send_message) {
        send_message.addEventListener("click", () => {
            if (message.value.trim() === "") return

            get_user_name((name) => {//send to the backend
                window.postMessage({
                    source: "main.js",
                    type: "send_message",
                    payload: {
                        message: message.value,
                        username: name
                    }
                }, "*");
            });

        });
    }
}
module.exports=add_send
