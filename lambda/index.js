const AWS = require("aws-sdk");
const linebotsdk = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const client = new linebotsdk.Client(config);
exports.handler = async (event, context) => {
  const sagemakerruntime = new AWS.SageMakerRuntime({
    region: 'us-west-2',
    httpOptions: {
      connectTimeout: context.getRemainingTimeInMillis() - 7000,
      timeout: context.getRemainingTimeInMillis() - 1000
    }
  });
  let result = {}
  let answer = "";
  const eventBody = JSON.parse(event.body);
  try {
    let prompt = eventBody.events[0].message.text;
    let systemPrompt = process.env.SYSTEM_PROMPT;
    let payload = {
      "inputs": systemPrompt + "\n\n" + prompt,
      "parameters": {
        "do_sample": true,
        "top_p": 0.9,
        "temperature": 0.8,
        "max_new_tokens": 1024,
        "stop": ["<|endoftext|>", "</s>"],
      }
    }
    let params = {
      "EndpointName": "my-endpoint",
      "Body": JSON.stringify(payload),
      "ContentType": "application/json",
    }
    let runtimeResponse = await sagemakerruntime.invokeEndpoint(params).promise()
    let jsonString = runtimeResponse.Body.toString('utf8');
    let jsonResult = JSON.parse(jsonString)
    let resultString = jsonResult[0].generated_text.trim();
    answer = resultString;
    result.data = resultString
  } catch (error) {
    result.error = error.message;
    answer = "Sorry, I can't answer right now. Please try again."
  }
  await client.replyMessage(
    eventBody.events[0].replyToken, {
    "type": "text",
    "text": answer
  })
  console.log(result);
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;
};
