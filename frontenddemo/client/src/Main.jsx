import React from "react";
import Header from './Header'
import moment from 'moment'
import ReactECharts from './ReactECharts.tsx';
import Select from 'react-select'
import ClipLoader from "react-spinners/ClipLoader";

const patientOptions = [
  { value: 'patient50', label: 'Person 1' },
  { value: 'patient133', label: 'Person 2' },
  { value: 'patient154', label: 'Person 3' },
	{ value: 'patient155', label: 'Person 5' }  
]

const patientOptionsMap = 

{ 'patient50': {
		value: 'patient50', label: 'Person 1' }
	,

	"patient133": {
		value: 'patient133', label: 'Person 2' 
	},	

	"patient154": {
		value: 'patient154', label: 'Person 3' 
	},		

	"patient155": {
		value: 'patient155', label: 'Person 5' 
	}

}


const makeTimelineOptions = (timelineData, timelineDatesData) => {
  return {
    xAxis: {
      type: "category",
      data: timelineDatesData,
      boundaryGap: false,
      splitLine: {
        show: true
      },
      axisLine: {
        show: true
      }
    },
    yAxis: {
      type: "category",
      data: ["Tweets", "Voice Entries", "Therapy", "DASS Scores"]
    },
    series: [
      {
        name: "stuff",
        type: "scatter",
        data: timelineData
      }
    ]



  }
}

const makeSubraphOptions = (nodes, edges, isMain) => {
	const categories = [
		{
			"name": "Patient"
		},
		{
			"name": "Tweet"
		},
		{
			"name": "Voice Entry"
		},
		{
			"name": "Therapy Session"
		},
		{
			"name": "DASS Score"
		}													
	]

	var optionsObj = {
    animationDuration: 1500,
    animationEasingUpdate: 'cubicInOut',
    tooltip: {},  
    series: [
      {
        name: 'Patient Graph',
        type: 'graph',
        layout: 'force',
        zoom: 2.0,
        data: nodes,
        links: edges,
        categories: categories,
        roam: true,
        draggable: true,
        force: {
          repulsion: 50,
          gravity: 0.22,
          edgeLength: 20
        },
        label: {
        	show: false,
          position: 'right',
          formatter: '{b}'
        }        
      }
    ],
		color: ["orange", "blue", "green", "purple", "pink"]    
  }

  if (isMain) {
  	optionsObj.legend = [
      {
        data: categories.map(function (a) {
          return a.name;
        })
      }
    ]
  }
  return optionsObj
}


function DemoModeDiv({demoMode, onDemoModeChange}) {

	return (
    <div className="demomodediv">
      <div className="demomodelabeldiv">
        <div className="demomodetext">Demo Mode:</div>
      </div>
      <div onClick={() => onDemoModeChange("existingPatients")} className="existingpatients">
        <div className="existingpatientstext">Use Existing Patients</div>
      </div>
      <div onClick={() => onDemoModeChange("createPatient")} className="existingpatients createpatient">
        <div className="existingpatientstext">Create Test Patient</div>
      </div>
    </div>
	)

}

function MostSimilarPatients({data, loading}) {

	return (
		<React.Fragment>
	    <div className="demomodediv selectpatient mostsimilar">
	      <div className="demomodelabeldiv">
	        <div className="demomodetext">Most similar</div>
	      </div>
	    </div>
	    <div className="mostsimilarmaindiv">
	    	{
	    		data.map((d) => (
	    			<div key={d.pid} className="mostsimilarindividual">
	      			<PatientSubgraph nodes={d.nodes} edges={d.edges} loading={loading} isMain={false}/>
	      		</div>
	    		))
	    	}
	    </div>
	   </React.Fragment>		
	)

}

function PatientSubgraph({nodes, edges, loading, isMain}) {

	const graphOptionsObj = makeSubraphOptions(nodes, edges, isMain)

		if (loading) {
			return (
				<ClipLoader color={"blue"} loading={loading} size={80} />
			)
		}

		return (
			<ReactECharts 
				style={{width: '100%', height: '100%'}} 
				option={graphOptionsObj} />
		)		

}

function PatientTimeline({xAxis, yAxis}) {

	const graphOptionsObj = makeTimelineOptions(yAxis, xAxis)

		return (
			<ReactECharts 
				style={{width: '105%', height: '100%'}} 
				option={graphOptionsObj} />
		)		

}

