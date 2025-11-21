require('dotenv').config(); 
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


const connectDB = require('./db/config');


const userRoutes = require('./routes/userRouter'); 


connectDB();


app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send("Your server is cooking right now!! 🍳");
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

