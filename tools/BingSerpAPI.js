const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

class BingSerpAPI extends Tool {

  constructor(apiKey = process.env.BingApiKey, params = {}) {
    super();

    if (!apiKey) {
      throw new Error(
        "BingSerpAPI API key not set. You can set it as BingApiKey in your .env file."
      );
    }

    this.key = apiKey;
    this.params = params;
  }

  name = "search";

  async call(input) {

    //console.log("BingSerpAPI: searching for " + input);

    const headers = { "Ocp-Apim-Subscription-Key": this.key};
    const params = { q: input, textDecorations: true, textFormat: "HTML" };
    const searchUrl = new URL('https://api.bing.microsoft.com/v7.0/search');
    
    Object.entries(params).forEach(([key, value]) => {
      searchUrl.searchParams.append(key, value);
    });
    
    var response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
  
    const res = await response.json();

    const myresponse = res.webPages.value[0].snippet;

    //console.log("BingSerpAPI: response: " + myresponse);

    return myresponse;
  }

  description =
    "a search engine. useful for when you need to answer questions about current events. input should be a search query.";
}

module.exports.BingSerpAPI = BingSerpAPI;
