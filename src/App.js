import {
  Textarea,
  Button,
  Text,
  Card,
  Note,
  Avatar,
  Input,
  useToasts,
} from "@geist-ui/core";
import { WithContext as ReactTags } from "react-tag-input";
import { useState } from "react";
import { isNotValidFileType, imageToBase64, generateId } from "./helpers/utils";
import getPrediction from "./helpers/api";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const prompts = [
  "Create a short social media phrase for an post about these topics: ",
  "Write a short social media post based about these topics: ",
  "Make promotional short social media post about these topics: ",
  "Create a promotional short social media phrase for an post about these topics: ",
];

function getRandomPrompt(topics) {
  const index = Math.floor(Math.random() * prompts.length);
  return prompts[index] + topics;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorTagsLength, setErrorTagsLength] = useState(false);
  const [tags, setTags] = useState([
    {
      id: generateId(),
      text: "javascript",
    },
    {
      id: generateId(),
      text: "nodejs",
    },
  ]);
  const { setToast } = useToasts();
  const [imgUrl, setImgUrl] = useState("");
  const IS_REACHED_MAX_TAGS = tags.length >= 8;
  const ERROR_TAGS_LENGTH = tags.length <= 0;

  const handleDelete = (i) => setTags(tags.filter((tag, index) => index !== i));

  const handleAddition = (tag) => setTags([...tags, tag]);

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const onChangePrompt = (e) => setPrompt(e.target.value);

  const onChangeFile = async (e) => {
    const img = e.target.files[0];
    if (isNotValidFileType(img.type)) {
      e.target.value = null;
      setToast({ text: "File type is invalid", type: "error" });
      return;
    }

    const url = await imageToBase64(img);
    setImgUrl(url);
  };

  const createPrediction = async () => {
    if (ERROR_TAGS_LENGTH) {
      setErrorTagsLength(true);
      return;
    }

    try {
      setError(null);
      setErrorTagsLength(false);
      setLoading(true);
      const topics = tags.map((t) => t.text).join(", ");
      let finalPrompt;

      if (prompt) {
        finalPrompt = prompt.replaceAll("%topics%", topics);
      } else {
        finalPrompt = getRandomPrompt(topics);
      }

      setSelectedPrompt(finalPrompt);

      const _prediction = await getPrediction(finalPrompt);
      setPrediction(_prediction);
    } catch (err) {
      const desc = err.response?.data?.data?.error || err.message || err;
      setError(desc);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Text className="mb-2 text-center text-gradient title" h1>
        Create your short posts for yours social medias
      </Text>
      <Text
        className="text-center text-muted mb-1"
        style={{ fontSize: "20px" }}
      >
        You can generate text using cohere ia recognition.
      </Text>

      <main style={{ maxWidth: "600px" }} className="mx-auto">
        {errorTagsLength && (
          <Note type="error" className="my-2">
            You must have almost one tag created
          </Note>
        )}

        {IS_REACHED_MAX_TAGS && (
          <Note type="warning" className="my-2">
            You have reached the maximum count of tags
          </Note>
        )}
        {error && (
          <Note type="error" className="my-2">
            {error}
          </Note>
        )}
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          delimiters={delimiters}
          handleDrag={handleDrag}
          inputFieldPosition="top"
          className="input-tags"
          readOnly={isLoading}
          placeholder="Press enter ⏎ to add a tag  (max tags is 8)"
          inputProps={{
            disabled: IS_REACHED_MAX_TAGS,
          }}
        />
        <label className="mb-3 d-block">
          You can use <span className="key">%topics%</span> variable to add the
          tags to your prompt
        </label>
        <Textarea
          width="100%"
          onChange={onChangePrompt}
          value={prompt}
          disabled={isLoading}
          resize="vertical"
          placeholder="Optionally you can write your custom prompt.&#10;Example: Write a linkedin post about these topics: %topics%"
          rows={5}
        />

        <Card className="mt-3 d-flex">
          <label htmlFor="file">
            You can upload a preview image for your post
          </label>
          <Input
            htmlType="file"
            id="file"
            className="mt-2"
            accept="image/png, image/gif, image/jpeg"
            width="100%"
            onChange={onChangeFile}
          />
        </Card>

        <Button
          type="success-light"
          className="my-3"
          onClick={createPrediction}
          disabled={isLoading}
          loading={isLoading}
        >
          Generate
        </Button>

        {prediction && (
          <>
            <Card className="my-3 card-gradient">
              <Text h4>Prompt:</Text>
              <Text>{selectedPrompt}</Text>
            </Card>

            <Card width="100%">
              <Text h4>Preview:</Text>
              <div className="d-flex align-items-center">
                <Avatar
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  width="40px"
                  height="40px"
                />
                <Text className="ms-2">
                  Carl Jhonsom
                  <time className="d-flex text-muted">
                    <small>Published 3h ago</small>
                  </time>
                </Text>
              </div>
              <p style={{ wordWrap: "break-word" }}>{prediction}</p>
              <img
                src={
                  imgUrl ||
                  "https://uning.es/wp-content/uploads/2016/08/ef3-placeholder-image.jpg"
                }
                alt="Output post"
                title="Output post"
                className="img-fluid rounded-3"
              />
              <div className="d-flex align-items-center gap-1 flex-wrap">
                {tags.map(({ text, id }) => (
                  <Text
                    key={id}
                    style={{ textDecoration: "underline", color: "#0070f3" }}
                    span
                  >
                    #{text}
                  </Text>
                ))}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
