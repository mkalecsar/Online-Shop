async function main() {
  const products = await fetchData("/api/productList");
  displayProducts(products);
  fillForm(products);

  window.addEventListener("change", (e) => {
    const id = e.target.parentNode.parentNode.dataset.id;
    const form = document.getElementById(`edit-product${id}`);
    fetchData(
      `/api/editProduct?id=${id}&title=${form.title.value}&desc=${form.desc.value}&price=${form.price.value}&quantity=${form.qnty.value}&img=${form.img.value}`
    );
  });
  window.addEventListener('click', (e)=>{
    if(e.target.textContent === 'Delete'){
      deleteProduct(e.target.dataset.id)
      e.target.classList.add('disabled')
      const form = document.getElementById(`edit-product${e.target.dataset.id}`);
      for (const element of form.elements) {
        element.disabled = true
      }
    }
  })
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

function displayProducts(products) {
  const container = document.getElementById("form-container");
  container.innerHTML = products
    .map(
      (product) => `
       
      <div class="row ">
        <div class="class="col p-2"">
            <div class="card">
                <img src="${product.img}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                </div>
                <p class="card-text">
                  <form id="edit-product${product.id}" class="list-group" data-id="${product.id}">
                    <div class="d-flex justify-content-between">
        <label for="title-input">Title:</label>
        <input id="title-input" type="text" name="title" />
      </div>
      <div class="d-flex justify-content-between">
        <label for="desc-input">Description:</label>
        <input id="desc-input" type="text" name="desc" />
      </div>
      <div class="d-flex justify-content-between">
        <label for="price-input">Price:</label>
        <input id="price-input" type="number" name="price" />
      </div>
      <div class="d-flex justify-content-between">
        <label for="qnty-input">Quantity:</label>
        <input id="qnty-input" type="number" name="qnty" />
      </div>
      <div class="d-flex justify-content-between">
        <label for="img-input">image:</label>
        <input id="img-input" type="text" name="img" />
      </div>
                  </form>
                </p>
                <a id="delete-btn${product.id}" data-id = "${product.id}" class="add-btn btn btn-primary">Delete</a>
                
            </div>
        </div>
        </div>
        `
    )
    .join("");
}

function createForm(products) {
  const container = document.getElementById("form-container");
  container.innerHTML = `
    <form class="edit-product" action="go">
      <div>
        <label for="title-input">Title:</label>
        <input id="title-input" type="text" name="title" />
      </div>
      <div>
        <label for="desc-input">Description:</label>
        <input id="desc-input" type="text" name="desc" />
      </div>
      <div>
        <label for="price-input">Price:</label>
        <input id="price-input" type="number" name="price" />
      </div>
      <div>
        <label for="qnty-input">Quantity:</label>
        <input id="qnty-input" type="number" name="qnty" />
      </div>
      <div>
        <label for="img-input">image:</label>
        <input id="img-input" type="text" name="img" />
      </div>
      

      <button id="save-btn" type="submit">Save</button>
      <button type="submit">Delete</button>
      
    </form>`;
    
}
function go (event){
  event.preventDefault()

}


function fillForm(products) {
  products.forEach((product) => {
    const form = document.getElementById(`edit-product${product.id}`);
    form.title.value = product.title;
    form.desc.value = product.desc;
    form.price.value = product.price;
    form.qnty.value = product.quantity;
    form.img.value = product.img;
  });
}

async function deleteProduct(productId) {
  await fetch(`/api/product/${productId}`, {
    method: 'DELETE',
  });
}