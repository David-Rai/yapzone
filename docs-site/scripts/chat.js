const btn=document.querySelector("#chat")
const live=document.querySelector(".live-chat")

btn.addEventListener("click",()=>{
    // alert("hey there")
    live.classList.toggle("showLive")
})