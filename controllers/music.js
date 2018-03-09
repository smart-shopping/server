const axios = require('axios')
const request = require('request')

const paramsRecognition = {
  "returnFaceId": "true",
  "returnFaceLandmarks": "false",
  "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,accessories,exposure",
};

module.exports = {
  getMusicAll: (req, res) => {
    axios({
      method: 'post',
      url:'https://accounts.spotify.com/api/token',
      params: {
        client_id: process.env.SPOTIFY_ID,
        client_secret: process.env.SPOTIFY_SECRET,
        code: 'spotify',
        scope: 'user-read-private user-read-email',
        grant_type :'authorization_code',
        redirect_uri: process.env.SPOTIFY_REDIRECT
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(token => {
      res.status(200).send(token)
    })
    .catch(err => {
      console.error(err)
      // res.status(400).send(err)
    })
  },

  getMusicByMood: (req, res) => {
    // console.log('req.body.sourceImage == ', req.body.sourceImage);
    // console.log('process.env.SUBSCRIP_KEY == ', process.env.SUBSCRIP_KEY);
    // axios({
    //   url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,accessories,exposure',
    //   type: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Ocp-Apim-Subscription-Key': process.env.SUBSCRIP_KEY
    //   },
    //   data: {
    //     url: req.body.sourceImage
    //   }
    // })
    // .then(resp => {
    //   console.log('resp == ', resp);
    //   res.status(200).send(JSON.stringify(resp, null, 2))
    // })
    // .catch(err => {
    //   console.error(err)
    //   res.status(400).send(err)
    // })

    // axios({
    //   url: `https://api.spotify.com/v1/search?q=${req.body.emotion}&type=playlist&market=ID`,
    //   type: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': 'Bearer BQBtICw_1uaVsXqX6nfmdlQ6B6eQN16SQb0UtRXKOh3qLlqEymSgnTeaA3MYkCiHZ5pyOvx1muuCxToBrtOf6QYOAMJzsiK9kQgP_JrADAH6V-zMRdwA7sIRA-gGf_yBW3YzWf4QhqBXkKHBNE_JqLHA-5SzvB_TQA',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    // axios.get(`https://api.spotify.com/v1/search?q=happiness&type=playlist&market=ID`, JSON.stringify({
    //   'Accept': 'application/json',
    //   'Authorization': 'Bearer BQBtICw_1uaVsXqX6nfmdlQ6B6eQN16SQb0UtRXKOh3qLlqEymSgnTeaA3MYkCiHZ5pyOvx1muuCxToBrtOf6QYOAMJzsiK9kQgP_JrADAH6V-zMRdwA7sIRA-gGf_yBW3YzWf4QhqBXkKHBNE_JqLHA-5SzvB_TQA',
    // }))
    // .then(resp => {
    //   res.send(resp.data)
    // })
    // .catch(err => res.status(500).send(err))

    request({
      method: 'POST',
      uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,accessories,exposure',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.SUBSCRIP_KEY
      },
      json: {
        'url': req.body.sourceImage
      }
    }, (error, response, body) => {
      if (error) {
        return console.error('Server failed:', error);
      }
      // console.log('Server responded with:', body[0].faceAttributes.emotion);
      let arrEmotion = []
      let strongestEmotion = '';
      let emotionScore = 0;
      let emotion = body[0].faceAttributes.emotion
      delete emotion.contempt
      delete emotion.disgust
      delete emotion.surprise
      delete emotion.neutral
      arrEmotion.push(emotion)

      for (var key in emotion) {
        if (emotion[key] > emotionScore) {
          emotionScore = emotion[key];
          strongestEmotion = key;
        }
      }
      console.log(strongestEmotion);

      request({
        method: 'GET',
        uri: `https://api.spotify.com/v1/search?q=${strongestEmotion}&type=playlist&market=ID`,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + process.env.SPOTIFY_TOKEN,
        },
      }, (error, response, body) => {
        if (error) {
          return console.error('upload failed:', error);
        }
        console.log('Server responded with:', body);
        res.send(body)
      })
    })
  }
}
