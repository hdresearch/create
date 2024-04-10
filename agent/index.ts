import { Agent, completionApiBuilder } from "nolita";
import "dotenv/config";

const providerOptions = {
  apiKey: process.env.PROVIDER_API_KEY,
  provider: process.env.MODEL_PROVIDER,
};

const chatApi = completionApiBuilder(providerOptions, {
  model: process.env.MODEL,
});

const agent = new Agent(chatApi);

export default agent;