function MainPatient({data, showingMostSimilar, loading, recommendedTreatment}) {

	if (loading) {
		return (
			<div className="mainpatintdiv">

      <ClipLoader color={"orange"} loading={loading} size={100} />
      </div>
		)
	}
	
	return (
    <div className="mainpatintdiv">
      <div className="patient360div">
        <div className="miniheadre">
          <div className="miniheadertesxt">Mental Health - Patient 360</div>
        </div>
        <div className="mainsubgraphdiv">
        	<PatientSubgraph nodes={data.nodes} edges={data.edges} loading={false} isMain={true}/>
        </div>
        <div className="recommendationdiv">
          { showingMostSimilar && 
          	<div className="recommendationtext">
          		Recommended care plan: <span style={{color: 'red'}}> {recommendedTreatment || 'CBT'}</span>
          	</div> }
        </div>
      </div>
      <div className="patientjourneydiv">
        <div className="miniheadre">
          <div className="miniheadertesxt">Mental Health Journey</div>
        </div>
        <div className="mainjourneydiv">
        	<div className="ppp">
	        	<PatientTimeline xAxis={data.timelineDatesData} yAxis={data.timelineData} />
        	</div>
        </div>
      </div>
    </div>
	)

}

const processRawData = (rawData) => {
	var nodes = []
  var edges = []
  const allDates = []
  const timelineData = []
	const namee = "cust" in rawData ? "cust" : "Others"
  const personNode = {
    name: rawData[namee][0].attributes.id,
    category: 0,
    symbolSize: 25,
    symbol: 'circle',
    itemStyle: {
      color: "orange"
    }
  }
  nodes.push(personNode)
  rawData.tweets.forEach((tweet) => {
    const formattedDate = moment(tweet.attributes.created).format("M/D/YY")
    timelineData.push({
    	symbol: "roundRect",
    	symbolSize: 20,
    	itemStyle: {
    		color: "blue"
    	},
    	value: [formattedDate,0]
    })
    allDates.push(new Date(tweet.attributes.created))
    nodes.push({
      name: tweet.attributes.id,
      value: `Sentiment: ${tweet.attributes["@sentiment"]}`,
      category: 1,
      symbolSize: 8,
      symbol: 'roundRect',
      itemStyle: {
        color: "blue"
      }
    })
  })
  rawData.voiceEntries.forEach((voiceEntry) => {
    const formattedDate = moment(voiceEntry.attributes.created).format("M/D/YY")
    timelineData.push({
    	symbol: "triangle",
    	symbolSize: 20,
    	itemStyle: {
    		color: "green"
    	},
    	value: [formattedDate,1]
    })
    allDates.push(new Date(voiceEntry.attributes.created))
    nodes.push({
      name: voiceEntry.attributes.id,
      value: `Sentiment: ${voiceEntry.attributes["@sentiment"]}`,      
      category: 2,
      symbolSize: 8,
      symbol: 'triangle',
      itemStyle: {
        color: "green"
      }
    })
  })  
  rawData.therapyDiagnoses.forEach((therapySession) => {
    const formattedDate = moment(therapySession.attributes.created).format("M/D/YY")
    timelineData.push({
    	symbol: "diamond",
    	symbolSize: 20,
    	itemStyle: {
    		color: "purple"
    	},
    	value: [formattedDate,2]
    })
    allDates.push(new Date(therapySession.attributes.created))
    nodes.push({
      name: therapySession.attributes.id,
      value: `Attendance: ${therapySession.attributes["@attendance"]}`,      
      category: 3,
      symbol: 'diamond',
      symbolSize: 8,
      itemStyle: {
        color: "purple"
      }      
    })
  })
  rawData.daasSeverities.forEach((daasSeverity) => {
    const formattedDate = moment(daasSeverity.attributes.created).format("M/D/YY")
    timelineData.push({
    	symbol: "rect",
    	symbolSize: 20,
    	itemStyle: {
    		color: "pink"
    	},
    	value: [formattedDate,3]
    })
    allDates.push(new Date(daasSeverity.attributes.created))    
    nodes.push({
      name: daasSeverity.attributes.id,
      category: 4,
      symbolSize: 8,
      value: `Severity: ${daasSeverity.attributes["@dass_severity"]}`,
      symbol: 'rect',
      itemStyle: {
        color: "pink"
      }      
    })
  })  
  rawData["@@edgeSet"].forEach((edge) => {
    edges.push({
      source: edge.from_id,
      target: edge.to_id
    })
  })


  const sortedDates = allDates.sort((a,b) => a - b)
  const momentDates = sortedDates.map((date) => (
    moment(date).format("M/D/YY")
  ))
  return {
    nodes: nodes,
    edges: edges,
    timelineData: timelineData,
    timelineDatesData: momentDates
  }
}

