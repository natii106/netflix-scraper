import express from "express";
import bodyParser from "body-parser"

import { MainController } from "./controller";

class App {
  public app: express.Application;

  constructor() {
    this.app = express()
    this.config()
  }

  private config(): void {
    this.app.use(bodyParser.json())
    this.app.post('/', new MainController().root)
  }
}

export default new App().app.listen(3000)
