import puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';

const URL_LOGIN = 'https://www.netflix.com/pl/login';
const URL_BROWSE = 'https://www.netflix.com/browse';

const URL_BILLING_ACTIVITY = 'https://www.netflix.com/BillingActivity';
const URL_MY_LIST = 'https://www.netflix.com/browse/my-list';
const URL_ACCOUNT_ACCESS = 'https://www.netflix.com/AccountAccess';
const URL_VIEWING_ACTIVITY = 'https://www.netflix.com/viewingactivity';

const USERNAME_SELECTOR  = '#email';
const PASSWORD_SELECTOR  = '#password';
const BUTTON_SELECTOR  = 'form > button';

export class Scraper {
  browser: Browser;
  page: Page;

  public async init() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  public close(): void {
    this.browser.close()
  }

  public async login(username : string, password : string) {
    await this.page.goto(URL_LOGIN)

    await this.page.click(USERNAME_SELECTOR)
    await this.page.keyboard.type(username)

    await this.page.click(PASSWORD_SELECTOR)
    await this.page.keyboard.type(password)

    await this.page.click(BUTTON_SELECTOR)

    await this.page.waitForNavigation()

    await this.page.goto(URL_BROWSE);
    const selector = '#appMountPoint > div > div > div > div > div.profiles-gate-container > div > div > ul > li:nth-child(1) > div > a'

    if (await this.page.$(selector) !== null) {
      await this.page.click(selector);
    }
  }

  public async getBillingInfo() {
    await this.page.goto(URL_BILLING_ACTIVITY)

    return await this.page.evaluate(() => {
      const getRowData = (row: Element, classname: string): string => row
          .querySelector(`${classname}`)
          .innerHTML
          .trim()
      const rows = document.querySelectorAll('.billingSummaryContents')
      const data = Array.from(rows).map(row => ({
        plan: getRowData(row, '.billingPlanMessage'),
        billing: getRowData(row, '.billingSummaryLabel'),
        billing_data: getRowData(row, '.billingSummaryContents > div > span'),
        billing_date: getRowData(row, '.billingSummarySpace'),
        billing_date_data: getRowData(row, '#appMountPoint > div > div > div.bd > div > div > section > div > div:nth-child(6)'),
      }))

      return JSON.stringify(data, null, 2);
    });
  }


  public async getMyListInfo() {
    await this.page.goto(URL_MY_LIST);

    return await this.page.evaluate(() => {
      let data = []
      const rows = document.querySelectorAll('.slider');

      for (const row of rows) {
        let fields = row.querySelectorAll(`.slider-item`);
        for (let i=0; i < fields.length; i++) {
          data.push({
            title: fields[i].querySelector('.fallback-text').innerHTML.trim(),
          })
        }
      }

      return JSON.stringify(data, null, 2);;
    });
  }


  public async getAccountAccessInfo() {
    await this.page.goto(URL_ACCOUNT_ACCESS);

    return await this.page.evaluate(() => {
      const getRowData = (row: Element, classname: string): string => row
        .querySelector(`${classname}`)
        .innerHTML
        .trim()
      const rows = document.querySelectorAll('.retableRow');
      const data = Array.from(rows).map(row => ({
        datetime: getRowData(row, '.datetime'),
        location: getRowData(row, '.location'),
        device: getRowData(row, '.device'),
      }))

      return JSON.stringify(data, null, 2);;
    });
  }

  public async getViewingActivityInfo() {
    await this.page.goto(URL_VIEWING_ACTIVITY);

    return await this.page.evaluate(() => {
      const getRowData = (row: Element, classname: string): string => row
        .querySelector(`${classname}`)
        .innerHTML
        .trim()
      const rows = document.querySelectorAll('.retableRow');
      const data = Array.from(rows).map(row => ({
        date: getRowData(row, '.date'),
        title: getRowData(row, '.title'),
      }))

      return JSON.stringify(data, null, 2);;
    });
  }
}

