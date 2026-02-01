<script setup>
	import { useGlobalStore } from "../stores/global";
	import { Notyf } from "notyf";
	import api from "../api";
	import { watch, ref, onBeforeMount, computed } from "vue";
	import PostCard from "../components/PostCard.vue";
	import { useRoute } from 'vue-router';
	let { user, getUserDetails } = useGlobalStore();
	import { uploadPostPic, deleteUploadIfError } from "../cloudinaryFunc.js";

	const notyf = new Notyf();
	const route = useRoute();

	const isLoading = ref(false);
	const isEnabled = ref(false);
	const title = ref("");
	const post = ref("");
	const picture = ref(null);
	const blogPosts = ref([]);
	const imagePreview = ref(null);
	const userDataId = ref(user.id);

	async function handleAddPost(e) {
		e.preventDefault();
		isLoading.value = true;

		let pictureData = null;
    let deleteToken = null;

		try {
			if (picture.value) {
				const uploadRes = await uploadPostPic(picture.value);
				pictureData = uploadRes.pictureData;
				deleteToken = uploadRes.deleteToken;
			} else {
				pictureData = null;
				deleteToken = null;
			}
			const response = await api.post("/blogPosts/", {
				title : title.value,
				content : post.value,
				picture : pictureData
			});

			if (response.status === 201) {
				notyf.success(response.data.message);
				title.value = "";
				post.value = "";
				picture.path = null;
				picture.fileName = null;
				const closeBtn = document.querySelector('#addNewPost [data-bs-dismiss="modal"]');
    		closeBtn?.click();
			}

		} catch(error) {

			if (deleteToken) {
				await deleteUploadIfError(deleteToken);
			}
			const errMsg = error.response?.data?.message || "An error occured. Please try again."
      notyf.error(errMsg);
		} finally {
			loadProfilePage();
			isLoading.value = false;
		}
	}

	async function handleFileUpload(event) {
		const file = event.target.files[0];
	  if (file) {
	    picture.value = file;
	    imagePreview.value = URL.createObjectURL(file);
	  }
	}

	function removeImage() {
		picture.value = null;
		imagePreview.value = null;
	}

	watch([title, post], (currentValue, oldValue) => {
		if (currentValue.every(field => field !== "")) isEnabled.value = true;
		else isEnabled.value = false;
	})

	onBeforeMount(async () => {

		await getUserDetails(localStorage.getItem("token"));
		const res = await api.get(`/blogPosts/blogs/${route.params.userId}`);
		blogPosts.value = res.data;
	});

	async function loadProfilePage() {
		const res = await api.get(`/blogPosts/blogs/${route.params.userId}`);
		blogPosts.value = res.data;
	}

	const currentUser = computed(() => useGlobalStore.user);

</script>

<template>
	<div class="container card mt-5 profile-card">
		<div class="row g-2 d-flex justify-content-center align-items-center">
			<div class="col-2 p-3 profile-img-wrapper">
				<img :src="user.picture?.path || `/images/placeholderuser.jpg`" class="img-fluid rounded-circle profile-img">
