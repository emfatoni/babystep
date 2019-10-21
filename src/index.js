import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class BSPProjectSum extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		const completeTasks = [];
		const incompleteTasks = [];

		this.props.project.tasks.forEach((task) => {
			if(task.status === 'Done'){
				completeTasks.push(task);
			}else{
				incompleteTasks.push(task);
			}
		});

		const today = new Date();
		const created = new Date(this.props.project.created);
		const finished = new Date(this.props.project.finished);
		let dayLong = 0;

		if(this.props.project.status === 'Done'){
			dayLong = Math.floor((finished.getTime() - created.getTime())/(1000*60*60*24));
		}else{
			dayLong = Math.floor((today.getTime() - created.getTime())/(1000*60*60*24));
		}
		

		return(
			<p className="text-dark">{dayLong} days • {completeTasks.length} of {this.props.project.tasks.length} tasks completed.</p>
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
					<h5 className="card-title">{this.props.project.name}</h5>
					<p className="card-text">{this.props.project.description}</p>
					<BSPProjectSum project={this.props.project} />
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
		if(this.props.task.status === 'Done'){
			return(
				<div className="card mb-3">
					<div className="card-body clearfix">
						<p className="card-text float-left pt-2"><del>{this.props.task.name}</del></p>
						<div className="float-right">
							<button className="btn" title="Undone"><i className="material-icons">undo</i></button>
							<button className="btn" title="Delete"><i className="material-icons">clear</i></button>
						</div>
					</div>
				</div>
			);
		}else{
			return(
				<div className="card mb-3">
					<div className="card-body clearfix">
						<p className="card-text float-left pt-2">{this.props.task.name}</p>
						<div className="float-right">
							<button className="btn" title="Done"><i className="material-icons">done</i></button>
							<button className="btn" title="Delete"><i className="material-icons">clear</i></button>
						</div>
					</div>
				</div>
			);
		}
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
					<div className="col-md-9 mb-3">
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
				<button className="btn btn-primary mr-2" title="Edit" data-toggle="modal" data-target="#formEditProject">Edit</button>
	            <button className="btn btn-danger mr-2" title="Delete">Delete</button>
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


class BSPUndoneProject extends React.Component{
	constructor(props){
		super(props);

		this.makeAlert = this.makeAlert.bind(this);
	}

	makeAlert(){
		console.log("Hei!");
	}

	render(){
		const cards = [];

		this.props.projects.forEach((project) => {
			cards.push(<BSPProjectCard project={project} onClick={this.makeAlert} />);
		});

		return(
			<div className="col-md-4 mb-5">
				<h2 className="mb-5">Let's do it today!</h2>
				{cards}
			</div>
		);
	}
}


class BSPDoneProject extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		const cards = [];

		this.props.projects.forEach((project) => {
			cards.push(<BSPProjectCard project={project} />);
		});

		return(
			<div className="col-md-4 mb-5">
				<h2 className="mb-5">Done today.</h2>
				{cards}
			</div>
		);
	}
}


class BSPHome extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		const doneProjects = [];
		const undoneProjects = [];

		this.props.projects.forEach((project) => {
			if(project.status === 'In Progress'){
				const updated = new Date(project.updated);
				const today = new Date();

				if(updated.getTime() >= today.getTime()){
					doneProjects.push(project);
				}else{
					undoneProjects.push(project);
				}
			}
		});

		return(
			<div className="row justify-content-center">
				<BSPUndoneProject projects={undoneProjects} gotoDetailed={this.props.gotoDetailed} />
				<BSPDoneProject projects={doneProjects} gotoDetailed={this.props.gotoDetailed} />
			</div>
		);
	}
}


class BSPAchievement extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		const completeProjects = [];

		this.props.projects.forEach((project) => {
			if(project.status === 'Done'){
				completeProjects.push(
					<div className="col-md-4">
						<BSPProjectCard project={project} />
					</div>
				);
			}
		});

		return(
			<div className="row py-5">
				<div className="col-md-12 mb-5">
					<h1>Congratulations! This is what you've tackle so far.</h1>
					<a href="home" className="text-muted" onClick={this.props.gotoHome} >Back to home</a>
				</div>

				{completeProjects}
			</div>
		);
	}
}


class BSPDetailProject extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		const tasks = [];

		this.props.project.tasks.forEach((task) => {
			tasks.push(<BSPProjectTask task={task} />);
		});

		return(
			<div className="row py-5">
				<div className="col-md-12 mb-5">
					<h3>Do it one small step at a time so you can done it easily.</h3>
					<a href="home" className="text-muted">Back to home</a>
				</div>

				<div className="col-md-6 mb-5">
					<BSPProjectCard project={this.props.project} />
					<BSPEditProject />
				</div>

				<div className="col-md-6">
					<h5 className="mb-3">List of small tasks</h5>
					{tasks}
					<BSPTaskForm />
				</div>
			</div>
		);
	}
}

