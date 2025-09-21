<template>
  <div>
    <div class="mb-2">
      <select class="form-select form-select-sm" v-model="selectedStatus">
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div class="mb-3">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="New task title" v-model="newTaskTitle" @keyup.enter="createTask">
        <button class="btn btn-primary" @click="createTask">Add Task</button>
      </div>
    </div>

    <div v-if="tasks.length" class="table-responsive">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <template v-if="editingTaskId === task.id">
              <td><input type="text" class="form-control form-control-sm" v-model="editedTask.title"></td>
              <td>
                <select class="form-select form-select-sm" v-model="editedTask.status">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </td>
              <td>
                <button class="btn btn-success btn-sm me-2" @click="updateTask">Save</button>
                <button class="btn btn-secondary btn-sm" @click="cancelEdit">Cancel</button>
              </td>
            </template>
            <template v-else>
              <td>{{ task.title }}</td>
              <td>{{ task.status }}</td>
              <td>
                <button class="btn btn-secondary btn-sm me-2" @click="editTask(task)">Edit</button>
                <button class="btn btn-danger btn-sm" @click="deleteTask(task.id)">Delete</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-info mt-3" role="alert">
      No tasks found for this project with the selected status.
    </div>

    <!-- Delete Task Confirmation Modal -->
    <div class="modal fade" :class="{ 'show': showDeleteTaskModal }" :style="{ display: showDeleteTaskModal ? 'block' : 'none' }" tabindex="-1" aria-labelledby="deleteTaskModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteTaskModalLabel">Confirm Delete Task</h5>
            <button type="button" class="btn-close" @click="showDeleteTaskModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this task?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteTaskModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteTask">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteTaskModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth'; // Import the auth store

export default {
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tasks: [],
      selectedStatus: 'all',
      editingTaskId: null, // To track which task is being edited
      editedTask: {}, // To hold the data of the task being edited
      showDeleteTaskModal: false, // Control visibility of delete confirmation modal
      taskToDeleteId: null, // Store the ID of the task to be deleted
      newTaskTitle: '', // New data property for the new task title
    };
  },
  setup() {
    const toast = useToast();
    const authStore = useAuthStore(); // Initialize the auth store
    return { toast, authStore }; // Make authStore available in the component
  },
  async created() {
    await this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        let url = `http://localhost:3000/api/tasks?projectId=${this.projectId}`;
        if (this.selectedStatus !== 'all') {
          url += `&status=${this.selectedStatus}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          this.authStore.logout();
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        this.tasks = await response.json();
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    async createTask() {
      if (!this.newTaskTitle.trim()) {
        this.toast.error('Task title cannot be empty.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: this.newTaskTitle,
            project_id: this.projectId, // Changed to snake_case
            status: 'todo', // Added default status
          }),
        });

        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          this.authStore.logout();
          return;
        }

        if (!response.ok) {
          let errorMessage = 'Failed to create task';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }

        const newTask = await response.json();
        this.tasks.push(newTask);
        this.newTaskTitle = ''; // Clear the input field
        this.toast.success('Task created successfully');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    editTask(task) {
      this.editingTaskId = task.id;
      this.editedTask = { ...task }; // Create a copy to avoid direct mutation
    },
    cancelEdit() {
      this.editingTaskId = null;
      this.editedTask = {};
    },
    async updateTask() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/tasks/${this.editedTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.editedTask),
        });

        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          this.authStore.logout();
          return;
        }

        if (!response.ok) {
          let errorMessage = 'Failed to update task';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }

        // Find the index of the updated task and replace it
        const index = this.tasks.findIndex(t => t.id === this.editedTask.id);
        if (index !== -1) {
          this.tasks[index] = { ...this.editedTask };
        }

        this.toast.success('Task updated successfully');
        this.cancelEdit(); // Exit edit mode
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    deleteTask(taskId) {
      this.taskToDeleteId = taskId;
      this.showDeleteTaskModal = true;
    },
    async confirmDeleteTask() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/tasks/${this.taskToDeleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          this.authStore.logout();
          return;
        }

        if (!response.ok) {
          let errorMessage = 'Failed to delete task';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }

        this.tasks = this.tasks.filter(t => t.id !== this.taskToDeleteId);
        this.toast.success('Task deleted successfully');
      } catch (error) {
        this.toast.error(error.message);
      } finally {
        this.showDeleteTaskModal = false;
        this.taskToDeleteId = null;
      }
    },
  },
  watch: {
    selectedStatus() {
      this.fetchTasks();
    },
  },
};
</script>