function findMode(array) {
  // This function starts by creating an object where the keys are each unique number of the array and the values are the amount of times that number appears in the array.

  let object = {}

  for (let i = 0; i < array.length; i++) {
    if (object[array[i]]) {
      // increment existing key's value
      object[array[i]] += 1
    } else {
      // make a new key and set its value to 1
      object[array[i]] = 1
    }
  }

  // assign a value guaranteed to be smaller than any number in the array
  let biggestValue = -1
  let biggestValuesKey = -1

  // finding the biggest value and its corresponding key
  Object.keys(object).forEach(key => {
    let value = object[key]
    if (value > biggestValue) {
      biggestValue = value
      biggestValuesKey = key
    }
  })

  return biggestValuesKey

}

const processSimilarPatientData = (rawData) => {

	var finalData = []
	
	const patientIDs = rawData.Others.map((el) => el.v_id)
	const treatments = rawData.Others.map((el) => el.attributes["@treatment"])

	patientIDs.forEach((pid) => {
		var nodes = []
	  var edges = []	

	  const personNode = {
	    name: pid,
	    category: 0,
	    symbolSize: 25,
	    itemStyle: {
	      color: "orange"
	    }
	  }
	  nodes.push(personNode)
		rawData.tweets.forEach((tweet) => {
				if (tweet.attributes["@personid"] === pid) {
			    nodes.push({
			      name: tweet.attributes.id,
			      category: 1,
			      symbolSize: 8,
			      symbol: 'roundRect',
			      itemStyle: {
			        color: "blue"
			      }
			    })			
				}

		  })
		  rawData.voiceEntries.forEach((voiceEntry) => {
				if (voiceEntry.attributes["@personid"] === pid) {
			    nodes.push({
			      name: voiceEntry.attributes.id,
			      category: 2,
			      symbolSize: 8,
			      symbol: 'triangle',
			      itemStyle: {
			        color: "green"
			      }
			    })
			  }
		  })  
		  rawData.therapyDiagnoses.forEach((therapySession) => {
				if (therapySession.attributes["@personid"] === pid) {
			    nodes.push({
			      name: therapySession.attributes.id,
			      category: 3,
			      symbol: 'diamond',
			      symbolSize: 8,
			      itemStyle: {
			        color: "purple"
			      }      
			    })
			  }
		  })
		  rawData.daasSeverities.forEach((daasSeverity) => {
				if (daasSeverity.attributes["@personid"] === pid) {
			    nodes.push({
			      name: daasSeverity.attributes.id,
			      category: 4,
			      symbolSize: 8,
			      symbol: 'rect',
			      itemStyle: {
			        color: "pink"
			      }      
			    })
		  	}
		  })  
		  rawData["@@edgeSet"].forEach((edge) => {
		  	if (edge.from_id === pid) {
					edges.push({
			      source: edge.from_id,
			      target: edge.to_id
		    	})		  		
		  	}
		  })
		  finalData.push({
		  	pid: pid,
		  	nodes: nodes,
		  	edges: edges
		  })	  

	})

	finalData.recommendedTreatment = findMode(treatments)

  return finalData
}


