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
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <div class="col" v-for="project in projects" :key="project.id">
        <div class="card h-100"> <!-- Added h-100 for consistent card height -->
          <div class="card-body d-flex flex-column">
            <div v-if="editingProjectId === project.id">
              <form @submit.prevent="updateProject" class="mb-3">
                <div class="mb-3">
                  <label for="editName" class="form-label">Name:</label>
                  <input type="text" id="editName" class="form-control" v-model="editedProject.name" required>
                </div>
                <div class="mb-3">
                  <label for="editDescription" class="form-label">Description:</label>
                  <textarea id="editDescription" class="form-control" v-model="editedProject.description" required></textarea>
                </div>
                <button type="submit" class="btn btn-success btn-sm me-2">Save</button>
                <button type="button" class="btn btn-secondary btn-sm" @click="cancelEdit">Cancel</button>
              </form>
            </div>
            <div v-else>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h2 class="card-title mb-0">{{ project.name }}</h2>
                <div>
                  <button class="btn btn-sm btn-secondary me-2" @click="editProject(project)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteProject(project.id)">Delete Project</button>
                </div>
              </div>
              <p class="card-text">{{ project.description }}</p>
              <button class="btn btn-sm btn-outline-primary mb-2" @click="toggleCreateTaskForm(project.id)">Create Task</button>
            </div>
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
          <div class="task-list-wrapper mt-3">
            <TaskList :project-id="project.id" :key="taskListKey[project.id] || 0" />
          </div>
        </div> <!-- Closes card-body -->
      </div> <!-- Closes card h-100 -->
    </div> <!-- Closes col -->
  </div> <!-- Closes row -->
    <div class="pagination d-flex justify-content-center mt-3" v-if="totalPages > 1">
      <button class="btn btn-secondary mx-1" @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-secondary mx-1" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  <!-- Delete Project Confirmation Modal -->
    <div class="modal fade" :class="{ 'show': showDeleteProjectModal }" :style="{ display: showDeleteProjectModal ? 'block' : 'none' }" tabindex="-1" aria-labelledby="deleteProjectModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteProjectModalLabel">Confirm Delete Project</h5>
            <button type="button" class="btn-close" @click="showDeleteProjectModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this project? This will also delete all associated tasks.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteProjectModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteProject">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteProjectModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import TaskList from './TaskList.vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth'; // Import the auth store

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
      editingProjectId: null, // To track which project is being edited
      editedProject: {}, // To hold the data of the project being edited
      showCreateTaskForm: {}, // To manage visibility of task creation form for each project
      newTask: {
        title: '',
        description: '',
        status: 'todo',
      },
      currentPage: 1,
      projectsPerPage: 6,
      totalProjects: 0,
      showDeleteProjectModal: false, // Control visibility of delete confirmation modal
      projectToDeleteId: null, // Store the ID of the project to be deleted
      taskListKey: {}, // Used to force re-render of TaskList component
    };
  },
  setup() {
    const toast = useToast();
    const authStore = useAuthStore(); // Initialize the auth store
    return { toast, authStore }; // Make authStore available in the component
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
      this.showCreateTaskForm[projectId] = !this.showCreateTaskForm[projectId];
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
          this.authStore.logout();
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
        this.totalProjects = data.totalProjects;
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
          this.authStore.logout();
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
        if (!this.authStore.user) {
          this.toast.error('You must be logged in to create a task.');
          this.authStore.logout();
          return;
        }
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...this.newTask, project_id: parseInt(projectId, 10) }),
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
        // Reset form and hide it
        this.newTask = {
          title: '',
          description: '',
          status: 'todo',
        };
        this.showCreateTaskForm[projectId] = false;
        // Re-fetch projects to update the task list for the specific project
        this.taskListKey[projectId] = (this.taskListKey[projectId] || 0) + 1;
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
    editProject(project) {
      this.editingProjectId = project.id;
      this.editedProject = { ...project }; // Create a copy to avoid direct mutation
    },
    cancelEdit() {
      this.editingProjectId = null;
      this.editedProject = {};
    },
    async updateProject() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/projects/${this.editedProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.editedProject),
        });

        if (response.status === 401 || response.status === 403) {
          this.toast.error('Session expired. Please login again.');
          this.authStore.logout();
          return;
        }

        if (!response.ok) {
          let errorMessage = 'Failed to update project';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }

        // Find the index of the updated project and replace it
        const index = this.projects.findIndex(p => p.id === this.editedProject.id);
        if (index !== -1) {
          this.projects[index] = { ...this.editedProject };
        }

        this.toast.success('Project updated successfully');
        this.cancelEdit(); // Exit edit mode
      } catch (error) {
        this.toast.error(error.message);
      }
    },
    deleteProject(projectId) {
      this.projectToDeleteId = projectId;
      this.showDeleteProjectModal = true;
    },
    async confirmDeleteProject() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/projects/${this.projectToDeleteId}`, {
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
          let errorMessage = 'Failed to delete project';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore if the error response is not JSON
          }
          throw new Error(errorMessage);
        }

        this.projects = this.projects.filter(p => p.id !== this.projectToDeleteId);
        this.toast.success('Project deleted successfully');
        // Re-fetch projects to update pagination and total count if necessary
        await this.fetchProjects();
      } catch (error) {
        this.toast.error(error.message);
      } finally {
        this.showDeleteProjectModal = false;
        this.projectToDeleteId = null;
      }
    },
  },
};
</script>

<style scoped>
.task-list-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0; /* Prevents the container from shrinking to zero in a flex context */
}
</style>
