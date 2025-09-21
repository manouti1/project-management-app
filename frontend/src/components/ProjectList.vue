<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Projects</h1>
      <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">Create Project</button>
    </div>
    <form v-if="showCreateForm" @submit.prevent="createProject" class="card card-body mb-3">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input type="text" id="name" class="form-control" v-model="newProject.name" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description:</label>
        <textarea id="description" class="form-control" v-model="newProject.description" required></textarea>
      </div>
      <button type="submit" class="btn btn-success">Create</button>
    </form>
    <div class="project-list">
      <div v-for="project in projects" :key="project.id" class="card mb-3">
        <div class="card-body">
          <h2 class="card-title">{{ project.name }}</h2>
          <p class="card-text">{{ project.description }}</p>
          <button class="btn btn-sm btn-outline-primary mb-2" @click="toggleCreateTaskForm(project.id)">Create Task</button>
          <form v-if="showCreateTaskForm[project.id]" @submit.prevent="createTask(project.id)" class="card card-body my-3">
            <div class="mb-2">
              <label for="taskTitle" class="form-label">Title:</label>
              <input type="text" id="taskTitle" class="form-control" v-model="newTask.title" required>
            </div>
            <div class="mb-2">
              <label for="taskDescription" class="form-label">Description:</label>
              <textarea id="taskDescription" class="form-control" v-model="newTask.description" required></textarea>
            </div>
            <div class="mb-2">
              <label for="taskStatus" class="form-label">Status:</label>
              <select id="taskStatus" class="form-select" v-model="newTask.status">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <button type="submit" class="btn btn-sm btn-success">Create Task</button>
          </form>
          <TaskList :project-id="project.id" />
        </div>
      </div>
    </div>
    <div class="pagination d-flex justify-content-center mt-3" v-if="totalPages > 1">
      <button class="btn btn-secondary mx-1" @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-secondary mx-1" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import TaskList from './TaskList.vue';
import { useToast } from 'vue-toastification';

export default {
  components: {
    TaskList,
  },
  data() {
    return {
      projects: [],
      showCreateForm: false,
      newProject: {
        name: '',
        description: '',
      },
      showCreateTaskForm: {}, // To manage visibility of task creation form for each project
      newTask: {
        title: '',
        description: '',
        status: 'todo',
      },
      currentPage: 1,
      projectsPerPage: 5, // You can adjust this value
      totalProjects: 0,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async created() {
    await this.fetchProjects();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalProjects / this.projectsPerPage);
    },
  },
  methods: {
    toggleCreateTaskForm(projectId) {
      // Use Vue.set to ensure reactivity for new properties
      this.$set(this.showCreateTaskForm, projectId, !this.showCreateTaskForm[projectId]);
      // Reset newTask when toggling form
      this.newTask = {
        title: '',
        description: '',
        status: 'todo',
      };
    },
    async fetchProjects() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/projects?page=${this.currentPage}&limit=${this.projectsPerPage}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }
        if (!response.ok) {
          let errorMessage = 'Failed to fetch projects';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        this.projects = data.projects;
        this.totalProjects = data.total;
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    async createProject() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.newProject),
        });
        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }
        if (!response.ok) {
          let errorMessage = 'Failed to create project';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }
        this.newProject.name = '';
        this.newProject.description = '';
        this.showCreateForm = false;
        await this.fetchProjects();
        this.toast.success('Project created successfully');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    async createTask(projectId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...this.newTask, project_id: projectId }),
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
        // Reset form and hide it
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
        };
        this.$set(this.showCreateTaskForm, projectId, false);
        // Re-fetch projects to update the task list for the specific project
        await this.fetchProjects();
        this.toast.success('Task created successfully');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchProjects();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchProjects();
      }
    },
  },
};
</script>

<style scoped></style>