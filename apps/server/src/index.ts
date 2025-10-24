import { app } from "./server/app.js";

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ARIP server listening on port ${port}`);
});
