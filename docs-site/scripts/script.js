const toggle=document.querySelector(".menu")
const ul=document.querySelector(".navbar ul")
let btnState=false

toggle.addEventListener("click", () => {
  if (!btnState) {
    ul.classList.remove("hide"); 
    ul.classList.add("show");
    btnState = true;            
  } else {
    ul.classList.remove("show");
    ul.classList.add("hide");
    btnState = false;
  }
});
