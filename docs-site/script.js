* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root{
    --primary:#ff6b00;
  }
  body {
    font-family: 'Poppins', sans-serif;
    height: 100vh;
    width: 100%;
  }
  
  /* navbar */
  .navbar {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 4rem;
  }
  
  .navbar ul {
    display: flex;
    list-style: none;
    align-items: center;
    gap: 2rem;
    margin-left: auto;
  }
  
  .navbar a {
    text-decoration: none;
    color: black;
    display: flex;
    align-items: center;
    padding: 0.5rem 1.5rem;
    transition: color 0.3s;
    font-weight: bold;
  }
  
  .navbar a:hover {
    color: orange;
    cursor: pointer;
  }
  
  .logo {
    width: 2rem;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
  }
  
  /* navbar */
  
  /* body */
  
  /* *********MAIN SECTION******* */
  main {
    height: calc(100% - 4rem);
    overflow: hidden;
    width: 100%;
    padding: 0px 40px;
  }
  
  .top {
    color: var(--primary);
    font-size: 5rem;
    width: 100%;
    display: flex;
    align-items: end;
    justify-content: start;
    height: 25%;
    padding-left: 5rem;
  }
  
  .bottom {
    height: 60%;
    width: 100%;
    display: flex;
  }
  
  .bottom-left {
    height: 100%;
    width: 40%;
    overflow: hidden;
  }
  .bottom-left img{
    height: 100%;
    object-fit: cover;
  }
  .bottom-right{
    height: 100%;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 60%;
    flex-direction: column;
  }
  .bottom-right h1{
    font-size: 64px;
  }
  .bottom-right p{
    width: 80%;
    font-size: 20px;
    color: #373f47;
    padding: 10px 0px 6rem 80px;
  }
  .bottom-right button{
    margin-left: 15rem;
    border: none;
    height: 4rem;
    width: 15rem;
    color: white;
    background-color: var(--primary);
    border-radius: 10px;
    font-size: 28px;
  }

  .bottom-right button:hover
  {
    cursor: pointer;
    background-color: #d98142fe;
  }



  /* HELP PAGE */
  .get-support 
  {
    display: flex;
    align-items: center;
  }
  .repair
  {
    width: 5rem;
  }

  .content
  {
    color: #373f47;
    font-size: 1.25rem;
    
  }

  .help-content
  {
    margin: 1rem 4rem;
  }
  .let-know
  {
    display: flex;
    flex-direction: column;
  }

  .let-know h3
  {
    margin: 1rem 4rem;
    font-size: 1.5rem;
    color: black;
  }

  .let-know ul 
  {
    font-size: 1.5rem;
    padding-left: 6.5rem;

  }

  .h4
  {
    margin:4rem 25rem ;
  }

  .live-chat
  {
    border: 0rem solid;
    border-radius: 0.5rem;
    background-color: #f68e43;
    width: 18rem;
    align-items: center;
  }

  .live-chat h2
  {
    padding: 2rem 0rem 0rem 1rem;
  }

  .input
  {
    border-radius: 2rem;
    border: 0rem;
    padding: 0.2rem;
    margin-top: 1rem;
    margin-left: 1rem;
    width: 13rem;
    padding-left: 0.5rem;
  }

  .live-chat p
  {
    padding-top: 2rem;
    padding-left: 5rem;
  }
#arrow:hover
{
  cursor: pointer;
}
   /* HELP PAGE */
