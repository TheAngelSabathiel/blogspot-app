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
@import url('https://fonts.googleapis.com/css2?family=Bevan&family=League+Spartan:wght@400;700&display=swap');

/* Color Variables */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --nav-transition: all 0.3s ease;
}

.navbar-custom {
  background-color: var(--brand-brown);
  border-bottom: 3px solid var(--brand-orange);
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Logo & Brand Text */
.navbar-brand {
  font-family: 'Bevan', serif;
  font-size: 1.4rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  transition: var(--nav-transition);
}

.navbar-brand:hover {
  transform: scale(1.02);
}

.burnt-text { color: var(--brand-cream); }
.and-text { color: var(--brand-yellow); padding: 0 5px; }
.orange-text { color: var(--brand-orange); }

/* Navigation Links */
.nav-link {
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--brand-cream) !important;
  margin: 0 10px;
  position: relative;
  transition: var(--nav-transition);
}

/* Sleek Underline Hover Effect */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -5px;
  left: 0;
  background-color: var(--brand-orange);
  transition: var(--nav-transition);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--brand-yellow) !important;
  transform: translateY(-2px);
}

/* Toggler / Hamburger Menu */
.nav-toggler-custom {
  border: 2px solid var(--brand-orange);
  padding: 5px;
}

.nav-toggler-custom:focus {
  box-shadow: 0 0 10px var(--brand-orange);
}

/* Offcanvas (Mobile Menu) Styling */
.offcanvas {
  background-color: var(--brand-brown) !important;
  border-left: 3px solid var(--brand-orange);
}

.offcanvas-title {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Active Link State */
.router-link-active.nav-link::after {
  width: 100%;
  background-color: var(--brand-yellow);
}

@media (max-width: 991px) {
  .nav-link {
    padding: 15px 0;
    border-bottom: 1px solid rgba(242, 233, 220, 0.1);
    margin: 0;
  }
  
  .nav-link::after {
    display: none; /* Hide underline animation on mobile for cleaner look */
  }
}
</style>
