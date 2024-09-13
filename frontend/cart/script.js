console.log("hello from CART!");

async function getAPIData(uri) {
  return await fetch(uri).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("ERROR.....");
    }
  });
}

async function buildCart() {
  const cartData = await getAPIData("/api/cart");
  console.log(cartData);
  const container = document.getElementById("container");

  if (cartData.length < 1) {
    container.innerHTML = `<h1>Shopping cart is empty</h1><br><a href="/webshop" class="btn btn-primary">Why not buy something?</a> `;
  } else {
    const memeDatas = await getAPIData("/api/productList");
    //console.log(memeDatas);
    container.innerHTML = `
        <h1>Shopping cart</h1>
        <table class="table">
        <thead>
        <tr>
        <th scope="col">id</th>
        <th scope="col">Item</th>
        <th scope="col">Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Subtotal</th>
        </tr>
        </thead>
        <tbody id="body">
        ${createTBodyElement(memeDatas, cartData)}
        <tr>
        <th scope="row"></th>
        <td colspan="2"></td>
        <td>SUM:</td>
        <td><span id='sum'>----</span></td>
        </tr>
        </tbody>
        </table>
        <a class="btn btn-primary" href="/payment" >Continue to Payment<a>
  `;
  }
  const sum = document.getElementById("sum");
  sum.textContent = sumPrice();

  window.addEventListener("change", (e) => {
    if (e.target.value < 1) {
      e.target.value = 1;
    }
    if (e.target.value >= 1) {
      console.log(e.target.parentNode.parentNode.dataset.id);
      const id = e.target.parentNode.parentNode.dataset.id;
      const subtotal = document.getElementById(`subtotal${id}`);
      subtotal.textContent =
      Number(e.target.value) * Number(subtotal.dataset.price);
      const sum = document.getElementById("sum");
      sum.textContent = sumPrice();
    }
  });
  window.addEventListener('click',async (e)=>{
    if(e.target.textContent === 'Continue to Payment'){
      const memeDatas = await getAPIData("/api/productList");
      console.log('aaaa');
      const order = {
        products:[],
        profit: sumPrice()}
    
  
    cartData.forEach((id) => {
      const meme = memeDatas.find((memeID) => memeID.id === id);
      let obj = {}
      const input = document.getElementById(`input${id}`)
      const subtotal = document.getElementById(`subtotal${id}`)
      obj.title = meme.title
      obj.quantity = parseInt(input.value)
      obj.subtotal = parseInt(subtotal.textContent)
      order.products.push(obj);
    });
    console.log(order);
    postOrderDetails(order)
    }
  })
}

buildCart();

function createTBodyElement(memeDatas, cartData) {
  let products = [];
  cartData.forEach((id) => {
    const meme = memeDatas.find((memeID) => memeID.id === id);
    products.push(meme);
  });
  return products
    .map(
      (product, i) => `
        <tr data-id='${product.id}' =>
        <th scope="row">${i + 1}</th>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td><input id="input${product.id}" type="number"value= "1"></td>
        <td><span id ="subtotal${product.id}"  data-price='${product.price}'>${product.price
        }</span></td>
        </tr>
      `)
    .join("");
}

function sumPrice() {
  const prices = document.querySelectorAll("[data-price]");
  let sum = 0;
  prices.forEach((element) => {
    sum += Number(element.textContent);
  });
  return sum;
}

async function postOrderDetails(order) {
  await fetch("/api/orderDetails", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
}
