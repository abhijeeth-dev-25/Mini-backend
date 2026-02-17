const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get("/abhijeeth",(req,res)=>{
    res.send("hello");
})

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
