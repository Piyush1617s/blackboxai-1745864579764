// Renderer process JavaScript for PLANet app

// Initial data structures
let tasks = [];
let subjects = [];
let events = [];

// Utility to save/load data from localStorage
function saveData() {
  localStorage.setItem('planet_tasks', JSON.stringify(tasks));
  localStorage.setItem('planet_subjects', JSON.stringify(subjects));
  localStorage.setItem('planet_events', JSON.stringify(events));
}

function loadData() {
  tasks = JSON.parse(localStorage.getItem('planet_tasks')) || [];
  subjects = JSON.parse(localStorage.getItem('planet_subjects')) || [];
  events = JSON.parse(localStorage.getItem('planet_events')) || [];
}

// UI Elements
const appContent = document.getElementById('app-content');
const tabs = {
  tasks: document.getElementById('tasks-tab'),
  progress: document.getElementById('progress-tab'),
  pomodoro: document.getElementById('pomodoro-tab'),
  calendar: document.getElementById('calendar-tab'),
  subjects: document.getElementById('subjects-tab'),
};

// Event listeners for tabs
tabs.tasks.addEventListener('click', () => showTasks());
tabs.progress.addEventListener('click', () => showProgress());
tabs.pomodoro.addEventListener('click', () => showPomodoro());
tabs.calendar.addEventListener('click', () => showCalendar());
tabs.subjects.addEventListener('click', () => showSubjects());

// Initial load
loadData();
showTasks();

// Helper: Clear app content
function clearContent() {
  appContent.innerHTML = '';
}

// Tasks UI
function showTasks() {
  clearContent();
  const container = document.createElement('div');
  container.className = 'space-y-4';

  const title = document.createElement('h2');
  title.textContent = 'Tasks';
  title.className = 'text-2xl font-bold mb-4 font-orbitron';
  container.appendChild(title);

  // Task form
  const form = document.createElement('form');
  form.className = 'space-y-2 bg-indigo-800 p-4 rounded-lg shadow-lg';

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.placeholder = 'New task description';
  taskInput.required = true;
  taskInput.className = 'w-full p-2 rounded text-black';

  const subjectSelect = document.createElement('select');
  subjectSelect.className = 'w-full p-2 rounded text-black';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select subject';
  subjectSelect.appendChild(defaultOption);
  subjects.forEach(subj => {
    const option = document.createElement('option');
    option.value = subj.id;
    option.textContent = subj.name;
    subjectSelect.appendChild(option);
  });

  const deadlineInput = document.createElement('input');
  deadlineInput.type = 'date';
  deadlineInput.className = 'w-full p-2 rounded text-black';

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Task';
  addButton.className = 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded';

  form.appendChild(taskInput);
  form.appendChild(subjectSelect);
  form.appendChild(deadlineInput);
  form.appendChild(addButton);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      description: taskInput.value.trim(),
      subjectId: subjectSelect.value || null,
      deadline: deadlineInput.value || null,
      completed: false,
    };
    tasks.push(newTask);
    saveData();
    showTasks();
  });

  container.appendChild(form);

  // Task list
  const list = document.createElement('ul');
  list.className = 'space-y-2';

  tasks.forEach(task => {
    const item = document.createElement('li');
    item.className = 'bg-indigo-700 p-3 rounded flex justify-between items-center';

    const desc = document.createElement('span');
    desc.textContent = task.description + (task.deadline ? ` (Due: ${task.deadline})` : '');
    desc.className = task.completed ? 'line-through text-gray-400' : '';

    const controls = document.createElement('div');
    controls.className = 'space-x-2';

    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
    completeBtn.className = 'text-green-400 hover:text-green-600';
    completeBtn.title = task.completed ? 'Mark as Incomplete' : 'Mark as Complete';
    completeBtn.addEventListener('click', () => {
      task.completed = !task.completed;
      saveData();
      showTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = 'text-red-500 hover:text-red-700';
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveData();
      showTasks();
    });

    controls.appendChild(completeBtn);
    controls.appendChild(deleteBtn);

    item.appendChild(desc);
    item.appendChild(controls);

    list.appendChild(item);
  });

  container.appendChild(list);

  appContent.appendChild(container);
}

