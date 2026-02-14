const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const path = require('path');

// Force override any system env vars with .env file values
const envConfig = dotenv.config({ path: path.join(__dirname, '.env'), override: true });

if (envConfig.error) {
    console.error('DOTENV ERROR:', envConfig.error);
}

// HARDCODED URI TO BYPASS PERSISTENT ENV ISSUE
process.env.MONGO_URI = 'mongodb://final_user:FinalPassword123@ac-xizgr3c-shard-00-00.nfit3bn.mongodb.net:27017,ac-xizgr3c-shard-00-01.nfit3bn.mongodb.net:27017,ac-xizgr3c-shard-00-02.nfit3bn.mongodb.net:27017/AlumNest?ssl=true&replicaSet=atlas-12uzoo-shard-0&authSource=admin&retryWrites=true&w=majority';

// Connect to Database
// Force Restart
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/gamification', require('./routes/gamificationRoutes'));

app.get('/', (req, res) => {
    res.send('AlumNest API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
