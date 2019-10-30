import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class BSPProjectSum extends React.Component {
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

			if(dayLong < 0){
				dayLong = 0;
			}
		}
		

		return(
			<p className="text-dark">{dayLong} days • {completeTasks.length} of {this.props.project.tasks.length} tasks completed.</p>
		);
	}
}

class BSPProjectCard extends React.Component{
	render(){
		return(
			<div className="card bg-warning mb-3" title="A Project">
				<div className="card-body text-light">
					<a href="detailed" className="text-dark" onClick={(e) => this.props.gotoDetailed(this.props.project.id, e)} ><h5 className="card-title">{this.props.project.name}</h5></a>
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

		this.delTask = this.delTask.bind(this);
		this.doneTask = this.doneTask.bind(this);
	}

	delTask(){
		this.props.delProjectTask(this.props.project.id, this.props.task.id);
	}

	doneTask(){
		let aTask = this.props.task;
		let aProject = this.props.project;

		if(aTask.status === 'Done'){
			aTask.status = 'Undone';

			const isThere = aProject.tasksDoneToday.find(t => t.id === aTask.id);

			if(isThere !== undefined){

				let tempTasks = aProject.tasksDoneToday.filter(t => t.id !== aTask.id);

				aProject.tasksDoneToday = tempTasks;

			}
		}else{
			aTask.status = 'Done';

			aProject.tasksDoneToday.push(aTask);
		}

		if(aProject.tasksDoneToday.length > 0){
			const today = new Date();

			aProject.updated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		}else{
			aProject.updated = aProject.oldUpdated;
		}

		this.props.doneProjectTask(this.props.project.id, aTask);

		this.props.editDetailedProject(aProject);
	}

	render(){
		const isCompleteButton = (this.props.task.status === 'Done')?"undo":"done";
		const taskName = (this.props.task.status === 'Done')?<del>{this.props.task.name}</del>:this.props.task.name;
		const isDone = (this.props.task.status === 'Done')?"Undone":"Done";

		let actionButton = null;

		if(this.props.project.status !== 'Done'){
			actionButton = (
				<div className="float-right">
					<button className="btn" title={isDone} onClick={this.doneTask} ><i className="material-icons">{isCompleteButton}</i></button>
					<button className="btn" title="Delete" onClick={this.delTask} ><i className="material-icons">clear</i></button>
				</div>
			);
		}
		
		return(
			<div className="card mb-3">
				<div className="card-body clearfix">
					<p className="card-text float-left pt-2">{taskName}</p>
					{actionButton}
				</div>
			</div>
		);
	}
}

class BSPTaskForm extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			taskName: ''
		};

		this.addTask = this.addTask.bind(this);
		this.fillTaskName = this.fillTaskName.bind(this);
	}

	addTask(e){
		e.preventDefault();
		const today = new Date();

		const newTaskID = this.props.getNextTaskId(this.props.project.id);

		let aTask = {
			id: ''+newTaskID,
			project_id: this.props.project.id,
			name: this.state.taskName,
			created: ''+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
			status: 'Undone'
		};

		this.props.addProjectTask(this.props.project.id, aTask);

		this.setState({taskName: ''});
	}

	fillTaskName(e){
		this.setState({
			taskName: e.target.value
		});
	}

	render(){
		return(
			<form className="bg-light px-3 pt-3">
				<div className="form-row">
					<div className="col-md-9 mb-3">
						<input type="text" className="form-control" placeholder="Small task..." onChange={this.fillTaskName} value={this.state.taskName} />
					</div>
					<div className="col-md-3 mb-3">
						<button className="btn btn-primary col" onClick={this.addTask} >Add</button>
					</div>
				</div>
			</form>
		);
	}
}