// Progress UI
function showProgress() {
  clearContent();
  const container = document.createElement('div');
  container.className = 'space-y-4';

  const title = document.createElement('h2');
  title.textContent = 'Progress Analysis';
  title.className = 'text-2xl font-bold mb-4 font-orbitron';
  container.appendChild(title);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percentComplete = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const progressText = document.createElement('p');
  progressText.textContent = `You have completed ${completedTasks} out of ${totalTasks} tasks (${percentComplete}%).`;
  progressText.className = 'text-lg';

  container.appendChild(progressText);

  // Simple progress bar
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'w-full bg-gray-700 rounded h-6';

  const progressBar = document.createElement('div');
  progressBar.className = 'bg-yellow-400 h-6 rounded';
  progressBar.style.width = percentComplete + '%';

  progressBarContainer.appendChild(progressBar);
  container.appendChild(progressBarContainer);

  appContent.appendChild(container);
}

// Pomodoro UI
function showPomodoro() {
  clearContent();
  const container = document.createElement('div');
  container.className = 'space-y-4 text-center';

  const title = document.createElement('h2');
  title.textContent = 'Pomodoro Timer';
  title.className = 'text-2xl font-bold mb-4 font-orbitron';
  container.appendChild(title);

  const timerDisplay = document.createElement('div');
  timerDisplay.textContent = '25:00';
  timerDisplay.className = 'text-6xl font-mono mb-4';

  container.appendChild(timerDisplay);

  const controls = document.createElement('div');
  controls.className = 'space-x-4';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  startBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded';

  const pauseBtn = document.createElement('button');
  pauseBtn.textContent = 'Pause';
  pauseBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded';

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded';

  controls.appendChild(startBtn);
  controls.appendChild(pauseBtn);
  controls.appendChild(resetBtn);

  container.appendChild(controls);

  appContent.appendChild(container);

  let timer = 25 * 60;
  let interval = null;
  let running = false;

  function updateDisplay() {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  startBtn.addEventListener('click', () => {
    if (!running) {
      running = true;
      interval = setInterval(() => {
        if (timer > 0) {
          timer--;
          updateDisplay();
        } else {
          clearInterval(interval);
          running = false;
          alert('Pomodoro session complete! Take a break.');
        }
      }, 1000);
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (running) {
      clearInterval(interval);
      running = false;
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    running = false;
    timer = 25 * 60;
    updateDisplay();
  });
}

// Calendar UI
function showCalendar() {
  clearContent();
  const container = document.createElement('div');
  container.className = 'space-y-4';

  const title = document.createElement('h2');
  title.textContent = 'Calendar & Events';
  title.className = 'text-2xl font-bold mb-4 font-orbitron';
  container.appendChild(title);

  // Simple calendar placeholder
  const calendarPlaceholder = document.createElement('p');
  calendarPlaceholder.textContent = 'Calendar feature coming soon!';
  calendarPlaceholder.className = 'text-lg italic text-gray-400';

  container.appendChild(calendarPlaceholder);

  appContent.appendChild(container);
}

// Subjects UI
function showSubjects() {
  clearContent();
  const container = document.createElement('div');
  container.className = 'space-y-4';

  const title = document.createElement('h2');
  title.textContent = 'Subjects';
  title.className = 'text-2xl font-bold mb-4 font-orbitron';
  container.appendChild(title);

  // Subject form
  const form = document.createElement('form');
  form.className = 'space-y-2 bg-indigo-800 p-4 rounded-lg shadow-lg';

  const subjectInput = document.createElement('input');
  subjectInput.type = 'text';
  subjectInput.placeholder = 'New subject name';
  subjectInput.required = true;
  subjectInput.className = 'w-full p-2 rounded text-black';

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Subject';
  addButton.className = 'bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded';

  form.appendChild(subjectInput);
  form.appendChild(addButton);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newSubject = {
      id: Date.now().toString(),
      name: subjectInput.value.trim(),
    };
    subjects.push(newSubject);
    saveData();
    showSubjects();
  });

  container.appendChild(form);

  // Subject list
  const list = document.createElement('ul');
  list.className = 'space-y-2';

  subjects.forEach(subj => {
    const item = document.createElement('li');
    item.className = 'bg-indigo-700 p-3 rounded flex justify-between items-center';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = subj.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = 'text-red-500 hover:text-red-700';
    deleteBtn.title = 'Delete Subject';
    deleteBtn.addEventListener('click', () => {
      subjects = subjects.filter(s => s.id !== subj.id);
      // Also remove tasks with this subject
      tasks = tasks.filter(t => t.subjectId !== subj.id);
      saveData();
      showSubjects();
    });

    item.appendChild(nameSpan);
    item.appendChild(deleteBtn);

    list.appendChild(item);
  });

  container.appendChild(list);

  appContent.appendChild(container);
}
