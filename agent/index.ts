import { Agent, completionApiBuilder } from "nolita";
import "dotenv/config";

const providerOptions = {
  apiKey: process.env.PROVIDER_API_KEY,
  provider: process.env.MODEL_PROVIDER,
};

if (!providerOptions.provider) {
  throw new Error("No provider specified. Did you forget to make a .env file? See README.md for more.");
}

const modelApi = completionApiBuilder(providerOptions, {
  model: process.env.MODEL,
});

const agent = new Agent({ modelApi });

export default agent;
