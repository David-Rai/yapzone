window.addEventListener("load", () => {
    document.title = "yapzone";

    //creating the main div
    let trigger = document.createElement("div");
    const imgSrc = chrome.runtime.getURL("icons/48.png");

    //adding the styling to the page
    let link = document.createElement("link")
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/trigger.css");


    // Setting innerHTML directly
    trigger.id = "trigger";
    trigger.innerHTML = `
      <div class="trigger-top">
          <input type="text" name="username" id="username">
           <button>Create</button>
        </div>

        <div class="trigger-bottom">
        <img src=${imgSrc} alt="image" class="trigger-image">
        </div>
    `;


    //Appending the trigger div
    document.body.appendChild(trigger);
});
