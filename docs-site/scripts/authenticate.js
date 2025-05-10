
console.log("fetching....")
async function getData(){
  const res=await fetch("https://yapzone-h6e1.onrender.com/")
  const data=await res.json()
  console.log(data)
}

getData()


