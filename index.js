require('dotenv').config(); 
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')


const connectDB = require('./db/config');


const userRoutes = require('./routes/userRouter'); 
const teamRouter = require('./routes/TeamRouter')
const projectRouters = require('./routes/ProjectsRoutes')
const taskRoutes = require('./routes/TasksRoutes')


connectDB();

app.use(cors())
app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/teams',teamRouter)
app.use('/projects',projectRouters)
app.use('/tasks',taskRoutes)


app.get('/', (req, res) => {
  res.send("Your server is cooking right now!! 🍳");
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

