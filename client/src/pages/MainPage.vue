<template>
  <section class="hero-container d-flex align-items-center">
    <div class="container">
      <div class="row align-items-center g-5">
        
        <div class="col-lg-6 text-center text-lg-start">
          <div class="hero-badge mb-3">🚀 Welcome to the Space</div>
          <h1 class="hero-title mb-4">
            Where Every Note <br />
            <span class="text-highlight">Tells a Story</span>
          </h1>
          <p class="hero-subtitle mb-5">
            Join our community of thinkers and creators. Share your zest, 
            leave a note, and spark a conversation in our digital scrapbook.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
            <router-link to="/posts" class="btn-hero-primary">Explore Posts</router-link>
            <router-link v-if="!user" to="/register" class="btn-hero-secondary">Join the Orbit</router-link>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="hero-card-wrapper">
            <div class="hero-main-card shadow-lg">
              <div class="card-tape"></div>
              <img src="https://images.unsplash.com/photo-1517842645767-c639042777db" alt="Featured" class="hero-img">
              <div class="card-caption p-3">
                <p class="mb-0">"The best way to predict the future is to create it."</p>
              </div>
            </div>
            <div class="floating-stamp">✨</div>
            <div class="floating-note">Don't forget to toast! 🍞</div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { useGlobalStore } from "../stores/global";
const { user } = useGlobalStore();
</script>

<style scoped>
.hero-container {
  min-height: 85vh;
  background-color: #F2E9DC; /* Your brand-cream */
  padding: 100px 0;
  position: relative;
  overflow: hidden;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: #4B3633; /* brand-brown */
  color: #E8C547; /* brand-yellow */
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-family: 'Bevan', serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  color: #4B3633;
  line-height: 1.1;
}

.text-highlight {
  color: #D97324; /* brand-orange */
  position: relative;
  z-index: 1;
}

.hero-subtitle {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 1.25rem;
  color: #8c7b78;
  max-width: 500px;
}

/* Button Styles */
.btn-hero-primary {
  background: #D97324;
  color: white;
  padding: 15px 35px;
  font-family: 'Bevan', serif;
  text-decoration: none;
  border-radius: 4px;
  border: 3px solid #4B3633;
  box-shadow: 6px 6px 0px #4B3633;
  transition: all 0.2s ease;
}

.btn-hero-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px #4B3633;
}

.btn-hero-secondary {
  background: white;
  color: #4B3633;
  padding: 15px 35px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  text-decoration: none;
  border: 3px solid #4B3633;
  border-radius: 4px;
  transition: all 0.2s ease;
}

/* Visual Card Styles */
.hero-card-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-main-card {
  background: white;
  padding: 15px;
  border: 3px solid #4B3633;
  transform: rotate(3deg);
  max-width: 400px;
  position: relative;
}

.card-tape {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 40px;
  background: rgba(232, 197, 71, 0.6); /* Translucent yellow tape */
  box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
}

.hero-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border: 2px solid #4B3633;
}

.card-caption {
  font-family: 'Kalam', cursive;
  font-size: 1.2rem;
  color: #4B3633;
}

/* Animations & Floats */
.floating-stamp {
  position: absolute;
  top: -20px;
  right: 20px;
  font-size: 3rem;
  animation: float 4s ease-in-out infinite;
}

.floating-note {
  position: absolute;
  bottom: -30px;
  left: -20px;
  background: #E8C547;
  padding: 10px 20px;
  font-family: 'Kalam', cursive;
  border: 2px dashed #4B3633;
  transform: rotate(-10deg);
  animation: float 6s ease-in-out infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@media (max-width: 992px) {
  .hero-card-wrapper {
    margin-top: 50px;
  }
}
</style>