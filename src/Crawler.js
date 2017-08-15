const cheerio = require("cheerio");
const querystring = require("querystring");
const { AUTH_URL, EMAIL, PASS, LOG } = require("./constants");

const request = require("request-promise").defaults({
  jar: true,
  rejectUnauthorized: false,
  followAllRedirects: true
});

class Crawler {
  async auth() {
    const html = await request(AUTH_URL);
    const $ = cheerio.load(html);
    const token = $("input[name=authenticity_token]").val();

    return await request({
      method: "POST",
      uri: AUTH_URL,
      formData: {
        utf8: "✓",
        authenticity_token: token,
        "user[email]": EMAIL,
        "user[password]": PASS
      }
    });
  }

  async getApiData(url, page = 1) {
    url = [url, querystring.stringify({ page })].join("?");
    LOG && console.log(`Start parse page url ${url}`.yellow);
    let content = await request(url);

    return JSON.parse(content);
  }
}

module.exports = new Crawler();
