const btn=document.querySelector("#chat")
const btn2=document.querySelector(".live-cross")
const live=document.querySelector(".live-chat")

btn.addEventListener("click",()=>{
    // alert("hey there")
    live.classList.toggle("showLive")
})

btn2.addEventListener("click",()=>{
    // alert("hey there")
    live.classList.toggle("showLive")
})