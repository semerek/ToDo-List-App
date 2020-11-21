import React from 'react';
import openSocket from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';





class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: "",
    }
  }


  componentDidMount() {

    this.socket = openSocket('http://localhost:8000');

    this.socket.on('updateData', tasks => {
      this.updateTasks(tasks);
    });

    this.socket.on('addTask', task => {
      this.addTask(task);
    });

    this.socket.on('removeTask', id => {
      this.removeTask(id);
    });


  };

  updateTasks(taskList) {
    this.setState({tasks: taskList})

  }

  removeTask(id) {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id)
    });
  }

  addTask(newTask) {
    this.setState({ tasks: [...this.state.tasks, newTask] })
  }

  submitForm(e){
    e.preventDefault();
      const newTask = {name: this.state.taskName, id:uuidv4()}
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);


  }


  render() {
    const { tasks } = this.state
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li className="task" key={task.id}>
                {task.name}
                <button 
                className="btn btn--red" 
                onClick={(event) => event.removeTask()} > {/*usunięcie taska o podanym id ?? */}
                  Remove
            </button>
              </li>
            ))};
      </ul>

          <form id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              //onChange={event => this.updateTasks(event.value)}
            />
            <button 
            className="btn" 
            type="submit" 
            onSubmit={(event) => { this.submitForm(event) }}>
              Add
            </button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;