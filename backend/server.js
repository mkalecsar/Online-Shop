import express from "express";
import fs from "fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { error } from "console";


const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = join(__dirname, "..", "frontend");

export const PORT = 42069;
const app = express();

app.use("/main", express.static(join(staticPath, "main")));
app.use("/cart", express.static(join(staticPath, "cart")));
app.use("/payment", express.static(join(staticPath, "payment")));
app.use("/editor", express.static(join(staticPath, "editor")));
app.use("/add", express.static(join(staticPath, "add")));
app.use("/webshop", express.static(join(staticPath, "webshop")));
app.use(express.json());

// serving website's GET requests here ---------------------------------

app.get(["/", "/main"], (req, res) => {
    const mainPagePath = join(staticPath, "main", "index.html");
    res.sendFile(mainPagePath);
});

app.get("/editor", (req, res) => {
    const editorPagePath = join(staticPath, "editor", "editor.html");
    res.sendFile(editorPagePath);
});

app.get("/cart", (req, res) => {
    const cartPagePath = join(staticPath, "cart", "cart.html");
    res.sendFile(cartPagePath);
});

app.get("/payment", (req, res) => {
    const paymentPagePath = join(staticPath, "payment", "payment.html");
    res.sendFile(paymentPagePath);
});

app.get("/add", (req, res) => {
    const addPagePath = join(staticPath, "add", "add.html");
    res.sendFile(addPagePath);
});
app.get("/webshop", (req, res) => {
    const addPagePath = join(staticPath, "webshop", "webshop.html");
    res.sendFile(addPagePath);
});


// serving website's POST requests here ---------------------------------

app.post('/payment/submit', (req, res) => {
    const formData = req.body;
  console.log(formData);
    // Save the form data to a JSON file
    fs.writeFile('data/order.json', JSON.stringify(formData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file', err);
        return res.status(500).send('An error occurred');
      }
    });
    res.status(200).send('Form data has been saved successfully!');
    console.log("Order-placed - server side");
});

/* 
app.post("/editor", (req, res) => {
    const post = {
        method: "POST",
        header: "application/json",
        body: {}
    }
})
 */
app.post("/api/add", async (req, res) => {
    const productList = await getProductList();    
    const newMeme = req.body
    const productIds = productList.map(product => product.id)
    const newId = Math.max(...productIds)+1    
    newMeme.id = newId
    productList.push(newMeme)    
    const fileContentToSave = JSON.stringify({
        products: productList
    }, null, 2)
    
    const filePath = join(__dirname, "data", "data.json");
    try {
        await writeFile(filePath, fileContentToSave)
        
    } catch (error) {
        res.json(error)
        res.end(); return;
    }
     
    res.send(fileContentToSave)
})

// api for webshop , send data.json which contains data for the memes to be displayed
app.get("/api/productList", async (req, res) => {
    try {
        const memeData = await fetchData("data/data.json");
        res.status(200).send(memeData.products);
    } catch (error) {
        res.status(500).send();
    }
});

app.get("/api/cart", async (req, res) => {
    try {
        const memeData = await fetchData("data/cart.json");
        res.status(200).send(memeData.ids);
    } catch (error) {
        res.status(500).send();
    }
});
app.get("/api/orderDetails", async (req, res) => {
    try {
        const memeData = await fetchData("data/user.json");
        res.status(200).send(memeData.orders);
    } catch (error) {
        res.status(500).send();
    }
});

/**
 * Endpoint /api/editProduct
 * @querry id - has to be number.
 * @querry title
 * @querry desc
 * @querry price
 * @querry quantity
 * @querry img
 */
