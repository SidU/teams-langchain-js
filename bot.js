// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { OpenAI } = require('langchain');
const { initializeAgentExecutor } = require('langchain/agents');
const { Calculator } = require('langchain/tools');
const { BingSerpAPI } = require('./tools/BingSerpAPI');

class EchoBot extends ActivityHandler {

    constructor() {

        super();

        this.model = new OpenAI({ temperature: 0.9 });
        this.tools = [new BingSerpAPI(), new Calculator()];
        
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        
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
    
                const execResponse = await this.executor.call(
                    {
                        input
                    }
                );
    
                const replyText = execResponse.output;

                // Print intermediate steps.
                console.log(JSON.stringify(execResponse.intermediateSteps, null, 2));

                //const replyText = await this.model.call(context.activity.text);
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
