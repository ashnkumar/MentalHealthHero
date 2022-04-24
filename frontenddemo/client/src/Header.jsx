import React from "react";

export default function Header () {
	return (

	    <div className="header">
	      <div className="headertext">Mental Health Hero (TigerGraph Demo)</div>
	      <div className="subheaders">This is a demo for TigerGraph&#x27;s Graph for All Challenge! Check out more <a href="https://devpost.com/software/mental-health-hero" target="_blank">project details here</a>.<br />Mental Health Hero uses graph technology to help improve accessibility for mental health treatment.</div>
	      <div className="subheader2"><strong className="subsubheadertext">Note: To avoid cloud charges, this demo uses a cached version of the graph data. You can set up a local demo pointing to your TigerGraph instance by following the directions </strong>
	        <a href="https://github.com/ashnkumar/MentalHealthHero" target="_blank"><strong>here</strong></a><strong>.</strong> 
	      </div>
	    </div>
	)
}