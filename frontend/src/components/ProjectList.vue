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
