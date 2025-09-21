<template>
  <div id="app">
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Project Manager</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Home</router-link>
            </li>
          </ul>
          <a @click.prevent="logout" href="#" class="btn btn-outline-secondary">Logout</a>
        </div>
      </div>
    </nav>
    <div class="container"><router-view/></div>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'App',
  computed: {
    ...mapState(useAuthStore, ['isLoggedIn']),
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
  }
}
</script>

<style></style>
