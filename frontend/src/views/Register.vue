<template>
  <div class="row justify-content-center mt-5">
    <div class="col-lg-5 col-md-7 col-sm-9">
      <div class="card">
        <div class="card-body p-4">
          <h1 class="card-title text-center mb-4">Register</h1>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input type="text" id="username" class="form-control" v-model="user.username" required>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input type="email" id="email" class="form-control" v-model="user.email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input type="password" id="password" class="form-control" v-model="user.password" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
            <p class="mt-3">
              Already have an account? <router-link to="/login">Login</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.user),
        });
        if (!response.ok) {
          let errorMessage = 'Failed to register';
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
        this.toast.success('Registered successfully. Please login.');
        this.$router.push('/login');
      } catch (error) {
        this.toast.error(error.message);
      }
    },
  },
};
</script>
