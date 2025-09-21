<template>
  <div class="row justify-content-center mt-5">
    <div class="col-lg-5 col-md-7 col-sm-9">
      <div class="card">
        <div class="card-body p-4">
          <h1 class="card-title text-center mb-4">Login</h1>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input type="text" id="username" class="form-control" v-model="user.username" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input type="password" id="password" class="form-control" v-model="user.password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <p class="mt-3">
              Don't have an account? <router-link to="/register">Register</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth'; // Import the auth store

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  setup() {
    const toast = useToast();
    const authStore = useAuthStore(); // Initialize the auth store
    return { toast, authStore }; // Make authStore available in the component
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.user),
        });
        if (!response.ok) {
          let errorMessage = 'Failed to login';
          try {
            const errorData = await response.json();
            if (errorData.errors) {
              errorMessage = errorData.errors.map(err => err.msg).join(', ');
            } else {
              errorMessage = errorData.message || errorMessage;
            }
          } catch (e) {
            // Backend did not return a JSON error, use default message
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        this.authStore.setToken(data.token);
        // Assuming the backend also returns user data upon login
        if (data.user) {
          this.authStore.setUser(data.user);
        }
        this.$router.push('/');
        this.toast.success('Logged in successfully');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
  },
};
</script>
