const express = require("express");
const path = require('path');
var cors = require('cors')
const axios = require('axios')
var bodyParser = require('body-parser')
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));

const tg_config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json')))
const TG_TOKEN = tg_config.tg_token
const cachedResults = JSON.parse(fs.readFileSync(path.resolve(__dirname, './cachedresults.json')))


const axiosConfig = {
  headers: { Authorization: `Bearer ${TG_TOKEN}` }
};

const APP_MODE = tg_config.tg_token === "<TG TOKEN>" ? "CACHED" : "LIVE"
console.log("APP MODE: ", APP_MODE)
const patientJourneySubgraphURL = tg_config.tg_patient_journey_subgraph_url
const findSimilarPatientsURL = tg_config.tg_find_similar_patients_url
const findAdHocPatientsURL = tg_config.tg_find_ad_hoc_patient_url

app.get("/get_similar_patients", (req, res) => {
  const patient = req.query.patientid

  if (APP_MODE === "LIVE") {  
    axios.get(findSimilarPatientsURL+"?source="+patient, axiosConfig)  
    .then(resp => {
      return res.json(resp.data.results);
    })
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    })
  }

  else {
    if (cachedResults.patient_similarities.hasOwnProperty(patient)) {
      return res.json(cachedResults.patient_similarities[patient])
    } else {
      return res.json(cachedResults.patient_similarities["patient50"])
    }
  }
  
});

app.post("/create_and_get_similar", (req, res) => {

  var allBag = []
  for (nodeObj of req.body.nodes) {
    if (nodeObj.option) {
      allBag.push(nodeObj.option)
    }
  }
  var bagString = "?"
  for (const [i, v] of allBag.entries()) {
    if (i === 0) {
      bagString += `bagA=${v}`  
    }
    else {
      bagString += `&bagA=${v}`   
    }
    
  }
  if (APP_MODE === "LIVE") {
    axios.get(findAdHocPatientsURL+bagString, axiosConfig)  
    .then(resp => {
      return res.json(resp.data.results);
    })
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    })
  }

  else {
    return res.json(cachedResults.patient_similarities["patient50"])
  }
})

app.get("/get_patient_data", (req, res) => {
  const patient = req.query.patientid
  if (APP_MODE === "LIVE") {
    axios.get(patientJourneySubgraphURL+"?person="+patient, axiosConfig)  
    .then(resp => {
      return res.json(resp.data.results);
    })
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    })
  }

  else {
    if (cachedResults.patient_similarities.hasOwnProperty(patient)) {
      return res.json(cachedResults.patient_subgraph[patient])
    } else {
      return res.json(cachedResults.patient_subgraph["patient50"])
    }
  }  
  
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});