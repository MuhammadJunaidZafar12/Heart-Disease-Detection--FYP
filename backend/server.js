const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Server started.
  console.log(`Server is running on port ${PORT}`); 
});