<!-- 				<button class="edit-avatar-badge" title="Change Photo">
            		&#9999;
          		</button> -->
			</div>
			<div class="col-1">
				
			</div>
			<div class="col-9 p-3">
				<h1 class="profile-username">{{user.username}}</h1>
				<h2 class="profile-name">{{user.firstName +" "+ user.lastName}}</h2>
				<p class="profile-info">{{user.displayInfo}} aa</p>
			</div>
		</div>
		<button type="button" class="m-2 btn btn-md btn-primary btn-custom" data-bs-toggle="modal" data-bs-target="#addNewPost">Add New Post</button>
	</div>

	<div class="container my-4" v-if="blogPosts.length > 0">
		<h2 class="text-sub text-center post-text"> Posts</h2>
		<div class="row g-3">
			<div
			class="col-12 col-md-6 col-lg-4"
			v-for="post in blogPosts"
			>
				<PostCard :postData="post" :userData="user.id" @loadPosts="loadProfilePage"/>
			</div>
		</div>
	</div>
	<div class="card container my-4 p-2 text-center" v-else>
		<h2 class="no-value-text"> No written posts yet. </h2>
		<h5>Click "Add New Post" to start writing.</h5>
	</div>


	<!-- Add Form Modal -->
	<div class="modal fade modal-custom container-fluid" id="addNewPost" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addNewPostLabel">
	  <div class="modal-dialog modal-lg">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h1 class="modal-title fs-5 modal-title-custom" id="addNewPostLabel">Create Post</h1>
	        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	      </div>
	      <div class="modal-body modal-body-custom">
	      	<form @submit="handleAddPost">
	      		<div class="mb-3">
		      		<label class="form-label small text-text fw-bold">Post Title</label>
	          	<input type="text" class="form-control form-input-custom" placeholder="Title" v-model="title">
	        	</div>
	        	<div class="mb-3">
		      		<label class="form-label small text-text fw-bold">Post Body</label>
	          	<textarea type="text" class="form-control form-input-custom" rows=10 placeholder="Post" v-model="post">
	          	</textarea>
	        	</div>
	        	<div class="mb-3">
							<label class="form-label small text-text fw-bold">Post Picture</label>
							<input type="file" class="form-control" accept="image/*" @change="handleFileUpload"/>
				
							<div v-if="imagePreview" class="mt-2 text-center">
								<img :src="imagePreview" class="img-thumbnail" style="max-height: 400px;" />
								<div class="mt-2">
            			<button type="button" class="btn btn-sm btn-outline-danger" @click="removeImage">
              			Remove Selected Image
            			</button>
          			</div>
							</div>
						</div>
	        	<div class="mb-3 d-flex justify-content-end">
	        		<button type="button" class="btn btn-secondary btn-custom ms-2" data-bs-dismiss="modal">Close</button>
		        	<button type="submit" class="btn btn-primary btn-custom ms-2" :disabled="!isEnabled">
		        		<span v-show="!isLoading">Add Post</span>
		        		<div class="spinner-grow" v-show="isLoading"></div>
		      		</button>
	        	</div>
	      	</form>
	      </div>
	    </div>
	  </div>
	</div>

	
</template>

<style scoped>
/* Color & Font Palette */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.2);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* --- Profile Section --- */
.profile-card {
  background-color: var(--brand-brown);
  border: none;
  border-radius: 20px;
  color: var(--brand-cream);
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
}

.profile-card:hover {
  transform: translateY(-5px);
}

.profile-username {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
  text-transform: uppercase;
}

.profile-name {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
}

.profile-info {
  font-family: 'Kalam', cursive;
  color: var(--brand-yellow);
}

/* --- The Avatar & Badge Positioning --- */
.profile-img-wrapper {
  position: relative; 
  display: inline-block;
  width: 130px; 
  height: 130px;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--brand-orange);
  background: var(--brand-cream);
  transition: var(--transition);
}

.edit-avatar-badge {
  /* Positioning Logic */
  position: absolute;
  bottom: 5px;
  right: 5px;
  
  /* Styling */
  background: var(--brand-orange);
  color: var(--brand-cream);
  border: 3px solid var(--brand-brown);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  
  /* Content Centering */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  
  /* Sleek Effects */
  cursor: pointer;
  z-index: 10;
  transition: var(--transition);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.edit-avatar-badge:hover {
  background: var(--brand-yellow);
  color: var(--brand-brown);
  transform: scale(1.15) rotate(15deg);
  box-shadow: 0 0 15px var(--brand-orange);
}

/* --- Modal & Forms --- */
.modal-content {
  background-color: var(--brand-brown);
  border: 2px solid var(--brand-orange);
  border-radius: 24px;
  color: var(--brand-cream);
}

.modal-title-custom {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
}

.form-input-custom {
  background: var(--brand-cream);
  font-family: 'Archivo Narrow', sans-serif;
  border-radius: 10px;
  border: 2px solid transparent;
}

.form-input-custom:focus {
  border-color: var(--brand-orange);
  box-shadow: 0 0 10px rgba(217, 115, 36, 0.4);
}

/* --- Buttons --- */
.btn-custom {
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  border-radius: 12px;
  padding: 8px 20px;
  transition: var(--transition);
}

.btn-primary.btn-custom {
  background: var(--brand-orange);
  border: none;
  color: var(--brand-cream);
}

.btn-primary.btn-custom:hover:not(:disabled) {
  background: var(--brand-yellow);
  color: var(--brand-brown);
  transform: translateY(-2px);
}

/* --- Section Titles --- */
.post-text {
  font-family: 'Bevan', serif;
  color: var(--brand-brown);
  text-align: center;
  margin-top: 2rem;
}

.no-value-text {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
}
</style>