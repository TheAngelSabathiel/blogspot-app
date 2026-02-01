<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from "../stores/global";
import api from "../api";
import { Notyf } from "notyf";

const notyf = new Notyf();
const route = useRoute();
const { user, getUserDetails } = useGlobalStore();

const post = ref(null);
const newComment = ref("");
const editCommentText = ref("");
const isLoading = ref(true);
const isAdmin = ref(user.isAdmin);
const isEnabled = ref(false);

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
}

function handleCommentDate(date) {
    const past = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now - past) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };


    for (let unit in intervals) {
        const value = Math.floor(seconds / intervals[unit]);
        if (value >= 1) {
            return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}

async function fetchPost() {
  try {
    const res = await api.get(`/blogPosts/details/${route.params.postId}`);
    post.value = res.data;
    post.value.comments = post.value.comments.sort((a, b) => {
    return new Date(b.commentedAt) - new Date(a.commentedAt);
  });
  } catch (err) {
    console.error("Error fetching post", err);
  } finally {
    isLoading.value = false;
  }
}

computed(() => {
  if (!post.value?.comments) return [];

});

async function handleLike() {
	try {
		const response = await api.patch(`/blogPosts/like/${route.params.postId}`);
		notyf.success(response.data.message)

	} catch (error) {
		const errMsg = error.response?.data?.message || null;
        notyf.error(errMsg);
	} finally {
		fetchPost();
	}
}

async function handleDislike() { 
	try {
		const response = await api.patch(`/blogPosts/dislike/${route.params.postId}`);
		notyf.success(response.data.message)

	} catch (error) {
		const errMsg = error.response?.data?.message || null;
        notyf.error(errMsg);
	} finally {
		fetchPost();
	}
}

async function handleCommentSubmit() {
	try {
		const response = await api.post(`/blogPosts/comment/${route.params.postId}`, {
			comment : newComment.value
		});
		notyf.success(response.data.message)

	} catch (error) {
		const errMsg = error.response?.data?.message || null;
        notyf.error(errMsg);
	} finally {
		fetchPost();
	}
}

const editingId = ref(null);

function startEdit(comment) {
  editingId.value = comment._id;
  editCommentText.value = comment.comment;
}

function closeEdit() {
  editingId.value = null;
  editCommentText.value = "";
}

async function handleEditComment(comment) {
  try {
    const response = await api.patch(`/blogPosts/comment/${route.params.postId}`, {
      commentId: comment._id,
      newComment: editCommentText.value
    });
    notyf.success(response.data.message);
    editingId.value = null;
    fetchPost();
  } catch (error) {
    notyf.error(error.response?.data?.message || "Update failed.");
  }
}

async function handleDeleteComment(comment) {
	if (!confirm(`Are you sure you want to delete this comment?`)) {
	            return;
	        }	  
	  try {
	    const response = await api.delete(`/blogPosts/comment/${route.params.postId}`, {data : {commentId: comment._id}}
	    	);
	    
	    notyf.success(response.data.message);
	    fetchPost();
	  } catch (error) {
	    notyf.error(error.response?.data?.message || "Deletion failed.");
	  }
}


onBeforeMount(async () => {
		await Promise.all([
        fetchPost(),
        getUserDetails(localStorage.getItem("token"))
    	]);
});
</script>

<template>
  <div class="container-fluid container-md py-4" v-if="post">
    <div class="row mb-3">
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

          <div class="post-content p-3 p-md-5 pb-0"> <h1 class="post-title">{{ post.title }}</h1>
            <div class="mb-3">
               <h4 class="author-badge d-inline">By {{ post.userId.username }}</h4>
               <span class="text-muted mx-2">•</span>
               <span class="date-badge">{{ formatDate(post.creationDate) }}</span>
            </div>
            
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="toast-controls">
                <button @click="handleLike" class="btn-toast">🍞</button>
                <span class="count mx-2">{{ post.likes.length - post.dislikes.length || 0 }}</span>
                <button @click="handleDislike" class="btn-toast">🔥</button>
              </div>
            </div>

            <div class="post-content-paper p-3 p-md-4 mb-4">
              <p class="post-body-text mb-0">{{ post.content }}</p>
            </div>
            
            <div class="d-flex justify-content-center">
               <div class="mini-divider"></div>
            </div>
          </div>

          <section class="comment-section p-3 p-md-5 pt-4"> <h3 class="bevan-font mb-4">The Conversation</h3>

            <div class="comment-input-area mb-5" v-if="user.token">
              <textarea v-model="newComment" class="form-control comment-input mb-3" placeholder="Write a little zest..." rows="3"></textarea>
              <button @click="handleCommentSubmit" class="btn btn-custom btn-primary " :disabled="newComment === ''">Add Note</button>
            </div>

            <div class="comment-list">
              <div v-for="comment in post.comments" :key="comment._id" class="comment-card mb-3 p-3">
                <div class="row align-items-center g-3">
				  <div class="col-auto">
				    <div class="comment-avatar-wrapper">
				      <img v-if="comment.commentingUserId.picture?.path" :src="comment.commentingUserId.picture.path" class="comment-avatar">
				      <div v-else class="comment-avatar-fallback">{{ comment.commentingUserId.username.charAt(0) }}</div>
				    </div>
				  </div>

				  <div class="col">
				    <div class="d-flex align-items-center gap-2 mb-1">
				      <h6 class="comment-user mb-0">{{ comment.commentingUserId.username }}</h6>
				      <span class="comment-date">• {{ handleCommentDate(comment.commentedAt) }}</span>
				    </div>
				    
				    <p v-if="editingId !== comment._id" class="comment-text mb-0">{{ comment.comment }}</p>
				    
				    <textarea 
				      v-else 
				      class="form-control comment-input mt-2 w-100" 
				      v-model="editCommentText"
				    ></textarea>
				  </div>

				  <div v-if="user.id === comment.commentingUserId._id" class="col-auto d-flex flex-column flex-sm-row gap-1">
				  	<div v-if="editingId !== comment._id">
				  		<button @click="startEdit(comment)" class="btn-action">Edit</button>
				      	<button @click="handleDeleteComment(comment)" class="btn-action btn-delete">Delete</button>
				  	</div>
				  	<div v-else>
				  		<button @click="handleEditComment(comment)" class="btn-action">Save</button>
				      	<button @click="closeEdit" class="btn-action btn-delete">Close</button>
				  	</div>
				  </div>
				  <div v-else-if="user.isAdmin" class="col-auto d-flex flex-column flex-sm-row gap-1">
				    <button @click="handleDeleteComment(comment)" class="btn-action btn-admin">Admin Del</button>
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
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --text-muted: #8c7b78;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.post-paper {
  background: var(--brand-cream);
  border: 4px solid var(--brand-brown);
  border-radius: 4px;
  overflow: hidden;
}

