import './lib/env.js';
import app from './app.js';
import connectDB from './lib/db.js';
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
	connectDB();
});
