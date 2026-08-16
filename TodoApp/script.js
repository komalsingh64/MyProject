let tasks = JSON.parse(localStorage.getItem("taskmaster_pro_tasks")) || [];
let currentFilter = "all";
let searchQuery = "";

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const searchInput = document.getElementById("searchInput");
const pendingCount = document.getElementById("pendingCount");
const statsPercent = document.getElementById("statsPercent");
const progressBar = document.getElementById("progressBar");
const dateDisplay = document.getElementById("dateDisplay");

// Date Format
const now = new Date();
dateDisplay.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
});

// Audio Feedback
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, type = "sine", duration = 0.08) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Confetti Blast
function blastConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 55,
            origin: { y: 0.75 },
            colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b']
        });
    }
}

// Add Task
document.getElementById("todoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        category: categoryInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.unshift(newTask);
    saveAndRender();
    playBeep(600, "triangle", 0.05);
    taskInput.value = "";
});

// Toggle Task
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const nextState = !task.completed;
            if (nextState) {
                playBeep(850, "sine", 0.1);
                blastConfetti();
            }
            return { ...task, completed: nextState };
        }
        return task;
    });
    saveAndRender();
}

// Delete Single Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
    playBeep(320, "sawtooth", 0.05);
}

// Clear All Completed
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

// Filters
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.toLowerCase().includes(filter));
    });
    render();
}

// Instant Search
function handleSearch() {
    searchQuery = searchInput.value.toLowerCase();
    render();
}

function saveAndRender() {
    localStorage.setItem("taskmaster_pro_tasks", JSON.stringify(tasks));
    render();
}

function render() {
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        const matchesFilter = currentFilter === "active" ? !task.completed :
                              currentFilter === "completed" ? task.completed : true;
        const matchesSearch = task.text.toLowerCase().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = `
            <div style="text-align:center; padding: 30px 10px; color:#475569;">
                <i class="fa-regular fa-clipboard" style="font-size:28px; margin-bottom:8px; display:block;"></i>
                <span style="font-size:13px;">No tasks found</span>
            </div>
        `;
    } else {
        filtered.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-left" onclick="toggleTask(${task.id})">
                    <div class="custom-checkbox">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="task-content">
                        <span class="task-title">${task.text}</span>
                        <div class="task-tags">
                            <span class="tag-badge category-tag">${task.category}</span>
                            <span class="tag-badge priority-${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                </div>
                <button class="del-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    // Calculations
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = `${percent}%`;
    statsPercent.textContent = `${percent}%`;
    pendingCount.textContent = `${total - completed} task${total - completed !== 1 ? 's' : ''} remaining`;
}

// Initial render
render();