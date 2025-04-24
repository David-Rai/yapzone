

window.addEventListener("load", () => {
    document.title = "yapzone"
    alert("bro")

    let trigger = document.createElement("div")
    trigger.id = "trigger"
    trigger.innerHTML=`myselffromtheyapzone`
    trigger.style.position = "absolute"
    trigger.style.bottom = "10%"
    trigger.style.right = "5%"

    document.body.appendChild(trigger)

})