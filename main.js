const form = document.querySelector('.todo-form');
const list = document.querySelector('.tasks');
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all';
const buttons = {
    all: document.querySelector('.all'),
    active: document.querySelector('.active'),
    completed: document.querySelector('.completed'),
    clear: document.querySelector('.clear-completed')
};

document.addEventListener('DOMContentLoaded', () => {
    const fragment = document.createDocumentFragment();
    tasks.forEach(task => fragment.appendChild(createTaskElement(task)));
    list.appendChild(fragment);
    document.querySelector(`.${filter}`).classList.add('selected');
    filterTasks();
    buttons.all.addEventListener('click', () => {
        document.querySelector(`.${filter}`).classList.remove('selected');
        filter = 'all';
        document.querySelector(`.${filter}`).classList.add('selected');
        filterTasks();
    });
    buttons.active.addEventListener('click', () => {
        document.querySelector(`.${filter}`).classList.remove('selected');
        filter = 'active';
        document.querySelector(`.${filter}`).classList.add('selected');
        filterTasks();
    });
    buttons.completed.addEventListener('click', () => {
        document.querySelector(`.${filter}`).classList.remove('selected');
        filter = 'completed';
        document.querySelector(`.${filter}`).classList.add('selected');
        filterTasks();
    });
    buttons.clear.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.done);
        console.log(tasks);
        list.querySelectorAll('.task.done').forEach(task => {
            task.style.animation = 'slideOut 0.5s';
            setTimeout(() => task.remove(), 400);
        });
        
        updateLocalStorage();
        filterTasks();
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target[0];
    const taskText = input.value.trim();
    if (taskText === "") return;

    input.value = "";
    const task = { task: taskText, done: false };
    tasks.push(task);
    updateLocalStorage();
    list.appendChild(createTaskElement(task));
    filterTasks();
});

const createTaskElement = (task) => {
    const div = document.createElement('div');
    div.classList.add('task');
    if (task.done) div.classList.add('done');
    div.dataset.task = task.task;

    const checkSvg = createCheckbox(task.done);
    checkSvg.addEventListener('click', () => toggleTask(task, div));

    const li = document.createElement('li');
    li.textContent = task.task;

    const remove = document.createElement('button');
    remove.classList.add('remove');
    remove.appendChild(generateGarbage());
    remove.addEventListener('click', () => removeTask(task, div));

    div.append(checkSvg, li, remove);
    return div;
};

const toggleTask = (task, div) => {
    task.done = !task.done;
    div.classList.toggle('done');
    updateLocalStorage();
    filterTasks();
};

const removeTask = (task, div) => {
    tasks = tasks.filter(t => t.task !== task.task);
    updateLocalStorage();
    div.style.animation = 'slideOut 0.5s';
    setTimeout(() => div.remove(), 400);
};

const filterTasks = () => {
    const taskElements = list.querySelectorAll('.task');
    taskElements.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = task.classList.contains('done') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('done') ? 'flex' : 'none';
                break;
        }
    });
}

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const createCheckbox = (checked = false) => {
    const checkbox = document.createElement('div');
    checkbox.classList.add('custom-checkbox');
    if (checked) checkbox.classList.add('checked');
    return checkbox;
};

const getNode = (n, v) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", n);
    Object.entries(v).forEach(([key, value]) => {
        node.setAttributeNS(null, key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()), value);
    });
    return node;
};

const generateGarbage = () => {
    const svg = getNode("svg", { width: 20, height: 20 });
    const elements = [
        { x: 4, y: 8, width: 12, height: 12, rx: 1, ry: 1, fill: 'gray', stroke: 'black', strokeWidth: 1 },
        { x: 2, y: 6, width: 16, height: 2, rx: 1, ry: 1, fill: 'darkgray', stroke: 'black', strokeWidth: 1 },
        { x: 7, y: 4, width: 6, height: 2, rx: 1, ry: 1, fill: 'darkgray', stroke: 'black', strokeWidth: 1 },
        { x: 6, y: 20, width: 16, height: 1, fill: 'lightgray' },
        { x: 6, y: 13, width: 8, height: 1, fill: 'lightgray' },
        { x: 6, y: 16, width: 8, height: 1, fill: 'lightgray' }
    ];
    elements.forEach(attrs => svg.appendChild(getNode('rect', attrs)));
    return svg;
};
