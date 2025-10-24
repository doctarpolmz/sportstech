import serverlessHttp from "serverless-http";
import { app } from "../server/app.js";

export default serverlessHttp(app);
