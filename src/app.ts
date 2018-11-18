import express from "express";
import { MainController } from "./controller";

class App {
  public app: express.Application;

  constructor() {
    this.app = express()
    this.config()
  }

  private config(): void {
    this.app.get('/', new MainController().root)
  }
}

export default new App().app.listen(3000)
