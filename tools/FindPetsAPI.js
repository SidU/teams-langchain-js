const { Tool } = require('langchain/tools');
const fetch = require('node-fetch');

class PetFinderAPI extends Tool {
  constructor() {
    super();
    this.name = "petfinder";
    this.description = "find pets by status. returns the name of each available pet. if status is not specified, default to available.";
  }

  async call(status = "available") {
    const headers = { "Accept": "application/json" };
    const searchUrl = `https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`;

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const pets = await response.json();
    const petNames = pets.map(pet => pet.name);

    return petNames;
  }
}

module.exports.PetFinderAPI = PetFinderAPI;
