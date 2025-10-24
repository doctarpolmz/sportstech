require('dotenv').config();
const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ARIP server listening on port ${PORT}`);
});
