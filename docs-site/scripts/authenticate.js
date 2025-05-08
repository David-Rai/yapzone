const form=document.querySelector("#myForm")
const key=document.querySelector("#myForm input")


form.addEventListener("submit",(e)=>{
    e.preventDefault()
    if(key.value.trim() === "") return
    verifyUSER()
})

async function verifyUSER() {
    console.log("verifying");
  
    try {
      const res = await fetch("https://yapzone-h6e1.onrender.com/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
  
      const data = await res.json();
      console.log("Server response:", data);
    } catch (err) {
      console.error("Failed to verify:", err.message);
    }
  }
  