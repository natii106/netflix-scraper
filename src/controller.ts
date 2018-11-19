import { Request, Response } from "express";
import { Scraper } from './login'

export class MainController {
  public async root(req: Request, res: Response) {
    const scraper = new Scraper()
    await scraper.init()
    await scraper.login(req.body.username, req.body.password)


    const billings = await scraper.getBillingInfo()
    const list = await scraper.getMyListInfo()
    const accountAccessInfo = await scraper.getAccountAccessInfo()
    const activityInfo = await scraper.getViewingActivityInfo()

    const data = {
      billings,
      list,
      accountAccessInfo,
      activityInfo,
    }
    scraper.close()

    res.status(200).send({ data });
  }
}
