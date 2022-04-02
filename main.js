const task_form = document.getElementById("task_form");
const task_input = document.getElementById("task_input");
const fastest_task = document.getElementById("fastest_task");
const btn_fastest_task = document.getElementById("btn_fastest_task");

const tasks = [];
const tasksDone = [];

const clearForm = () => task_input.value = '';

const setTask = description => {
    const task = {};
    task.description = description;
    task.id = Math.floor(Math.random() * (50000 - 25000 + 1)) + 25000;
    task.done = false;
    task.created_at = new Date();
    task.finished_at = '';
    tasks.push(task);
}

const getTemplate = tasks => {
    let template = "";

    tasks.forEach(({id, done, description, created_at, finished_at}) => {
        template += `
            <div class="task col-lg-3 mx-1 d-flex flex-column">
                <div>
                    <button onclick="handleClick(${id}, ${done})" class="mb-2 btn btn-${ done ? "danger" : "primary" }">${done ? "Completado" : "Completar"}</button>
                    <b class="task_text ${done ? 'done' : ''}">${description}</b>
                </div>

                <div>
                    <p class="task_date">Creado: ${formatDate(created_at)}</p>
                    ${
                        done
                            ? `<p class="task_date">Finalizado: ${formatDate(finished_at)}</p>`
                            : ''
                    }
                </div>
            </div>
        `
    });

    return template;
}

const showTasks = () => {
    document.getElementById("task_list").innerHTML = getTemplate(tasks);
    document.getElementById("task_done").innerHTML = getTemplate(tasksDone);
}

task_form.addEventListener("submit", e => {
    e.preventDefault();

    const description = task_input.value;
    if(description.trim() === '') return;

    setTask(description);
    showTasks();
    clearForm();
})

const handleClick = (id, done) => {
    if(!done){
        let task = tasks.find(t => t.id === id);
        task.done = !task.done;
        task.finished_at = new Date();
        tasksDone.push(tasks.splice(tasks.indexOf(task), 1)[0])
    }else{
        let task = tasksDone.find(t => t.id === id);
        task.done = !task.done;
        task.finished_at = '';
        tasks.push(tasksDone.splice(tasksDone.indexOf(task), 1)[0])
        if(tasksDone.length === 0) fastest_task.innerHTML = '';
    }

    showTasks();
}

btn_fastest_task.addEventListener("click", () => {
    if(tasksDone.length <= 0) return alert("Todavía no se completó ninguna tarea");

    let fastestTask = {};
    let maximaDiferencia = Infinity;
    
    tasksDone.forEach(task => {
        let actualDiferencia = task.finished_at - task.created_at;
        if(actualDiferencia <= maximaDiferencia){
            maximaDiferencia = actualDiferencia;
            fastestTask = task;
        }
    });

    fastest_task.innerHTML = `
        <h5>La tarea más rápida fue: ${fastestTask.description}</h5>
    `;
});

const formatDate = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}