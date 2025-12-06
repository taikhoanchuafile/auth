import { createServer } from "@vercel/node";
import app from "../src/server.js"; // file express của em

export default createServer(app);