class BSPEditProject extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			projectName: this.props.project.name,
			projectDesc: this.props.project.description
		};

		this.editProject = this.editProject.bind(this);
		this.fillProjectName = this.fillProjectName.bind(this);
		this.fillProjectDesc = this.fillProjectDesc.bind(this);
		this.completeProject = this.completeProject.bind(this);
		this.uncompleteProject = this.uncompleteProject.bind(this);
		this.delProject = this.delProject.bind(this);
		this.validateEdit = this.validateEdit.bind(this);
	}

	validateEdit(){
		if(this.state.projectName === ''){
			alert("Project name is mandatory");
			return false;
		}else if(this.state.projectDesc === ''){
			alert("Project description is mandatory");
			return false;
		}else if(this.state.projectDesc.length < 100){
			alert("Description is should be 100 characters at least.");
			return false;
		}else{
			return true;
		}
	}

	fillProjectName(e){
		this.setState({
			projectName: e.target.value
		});
	}

	fillProjectDesc(e){
		this.setState({
			projectDesc: e.target.value
		});
	}

	editProject(e){
		e.preventDefault();

		let aProject = this.props.project;

		if(this.validateEdit()){
			aProject.name = this.state.projectName;
			aProject.description = this.state.projectDesc;

			this.props.refreshDetailedPage(aProject.id);
		}

		this.setState({
			projectName: this.props.project.name,
			projectDesc: this.props.project.description
		});
	}

	completeProject(){
		let aProject = this.props.project;
		const today = new Date();

		aProject.status = 'Done';
		aProject.finished = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		this.props.editDetailedProject(aProject);
	}

	uncompleteProject(){
		let aProject = this.props.project;

		aProject.status = 'In Progress';
		aProject.finished = null;

		this.props.editDetailedProject(aProject);
	}

	delProject(e){
		let aProject = this.props.project;

		this.props.delDetailedProject(aProject);

		this.props.gotoHome(e);
	}

	render(){
		const editButton = (this.props.project.status === 'Done')?null:<button className="btn btn-primary mr-2" title="Edit" data-toggle="modal" data-target="#formEditProject">Edit</button>;
		const completeButton = (this.props.project.status === 'Done')?<button className="btn btn-success" title="Undo Complete Project" onClick={this.uncompleteProject} >Undo</button>:<button className="btn btn-success" title="Complete Project" onClick={this.completeProject} >It's Complete!</button>;

		return(
			<div>
				{editButton}
	            <button className="btn btn-danger mr-2" title="Delete" onClick={this.delProject} >Delete</button>
	            {completeButton}

				<div className="modal fade" id="formEditProject" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Project</h5>
							</div>
							<div className="modal-body">
								<form onSubmit={this.editProject} >
									<div className="form-group">
										<label className="col-form-label">Project Name</label>
										<input type="text" className="form-control" value={this.state.projectName} onChange={this.fillProjectName} />
									</div>
									<div className="form-group">
										<label className="col-form-label">Description</label>
										<textarea className="form-control" rows="3" placeholder="Three sentences is good..." value={this.state.projectDesc} onChange={this.fillProjectDesc} ></textarea>
										<span>{this.state.projectDesc.length} characters</span>
									</div>
								</form>
							</div>
							<div className="modal-footer">
								<button className="btn btn-success" onClick={this.editProject} >Save</button>
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

		this.state = {
			projectName: '',
			projectDesc: ''
		}

		this.addProject = this.addProject.bind(this);
		this.fillProjectName = this.fillProjectName.bind(this);
		this.fillProjectDesc = this.fillProjectDesc.bind(this);
		this.validate = this.validate.bind(this);
	}

	validate(){
		if(this.state.projectName === ''){
			alert("Project name is mandatory");
			return false;
		}else if(this.state.projectDesc === ''){
			alert("Project description is mandatory");
			return false;
		}else if(this.state.projectDesc.length < 100){
			alert("Description is should be 100 characters at least.");
			return false;
		}else{
			return true;
		}
	}

	fillProjectName(e){
		this.setState({
			projectName: e.target.value
		});
	}

	fillProjectDesc(e){
		this.setState({
			projectDesc: e.target.value
		});
	}

	addProject(){
		const newID = this.props.getNextProjectId();
		const today = new Date();

		let aProject = {
			id: ''+newID,
			name: this.state.projectName,
			created: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
			updated: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-1),
			status: 'In Progress',
			description: this.state.projectDesc,
			finished: null,
			tasks: [],
			tasksDoneToday: []
		}

		if(this.validate()){
			this.props.addNewProject(aProject);

			this.setState({
				projectName: '',
				projectDesc: ''
			});
		}
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
									<input type="text" className="form-control" value={this.state.projectName} onChange={this.fillProjectName} />
								</div>
								<div className="form-group">
									<label className="col-form-label">Description</label>
									<textarea className="form-control" rows="3" placeholder="Three sentences is good..." value={this.state.projectDesc} onChange={this.fillProjectDesc} ></textarea>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button className="btn btn-success" onClick={this.addProject} >Save</button>
							<button className="btn btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


class BSPHome extends React.Component{
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

		const doneProjectsCards = doneProjects.map((project) =>
			<BSPProjectCard key={project.id} project={project} gotoDetailed={this.props.gotoDetailed} />
		);

		const undoneProjectsCards = undoneProjects.map((project) =>
			<BSPProjectCard key={project.id} project={project} gotoDetailed={this.props.gotoDetailed} />
		);

		return(
			<div className="row justify-content-center">
				<div className="col-md-4 mb-5">
					<h2 className="mb-5">Let's do it today!</h2>
					{undoneProjectsCards}
				</div>
				<div className="col-md-4 mb-5">
					<h2 className="mb-5">Done today.</h2>
					{doneProjectsCards}
				</div>
			</div>
		);
	}
}


