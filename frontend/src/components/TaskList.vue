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
            <td>{{ task.title }}</td>
            <td>{{ task.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-info mt-3" role="alert">
      No tasks found for this project with the selected status.
    </div>
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
  },
  watch: {
    selectedStatus() {
      this.fetchTasks();
    },
  },
};
</script>