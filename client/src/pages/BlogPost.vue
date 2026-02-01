<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from "../stores/global";
import api from "../api";

const route = useRoute();
const { user } = useGlobalStore();

const post = ref(null);
const newComment = ref("");
const isLoading = ref(true);
const isAdmin = ref(user.role === 'admin');

// --- Data Fetching ---
async function fetchPost() {
  try {
    const res = await api.get(`/blogPosts/details/${route.params.postId}`);
    post.value = res.data;
  } catch (err) {
    console.error("Error fetching post", err);
  } finally {
    isLoading.value = false;
  }
}

// --- Interaction Logic ---
async function handleLike() { console.log("Post toasted!"); }
async function handleDislike() { console.log("Post burnt!"); }

// --- Comment Logic ---
async function handleCommentSubmit() {
  if (!newComment.value.trim()) return;
  console.log("Adding comment:", newComment.value);
  newComment.value = "";
}

async function editComment(id) { console.log("Editing comment:", id); }
async function deleteComment(id) { console.log("Deleting comment:", id); }

onBeforeMount(fetchPost);
</script>

<template>
  <div class="container-fluid container-md py-4 py-md-5" v-if="post">
    <div class="row mb-4">
      <div class="col-12">
        <router-link to="/posts" class="btn-back">← Back to Space</router-link>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-8">
        <article class="post-paper shadow-lg">
          
          <div class="post-img-wrapper" v-if="post.picture">
            <img :src="post.picture.path" class="img-fluid w-100" :alt="post.title">
          </div>

          <div class="post-content p-3 p-md-5">
            <h1 class="post-title mb-3">{{ post.title }}</h1>
            
            <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
              <div class="toast-controls">
                <button @click="handleLike" class="btn-toast">🍞</button>
                <span class="count">{{ post.likes?.length || 0 }}</span>
                <button @click="handleDislike" class="btn-toast">🔥</button>
              </div>
              <span class="author-badge">By {{ post.userId.username }}</span>
            </div>

            <p class="post-body-text">{{ post.content }}</p>
          </div>

          <section class="comment-section p-3 p-md-5">
            <h3 class="bevan-font mb-4">The Conversation</h3>

            <div class="mb-5">
              <textarea 
                v-model="newComment" 
                class="form-control comment-input mb-3" 
                placeholder="Write a little zest..." 
                rows="3"
              ></textarea>
              <button @click="handleCommentSubmit" class="btn btn-custom btn-primary">Add Note</button>
            </div>

            <div class="comment-list">
              <div v-for="comment in post.comments" :key="comment.id" class="comment-card mb-3 p-3">
                <div class="row align-items-start">
                  <div class="col">
                    <h6 class="comment-user">{{ comment.username }}</h6>
                    <p class="comment-text mb-0">{{ comment.text }}</p>
                  </div>
                  <div class="col-auto d-flex flex-column flex-sm-row gap-1">
                    <template v-if="user.id === comment.userId">
                      <button @click="editComment(comment.id)" class="btn-action">Edit</button>
                      <button @click="deleteComment(comment.id)" class="btn-action btn-delete">Delete</button>
                    </template>
                    <button v-else-if="isAdmin" @click="deleteComment(comment.id)" class="btn-action btn-admin">Admin Del</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="vh-100 d-flex align-items-center justify-content-center">
    <div class="spinner-grow text-orange"></div>
  </div>
</template>

<style scoped>
/* Scoped variables for clean design */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --transition: all 0.3s ease;
}

.post-paper {
  background: var(--brand-cream);
  border: 4px solid var(--brand-brown);
  border-radius: 4px;
}

/* Header & Typography */
.post-title {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
  line-height: 1.1;
}

.post-body-text {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.author-badge {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand-brown);
}

/* Toasting & Buttons */
.toast-controls {
  background: var(--brand-brown);
  padding: 5px 12px;
  border-radius: 50px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-toast {
  background: none; border: none; font-size: 1.2rem; transition: var(--transition);
}

.btn-toast:hover { transform: scale(1.3) rotate(15deg); }

.count { font-family: 'Bevan', serif; color: var(--brand-yellow); }

/* Comment System Styling */
.comment-section {
  background: rgba(75, 54, 51, 0.05);
  border-top: 4px solid var(--brand-brown);
}

.comment-input {
  border: 2px solid var(--brand-brown);
  font-family: 'Kalam', cursive;
}

.comment-card {
  background: white;
  border-left: 5px solid var(--brand-orange);
  box-shadow: 4px 4px 0px var(--brand-brown);
}

.comment-text { font-family: 'Kalam', cursive; font-size: 1.1rem; }

.btn-action {
  font-family: 'League Spartan', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  border: 2px solid var(--brand-brown);
  background: var(--brand-yellow);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-delete { background: #ff4d4d; color: white; }
.btn-admin { border-style: dashed; }

/* --- Mobile Responsiveness --- */
@media (max-width: 576px) {
  .post-paper {
    border-left: none;
    border-right: none;
    margin-left: -15px;
    margin-right: -15px;
  }
  
  .post-title { font-size: 2.2rem; }
  
  .btn-action {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
  }
}
</style>