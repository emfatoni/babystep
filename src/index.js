import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class BSPProjectSum extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<p className="text-dark">26 days • 3 of 8 tasks completed.</p>
		);
	}
}

class BSPProjectCard extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="card bg-warning mb-3" title="A Project">
				<div className="card-body text-light">
					<h5 className="card-title">A Project</h5>
					<p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
					<BSPProjectSum />
				</div>
			</div>
		);
	}
}

class BSPProjectTask extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="card mb-3">
				<div className="card-body clearfix">
					<p className="card-text float-left pt-2">A Small Task</p>
					<div className="float-right">
						<button className="btn" title="Done"><i className="material-icons">done</i></button>
						<button className="btn" title="Delete"><i className="material-icons">clear</i></button>
					</div>
				</div>
			</div>
		);
	}
}

class BSPTaskForm extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<form className="bg-light px-3 pt-3">
				<div className="form-row">
					<div class="col-md-9 mb-3">
						<input type="text" className="form-control" placeholder="Small task..." />
					</div>
					<div className="col-md-3 mb-3">
						<button className="btn btn-primary col">Add</button>
					</div>
				</div>
			</form>
		);
	}
}