.post-title {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
}

.author-badge {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  color: var(--brand-brown);
  text-transform: uppercase;
  font-size: 1.1rem;
}

.date-badge {
  font-family: 'Archivo Narrow', sans-serif;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.toast-controls {
  background: var(--brand-brown);
  padding: 5px 12px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  border: 2px solid var(--brand-orange);
}

.btn-toast {
  background: none;
  border: none;
  font-size: 1.2rem;
  transition: var(--transition);
}

.btn-toast:hover {
  transform: scale(1.2) rotate(10deg);
}

.count {
  font-family: 'Bevan', serif;
  color: var(--brand-yellow);
}

.post-content-paper {
  background-color: white;
  border: 2px solid var(--brand-brown);
  border-radius: 8px;
  position: relative;
  box-shadow: 5px 5px 0px var(--brand-yellow);
}

.post-content-paper::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 20px;
  width: 40px;
  height: 20px;
  background: rgba(217, 115, 36, 0.3);
  transform: rotate(-5deg);
}

.post-body-text {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--brand-brown);
  white-space: pre-wrap;
}

.mini-divider {
  width: 60px;
  height: 3px;
  background: var(--brand-brown);
  opacity: 0.2;
  border-radius: 2px;
}

.comment-section {
  background: rgba(75, 54, 51, 0.04);
  border-top: 2px dashed var(--brand-brown);
}

.comment-input {
  border: 2px solid var(--brand-brown);
  font-family: 'Kalam', cursive;
  border-radius: 12px;
}

.comment-card {
  background: white;
  border-left: 5px solid var(--brand-orange);
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 4px 0px var(--brand-brown);
}

.comment-user {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  color: var(--brand-brown);
}

.comment-date {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-text {
  font-family: 'Kalam', cursive;
  font-size: 1.1rem;
}

.comment-avatar-wrapper {
  width: 45px;
  height: 45px;
}

.comment-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--brand-brown);
}

.comment-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--brand-yellow);
  color: var(--brand-brown);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bevan', serif;
  border: 2px solid var(--brand-brown);
}

.btn-action {
  font-family: 'League Spartan', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  border: 2px solid var(--brand-brown);
  background: var(--brand-cream);
  padding: 3px 8px;
  border-radius: 6px;
}

.btn-delete {
  color: #ff4d4d;
  border-color: #ff4d4d;
}

.btn-admin {
  border-style: dashed;
  background: var(--brand-yellow);
}

.btn-back {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  color: var(--brand-brown);
  text-decoration: none;
  text-transform: uppercase;
}

.btn-back:hover {
  color: var(--brand-orange);
}

@media (max-width: 576px) {
  .post-paper {
    border-radius: 0;
    border-left: none;
    border-right: none;
    margin-left: -15px;
    margin-right: -15px;
  }
  .post-content-paper {
    box-shadow: 3px 3px 0px var(--brand-yellow);
  }
}
</style>