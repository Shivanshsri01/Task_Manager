const tasks = {};

document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const modal = document.getElementById('myModal');
    const taskForm = document.getElementById('taskForm');

    // Show the modal when the "Add Task" button is clicked
    addTaskBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        // Clear the form fields when the modal is opened
        taskForm.reset();
    });
    
   // addTaskBtn.addEventListener

    // Close the modal when the user clicks on <span> (x)
    document.getElementsByClassName('close')[0].addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(taskForm);
        const task = formData.get('task');
        const date = formData.get('date');
        const status = formData.get('status');

        // Send a POST request to the server with task data
        fetch('/save-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, task, status })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Optionally, you can update the UI after saving the task
                // Reload the calendar for the selected month and year
                const selectedYear = new Date(date).getFullYear();
                const selectedMonth = new Date(date).getMonth();
                createCalendar(selectedYear, selectedMonth);
                // Close the modal after adding the task
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

function createCalendar(year, month) {
    const container = document.getElementById('calendar-body');
    container.innerHTML = ''; // Clear previous content

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the day of the week of the first day

    let dateCounter = 1;

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDayOfMonth) {
                cell.textContent = '';
            } else if (dateCounter <= daysInMonth) {
                cell.textContent = dateCounter;
                const date = `${year}-${month + 1}-${dateCounter}`;
                cell.dataset.date = date;
                cell.classList.add('day');
                cell.addEventListener('click', function () {
                    const date = this.dataset.date;
                    addTask(date);
                });
                const taskList = document.createElement('ul');
                taskList.className = 'task-list';
                taskList.dataset.date = date;
                cell.appendChild(taskList);
                dateCounter++;
            }
            row.appendChild(cell);
        }
        container.appendChild(row);
    }

    // Load tasks for the current month
    loadTasks(year, month);

    Object.keys(tasks).forEach(date => {
        displayTasks(date);
    });
}

function addTask(date) {
    // Display the modal
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    const form = document.getElementById('taskForm');

    // Remove any existing event listeners to prevent multiple bindings
    form.removeEventListener('submit', handleSubmit);

    // Define a new event listener for form submission
    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(taskForm);
        const task = formData.get('task');
        const status = formData.get('status');

        // Save the task to the tasks object for the clicked date
        if (!tasks[date]) {
            tasks[date] = [];
        }
        tasks[date].push({ task, status });

        // Display the task on the calendar UI
        displayTasks(date);

        // Close the modal
        modal.style.display = 'none';

        // Remove the event listener after submission
        form.removeEventListener('submit', handleSubmit);
    }

    // Add the new event listener for form submission
    form.addEventListener('submit', handleSubmit);
}

function changeCalendar() {
    const selectedMonth = parseInt(document.getElementById('month').value);
    const selectedYear = parseInt(document.getElementById('year').value);

    // Load calendar for the selected month and year
    createCalendar(selectedYear, selectedMonth);
}

function loadTasks(year, month) {
    // Load tasks from the specified year and month and display them on the calendar
    const tasksForMonth = tasks[`${year}-${month + 1}`];
    if (tasksForMonth) {
        Object.keys(tasksForMonth).forEach(date => {
            displayTasks(date);
        });
    }
}

function displayTasks(date) {
    const taskList = document.querySelector(`[data-date="${date}"] .task-list`);
    if (taskList) { // Ensure task list exists for the date
        //taskList.innerHTML = ''; // Clear existing tasks

        if (tasks[date]) { // Check if tasks exist for the date
            tasks[date].forEach((taskObj, index) => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${taskObj.task} (${taskObj.status})`; // Display task with status
                taskList.appendChild(taskItem);
            });
        }
    }
}

// Populate months dynamically in the dropdown menu
const monthDropdown = document.getElementById('month');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = month;
    monthDropdown.appendChild(option);
});

// Populate years dynamically in the dropdown menu
const yearDropdown = document.getElementById('year');
const startYear = 1970;
const endYear = new Date().getFullYear() + 100; // You can set the end year as per your requirement
for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
}

// Initialize calendar for the current month and year
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
document.getElementById('month').value = currentMonth;
document.getElementById('year').value = currentYear;
createCalendar(currentYear, currentMonth);

// Get the modal element
const modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
