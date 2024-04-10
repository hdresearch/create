import { Agent, completionApiBuilder } from "nolita";
import "dotenv/config";

const providerOptions = {
  apiKey: process.env.PROVIDER_API_KEY,
  provider: process.env.MODEL_PROVIDER,
};

const modelApi = completionApiBuilder(providerOptions, {
  model: process.env.MODEL,
});

const agent = new Agent({ modelApi });

export default agent;
