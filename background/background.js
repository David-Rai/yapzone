
    // shadowRoot.appendChild(socketScript);
    //  const socket = io("http://localhost:1111",{
    // reconnectionAttempts: 3, // Optional: limit retry attempts
    // timeout: 5000     
    //  })


        chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
            // if(message.action==="socket.min.js"){

            // }
            console.log("received")
            sendResponse("done")
        })