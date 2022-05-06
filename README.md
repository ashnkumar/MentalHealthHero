# Mental Health Hero - Tigergraph Hackathon (Graph for All)
Repository with the source code and data to replicate and run our Mental Health Challenge demo for the Tigergraph Graph for All Hackathon.

See Devpost submission [here](https://devpost.com/software/mental-health-hero) for more details.

https://user-images.githubusercontent.com/5797744/167220869-829194fe-4f99-47a4-a379-4ca6ad31edd1.mp4


### 👉 Step 1: Download our solution from this repository
Download the file **mentalhealthhero.tar.gz** from this repository.


### 👉 Step 2: Import the solution into your instance.
On the Tigergraph console, import the **mentalhealthhero.tar.gz** file into your Tigergraph instance by clicking "Import an Existing Solution".


### 👉 Step 3: Add the data files to your Tigergraph instance
Please unzip the **data.zip** file to download all the CSVs to your comptuer, and then in Tigergraph on the "Map Data" section in Tigergraph, add all those files (with those exact filenames!).

You _may_ need to publish the Design Schema and "Map Data to Graph" areas too.


### 👉 Step 4: Load data into graph
In the "Load Data" section of Graphstudio, press the play icon to load the data.


### 👉 Step 5: Explore the graph
Once the data is loaded, in the Explore Graph section, you can try selecting a few vertices to explore the graph.

Try using the vertex type Person, with Vertex id of "patient17" to see an example!


### 👉 Step 6: Run the mental health treatment plan recommendation query
In the "Write queries" section, install the following queries:
* **find_mental_health_recommendations**
* **find_similar_ad_hoc**
* **patient_journey_subgraph**

Try putting in an example like **patient17** for the "find_mental_health_recommendations" query to find similar patients, who can point to potential recommended treatment plans.


### 👉 Step 7 (optional): Connect our front-end to your instance! ([cached demo site here](https://mental-health-hero.herokuapp.com/))
You'll need to clone this repository down and do some configuration to get the frontend working live on localhost:
1. Clone this repository and go into the `frontenddemo` folder
2. Copy the `configtemplate.json` into a new file called `config.json` in the same root level directory
3. In this `config.json file` change the following:
  a) replace `tg_token` with your Tigergraph API token which you can get by following [these instructions](https://docs.tigergraph.com/tigergraph-server/current/api/built-in-endpoints#_request_a_token)
  b) In Tigergraph Graphstudio, find your URL for the following queries and modify those in the `config.json` file (do NOT include the params - see `configtemplate.json` for examples):
    1. patient_journey_subgraph
    2. find_mental_health_recommendations
    3. find_similar_ad_hoc
  c) Delete the comments in the `config.json` file!
2. Run the following commands to install requirements and launch demo
```
cd MentalHealthHeros
cd frontenddemo
npm install && cd client && npm install
cd ..
npm start

// In new terminal window:
cd client
npm start
```
3. The demo should be running at http://localhost:3000/