function ExistingPatient() {
	const [currentPatient, setCurrentPatient] = React.useState(patientOptions[0])
	const [currentPatientData, setCurrentPatientData] = React.useState(null)
	const [similarPatientData, setSimilarPatientData] = React.useState(null)
	const [mainPatientloading, setMainPatientLoading] = React.useState(true);
	const [similarPatientsLoading, setSimilarPatientsLoading] = React.useState(true);
	React.useEffect(() => {
		setMainPatientLoading(true)
		setSimilarPatientsLoading(true)
		fetch("/get_patient_data?patientid=" + currentPatient.value)
			.then((res) => res.json())
			.then((data) => {
	
				setCurrentPatientData(processRawData(data[0]))
				setTimeout(() => {
					setMainPatientLoading(false)
				}, 2000)
				fetch("/get_similar_patients?patientid=" + currentPatient.value)
					.then((res) => res.json())
					.then((data) => {
						setSimilarPatientData(processSimilarPatientData(data[0]))
						setTimeout(() => {
								setSimilarPatientsLoading(false)
							}, 4000)
					})
			})

	}, [currentPatient])	


		     // <div className="patientdropdown">
		     // </div>
return (
		<React.Fragment>
		    <div className="demomodediv selectpatient">
		      <div className="demomodelabeldiv">
		        <div className="demomodetext">Select Patient:</div>
		      </div>
		       <Select 
		       	menuPlacement={"bottom"}
		       	minMenuHeight={100}
		       	name="patient"
		       	className="patientdropdown"
		       	defaultValue={patientOptions[0]}
		       	options={patientOptions} 
		       	onChange={(f) => setCurrentPatient(f)}
		       />
		     </div>
		    

		    { currentPatientData &&
		    		<MainPatient 
		    			data={currentPatientData} 
		    			loading={mainPatientloading}
		    			showingMostSimilar={similarPatientData}
		    			recommendedTreatment={similarPatientData ? similarPatientData["recommendedTreatment"] : "TBD"}
		    			 /> }
		    			

		    { similarPatientData && 
		    	<MostSimilarPatients loading={similarPatientsLoading} data={similarPatientData} /> }	
		</React.Fragment>
	)
}

const startingCreateData = {
	nodes: [{
	    name: "create",
	    category: 0,
	    symbolSize: 20,
	    itemStyle: {
	      color: "orange"
	   }
		}
	],
	edges: []
}

function CreateGraphView ({data}) {
	return (
		<PatientSubgraph nodes={data.nodes} edges={data.edges} loading={false} isMain={true} />
	)
}

const symbolMap = {
	"tweet": {
		"color": "blue",
		"style": "rectRound"
	},
	"voiceEntry": {
		"color": "green",
		"style": "triangle"
	},
	"dassSeverity": {
		"color": "rect",
		"style": "pink"
	},
	"therapySession": {
		"color": "purple",
		"style": "diamond"
	}			
}


const sentimentOptions = [
  { value: 'very_sad', label: 'Very Sad' },
  { value: 'sad', label: 'Sad' },
  { value: 'mixed', label: 'Mixed' },
	{ value: 'happy', label: 'Happy' },
	{ value: 'very_happy', label: 'Very Happy' }  	
]

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const sessionAttendances = [
  { value: 'did_attend', label: 'Attended' },
  { value: 'did_not_attend', label: 'Missed' }
]

