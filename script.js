let tasks = load();

const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyMessage = document.querySelector('#empty');
const counter = document.querySelector('#counter');

function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem('tasks', json);
}

function load() {
  const raw = localStorage.getItem('tasks');
  return JSON.parse(raw) || []; // first visit: nothing stored, start empty
}

function nextId() {
  let max = 0;
  tasks.forEach(task => {
    if (task.id > max) {
      max = task.id;
    }
  });
  return max + 1;
}

function addTask(title) {
  const task = {
    id: nextId(),
    title: title,
    done: false,
  };
  tasks[tasks.length] = task; // put it in the next free position, at the end
  save();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(task => {
    if (task.id === id) {
      task.done = !task.done;
    }
  });
  save();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  save();
  renderTasks();
}

function taskToListItem(task) {
  const li = document.createElement('li');
  li.textContent = task.title;
  li.classList.add('task');
  li.dataset.id = task.id;
  if (task.done) {
    li.classList.add('done');
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✕';
  deleteButton.classList.add('delete');
  deleteButton.setAttribute('aria-label', `Delete ${task.title}`);
  li.append(deleteButton);

  return li;
}

function renderTasks() {
  list.innerHTML = ''; 
  tasks
    .map(taskToListItem)                
    .forEach(li => list.append(li));    

  if (tasks.length === 0) {
    emptyMessage.classList.remove('hidden');
  } else {
    emptyMessage.classList.add('hidden');
  }

  const doneCount = tasks.filter(task => task.done).length;
  counter.textContent = tasks.length === 0
    ? 'Nothing to do yet'
    : `${doneCount} of ${tasks.length} done`;
}

function handleSubmit(e) {
  e.preventDefault(); 
  addTask(input.value);
  input.value = '';
}

function handleListClick(e) {
  const li = e.target.closest('li');
  if (!li) return; 

  const id = li.dataset.id * 1;

  if (e.target.closest('.delete')) {
    deleteTask(id);
    return;
  }
  toggleTask(id);
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
renderTasks();
