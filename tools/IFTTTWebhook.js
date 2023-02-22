const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

class IFTTTWebhook extends Tool {
  constructor(url, name, description) {
    super();
    this.url = url;
    this.name = name || "ifttt";
    this.description = description || "Send data to an IFTTT webhook URL";
  }

  async call(input) {
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ "this": input });

    const response = await fetch(this.url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.text();
    return result;
  }
}

module.exports.IFTTTWebhook = IFTTTWebhook;
