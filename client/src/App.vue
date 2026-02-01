<script setup>
  import Navbar from "./components/NavbarComponent.vue"

</script>

<template>
  <Navbar/>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;

  background-color: var(#F2E9DC); 
  
  background-size: cover;
  background-position: center;
  background-attachment: fixed; 
  font-family: 'Archivo Narrow', sans-serif;
  color: #4B3633; 
}

body::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03; 
  pointer-events: none;
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
  z-index: 9999;
}

.main-content {
  position: relative;
  z-index: 2;
}
</style>
