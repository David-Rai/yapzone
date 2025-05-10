const users = document.querySelector("main .dash-left ul")
const rooms = document.querySelector("main .dash-right ul")
const userNum = document.querySelector("main .dash-top h1")

async function getData() {
  try {
    const res = await fetch("https://yapzone-h6e1.onrender.com/")
    const data = await res.json()
    // console.log(data)


    // Updating the number of active users
    userNum.innerText = data.number

    //Updating the active users name
    const newData=data.users.map((user)=>{
      return `<Li>${user}</li>`
    })
    users.innerHTML=newData

 //Updating the active rooms name
 const newRooms=data.rooms.map((room)=>{
  return `<Li>${room}</li>`
})
rooms.innerHTML=newRooms

  } catch (err) {
    console.log(err)
  }
}

getData()