class BSPNavbar extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<nav className="navbar navbar-dark bg-primary navbar-expand-lg">
					<div className="container">
						<a onClick={this.props.gotoHome} href="home" ><span className="navbar-brand" title="Home">Baby Step Project</span></a>

						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarItem">
							<span className="navbar-toggler-icon"></span>
						</button>

						<div className="collapse navbar-collapse justify-content-end mt-2" id="navbarItem">
							<ul className="nav justify-content-end">
								<li className="nav-item" title="Save"><button className="btn btn-primary"><i className="material-icons">save</i></button></li>
								<li className="nav-item" title="Achievements"><button href="achievements" className="btn btn-primary" onClick={this.props.gotoAchievements} ><i className="material-icons">emoji_events</i></button></li>
								<li className="nav-item" title="Add Project"><button className="btn btn-primary" data-toggle="modal" data-target="#formAddProject"><i className="material-icons">note_add</i></button></li>
								<li className="nav-item">
									<form className="form-inline ml-2">
										<input type="text" name="" className="form-control" placeholder="Search here..." />
									</form>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<BSPAddProject />
			</div>
		);
	}
}


class BSPMiniDashboard extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		const completeProjects = [];
		const incompleteProjects = [];

		this.props.projects.forEach((project) => {
			if(project.status === 'Done'){
				completeProjects.push(project);
			}else{
				incompleteProjects.push(project);
			}
		});


		return(
			<div className="jumbotron bg-light">
				<div className="container">
					<h1 className="display-4">You've completed {completeProjects.length} projects,<br />now do the remaining {incompleteProjects.length}, one step at a time</h1>
				</div>
			</div>
		);
	}
}


class BSPFooter extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<footer className="bg-light py-5">
				<div className="container text-center">
					<p className="m-0">© 2019 M Fatoni</p>
				</div>
			</footer>
		);
	}
}


class BSPApps extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			page: 'home',
			detailedProject: null,
			searchText: null
		};

		this.gotoAchievements = this.gotoAchievements.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.gotoDetailed = this.gotoDetailed.bind(this);
	}

	gotoAchievements(){
		this.setState({page: 'achievements'});
	}

	gotoHome(){
		this.setState({page: 'home'});
	}

	gotoDetailed(){
		alert('go to detailed');
	}

	render(){
		let projects = [];
		const tasks = this.props.tasks;

		this.props.projects.forEach((project) => {
			let newProject = project;
			newProject.tasks = [];

			tasks.forEach((task) => {
				if(task.project_id === newProject.id){
					newProject.tasks.push(task);
				}
			});

			projects.push(newProject);
		});


		if(this.state.page === 'home'){
			return(
				<div>
					<BSPNavbar gotoAchievements={this.gotoAchievements} gotoHome={this.gotoHome} />
					<BSPMiniDashboard projects={projects} />

					<div className="container">
						<BSPHome projects={projects} gotoDetailed={this.gotoDetailed} />
					</div>
					<BSPFooter />
				</div>
			);
		}else if(this.state.page === 'achievements'){
			return(
				<div>
					<BSPNavbar />
					<div className="container">
						<BSPAchievement projects={projects} gotoHome={this.gotoHome} />
					</div>
					<BSPFooter />
				</div>
			);
		}else if(this.state.page === 'detailed'){

			if(this.state.detailedProject === null){
				return null;
			}else{
				const project = projects.find(p => p.id === this.state.detailedProject);
			
				return(
					<div>
						<BSPNavbar />
						<div className="container">
							<BSPDetailProject project={project} />
						</div>
						<BSPFooter />
					</div>
				);
			}
			
		}else{
			return null;
		}
		
	}
}


let projects = [
	{id: '1', name: 'Baby Step Project', created: '2019-09-01', updated: '2019-10-20', status: 'In Progress', description: 'Project membuat aplikasi project. Menggunakan framework mini habit, yaitu mengerjakan project one step at atime', finished: null},
	{id: '2', name: 'Cerpen SUAMI', created: '2019-10-10', updated: '2019-10-21', status: 'In Progress', description: 'Project membuat cerita pendek. Menceritakan tentang pasangan LDM yang diganggu genderuwo.', finished: null},
	{id: '3', name: 'Cerpen ala Lovecraft', created: '2019-07-31', updated: '2019-09-20', status: 'Done', description: 'Project membuat cerita pendek. Ceritanya bergenre horor kosmik dan gaya penulisannya menirukan Lovecraft.', finished: '2019-09-01'}
];

let tasks = [
	{id: '1', project_id: '1', name: 'Install React-js', status: 'Done', created: '2019-10-01'},
	{id: '2', project_id: '1', name: 'Sampling data', status: 'Undone', created: '2019-10-10'},
	{id: '3', project_id: '2', name: 'Scene #1', status: 'Done', created: '2019-10-11'},
	{id: '4', project_id: '2', name: 'Scene #2', status: 'Undone', created: '2019-10-12'},
	{id: '5', project_id: '3', name: 'Paragraf #1', status: 'Done', created: '2019-08-11'},
	{id: '6', project_id: '3', name: 'Paragraf #2', status: 'Done', created: '2019-08-12'}
];


ReactDOM.render(
  <BSPApps 
  	projects={projects}
  	tasks={tasks}
  />,
  document.getElementById('root')
);