class BSPAchievement extends React.Component{
	render(){
		const completeProjects = [];

		this.props.projects.forEach((project) => {
			if(project.status === 'Done'){
				completeProjects.push(
					<div className="col-md-4" key={project.id}>
						<BSPProjectCard project={project} gotoDetailed={this.props.gotoDetailed} />
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


class BSPSearchResult extends React.Component{
	render(){
		const searchResult = [];

		this.props.projects.forEach((project) => {
			const byName = (project.name.toUpperCase()).indexOf(this.props.searchText.toUpperCase());
			const byDesc = (project.description.toUpperCase()).indexOf(this.props.searchText.toUpperCase());

			if((byName !== -1) || (byDesc !== -1)){
				searchResult.push(project);
			}
		});


		const searchResultCards = searchResult.map((project) =>
			<div className="col-md-4" key={project.id} >
				<BSPProjectCard project={project} gotoDetailed={this.props.gotoDetailed} />
			</div>
		);

		return(
			<div className="row py-5">
				<div className="col-md-12 mb-5">
					<h1>Is this what you search?</h1>
					<a href="home" className="text-muted" onClick={this.props.gotoHome} >Back to home</a>
				</div>

				{searchResultCards}
			</div>
		);
	}
}


class BSPDetailProject extends React.Component{
	render(){
		const tasks = this.props.project.tasks.map((task) => 
			<BSPProjectTask task={task} key={task.id} project={this.props.project} delProjectTask={this.props.delProjectTask} doneProjectTask={this.props.doneProjectTask} editDetailedProject={this.props.editDetailedProject} />
		);

		const taskForm = (this.props.project.status === 'Done')?null:<BSPTaskForm project={this.props.project} addProjectTask={this.props.addProjectTask} getNextTaskId={this.props.getNextTaskId} />;

		return(
			<div className="row py-5">
				<div className="col-md-12 mb-5">
					<h3>Do it one small step at a time so you can done it easily.</h3>
					<a href="home" className="text-muted" onClick={this.props.gotoHome} >Back to home</a>
				</div>

				<div className="col-md-6 mb-5">
					<BSPProjectCard project={this.props.project} gotoDetailed={this.props.gotoDetailed} />
					<BSPEditProject project={this.props.project} editDetailedProject={this.props.editDetailedProject} delDetailedProject={this.props.delDetailedProject} gotoHome={this.props.gotoHome} refreshDetailedPage={this.props.refreshDetailedPage} />
				</div>

				<div className="col-md-6">
					<h5 className="mb-3">List of small tasks</h5>
					{tasks}
					{taskForm}
				</div>
			</div>
		);
	}
}

class BSPNavbar extends React.Component{
	constructor(props){
		super(props);

		this.fillSearchText = this.fillSearchText.bind(this);
	}

	fillSearchText(e){
		this.props.fillSearchText(e.target.value);
	}


	render(){
		return(
			<div>
				<nav className="navbar navbar-dark bg-primary navbar-expand-lg">
					<div className="container">
						<a href="home" onClick={this.props.gotoHome} ><span className="navbar-brand" title="Home">Baby Step Project</span></a>

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
										<input type="text" className="form-control" placeholder="Search here..." value={this.props.searchText} onChange={this.fillSearchText} />
									</form>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<BSPAddProject getNextProjectId={this.props.getNextProjectId} addNewProject={this.props.addNewProject} />
			</div>
		);
	}
}


class BSPMiniDashboard extends React.Component{
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

		let projects = [];
		const tasks = this.props.tasks;

		this.props.projects.forEach((project) => {
			let newProject = project;
			newProject.tasks = [];
			newProject.tasksDoneToday = [];
			newProject.oldUpdated = project.updated;

			tasks.forEach((task) => {
				if(task.project_id === newProject.id){
					newProject.tasks.push(task);
				}
			});

			projects.push(newProject);
		});

		this.state = {
			page: 'home',
			detailedProject: null,
			searchText: '',
			projects: projects
		};

		this.gotoAchievements = this.gotoAchievements.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.gotoDetailed = this.gotoDetailed.bind(this);

		this.addProjectTask = this.addProjectTask.bind(this);
		this.getNextTaskId = this.getNextTaskId.bind(this);
		this.delProjectTask = this.delProjectTask.bind(this);
		this.doneProjectTask = this.doneProjectTask.bind(this);

		this.addNewProject = this.addNewProject.bind(this);
		this.getNextProjectId = this.getNextProjectId.bind(this);
		this.editDetailedProject = this.editDetailedProject.bind(this);
		this.delDetailedProject = this.delDetailedProject.bind(this);

		this.fillSearchText = this.fillSearchText.bind(this);

		this.refreshDetailedPage = this.refreshDetailedPage.bind(this);
	}

	fillSearchText(text){

		if(text === ''){
			this.setState({
				searchText: text,
				page: 'home'
			});
		}else{
			this.setState({
				searchText: text,
				page: 'search'
			});
		}

		
	}

	gotoAchievements(e){
		e.preventDefault();
		this.setState({
			page: 'achievements',
			detailedProject: null
		});
	}

	gotoHome(e){
		e.preventDefault();
		this.setState({
			page: 'home',
			detailedProject: null
		});
	}

	gotoDetailed(project_id, e){
		e.preventDefault();
		
		this.setState({
			page: 'detailed',
			detailedProject: project_id
		});
	}

	refreshDetailedPage(project_id){
		this.setState({
			page: 'detailed',
			detailedProject: project_id
		});
	}

	addProjectTask(project_id, task){
		let projectTemp = this.state.projects;
		let aProject = projectTemp.find(p => p.id === project_id);
		aProject.tasks.push(task);

		this.setState({projects: projectTemp});
	}

	addNewProject(newProject){
		let tempProjects = this.state.projects;

		tempProjects.push(newProject);

		this.setState({
			projects: tempProjects
		});
	}

	editDetailedProject(editedProject){
		let projectTemp = this.state.projects.filter(p => p.id !== editedProject.id);
		projectTemp.push(editedProject);

		projectTemp.sort((a, b) => (a.id > b.id) ? 1 : -1);

		this.setState({projects: projectTemp});
	}

	delDetailedProject(deletedProject){
		let projectTemp = this.state.projects.filter(p => p.id !== deletedProject.id);

		this.setState({projects: projectTemp});
	}

	getNextTaskId(project_id){
		let aProject = this.state.projects.find(p => p.id === project_id);
		let maxID = 0;

		aProject.tasks.forEach((task) => {
			if(Number(task.id) > maxID){
				maxID = Number(task.id);
			}
		});

		return (maxID+1);
	}

	getNextProjectId(){
		let maxID = 0;

		this.state.projects.forEach((project) => {
			if(Number(project.id) > maxID){
				maxID = Number(project.id);
			}
		});

		return (maxID+1);
	}

	delProjectTask(project_id, task_id){
		let tempProjects = this.state.projects;
		let aProject = tempProjects.find(p => p.id === project_id);
		let newProjectTasks = aProject.tasks.filter(t => t.id !== task_id);

		aProject.tasks = newProjectTasks;

		this.setState({projects: tempProjects});
	}

	doneProjectTask(project_id, aTask){
		let tempProjects = this.state.projects;
		let aProject = tempProjects.find(p => p.id === project_id);
		let tempTasks = aProject.tasks.filter(t => t.id !== aTask.id);

		tempTasks.push(aTask);
		
		tempTasks.sort((a, b) => (a.id > b.id) ? 1 : -1);

		this.setState({projects: tempProjects});
	}

	render(){
		const navbar = <BSPNavbar gotoAchievements={this.gotoAchievements} gotoHome={this.gotoHome} getNextProjectId={this.getNextProjectId} addNewProject={this.addNewProject} fillSearchText={this.fillSearchText} searchText={this.state.searchText} />;
		const footer = <BSPFooter />;
		const minidashboard = (this.state.page === 'home')?<BSPMiniDashboard projects={this.state.projects} />:null;
		let content = null;

		if(this.state.page === 'home'){
			content = <BSPHome projects={this.state.projects} gotoDetailed={this.gotoDetailed} />;
		}else if(this.state.page === 'achievements'){
			content = <BSPAchievement projects={this.state.projects} gotoHome={this.gotoHome} gotoDetailed={this.gotoDetailed} />;
		}else if(this.state.page === 'detailed'){
			if(this.state.detailedProject === null){
				content = null;
			}else{

				content = <BSPDetailProject 
					project={this.state.projects.find(p => p.id === this.state.detailedProject)} 
					gotoHome={this.gotoHome} 
					gotoDetailed={this.gotoDetailed} 
					addProjectTask={this.addProjectTask} 
					getNextTaskId={this.getNextTaskId}
					delProjectTask={this.delProjectTask}
					doneProjectTask={this.doneProjectTask}
					editDetailedProject={this.editDetailedProject}
					delDetailedProject={this.delDetailedProject}
					refreshDetailedPage={this.refreshDetailedPage}
				/>;
			}
		}else if(this.state.page === 'search'){
			content = <BSPSearchResult gotoHome={this.gotoHome} projects={this.state.projects} gotoDetailed={this.gotoDetailed} searchText={this.state.searchText} />
		}

		return(
			<div>
				{navbar}
				{minidashboard}
				<div className="container">
					{content}
				</div>
				{footer}
			</div>
		);
		
	}
}


let projects = [
	{id: '1', name: 'Baby Step Project', created: '2019-09-01', updated: '2019-10-20', status: 'In Progress', description: 'Project membuat aplikasi project. Menggunakan framework mini habit, yaitu mengerjakan project one step at atime', finished: null},
	{id: '2', name: 'Cerpen SUAMI', created: '2019-10-10', updated: '2019-10-23', status: 'In Progress', description: 'Project membuat cerita pendek. Menceritakan tentang pasangan LDM yang diganggu genderuwo.', finished: null},
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