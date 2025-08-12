const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');
const product = require('./models/product');
const transporter = require('./utils/transport')
const otpsend = require('./controllers/Verification')

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Order = require('./models/order');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cart = require('./models/cart');
const order = require('./models/order');

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://baghub-cli.onrender.com"
    // local dev
     // production
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));



app.get("/get", async function  (req, res) {
    const response = await product.find() 
    
    res.send(response);      
});
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({ exists: true });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
                await newUser.save();
                   async function main() {
                    // send mail with defined transport object
                        const info = await transporter.sendMail({
                          from: '"Pack-Me.official" <md.packme.official@gmail.com>', // sender address
                          to: newUser.email, // list of receivers
                          subject: "Welcome to BAGHUB", // Subject line
                          text: "Hi!"+" "+newUser.name+"\n\n"+"Welcome to BAGHUB! We're thrilled to have you on board. Explore our wide range of stylish and durable bags, perfect for any occasion. Enjoy easy shopping, fast shipping, and excellent customer service. Let us help you find the perfect bag today!"+"\n \n "+"Happy shopping,"+"\n\n"+"The Pack-Me Team"
                        });
                  
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
                  }
                   main().catch(console.error);


  res.json({ success: true });
});


app.post("/forgetpass",async function(req,res){
    console.log(req.body.email)
  
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpsend(req.body.email,otp,req,res)
});

app.post("/reset-password",async function(req,res){
  const {email,newPassword}=req.body
  const hashedPassword = await bcrypt.hash(newPassword,10)
  const update = await User.findOneAndUpdate(
    {email:email},
    {$set:{password:hashedPassword}},
    {new:true}
  )
  if(update){
    res.json({success:true,message:"changes done successfully"})
  }
  else{
    res.json({success:true,message:"someting went wrong "})
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ success: true, email: user.email });
});


