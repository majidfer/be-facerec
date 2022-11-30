const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

dotenv.config();
const { CLARIFAI_USER_ID, CLARIFAI_PAT } = process.env;

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${CLARIFAI_PAT}`);

const {
  fetchTotalUsers,
  signingIn,
  registering,
  fetchProfileById,
  fetchEntries,
} = require("./models");

// exports.getTotalUsers = (req, res) => {
//   fetchTotalUsers()
//     .then((totalUser) => {
//       console.log("from controller", totalUser);
//       res.status(200).json(`${totalUser} user(s) registered`);
//     })
//     .catch((err) => res.status(400).json("something is not right"));
// };

exports.getTotalUsers = (req, res) => {
  fetchTotalUsers()
    .then((totalUser) => {
      res.status(200).json(totalUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("something is not right");
    });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  signingIn(email, password)
    .then((user) => {
      if (user.id) {
        res.status(200).json(user);
      } else {
        res.status(400).json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something in the server gone wrong");
    });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  registering(name, email, password)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something in the server gone wrong");
    });
};

exports.getProfileById = (req, res) => {
  const { id } = req.params;
  fetchProfileById(id)
    .then((profile) => res.status(200).json(profile))
    .catch((err) => {
      res.status(err.status).json(err.msg);
    });
};

exports.incrementEntries = (req, res) => {
  const { id } = req.body;
  fetchEntries(id)
    .then((entries) => res.status(200).json(entries))
    .catch((err) => {
      res.status(err.status).json(err.msg);
    });
};

/*
exports.handleApiCall = (req, res) => {
  const { input } = req.body;
  const USER_ID = CLARIFAI_USER_ID;
  const PAT = CLARIFAI_PAT;
  const APP_ID = "my-first-application";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  const IMAGE_URL = input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      res
        .status(200)
        .send(result.outputs[0].data.regions[0].region_info.bounding_box);
    })
    .catch((err) => {
      res.status(400).json("unable to get entries");
    });
};
*/

exports.handleApiCall = (req, res) => {
  const { input } = req.body;
  stub.PostModelOutputs(
    {
      model_id: "face-detection",
      inputs: [{ data: { image: { url: input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }
      res
        .status(200)
        .send(response.outputs[0].data.regions[0].region_info.bounding_box);
    }
  );
};