function CreatePatient() {
	
	const [data, setData] = React.useState(startingCreateData)
	const [idx, setIdx] = React.useState(data.nodes.length)
	const [tweetSentiment, setTweetSentiment] = React.useState(sentimentOptions[0]
		)
	const [voiceEntrySentiment, setVoiceEntrySentiment] = React.useState(sentimentOptions[0])	
	const [dassSeverityScore, setDassSeverityScore] = React.useState(severityOptions[0])		
	const [sessionAttendance, setSessionAttendance] = React.useState(sessionAttendances[0])			
	const [similarPatientData, setSimilarPatientData] = React.useState(null)
	const [similarPatientsLoading, setSimilarPatientsLoading] = React.useState(true);	

	React.useEffect(() => {
		if (data) {
			setIdx(data.nodes.length)	
		}
	}, [data])

	const addNode = ({nodeType, option}) => {
		const nodeId = `${nodeType}${idx}`
		const newNode = {
			name: `${nodeType}${idx}`,
			symbolSize: 15,
			symbol: symbolMap[nodeType].style,
			itemStyle: {
				color: symbolMap[nodeType].color
			},
			option: option
		}

		const newNodes = [...data.nodes, newNode]
		const newEdges = [...data.edges, {
			source: "create",
			target: nodeId
		}]
		setData({...data, nodes: newNodes, edges: newEdges})
	}

	const resetData = () => {
		setData(startingCreateData)
		setSimilarPatientData(null)
	}

	const findSimilarPatients = () => {
		setSimilarPatientsLoading(true)
		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({nodes: data.nodes, edges: data.edges})
		}
		fetch("/create_and_get_similar", fetchOptions)
			.then((res) => res.json())
			.then((data) => {
				setSimilarPatientData(processSimilarPatientData(data[0]))
				setTimeout(() => {
						setSimilarPatientsLoading(false)
					}, 4000)
			})	
	}

	return (
		<React.Fragment>
	    <div className="maincreateareadiv">
	      <div className="createformblock">
	      	 <div onClick={() => resetData()} className="finsimilarpatientsdivreset">
	          <div className="findimilartext">Reset</div>
	        </div>	        
	        <div className="adddiv">

	          <div className="adddivtextdiv">
	            <div className="adddivheadertext">Add Tweet</div>
	          </div>
	          <div className="adddivsubblock">
	            <div className="addivlabel">Sentiment of Tweet:</div>
	            <div className="adddivdropdown">
	            	<Select 
					       	defaultValue={tweetSentiment}
					       	value={tweetSentiment}
					       	options={sentimentOptions} 
					       	onChange={(f) => setTweetSentiment(f)}
					       />
	            </div>
	            <div onClick={() => addNode({nodeType: "tweet", option: tweetSentiment.value})}
	            	className="addbuttn">
	              <div className="addd">ADD</div>
	            </div>
	          </div>
	        </div>
	        <div className="adddiv">
	          <div className="adddivtextdiv">
	            <div className="adddivheadertext">Add Voice Entry</div>
	          </div>
	          <div className="adddivsubblock">
	            <div className="addivlabel">Sentiment of Voice Entry:</div>
	            <div className="adddivdropdown">
	            	<Select 
					       	defaultValue={voiceEntrySentiment}
					       	value={voiceEntrySentiment}
					       	options={sentimentOptions} 
					       	onChange={(f) => setVoiceEntrySentiment(f)}
					       />
	            </div>
	            <div onClick={() => addNode({nodeType: "voiceEntry", option: voiceEntrySentiment.value})}
	            	className="addbuttn">
	              <div className="addd">ADD</div>
	            </div>
	          </div>
	        </div>
	        <div className="adddiv">
	          <div className="adddivtextdiv">
	            <div className="adddivheadertext">Add DASS Score</div>
	          </div>
	          <div className="adddivsubblock">
	            <div className="addivlabel">DASS Severity:</div>
	 	            <div className="adddivdropdown">
	            	<Select 
					       	defaultValue={dassSeverityScore}
					       	value={dassSeverityScore}
					       	options={severityOptions} 
					       	onChange={(f) => setDassSeverityScore(f)}
					       />
	            </div>
	            <div onClick={() => addNode({nodeType: "dassSeverity", option: dassSeverityScore.value})}
	            	className="addbuttn">
	              <div className="addd">ADD</div>
	            </div>
	          </div>
	        </div>
	        <div className="adddiv">
	          <div className="adddivtextdiv">
	            <div className="adddivheadertext">Add Therapy Session</div>
	          </div>
	          <div className="adddivsubblock">
	            <div className="addivlabel">Session Attendance:</div>
	            <div className="adddivdropdown">
	            	<Select 
					       	defaultValue={sessionAttendance}
					       	value={sessionAttendance}
					       	options={sessionAttendances} 
					       	onChange={(f) => setSessionAttendance(f)}
					       />
	            </div>
	            <div onClick={() => addNode({nodeType: "therapySession", option: sessionAttendance.value})}
	            	className="addbuttn">
	              <div className="addd">ADD</div>
	            </div>
	          </div>
	        </div>
	        <div onClick={() => findSimilarPatients()}
	        		className="finsimilarpatientsdiv">
	          <div className="findimilartext">Find Similar Patients</div>
	        </div>

	      </div>
	      <div className="graphcreateviewblock">
	      	{data && 
	      		<CreateGraphView data={data}/>
	      	}
	      	{ similarPatientData && (similarPatientsLoading === false) &&
	      		<div className="recommendationtext">Recommended care plan: {similarPatientData["recommendedTreatment"]}</div>
	      	}
	      </div>
	    </div>


	    { similarPatientData && 
	    	<MostSimilarPatients loading={similarPatientsLoading} data={similarPatientData} /> }		
		</React.Fragment>
	)
}	

export default function Main() {

	const [demoMode, setDemoMode] = React.useState("existingPatients")

	return (
	  <div className="mainarea">
	  	<Header />
	    
	    <DemoModeDiv onDemoModeChange={(t) => setDemoMode(t)} />

	    {
	    	demoMode === "existingPatients"
	    	? <ExistingPatient />
	    	: <CreatePatient />
	    }

	  </div>
	)
}