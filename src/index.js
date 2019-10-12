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

class BSPEditProject extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<button className="btn btn-primary" title="Edit" data-toggle="modal" data-target="#formEditProject">Edit</button>
	            <button className="btn btn-danger" title="Delete">Delete</button>
	            <button className="btn btn-success" title="Complete Project">It's Complete!</button>

				<div className="modal fade" id="formEditProject" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Project</h5>
							</div>
							<div className="modal-body">
								<form>
									<div className="form-group">
										<label className="col-form-label">Project Name</label>
										<input type="text" className="form-control" />
									</div>
									<div className="form-group">
										<label className="col-form-label">Description</label>
										<textarea className="form-control" rows="3" placeholder="Three sentences is good..."></textarea>
									</div>
								</form>
							</div>
							<div className="modal-footer">
								<button className="btn btn-success">Save</button>
								<button className="btn btn-danger" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


class BSPAddProject extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="modal fade" id="formAddProject" tabIndex="-1" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Add New Project</h5>
						</div>
						<div className="modal-body">
							<form>
								<div className="form-group">
									<label className="col-form-label">Project Name</label>
									<input type="text" className="form-control" />
								</div>
								<div className="form-group">
									<label className="col-form-label">Description</label>
									<textarea className="form-control" rows="3" placeholder="Three sentences is good..."></textarea>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button className="btn btn-success">Save</button>
							<button className="btn btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}