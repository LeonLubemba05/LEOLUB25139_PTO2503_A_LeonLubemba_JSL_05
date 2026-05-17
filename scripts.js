import { initialTasks } from "./initialData.js";

/**
 * Creates a single task DOM element.
 * @param {Object} task - Task data object.
 * @param {string} task.title - Title of the task.
 * @param {number} task.id - Unique task ID.
 * @param {string} task.status - Status column: 'todo', 'doing', or 'done'.
 * @returns {HTMLElement} The created task div element.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Finds the task container element based on task status.
 * @param {string} status - The task status ('todo', 'doing', or 'done').
 * @returns {HTMLElement|null} The container element, or null if not found.
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clears all existing task-divs from all task containers.
 */
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

/**
 * Renders all tasks from initial data to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
}

/**
 * Opens the modal dialog with pre-filled task details for editing.
 * @param {Object} task - The task object to display in the modal.
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");
  const submitBtn = document.getElementById("modal-submit-btn");

  // Fill inputs with task data
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  // Set mode to 'edit' and store task ID
  modal.dataset.mode = "edit";
  modal.dataset.taskId = task.id;
  submitBtn.textContent = "Save";

  modal.showModal();
}

/**
 * Opens the modal for adding a new task.
 */
function openAddTaskModal() {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");
  const submitBtn = document.getElementById("modal-submit-btn");

  // Clear previous inputs
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "todo";

  // Clear task ID and set mode to 'add'
  modal.dataset.mode = "add";
  delete modal.dataset.taskId;
  submitBtn.textContent = "Add";

  modal.showModal();
}

/**
 * Handles form submission for adding or editing tasks.
 * @param {Event} event - The submit event.
 */
function handleTaskFormSubmit(event) {
  event.preventDefault();

  const modal = document.getElementById("task-modal");
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const status = document.getElementById("task-status").value;
  const mode = modal.dataset.mode;
  const taskId = modal.dataset.taskId;
  const submitBtn = document.getElementById("modal-submit-btn");

  if (title === "") {
    alert("Please enter a task title");
    return;
  }

  if (mode === "add") {
    // Create new task object
    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
    };
    initialTasks.push(newTask);
  } else if (mode === "edit") {
    // Find existing task and update
    const taskIndex = initialTasks.findIndex((t) => t.id == taskId);
    if (taskIndex !== -1) {
      initialTasks[taskIndex].title = title;
      initialTasks[taskIndex].description = description;
      initialTasks[taskIndex].status = status;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(initialTasks));

  // Re-render tasks
  clearExistingTasks();
  renderTasks(initialTasks);

  // Close modal
  modal.close();
}

/**
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  // Load tasks from localStorage if available
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    initialTasks.splice(0, initialTasks.length, ...JSON.parse(storedTasks));
  }

  clearExistingTasks();
  renderTasks(initialTasks);
  setupModalCloseHandler();

  document
    .getElementById("add-task")
    .addEventListener("click", openAddTaskModal);

  document
    .getElementById("task-form")
    .addEventListener("submit", handleTaskFormSubmit);

  document
    .getElementById("task-form")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleTaskFormSubmit(event);
      }
    });
}

/**
 * Sets up the close button for the modal.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initTaskBoard);














