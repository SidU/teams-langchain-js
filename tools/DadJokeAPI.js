const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

class DadJokeAPI extends Tool {
  constructor() {
    super();
    this.name = "dadjoke";
    this.description = "Get a dad joke about a specific topic";
  }

  async call(input) {
    const headers = { "Accept": "application/json" };
    const searchUrl = `https://icanhazdadjoke.com/search?term=${input}`;

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const jokes = data.results;

    if (jokes.length === 0) {
      return `No dad jokes found about ${input}`;
    }

    const randomIndex = Math.floor(Math.random() * jokes.length);
    const randomJoke = jokes[randomIndex].joke;

    return randomJoke;
  }
}

module.exports.DadJokeAPI = DadJokeAPI;
