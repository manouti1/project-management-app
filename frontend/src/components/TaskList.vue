<template>
  <div class="card mt-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h3>Tasks</h3>
      <button class="btn btn-sm btn-outline-primary" @click="showCreateForm = !showCreateForm">Create Task</button>
    </div>
    <form v-if="showCreateForm" @submit.prevent="createTask" class="card card-body my-3">
      <div class="mb-2">
        <label for="name" class="form-label">Name:</label>
        <input type="text" id="name" class="form-control" v-model="newTask.name" required>
      </div>
      <div class="mb-2">
        <label for="description" class="form-label">Description:</label>
        <textarea id="description" class="form-control" v-model="newTask.description" required></textarea>
      </div>
      <button type="submit" class="btn btn-sm btn-success">Create</button>
    </form>
    <div class="card-body">
      <input type="text" v-model="searchQuery" class="form-control form-control-sm mb-2" placeholder="Search tasks...">
      <select v-model="selectedStatus" class="form-select form-select-sm mb-2">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <ul class="list-group list-group-flush">
        <li v-for="task in filteredTasks" :key="task.id" class="list-group-item">
          <h5>{{ task.name }}</h5>
          <p class="mb-1">{{ task.description }}</p>
          <small>Status: {{ task.status }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';

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
      searchQuery: '',
      showCreateForm: false,
      newTask: {
        name: '',
        description: '',
        projectId: this.projectId,
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    filteredTasks() {
      // Filter by search query
      if (this.searchQuery.trim()) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        return this.tasks.filter(task =>
          task.name.toLowerCase().includes(lowerCaseQuery) ||
          task.description.toLowerCase().includes(lowerCaseQuery)
        );
      }

      return this.tasks;
    },
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
          // This logic was added in a previous step, but it's good to ensure it's here.
          this.toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          this.$router.push('/login');
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
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.newTask),
        });
        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          this.$router.push('/login');
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
        this.newTask.name = '';
        this.newTask.description = '';
        this.showCreateForm = false;
        await this.fetchTasks();
        this.toast.success('Task created successfully');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
  },
  watch: {
    selectedStatus() {
      this.fetchTasks();
    }
  }
};
</script>
