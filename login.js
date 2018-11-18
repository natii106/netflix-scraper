const puppeteer  = require ('puppeteer');

const URL = 'https://www.netflix.com/pl/login';
const USERNAME = '';
const PASSWORD = '';

const USERNAME_SELECTOR  = '#email';
const PASSWORD_SELECTOR  = '#password';
const BUTTON_SELECTOR  = 'form > button';

const login = module.exports = {
  log: async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const override = Object.assign(page.viewport(), {width: 1920});
  await page.setViewport(override);
  await page.goto(URL)

  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(USERNAME);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(PASSWORD);

  await page.click(BUTTON_SELECTOR);

  await page.waitForNavigation();

  await page.goto('https://www.netflix.com/BillingActivity');


  const billingInfo = await page.evaluate(() => {
    const rowData = (row, classname) => row
        .querySelector(`${classname}`)
        .innerText
        .trim()

      const ROW_SELECTOR = 'div.billingSummaryContents'
      let data = []
      const rows = document.querySelectorAll(ROW_SELECTOR)

      for (const row of rows) {
        data.push({
          plan: rowData(row, 'div.billingPlanMessage'),
          billing: rowData(row, 'label.billingSummaryLabel'),
          billing_data: rowData(row, 'div.billingSummaryContents > div > span'),
          billing_date: rowData(row, 'label.billingSummarySpace'),
          billing_date_data: rowData(row, '#appMountPoint > div > div > div.bd > div > div > section > div > div:nth-child(6)'),
        })
      }
      return data;
  });

  console.log(JSON.stringify(billingInfo, null, 2));


//todo: click and if not necessary, catch error
  await page.goto('https://www.netflix.com/browse');
  await page.click('#appMountPoint > div > div > div > div > div.profiles-gate-container > div > div > ul > li:nth-child(1) > div > a');


  await page.goto('https://www.netflix.com/browse/my-list');

  const myList = await page.evaluate(() => {
    const rowData = (row, classname) => row
        .querySelector(`${classname}`)
        .innerText
        .trim()

      const ROW_SELECTOR = 'div.slider'
      let data = []
      const rows = document.querySelectorAll(ROW_SELECTOR);
      for (const row of rows) {
        //todo: second row, i <= number of columns
         for (let i=0; i <= 5; i++) {
           let field = row.querySelector(`div.slider-item-${i}`);
          data.push({
            title: rowData(field, 'div.fallback-text'),
            // add img url
          })
        }
      }
      return data;
  });


  console.log(JSON.stringify(myList, null, 2))


  await page.goto('https://www.netflix.com/AccountAccess');


  const accountActivity = await page.evaluate(() => {
    const rowData = (row, classname) => row
        .querySelector(`${classname}`)
        .innerText
        .trim()

      const ROW_SELECTOR = 'li.retableRow'
      let data = []
      const rows = document.querySelectorAll(ROW_SELECTOR)

      for (const row of rows) {
        data.push({
          datetime: rowData(row, 'div.datetime'),
          location: rowData(row, 'div.location'),
          device: rowData(row, 'div.device'),
        })
      }
      return data;
  });

  console.log(JSON.stringify(accountActivity, null, 2));


  await page.goto('https://www.netflix.com/viewingactivity');

  await page.screenshot({ path: 'screenshot.png' })
  const viewingActivity = await page.evaluate(() => {
    const rowData = (row, classname) => row
        .querySelector(`${classname}`)
        .innerText
        .trim()

      const ROW_SELECTOR = 'li.retableRow'
      let data = []
      const rows = document.querySelectorAll(ROW_SELECTOR)

      for (const row of rows) {
        data.push({
          title: rowData(row, 'div.date'),
          report: rowData(row, 'div.title'),
        })
      }
      return data;
  });

  console.log(JSON.stringify(viewingActivity, null, 2));


  browser.close();
},

  main: async () => {
    await login.log()
  }
}

