async function main() {

  const products = await fetchData("/api/productList");
  const selectedProduct = await fetchData("/api/cart");
  console.log(products);

  displayProducts(products, selectedProduct)


  window.addEventListener('click', (e) => {

    if (e.target.textContent === 'Add to cart') {
      const productId = parseInt(e.target.dataset.id)
      e.target.textContent = 'Remove'
      postProduct({ id: productId })
      return
    }
    if (e.target.textContent === 'Remove') {
      const productId = parseInt(e.target.dataset.id)
      e.target.textContent = 'Add to cart'
      deleteProduct(productId);
    }

  });

  const modalButton = document.querySelectorAll("#modalButton");
    modalButton.forEach(button => {
      button.addEventListener("click", (e) => {
        //console.log(e.target);
        const modal = document.querySelector(".modal-body");
        modal.textContent = e.target.getAttribute("desc");
      });
  });
  
}

main();

async function fetchData(url) {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("ERROR.....");
    }
  });
}

async function postProduct(productId) {
  await fetch("/api/cart", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productId)
  })
}



function displayProducts(products, selectedProduct) {

  const main = document.querySelector("#main");
  main.innerHTML = `<div id="webshopMemes" class="row row-cols-1 row-cols-md-5 gap-3 justify-content-center"></div>`;
  products.forEach(product => {
    const webshopMemes = document.getElementById("webshopMemes");
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    cardDiv.innerHTML += `<div  class="col p-2">
      <img src="${product.img}" class="card-img-top" alt="${product.title}">
      <div class="card-body text-center">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text">${product.price} HUF</p>
      <a data-id = "${product.id}" class="add-btn btn btn-primary m-1">${selectedProduct.includes(product.id) ? `Remove` : "Add to cart"}</a>
      <button type="button" class="btn btn-primary m-1" data-bs-toggle="modal" data-bs-target="#exampleModal" id="modalButton" desc="${product.desc}">
      View Info
      </button>
      </div>
      </div>`;

    webshopMemes.appendChild(cardDiv);
    
  });
}

async function deleteProduct(productId) {
  await fetch(`/api/cart/${productId}`, { method: "DELETE" });
}