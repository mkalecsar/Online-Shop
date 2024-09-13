console.log("Hello from Payment Page :)");

// fetching api/url data from server
async function fetchData(url) {
    return fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("ERROR.....");
        }
    });
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
function formValidator() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
}

// displays cart's content
async function displayCartContents() {

    const cartContentsData = await fetchData("/api/cart");
    const allMemesData = await fetchData("/api/productList");
    const orderDetails = await fetchData("/api/orderDetails")
    const cartItemNumbers = document.getElementById("cartItemNumbers");    
    const cartContents = document.getElementById("cartContents");
    let totalPrice = 0;
    let totalItems = 0
    orderDetails.products.forEach(product => {

        //const product = allMemesData.find(meme => meme.id === id);
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
        item.innerHTML = `<div>
        <h6 class="my-0">${product.title}</h6>
        <small class="text-body-secondary">${product.quantity}</small>
        </div>
        <span class="text-body-secondary">${product.subtotal}</span>`;
        cartContents.appendChild(item);
        totalPrice += Number(product.subtotal);
        totalItems += product.quantity
    });

    cartContents.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (HUF)</span>
            <strong id="totalAmount">0</strong>
        </li>
    `;
    const totalAmount = document.getElementById("totalAmount");
    totalAmount.textContent = totalPrice;
    cartItemNumbers.textContent = totalItems;

}

// promo code functionality
function promoCode(promo) {
    const validPromoCodes = ["Codecool","MemeDealers","asd"]
    if (validPromoCodes.includes(promo)) {
        const cartContents = document.getElementById("cartContents");
        const validPromoElement = `<li class="list-group-item d-flex justify-content-between bg-body-tertiary">
              <div class="text-success">
                <h6 class="my-0">Promo code</h6>
                <small>${promo}</small>
              </div>
              <span class="text-success">−50 HUF</span>
        </li>`;

        cartContents.innerHTML += validPromoElement;
        const totalAmount = document.getElementById("totalAmount");
        totalAmount.textContent -= 50;

    } else {
        alert("Incorrect Promo Code !");
    }
}




async function main() {

    formValidator();
    displayCartContents();


    document.getElementById("promoButton").addEventListener("click",(e) => {
        const promoInput = document.getElementById("promoInput");
        console.log(promoInput.value);
        promoCode(promoInput.value);
    });

    document.getElementById('submitOrder').addEventListener('submit', async function(event) {
        console.log("order submitted - client");
        event.preventDefault(); // Prevent the default form submission
        const orderDetails = await fetchData("/api/orderDetails")
        const form = event.target;
        const formData = new FormData(form);
  
        const data = {
          fname: formData.get('firstName'),
          lname: formData.get('lastName'),
          user: formData.get('user'),
          email: formData.get('email'),
          address: formData.get('address'),
          country: formData.get('country'),
          state: formData.get('state'),
          nameOnCard: formData.get('nameOnCard'),
          ccn: formData.get('ccn'),
          cce: formData.get('cce'),
          cvv: formData.get('cvv'),
          order: orderDetails
        };
  
        try {
          const response = await fetch('/payment/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
  
          const result = await response.text();
          alert(result);
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          alert('An error occurred: ' + error.message);
        }
        postProduct({id:null})
    });
}

main();

async function postProduct(productId) {
    await fetch("/api/cart", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productId)
    });
}
