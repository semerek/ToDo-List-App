
const express = require("express");
const path = require("path");
const socket = require("socket.io");


const app = express();
const tasks = [];

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});


const io = socket(server); 

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
      console.log('Just added new task' + task)
    
      tasks.push(task);
      socket.broadcast.emit ('addTask', task);
    });
    
    socket.on('removeTask', id => {
      console.log('Just removed a task with index' + id);
    
      const task = tasks.find(task => task.id === id)
      socket.broadcast.emit ('removeTask', task)
    
    });
  });



{/*
REMOVING A VALUE FROM AN ARRAY
const items = ['a', 'b', 'c', 'd', 'e', 'f']
const valueToRemove = 'c'
const filteredItems = items.filter(item => item !== valueToRemove)
// ["a", "b", "d", "e", "f"]
*/}