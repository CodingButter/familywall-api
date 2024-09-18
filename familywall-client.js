function encode(data) {
  return encodeURI;
}

function serialize(data) {
  return new URLSearchParams(data).toString();
}

function setCookie(jsessionid) {
  return `_gid=GA1.2.2118125424.1726621203; _gat_gtag_UA_30098956_2=1; _gat_gtag_UA_37056134_1=1; JSESSIONID=${jsessionid}; _ga_5GHHS7PK50=GS1.1.1726621036.1.1.1726622248.0.0.0; _ga_QEJNR13YN6=GS1.1.1726621037.1.1.1726622248.0.0.0; _ga=GA1.1.600776544.1726621203`;
}

export default class FamilyWallClient {
  constructor(options = {}) {
    this.baseUrl = "https://api.familywall.com/api";
    this.cookie = null;
    this.jsessionid = null;
    this.timezone =
      options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  async apiFetch(endpoint, body, method = "POST") {
    body = serialize(body);
    const headers = {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://www.familywall.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      "content-length": body.length,
    };

    if (this.jsessionid) {
      headers.tokencsrf = this.jsessionid;
      headers.cookie = this.cookie;
    }

    return await fetch(`${this.baseUrl}/${endpoint}`, {
      headers,
      body,
      method,
    });
  }

  async login(email, password) {
    const body = {
      partnerScope: "Family",
      a01call: "log2get",
      transactional: true,
      a00generateAutologinToken: true,
      a00identifier: email,
      a00password: password,
    };

    const response = await this.apiFetch("log2in", body);
    const headers = response.headers;
    console.log(headers);
    this.jsessionid = headers
      .get("set-cookie")
      .split(";")[0]
      .replace("JSESSIONID=", "");
    this.cookie = setCookie(this.jsessionid);
    await this.webset();
    await this.webget();
  }

  async getWebSocketUrl() {
    const body = {
      partnerScope: "Family",
    };

    const response = await this.apiFetch("webgetWebSocketUrl", body);

    const json = await response.json();

    return (this.webSocketUrl = json?.["a00"]?.["r"]?.["r"]);
  }

  async webset() {
    const body = {
      partnerScope: "Family",
      var: "a",
      value: "t",
    };
    const response = await this.apiFetch("webset", body);

    const json = await response.json();
    return json;
  }

  async webget() {
    const body = {
      partnerScope: "Family",
      var: "a",
    };

    const response = await this.apiFetch("webget", body);
    return response.json();
  }

  async getAllFamily() {
    const body = {
      partnerScope: "Family",
      a01call: "prfgetProfiles",
      a02call: "famlistfamily",
      a03call: "settingsgetperfamily",
      a04call: "famshowincominginvite",
      a05call: "imthreadlist",
      a05isLoggedFamily: false,
      a06call: "accgetstate",
      a06deviceId: "webm16skcc5so1b181l4o",
      a06modelType: "WebFirebase",
      a06applicationVersion: "",
      a06timezone: this.timezone,
    };

    const response = await this.apiFetch("accgetallfamily", body);
    const json = await response.json();
    return json;
  }

  async getProfiles() {
    const body = {
      partnerScope: "Family",
    };

    const response = await this.apiFetch("prfgetProfiles", body);

    const json = await response.json();
    return json;
  }
}
