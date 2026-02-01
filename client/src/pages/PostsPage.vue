<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import PostCard from "../components/PostCard.vue";

const allPosts = ref([]);
const isLoading = ref(true);

async function fetchPosts() {
    try {
        const res = await api.get("/blogPosts");
        allPosts.value = res.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchPosts);
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-5 mt-3">
      <h1 class="posts-title">COMMUNAL <span>SPACE</span></h1>
      <p class="posts-subtitle">No Gatekeepers. Just Zest.</p>
    </div>

    <hr class="divider-custom mx-auto mb-5">

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-grow text-orange" role="status"></div>
      <p class="text-details mt-2">Toasting the posts...</p>
    </div>

    <div class="row g-4" v-else-if="allPosts.length > 0">
      <div 
        class="col-12 col-md-6 col-lg-4" 
        v-for="post in allPosts" 
        :key="post._id"
      >
        <PostCard :postData="post" />
      </div>
    </div>

    <div v-else class="text-center py-5 empty-state">
      <h3 class="no-value-text">The toaster is empty!</h3>
      <p class="text-details">Check back later for fresh zest.</p>
    </div>
  </div>
</template>

<style scoped>
/* Typography */
.posts-title {
  font-family: 'Bevan', serif;
  color: #4B3633;
  font-size: clamp(2.5rem, 8vw, 4rem); /* Responsive sizing */
  letter-spacing: -1px;
  text-transform: uppercase;
}

.posts-title span {
  color: #D97324;
}

.posts-subtitle {
  font-family: 'Kalam', cursive;
  font-size: 1.4rem;
  color: #4B3633;
  margin-top: -10px;
  opacity: 0.9;
}

/* Custom Ribbon-Style Divider */
.divider-custom {
  width: 100px;
  height: 6px;
  background-color: #D97324;
  border: none;
  opacity: 1;
  border-radius: 3px;
}

/* Layout States */
.text-orange {
  color: #D97324;
}

.text-details {
  font-family: 'Kalam', cursive;
  font-size: 1.1rem;
}

.no-value-text {
  font-family: 'Bevan', serif;
  color: #D97324;
  font-size: 2rem;
}

.empty-state {
  background: rgba(242, 233, 220, 0.4);
  border: 3px dashed #4B3633;
  border-radius: 30px;
  max-width: 600px;
  margin: 0 auto;
}

/* Ensuring the grid handles different screen heights */
.row {
  min-height: 400px;
}
</style>