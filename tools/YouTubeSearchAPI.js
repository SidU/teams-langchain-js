const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

class YouTubeSearchAPI extends Tool {
  constructor(apiKey = process.env.YouTubeApiKey) {
    super();

    if (!apiKey) {
      throw new Error(
        "YouTubeSearchAPI API key not set. You can set it as YouTubeApiKey in your .env file."
      );
    }

    this.name = "youtubesearch";
    this.description = "Search YouTube and get URLs of the videos";
    this.apiKey = apiKey;
  }

  async call(input) {
    const headers = { "Accept": "application/json" };
    const params = {
      q: input,
      part: "snippet",
      type: "video",
      maxResults: 5,
      key: this.apiKey,
    };
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');

    Object.entries(params).forEach(([key, value]) => {
      searchUrl.searchParams.append(key, value);
    });

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const videoUrls = data.items.map((item) => {
      return `https://www.youtube.com/watch?v=${item.id.videoId}`;
    });

    return videoUrls;
  }
}

module.exports.YouTubeSearchAPI = YouTubeSearchAPI;
