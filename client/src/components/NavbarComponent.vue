<script setup>
import { useGlobalStore } from "../stores/global";
const { user } = useGlobalStore();



</script>

<template>
<nav class="navbar navbar-expand-lg navbar-dark sticky-top navbar-custom">
  <div class="container-fluid">
    <router-link class="navbar-brand" to="/">
      <img src="/images/logo1.png" class="mb-1" style="width : 40px">
      <span class="burnt-text">Burnt Toast</span> 
      <span class="and-text"> & </span>
      <span class="orange-text">Orange Peels</span>
    </router-link>
    <button class="navbar-toggler nav-toggler-custom" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
      <div class="offcanvas-header">
        <img src="/images/logo1.png" class="mb-1" style="width : 40px">
        <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Burnt Toast & Orange Peels</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/posts">Posts</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" :to="{ path :`/user/${user.id}` }" v-if="user.token">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login" v-if="!user.token">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register" v-if="!user.token">Register</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/logout" v-if="user.token">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
</template>

<style scoped>

</style>
