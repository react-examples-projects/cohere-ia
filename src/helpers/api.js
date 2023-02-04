import axios from "axios";

export default async function getPrediction(prompt) {
  const options = {
    method: "POST",
    url: "https://api.cohere.ai/generate",
    headers: {
      accept: "application/json",
      "Cohere-Version": "2022-12-06",
      "content-type": "application/json",
      Authorization: "BEARER 3AXryr60zKqQBQhNRALhgr6q01a58KW0IdsEan40",
    },
    data: {
      model: "command-xlarge-nightly",
      prompt,
      max_tokens: 100,
      temperature: 0.8,
      k: 0,
      p: 0.75,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      return_likelihoods: "NONE",
    },
  };
  const res = await axios.request(options);
  return res.data?.generations[0].text;
}
