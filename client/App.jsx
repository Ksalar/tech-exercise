import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Form, 
  FormGroup, 
  Label,
  Navbar,
  Button,
  Container, Row, Col,
  Input,
  Modal, 
  ModalBody, 
  Progress
} from 'reactstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //this two variables for counting tasks for progress bar
      // when user adds new task it makes norCompleted +1
      // when user crosses task as completed or back to notCompleted
      // it adds +1 and -1 to the counters
      // also when remove completed tasks it makes completed = 0 
      // and notComplited = notcomplited - complited
      completed: 1,
      notCompleted: 1,

      data: {homework: [['Fuigo coding challenge', true]]},
      // if user will try existing category it will popup message "already exists"
      categoryExist: false,
      //variable for creating category
      newCategory: '',
      // two variables for creating new task with picked category
      chosenCategory: '',
      newTask: '',
      // variable to popup modal about success of deletion of the completed tasks
      modal: false
    }
    this.addCategory = this.addCategory.bind(this)
    this.handleChangeCategory = this.handleChangeCategory.bind(this)
    this.handleNewTask = this.handleNewTask.bind(this)
    this.addNewTask = this.addNewTask.bind(this)
    this.deleteCrossed = this.deleteCrossed.bind(this)
    this.select = this.select.bind(this)
  }

  addCategory() { //function adds new category to the collection
    if (this.state.newCategory.length > 0) {
      const { data } = this.state;
      if (data[this.state.newCategory]) {
        this.setState({ categoryExist: true })
      } else {
        data[this.state.newCategory] = [];
        this.setState({ data, newCategory: '' })
      }
    }
  }

  handleChangeCategory(event) { // function changes state when user types new category
    this.setState({ newCategory: event.target.value, categoryExist: false })
  }

  handleNewTask(event) { // function changes state when user types the name of task
    this.setState({ newTask: event.target.value })
  }

  select(e) { // function to get value of selected(chosen) category
    this.setState({ chosenCategory: e.target.value })
  }

  cross(category, i) { // function to cross task -> mark it complete
    let plusOne;
    const { data, completed } = this.state;
    data[category][i][1] ? plusOne = completed - 1 : plusOne = completed + 1;
    data[category][i][1] = !data[category][i][1];
    this.setState({ data, completed: plusOne })
  }

  addNewTask(e) { // function to add new task
    e.preventDefault()
    const { data, chosenCategory, newTask, notCompleted } = this.state;
    let plusOne = notCompleted + 1
    data[chosenCategory].push([newTask, false])
    this.setState({ data, newTask: '', notCompleted: plusOne })
  }

  deleteCrossed() { // function to delete completed tasks
    const { data, completed, notCompleted } = this.state;
    const categories = Object.keys(data);
    let newNotComplited = notCompleted - completed;
    // it iterates thru object 'data' thru each category's array of tasks
    // and if it's second element is true it needs to be deleted
    for (let i = 0; i < categories.length; i++) {
      let tasks = data[categories[i]];
      for (let j = 0; j < tasks.length; j++) {
        let task = tasks[j];
        if (task[1]) {
          tasks.splice(j, 1);
          j--
        }
      }
    }
    this.setState({ 
      data, 
      // for popup
      modal: true, 
      // reset completed counter and deduct from notCompleted tasks
      completed: 0, 
      notCompleted: newNotComplited 
    })
  }

  render() {
    let percent;
    if (this.state.modal) { setTimeout(() => {this.setState({modal: false})}, 1200)}
      let { completed, notCompleted } = this.state;
    if (notCompleted === 0) {
      percent = 0
    } else {
      percent = Math.round(completed / notCompleted * 100);
    }
    const categories = Object.keys(this.state.data);
    return (
      <div>
      <Navbar color="dark" light expand="md">
        <div id="brand">Task Manager for Fuigo</div>
      </Navbar>
      <div id="main">
      <Container>
      <Row>
      {/***************************************************************
          Left part of the page where all tasks render
    *****************************************************************/}
      <Col>
      <div>You have {notCompleted} task(s)</div>
      {
       categories.map((category, i) => {
        return (
          <ul key={i}>
          <li>{category}</li>
          <ul>
          {this.state.data[category].map((task, j) => {
            if (task[1]) {
              return <strike><li className="task" onClick={() => this.cross(category, j)} key={i+j}>{task[0]}</li></strike>
            } else {
              return <li className="task" onClick={() => this.cross(category, j)} key={i+j}>{task[0]}</li>
            }
          })}
          </ul>
          </ul>
          )
      })
     }

     </Col>
     {/***************************************************************
          Right part of the page where user can add new category or task
    *****************************************************************/}
     <Col>
     <Label>Add new category:</Label>
     <Input onChange={this.handleChangeCategory} value={this.state.newCategory} />
     <br/>
     <Button color="primary" onClick={this.addCategory}>Add new category</Button>
     <br/>
     { this.state.categoryExist ? <div>Sorry but category already exists</div> : <div></div>}
     <br/>
     <Form onSubmit={this.addNewTask}>
     <FormGroup>
     <Label>Add task:</Label>
     <br/>
     <Input required onChange={this.handleNewTask} value={this.state.newTask} />
     <br/>
     Category:
     <br/>
     <Input
     type="select"
     required
     defaultValue=''
     onChange={this.select}
     >
     <option value="" disabled>Select Category</option>
     {
      categories.map((category, k) => <option key={k} >{category}</option>)
    }

    </Input>
    <br/>
    </FormGroup>
    <Button color="primary">Add New Task</Button>
    <br/>
    </Form>
    <br/>
    {/***************************************************************
          Progress bar of completeness of the tasks
    *****************************************************************/}
    <div className="text-center">Completed {percent}%</div>
    <Progress value={percent} />
    <br/>
    <br/>
    <Button color="danger" onClick={this.deleteCrossed}>Remove Completed</Button>
    <br/>
    </Col>
    </Row>
    </Container>
    </div>
     {/***************************************************************
          small popup to notify user about successful deletion of the completed tasks
    *****************************************************************/}
    <Modal isOpen={this.state.modal}>
    <ModalBody>
    <Button color="success">Completed tasks removed!</Button>

    </ModalBody>
    </Modal>
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
