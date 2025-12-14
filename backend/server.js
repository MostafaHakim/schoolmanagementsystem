const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
  connectDb;
});
