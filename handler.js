const chromium = require('chrome-aws-lambda');

exports.hello = async (event, context) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    // ここのページを任意のものにさしかえてください
    await page.goto('https://app.mural.co/t/usagigumi5492/m/usagigumi5492/1587875788805/c5d98362fd0b0a28997aed54c9131ee75d1baffa');

    result = await page.title();
    const enterButton = await page.waitForSelector('body > div:nth-child(5) > div > div > div > div > div > div.ui-visitor-modal.fade-enter-done > div > div > div:nth-child(3) > div > button')
    await enterButton.click();
    await page.waitFor(5 * 1000);
    

    const mouse = page.mouse;
    await page.waitForXPath('//button[text() = "Got it"]');
    await (await page.$x('//button[text() = "Got it"]'))[0].click({clickCount: 2});
    await page.waitFor(5 * 1000);
    await page.waitForXPath('//span[text() = "スペース1"]');
    await (await page.$x('//span[text() = "スペース1"]'))[0].click({clickCount: 2});

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    for(let step = 1; step < 20; step++){
      await Promise.all([
        x = getRandomInt(400, 1200),
        y = getRandomInt(400, 1200),
        mouse.click(x, y, {clickCount: 2}), // 付箋作成
        page.waitFor(3 * 1000),
        page.keyboard.type('sample-' + step), // 文字入力
        page.waitFor(getRandomInt(3, 5) * 1000),
      ]);
    }
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return context.succeed(result);
};