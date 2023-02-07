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
      max_tokens: 50,
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

export async function toSpanish(txt) {
  const res = await axios.get(`https://api.mymemory.translated.net/get`, {
    params: {
      q: txt,
      langpair: "en-GB|es-ES",
    },
  });

  if (res.status !== 200) {
    return alert("Translation failed!");
  }

  const data = res.data;
  const translation = data?.responseData?.translatedText;
  return translation;
}