app.get('/user', async (req, res) => {
  const userEmail = req.query.email;  
  if (!userEmail) {
    return res.json({succes:true, message: 'Email query parameter is required' });
  }
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {  
      return res.json({ success: false, message: 'User not found' });
    }

    res.json(user);
  } catch (error) { 
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post("/book-my-order", async (req, res) => {
  try {
    const { email, productId, ...restData } = req.body;
    console.log(email, productId, restData.fullName, restData.address, restData.pin, restData.phone);

    if (!email || !productId) {
      return res.status(400).json({ message: "Email and Product ID are required" });
    }

    const productData = await product.findOne({ id: productId });
    if (!productData) { 
      return res.status(404).json({ message: "Product not found" });
    }

    const newOrder = await  Order.create({
      id: productData.id,
      name: restData.fullName,
      email: email,
      address: restData.address,
      pin: restData.pin,
      phone: restData.phone,
      productname: productData.name,
      
      price: productData.price,
      status: "Placed", // Default status
      Deliverable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Assuming deliverable in 7 days

    });

   

    res.json({ success : true ,message: "Order placed successfully" });
  } catch (error) {
    console.error("Error booking order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete('/cart/remove', async (req, res) => {
  try {
    const { email, id } = req.body;

    if (!email || !id) {
      return res.status(400).json({ success: false, message: 'Email and product id required' });
    }

    // Remove the cart item for this user and product id
    const result = await cart.deleteOne({ email: email, id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
})

app.get('/cart', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log(userEmail);
    
    if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized. Email required.' });
    }

    // Find all cart entries for the user
    const cartDocs = await cart.find({ email: userEmail });

    if (!cartDocs.length) {
      return res.json({ orders: [] }); // No cart items found
    }

    // For each cart entry, fetch product details by product id
    const orders = await Promise.all(
      cartDocs.map(async (item) => {
        const productData = await product.findOne({ id: item.id });

        if (productData) {
          return {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            images: productData.images,
            // You can add timestamp if cart schema has it, e.g. addedAt: item.createdAt
          };
        }

        // If product not found (deleted or unavailable), return null to filter out later
        return null;
      })
    );

    // Filter out any null entries (products not found)
    const filteredOrders = orders.filter(order => order !== null);

    res.json({ orders: filteredOrders });

  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/order', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log(userEmail);

    if (!userEmail) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    // Fetch orders for the given email
    const orderDocs = await Order.find({ email: userEmail });

    if (!orderDocs.length) {
      return res.json({ orders: [] }); // No orders found
    }

    // For each order, fetch product details using the product id stored in the order
    const ordersWithProducts = await Promise.all(
      orderDocs.map(async (order) => {
        const productData = await product.findOne({ id: order.id }); // assuming "id" in Order matches product.id

        if (productData) {
          return {
            orderId: order.id,
            status: order.status,
            orderDate: order.orderDate,
            deliverable: order.Deliverable,
            price: order.price,
            product: {
              id: productData.id,
              name: productData.name,
              price: productData.price,
              images: productData.images,
            }
          };
        }
        return null;
      })
    );

    // Remove any null entries for missing products
    const filteredOrders = ordersWithProducts.filter(order => order !== null);

    res.json({ orders: filteredOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/order/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userEmail = req.query.email;

    const order = await Order.findOne({id:orderId, email: userEmail});
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const productData = await product.findOne({ id: order.id });  
    res.json({ orders : order, pdata :productData});
    // res.json({
    //   orderdata:order,
    //   productimage: productData ? productData.images[0] : 'https://via.placeholder.com/280x160?text=No+Image',

    // });
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/home", async function  (req, res) {
    const response = await product.find().limit(9); // Fetch only 6 products for the home page
    
    res.send(response);      
});

app.get("/product/:id", async function (req, res) {
    const id = req.params.id;   
    const response = await product.findOne({id: id});
    res.json(response);
});

app.get("/check/:id", async function (req, res) {
  const id = req.params.id;
  const email = req.query.email;
  try {
    const existingItem = await cart.findOne({ id, email});
    if (existingItem) {
      return res.json({ success: true, message: "Already in cart" });
    }
    return res.json({ success: false, message: "Not in cart" });
  } catch (err) {
    console.error("Error in /check:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

app.get("/addtocart/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  try {
    const existingItem = await cart.findOne({ id, email });

    if (existingItem) {
      return res.json({ success: false, message: "Already in cart" }); // ← Add return here
    }

    const newItem = new cart({ id, email });
    await newItem.save();

    return res.json({ success: true, message: "Added to cart" }); // Also return here
  } catch (err) {
    console.error("Error in /addtocart:", err);
    return res.status(500).json({ success: false, error: "Server error" }); // Also return
  }
});

app.post('/product/:id/review', async (req, res) => {
  const productId = req.params.id;
  const { customer, rating, comment } = req.body;

  // Simple validation
  if (!customer || !comment || !rating) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  try {
    const Productdoc = await product.findOne({id:productId});
    if (!productdoc) return res.status(404).json({ success: false, message: 'Product not found' });

    // Add the new review
    Productdoc.reviews.push({ customer, rating, comment });

    await Productdoc.save();

    res.json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



app.post('/order/cancel/:orderId',async  (req, res) => {
  const { orderId } = req.params;
  const { email } = req.body;
  console.log(orderId,email)

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const order = await Order.findOne({id:orderId,email:email});
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Allow cancellation only if order status permits
 

  // Update order status to Cancelled
  order.status = 'Cancelled';
  const update = await Order.findOneAndUpdate(
      { id: orderId, email: email },
      { $set: { status: "Cancelled" } },
      { new: true } // returns the updated document
        );
  // Save changes to DB if applicable
  // e.g., await OrderModel.updateOne({ _id: orderId }, { status: 'Cancelled' });

  res.json({ success: true, message: 'Order cancelled successfully' });
});

// POST /order/return/:orderId
app.post('/order/return/:orderId',async  (req, res) => {
  const { orderId } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const order = Order.find({id:orderId,email:email});
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

   const update = await Order.findOneAndUpdate(
      { id: orderId, email: email },
      { $set: { status: "Returned" } },
      { new: true } // returns the updated document
        );
  // Update order status to Returned
  

  // Save changes to DB if applicable
  // e.g., await OrderModel.updateOne({ _id: orderId }, { status: 'Returned' });

  res.json({ success: true, message: 'Return request submitted successfully' });
});


app.get('/admin/products',async  (req, res) => {
  const products = await  product.find()
  res.json(products)
});

app.put('/admin/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, stock, description, image } = req.body;

  const productIndex = product.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  // Update fields (optional fields like description, image)
  products[productIndex] = {
    ...products[productIndex],
    name,
    price: Number(price),
    stock: Number(stock),
    description: description || products[productIndex].description,
    images: image ? [image] : products[productIndex].images,
  };

  // Save to DB in real app
  res.json({ success: true, product: products[productIndex] });
});
app.get('/admin/orders',async (req, res) => {
  const orders = await order.find()
  res.json(orders)
});
app.put("/admin/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status, email } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { id: orderId, email },
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success :true ,message: "Order updated successfully", updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({success:false , message: "Error updating order" });
  }
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));



