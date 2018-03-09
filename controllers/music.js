const axios = require('axios')
const request = require('request')
const Spotify = require('machinepack-spotify');

const paramsRecognition = {
  "returnFaceId": "true",
  "returnFaceLandmarks": "false",
  "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,accessories,exposure",
};

module.exports = {
  getMusicAll: (req, res) => {
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
  },

  getMusicByMood: (req, res) => {
    Spotify.getAccessToken({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
    })
    .exec({
      error: function (err) {
        console.log(err);
      },
      success: function (token) {
        console.log('OKEEE ', token);
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
          // console.log('Server responded with:', body);
          let arrEmotion = []
          let strongestEmotion = '';
          let emotionScore = 0;
          let emotion = body[0].faceAttributes.emotion
          console.log(emotion);
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
          console.log('strongestEmotion ==', strongestEmotion);

          request({
            method: 'GET',
            uri: `https://api.spotify.com/v1/search?q=${strongestEmotion}&type=playlist&market=ID`,
            headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + token, // + process.env.SPOTIFY_TOKEN,
            },
          }, (error, response, body) => {
            if (error) {
              return console.error('upload failed:', error);
            }
            // console.log('Server responded with:', body);
            console.log(body);
            // body.emotion = arrEmotion
            res.json({
              body:JSON.parse(body),
              emotion: arrEmotion
            })
          })
        })

        // Spotify.getLoginUrl({
        //   clientId: 'abc123jdhs3h4js',
        //   redirectUri: 'https://example.com/callback?code=NApCCg..BkWtQ&state=profile%2Factivity',
        //   responseType: [ 'code' ],
        //   state: '34fFs29kd09',
        //   scope: '*',
        //   dialog: 'false',
        // })
        // .exec({
        //   error: function (err) {
        //     console.log(err);
        //   },
        //   success: function (result) {
        //     // console.log(result);
        //   },
        // });
      },
    })
  }
}
