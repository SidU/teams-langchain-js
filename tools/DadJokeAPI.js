const { Tool } = require('langchain/agents');
const fetch = require('node-fetch');

class DadJokeAPI extends Tool {

  constructor() {
    super();
    this.baseUrl = "https://icanhazdadjoke.com/";
  }

  name = "dad joke";

  async call(searchTerm) {
    const url = `${this.baseUrl}/search?term=${searchTerm}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    // Return the first result.
    return data?.results[0]?.joke;
  }

  description = "a tool to retrieve a random dad joke from icanhazdadjoke. input should be a search term.";
}

module.exports.DadJokeAPI = DadJokeAPI;
