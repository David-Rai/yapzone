// const form=document.querySelector("#myForm")
// const key=document.querySelector("#myForm input")


// form.addEventListener("submit",(e)=>{
//     e.preventDefault()
//     if(key.value.trim() === "") return
//     verifyUSER()
// })

    verifyUSER()

    async function verifyUSER() {
      try {
        const response = await fetch('https://yapzone-h6e1.onrender.com');
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
  