//patch-cse alakitani, vegpont cime: /api/products/:productID
app.get("/api/editProduct", async (req, res) => {
    if (!req.query.id) {
        res.json({error: 422, errorMessage: "The id is missing from the reqeust."});
        res.end(); return;
    }
    if (req.query.id && isNaN(Number(req.query.id))) {
        res.json({error: 422, errorMessage: "The id must be numeric. Cannot be: '"+req.query.id+"'"})
        res.end(); return;
    }
    if (!(req.query.title ||
        req.query.desc ||
        req.query.price ||
        req.query.quantity ||
        req.query.img)) {
            res.json({error: 422, errorMessage: "At least the title, desc, price, quantity or img has to be here."})
            res.end(); return;
    }
    if (req.query.price && isNaN(Number(req.query.price))) {
        res.json({error: 422, errorMessage: "The price has to be numeric."})
        res.end(); return;
    }
    if (req.query.quantity && isNaN(Number(req.query.quantity))) {
        res.json({error: 422, errorMessage: "The quantity has to be numeric."})
        res.end(); return;
    }
    const id = Number(req.query.id);
    const productList = await getProductList();
    const index = productList.findIndex(product => product.id === id)
    if (index === -1) {
        res.json({error: 404, errorMessage: "There is no product with the id of "+id})
        res.end(); return;
    }    
    
    if (req.query.title) productList[index].title = req.query.title;
    if (req.query.desc) productList[index].desc = req.query.desc;
    if (req.query.price) productList[index].price = Number(req.query.price);
    if (req.query.quantity) productList[index].quantity = Number(req.query.quantity);
    if (req.query.img) productList[index].img = req.query.img;

    try {
        await saveProductList(productList);
        
    } catch (error) {
        res.json(error)
        res.end(); return;
    }
   
    const modifiedProduct = productList[index];
    res.json({code: 200, message: "Product has been modified!", modifiedProduct: modifiedProduct})
    res.end();
});
// gets data then writes it into a file ---------trycatch block hiányzik
app.post("/api/cart", async (req, res) => {
    const cart = await fetchData('data/cart.json')
    if(req.body.id !== null){

        cart.ids.push(req.body.id)
        const fileContentToSave = JSON.stringify({
            ids: cart.ids
        }, null, 2)
        res.send(fileContentToSave)
    
        const filePath = join(__dirname, "data", "cart.json");
        await writeFile(filePath, fileContentToSave) 
    } else {
        const fileContentToSave = JSON.stringify({
            ids: []
        }, null, 2)
        res.send(fileContentToSave)
    
        const filePath = join(__dirname, "data", "cart.json");
        await writeFile(filePath, fileContentToSave)
    }
});
app.post("/api/orderDetails", async (req, res) => {
    const orders = await fetchData('data/user.json')
    
    
    //orders.orders.push(req.body)
    const fileContentToSave = JSON.stringify({
        orders: req.body
    }, null, 2)
    res.send(fileContentToSave)

    const filePath = join(__dirname, "data", "user.json");
    try {
        await writeFile(filePath, fileContentToSave)
        
    } catch (error) {
        res.json(error)
        res.end(); return;
    }
    res.send() 
});

//---------trycatch block hiányzik
app.delete("/api/cart/:id", async (req,res)=>{ 
    const productId = parseInt(req.params.id)
    const cart = await fetchData('data/cart.json')
    const filterdCart = cart.ids.filter(id=> id !== productId)
    const fileContentToSave = JSON.stringify({
        ids: filterdCart
    },null,2)
    const filePath = join(__dirname, "data", "cart.json");
    try {
        await writeFile(filePath, fileContentToSave)
        
    } catch (error) {
        res.json(error)
        res.end(); return;
    }
    res.send(fileContentToSave)
})

//---------trycatch block hiányzik, products többesszám
app.delete('/api/product/:id', async (req,res)=>{
    const productId = parseInt(req.params.id)
    const products = await getProductList()
    const filteredProducts = products.filter(product => product.id !== productId)
    const fileContentToSave = JSON.stringify({
        products: filteredProducts
    },null,2)
    const filePath = join(__dirname, "data", "data.json");
    try {
        await writeFile(filePath, fileContentToSave)
        
    } catch (error) {
        res.json(error)
        res.end(); return;
    }
    res.status(201);
    res.send(fileContentToSave)
   
})

// initialize server ( 196.168.1.69 or localhost)
app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
});

// ----------------------------- functions come here -----------------------------

// returns json file from server
const fetchData = async (path) => {
    const data = JSON.parse(await fs.readFile(path));
    return data;
};

/**
 * Fucntion that returns the product List.
 * @returns {Array<Object>}
 * returns a List of Objects with these keys: id, title, desc, price, quantity, img
 */
async function getProductList() {
    const data = await fs.readFile("data/data.json")    
    return await JSON.parse(data).products
}

//függvény hívó helyére kell betenni a trycatch blokkot
/**
 * Function that saves an array into the data/data.json file.
 * @param {Array<Object>} productList - an Array of products
 * @returns {null} - everything went smooth
 * @returns {Object} - something went wrong, returns the error Obejct.
 */
async function saveProductList(productList){
    const objectToSave = {};
    objectToSave.products = productList;    
    await fs.writeFile("data/data.json", JSON.stringify(objectToSave));
    //return null;
}