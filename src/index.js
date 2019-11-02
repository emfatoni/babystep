import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// a component to show project summary in a project card
class BSPProjectSum extends React.Component {
	render(){
		const completeTasks = [];
		const incompleteTasks = [];

		// filter completed tasks and incomplete tasks
		this.props.project.tasks.forEach((task) => {
			if(task.status === 'Done'){
				completeTasks.push(task);
			}else{
				incompleteTasks.push(task);
			}
		});

		// count how old a project since it's created
		const today = new Date();
		today.setHours(0, 0, 0, 0);

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

// a component to show project card
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

// a component to show a project small task
class BSPProjectTask extends React.Component{
	constructor(props){
		super(props);

		this.delTask = this.delTask.bind(this);
		this.doneTask = this.doneTask.bind(this);
	}

	// delete a task function
	delTask(){
		const tempTasks = this.props.project.tasks.filter(t => t.id !== this.props.task.id);
		this.props.project.tasks = tempTasks;

		this.props.refreshDetailedPage(this.props.project.id);
	}

	// done/undone a task function
	doneTask(){
		let aTask = this.props.task;
		let aProject = this.props.project;

		if(aTask.status === 'Done'){

			aTask.status = 'Undone';

			// delete undone task from done task today list
			const isThere = aProject.tasksDoneToday.find(t => t.id === aTask.id);

			if(isThere !== undefined){

				const tempTasks = aProject.tasksDoneToday.filter(t => t.id !== aTask.id);

				aProject.tasksDoneToday = tempTasks;

			}
		}else{

			aTask.status = 'Done';

			// a done task to done task today list
			aProject.tasksDoneToday.push(aTask);
		}

		// update project updated date
		if(aProject.tasksDoneToday.length > 0){
			const today = new Date();

			aProject.updated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		}else{
			aProject.updated = aProject.oldUpdated;
		}

		this.props.refreshDetailedPage(aProject.id);
	}

	render(){
		// for action icon
		const isCompleteButton = (this.props.task.status === 'Done')?"undo":"done";

		// for task name
		const taskName = (this.props.task.status === 'Done')?<del>{this.props.task.name}</del>:this.props.task.name;

		// for button title
		const isDone = (this.props.task.status === 'Done')?"Undone":"Done";

		let actionButton = null;

		// show action button based on task status
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

// a component of add task form
class BSPTaskForm extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			taskName: ''
		};

		this.addTask = this.addTask.bind(this);
		this.fillTaskName = this.fillTaskName.bind(this);
		this.getNextTaskId = this.getNextTaskId.bind(this);
	}

	// get next task id in a project
	getNextTaskId(){
		let maxID = 0;

		this.props.project.tasks.forEach((task) => {
			if(Number(task.id) > maxID){
				maxID = Number(task.id);
			}
		});

		return (maxID+1);
	}

	// add task function
	addTask(e){
		e.preventDefault();
		const today = new Date();

		// to get new task ID
		const newTaskID = this.getNextTaskId();

		let aTask = {
			id: ''+newTaskID,
			project_id: this.props.project.id,
			name: this.state.taskName,
			created: ''+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
			status: 'Undone'
		};

		
		this.props.project.tasks.push(aTask);

		this.props.refreshDetailedPage(this.props.project.id);

		this.setState({taskName: ''});
	}

	// to change task name state
	fillTaskName(e){
		this.setState({
			taskName: e.target.value
		});
	}

	render(){
		return(
			<form className="bg-light px-3 pt-3" onSubmit={this.addTask} >
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

// a component of edit project button and form
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
		this.validateDone = this.validateDone.bind(this);
	}

	// edit project validation
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

	// done project validation
	validateDone(){
		const tasks = this.props.project.tasks;
		return  tasks.every(p => p.status === 'Done');
	}

	// change project name state
	fillProjectName(e){
		this.setState({
			projectName: e.target.value
		});
	}

	// change project description state
	fillProjectDesc(e){
		this.setState({
			projectDesc: e.target.value
		});
	}

	// edit project
	editProject(e){
		e.preventDefault();

		let aProject = this.props.project;

		if(this.validateEdit()){
			aProject.name = this.state.projectName;
			aProject.description = this.state.projectDesc;

			this.props.refreshDetailedPage(aProject.id);

			alert("Edit project is success!");
		}

		this.setState({
			projectName: this.props.project.name,
			projectDesc: this.props.project.description
		});
	}

	// complete project
	completeProject(){
		let aProject = this.props.project;
		const today = new Date();

		if(this.validateDone()){
			aProject.status = 'Done';
			aProject.finished = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			this.props.refreshDetailedPage(aProject.id);
		}else{
			alert("All tasks should be Done.");
		}
		
	}

	// undo complete project
	uncompleteProject(){
		let aProject = this.props.project;

		aProject.status = 'In Progress';
		aProject.finished = null;

		this.props.refreshDetailedPage(aProject.id);
	}

	// delete project
	delProject(e){
		if(window.confirm("Are you sure to delete this project?")){
			const tempProjects = this.props.projects.projectList.filter(p => p.id !== this.props.project.id);
			this.props.projects.projectList = tempProjects;
			this.props.gotoHome(e);
		}
	}

	render(){

		// when edit button is showed
		const editButton = (this.props.project.status === 'Done')?null:<button className="btn btn-primary mr-2" title="Edit" data-toggle="modal" data-target="#formEditProject">Edit</button>;

		// when complete button is showed
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

// a component of add project form
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
		this.getNextProjectId = this.getNextProjectId.bind(this);
	}

	// get new project ID
	getNextProjectId(){
		let maxID = 0;

		this.props.projects.projectList.forEach((project) => {
			if(Number(project.id) > maxID){
				maxID = Number(project.id);
			}
		});

		return (maxID+1);
	}

	// add project validation
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

	// change project name state
	fillProjectName(e){
		this.setState({
			projectName: e.target.value
		});
	}

	// change project description state
	fillProjectDesc(e){
		this.setState({
			projectDesc: e.target.value
		});
	}

	// add project
	addProject(e){
		e.preventDefault();

		const newID = this.getNextProjectId();
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
			this.props.projects.projectList.push(aProject);

			this.props.gotoHome(e);

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
							<form onSubmit={this.addProject} >
								<div className="form-group">
									<label className="col-form-label">Project Name</label>
									<input type="text" className="form-control" value={this.state.projectName} onChange={this.fillProjectName} placeholder="Project name is mandatory" />
								</div>
								<div className="form-group">
									<label className="col-form-label">Description</label>
									<textarea className="form-control" rows="3" placeholder="At least 100 characters is good..." value={this.state.projectDesc} onChange={this.fillProjectDesc} ></textarea>
									<span>{this.state.projectDesc.length} characters</span>
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

// a component to show home page
class BSPHome extends React.Component{
	render(){
		const doneProjects = [];
		const undoneProjects = [];

		// filter done today project and undone today project
		this.props.projects.projectList.forEach((project) => {
			if(project.status === 'In Progress'){
				const updated = new Date(project.updated);
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				if(updated.getTime() >= today.getTime()){
					doneProjects.push(project);
				}else{
					undoneProjects.push(project);
				}
			}
		});

		// map to some project card
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

// a component to show completed projects
class BSPAchievement extends React.Component{
	render(){
		const completeProjects = [];

		// filter completed projects
		this.props.projects.projectList.forEach((project) => {
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

// a component to show search result page
class BSPSearchResult extends React.Component{
	render(){
		const searchResult = [];

		// filter project based on search keyword
		this.props.projects.projectList.forEach((project) => {
			const byName = (project.name.toUpperCase()).indexOf(this.props.searchText.toUpperCase());
			const byDesc = (project.description.toUpperCase()).indexOf(this.props.searchText.toUpperCase());

			if((byName !== -1) || (byDesc !== -1)){
				searchResult.push(project);
			}
		});


		// map to some project cards
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

// a component to show detail project page
class BSPDetailProject extends React.Component{
	render(){

		// map to some project task cards
		const tasks = this.props.project.tasks.map((task) => 
			<BSPProjectTask task={task} key={task.id} project={this.props.project} refreshDetailedPage={this.props.refreshDetailedPage} />
		);

		// when task form is showed
		const taskForm = (this.props.project.status === 'Done')?null:<BSPTaskForm project={this.props.project} refreshDetailedPage={this.props.refreshDetailedPage} />;

		return(
			<div className="row py-5">
				<div className="col-md-12 mb-5">
					<h3>Do it one small step at a time so you can done it easily.</h3>
					<a href="home" className="text-muted" onClick={this.props.gotoHome} >Back to home</a>
				</div>

				<div className="col-md-6 mb-5">
					<BSPProjectCard project={this.props.project} gotoDetailed={this.props.gotoDetailed} />
					<BSPEditProject project={this.props.project} gotoHome={this.props.gotoHome} refreshDetailedPage={this.props.refreshDetailedPage} projects={this.props.projects} />
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

// a component to show navbar
class BSPNavbar extends React.Component{
	constructor(props){
		super(props);

		this.fillSearchText = this.fillSearchText.bind(this);
	}

	// change search keyword state
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

				<BSPAddProject gotoHome={this.props.gotoHome} projects={this.props.projects} />
			</div>
		);
	}
}

// a component to show mini summary
class BSPMiniDashboard extends React.Component{
	render(){
		const completeProjects = [];
		const incompleteProjects = [];

		// filter completed and incomplete projects
		this.props.projects.projectList.forEach((project) => {
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

// a component to show footer
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

// main apps
class BSPApps extends React.Component{
	constructor(props){
		super(props);

		let projects = [];
		const tasks = this.props.tasks;

		// construct project and it's tasks
		this.props.projects.forEach((project) => {
			
			let newProject = project;

			// for project tasks
			newProject.tasks = [];

			// for project task done today
			newProject.tasksDoneToday = [];

			// for old updated date
			newProject.oldUpdated = project.updated;

			// assign task
			tasks.forEach((task) => {
				if(task.project_id === newProject.id){
					newProject.tasks.push(task);
				}
			});

			projects.push(newProject);
		});

		// manipulasi agar tidak perlu membuat fungsi ubah state di depan
		let datas = {
			projectList: projects
		};

		this.state = {
			page: 'home',
			detailedProject: null,
			searchText: '',
			projects: datas
		};

		this.gotoAchievements = this.gotoAchievements.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.gotoDetailed = this.gotoDetailed.bind(this);

		this.fillSearchText = this.fillSearchText.bind(this);

		this.refreshDetailedPage = this.refreshDetailedPage.bind(this);
	}

	// change search keyword state
	fillSearchText(text){

		// if blank go to home
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

	// go to achievements page
	gotoAchievements(e){
		e.preventDefault();
		this.setState({
			page: 'achievements',
			detailedProject: null
		});
	}

	// go to home page
	gotoHome(e){
		e.preventDefault();

		this.setState({
			page: 'home',
			detailedProject: null
		});
	}

	// go to detailed page
	gotoDetailed(project_id, e){
		e.preventDefault();
		
		this.setState({
			page: 'detailed',
			detailedProject: project_id
		});
	}

	// refresh detailed page, for changes
	refreshDetailedPage(project_id){
		this.setState({
			page: 'detailed',
			detailedProject: project_id
		});
	}

	render(){

		// just a navbar
		const navbar = <BSPNavbar gotoAchievements={this.gotoAchievements} gotoHome={this.gotoHome} fillSearchText={this.fillSearchText} searchText={this.state.searchText} projects={this.state.projects} />;

		// just a footer
		const footer = <BSPFooter />;

		// just a mini dashboard and when to show it
		const minidashboard = (this.state.page === 'home')?<BSPMiniDashboard projects={this.state.projects} />:null;

		// main page
		let content = null;

		// home page
		if(this.state.page === 'home'){
			content = <BSPHome projects={this.state.projects} gotoDetailed={this.gotoDetailed} />;

		// achievement page
		}else if(this.state.page === 'achievements'){
			content = <BSPAchievement projects={this.state.projects} gotoHome={this.gotoHome} gotoDetailed={this.gotoDetailed} />;

		// detailed page
		}else if(this.state.page === 'detailed'){
			if(this.state.detailedProject === null){
				content = null;
			}else{
				content = <BSPDetailProject 
					project={this.state.projects.projectList.find(p => p.id === this.state.detailedProject)}
					projects={this.state.projects} 
					gotoHome={this.gotoHome} 
					gotoDetailed={this.gotoDetailed} 
					refreshDetailedPage={this.refreshDetailedPage}
				/>;
			}

		//search result page
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