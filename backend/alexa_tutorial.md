##Steps to building an alexa skill:

###Prerequisites:
In order to develop an Alexa skill you'll need access to 2 accounts.

1. **aws.amazon.com**: An IAM user with access to the webservices@intrepid.io account
2. **developer.amazon.com**:  webservices@intrepid.io for amazon developers, this login info is in LastPass.

### Intro
There are two parts to building an echo skill. (1) Developing the logic for skill. Alexa can be configured to hit any api endpoint. A common practice to set up a lambda function for the Alexa skill to hit. Which is what we'll do in this tutorial.
(2) Configuring your Alexa skill, this is where you'll create the commands that Alexa will respond to, define the variables you'll have access to in your endpoint and publish your skill.

### Setting up your lambda

1. Login using your IAM user and ensure that you're in the correct region
* Create a new function
* Enter the name of your lambda function. It should reflect the name of your skill eg: febreze-alexa-skill.
* This will give you an empty function that you can configure to process alexa command.
* Next we need to set a role, if you scroll down you should see a role dropdown, this sets permissions for your lambda function. For now you can choose lambda basic execution role.  
* Click Next and Create Function
* Now under the event sources tab and the "Alexa Skills Kit" event source.
* Finally copy the ARN at the top of the page and save it for later

###Configuring your alexa skill:

1. Login using the webservices account
* Go to the alexa tab and select Alexa Skills Kit and start creating a new skill
* Under skill information select the following:
    * Custom interaction model
    * Name: This should be self explanatory
    * Invocation Name: Like the description says this is what people will use to start your alexa skill
    *Global Fields: Most skills won't need this but if you're playing music through your echo skill this is relevant to you.
* The interaction model like the name suggests is where you'll define how people will interact with your alexa skill. It's comprised of two parts (1) Intent Schema (2) Sample Utterances
* Configuration: Here's where you set the endpoint or lambda that your skill will connect to. If you're using a lambda function copy the ARN that you obtained while setting up your lambda
* Testing: You can enter in phrases and see how Alexa responds to them, you can even hear her say the words. This interface is particularly useful because it gives you the same request that Alexa is sending as well as the sample response.
* Publish and Profit.

 * **Sample Utterances **

This is a list of commands that you can use with your echo skill. It maps an 'intent' to a command that a user can give to Alexa.
These intents are like function names that will map back to actual functions in your lambda.

You can define a 'slot' which is essentially a variable that will be taken in your commands like so:
`SetScent make the room smell like {scent}`

Where scent is the variable that's taken in and SetScent is some action. [Further Reading](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#h2_sample_utterances)

 * **Intent Schema**:

This is a json structure that represents all the actions that a user an take. These actions map back to functions in the lambda(or other server endpoint). This intent schema is also where you define any variables you might need to take in for that intent, amazon refers to these variables as slots. So in our previous example SetScent is an intent, and scent is a slot.

Slots have both a name and type. Name is just whatever you named the variable. Type can either be one of the Amazon's built in types or a custom slot type which is essentially a list of slots that you define in the custom slot type section under intent schema. So the intent schema for our previous example would look like
```
 "intents": [
    {
      "intent": "SetScent",
      "slots": [
        {
          "name": "Scent",
          "type": "LIST_OF_SCENT"
        }
  ]
```
[Further Reading](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#h2_intents)


### Helpful Links
More in depth tutorial with screenshots: https://medium.com/@bthdonohue/build-your-first-alexa-skill-8a37dc3103d6
Creating Lambda roles: http://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-create-iam-role.html
Using DynamoDB with Alexa skills:
https://medium.com/@toyhammered/how-i-built-my-alexa-skill-daily-cutiemals-fa3e08dcd4da
