const { ActivityHandler, MessageFactory } = require('botbuilder');
const { OpenAI } = require('langchain');
const { initializeAgentExecutor } = require('langchain/agents');
const { Calculator } = require('langchain/tools');
const { BingSerpAPI } = require('./tools/BingSerpAPI');
const { DadJokeAPI } = require('./tools/DadJokeAPI');
const { PetFinderAPI } = require('./tools/FindPetsAPI');
const { IFTTTWebhook } = require('./tools/IFTTTWebhook');
const { YouTubeSearchAPI } = require('./tools/YoutubeSearchAPI');

class EchoBot extends ActivityHandler {

    constructor() {

        super();

        this.model = new OpenAI({ temperature: 0.9 });

        this.tools = [
            new BingSerpAPI(), 
            new Calculator(), 
            new DadJokeAPI(),
            new PetFinderAPI(),
            new IFTTTWebhook(
                `https://maker.ifttt.com/trigger/spotify/json/with/key/${process.env.IFTTTKey}`, 
                'Spotify', 
                'Play a song on Spotity.')
        ];
        
        this.onMessage(async (context, next) => {

            try {
                if (!this.executor) {

                    this.executor = await initializeAgentExecutor(
                        this.tools,
                        this.model,
                        "zero-shot-react-description"
                    );
                    console.log("Loaded agent.");
                }
    
                const input = context.activity.text;
    
                const execResponse = await this.executor.call({input});
    
                const replyText = execResponse.output;

                // Print the log property of each action in intermediateSteps.
                // This is useful for debugging.
                execResponse.intermediateSteps.forEach((step) => {
                    console.log("--------------------");
                    console.log(step.action.log);
                    console.log(`Observation: ${step.observation}`);
                });

                await context.sendActivity(MessageFactory.text(replyText, replyText));
                
            }
            catch (err) {
                console.log(err);
                throw err;
            }
           
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        

    }
}

module.exports.EchoBot = EchoBot;
