async function postNewMeme(meme){
    await fetch("/api/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(meme)
    })   
}

async function addNew() {

    //const indexOfLastMeme = await fetch("/api/productList")

    const main = document.querySelector("#main");
    const newMemeForm = document.getElementById("new-meme");    
    
    newMemeForm.addEventListener("submit", (event) =>{
        event.preventDefault()
        const titleElement = document.getElementById("title-input")
        const descElement = document.getElementById("desc-input")
        const imageElement = document.getElementById("img-input")
        const priceElement = document.getElementById("price-input")
        const quantityElement = document.getElementById("qnty-input")
        const messageElement = document.getElementById("added-msg")
        const title = titleElement.value 
        const desc = descElement.value
        const image = imageElement.value 
        const price = priceElement.value
        const quantity = quantityElement.value         

        const newMeme = {            
            title : title, 
            desc : desc,
            img: image, 
            price: parseInt(price),
            quantity: parseInt(quantity)
        }

        if (!titleElement.value) {
            messageElement.innerText = "PLease add title!"
            messageElement.style = "visibility:visible"
        }
        else if (!descElement.value) {
            messageElement.innerText = "PLease add description!"
            messageElement.style = "visibility:visible"
        }
        else if (!priceElement.value) {
            messageElement.innerText = "PLease add price!"
            messageElement.style = "visibility:visible"
        }
        else if (!quantityElement.value) {
            messageElement.innerText = "PLease add quantity!"
            messageElement.style = "visibility:visible"
        }
        else if (!imageElement.value) {
            messageElement.innerText = "PLease add image source!"
            messageElement.style = "visibility:visible"
        }        
               
        else{
            postNewMeme(newMeme)
            messageElement.innerText = "Meme added sucesfully!"
            messageElement.style = "visibility:visible"
        } 
    })    

}

addNew()