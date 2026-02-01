<script setup>
import {Notyf} from "notyf";
import api from "../api";       
import {ref} from "vue";
import { uploadPostPic, deleteUploadIfError } from "../cloudinaryFunc.js";

const notyf = new Notyf();
const { postData, userData } = defineProps({
    postData : Object,
    userData : String
});

    const isLoading = ref(false);
    const isEnabled = ref(false);
    const title = ref(postData.title);
    const post = ref(postData.content);
    const picture = ref(null);
    const blogPosts = ref([]);
    const imagePreview = ref(postData.picture?.path || null);

const emit = defineEmits(['loadPosts']);

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

function handleContent(content) {
    if (content.length > 40) {
        content = content.slice(0,40);
        content += "..."
    }
    return content;
}

function prelimEdit() {
    title.value = postData.title;
    post.value = postData.content;
    picture.value = null;
    imagePreview.value = postData.picture?.path || null;
}

async function deletePost(postData) {
    if (!confirm(`Are you sure you want to delete this post?`)) {
                return;
            }     
            console.log(postData._id);
      try {
        const response = await api.delete(`/blogPosts/delete/${postData._id}`);
        
        notyf.success(response.data.message);
      } catch (error) {
        notyf.error(error.response?.data?.message || "Deletion failed.");
      } finally {
        emit("loadPosts");
      }
}

async function handleEditPost(e) {
    e.preventDefault();
    isLoading.value = true;

    let pictureData = null;
    let deleteToken = null;

    try {
        if (picture.value) {
            const uploadRes = await uploadPostPic(picture.value);
            pictureData = uploadRes.pictureData;
            deleteToken = uploadRes.deleteToken;
        }


        const requests = [
            api.put(`/blogPosts/update/${postData._id}`, {
                title: title.value,
                content: post.value
            })
        ];

        if (pictureData) {
            requests.push(
                api.patch(`/blogPosts/update-pic/${postData._id}`, {
                    picture: pictureData
                })
            );
        }

        const responses = await Promise.all(requests);

        // 4. Success Handling
        const textSuccess = responses[0].status === 200;
        const picSuccess = requests.length > 1 ? responses[1].status === 200 : true;

        if (textSuccess && picSuccess) {
            notyf.success("Post updated successfully!");
            const closeBtn = document.querySelector('#editPost [data-bs-dismiss="modal"]');
            closeBtn?.click();
        }

    } catch (error) {
        if (deleteToken) {
            await deleteUploadIfError(deleteToken);
        }
        const errMsg = error.response?.data?.message || "An error occurred. Please try again.";
        notyf.error(errMsg);
    } finally {
        emit("loadPosts");
        isLoading.value = false;
    }
}

</script>

<template>
<div class="card card-custom">
    <div class="image-wrapper">
          <img :src="postData.picture.path" class="card-img-top card-img-custom" style="width : 100%" v-if="postData.picture !== null">
          <button class="delete-post text-danger fw-bold" @click="deletePost(postData)" v-if="userData === postData.userId._id">X</button>
    </div> 

  <div class="card-body">
    <h4 class="card-title text-sub-4">{{ postData.title }}</h4>
    <h6 class="card-text text-sub-6">Written by: {{ postData.userId.username }}</h6>
    <p class="card-text text-details">{{ handleContent(postData.content) }}</p>
    <div class="row align-items-center justify-content-between">
        <div class="col-6 mb-0 text-details">🍞 {{ postData.likes.length - postData.dislikes.length }} Toasts</div>
        <div class="col-3">
            <router-link :to="{path : `/post/${postData._id}`}" class="btn btn-custom btn-primary">View</router-link>
        </div>
        <div class="col-3" v-if="userData === postData.userId._id">
            <button type="button" class="btn btn-custom btn-secondary" data-bs-toggle="modal" data-bs-target="#editPost" @click="prelimEdit">Edit</button>
        </div>
    </div>
  </div>
</div>

    <!-- Edit Form Modal -->
    <div class="modal fade modal-custom container-fluid" id="editPost" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addNewPostLabel">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 modal-title-custom" id="addNewPostLabel">Edit Post</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body modal-body-custom">
            <form @submit="handleEditPost">
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
                    <button type="submit" class="btn btn-primary btn-custom ms-2">
                        <span v-show="!isLoading">Edit Post</span>
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
.image-wrapper {
    position: relative;
    display: inline-block;
}



/* Color Palette */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-post {
    position: absolute;
    top : 5px;
    right : 10px;
    background: none;
    border : none;
}

.card-custom {
  background-color: var(--brand-cream);
  border: 3px solid var(--brand-brown);
  border-radius: 15px;
  overflow: hidden;
  transition: var(--transition);
  height: 100%;
  box-shadow: 6px 6px 0px var(--brand-brown); /* Retro hard shadow */
}

.card-custom:hover {
  transform: translateY(-8px) rotate(-1deg);
  box-shadow: 12px 12px 0px var(--brand-orange);
}

.card-img-custom {
  object-fit: cover;
  height: 200px;
  border-bottom: 3px solid var(--brand-brown);
  transition: var(--transition);
}

.card-custom:hover .card-img-custom {
  filter: sepia(0.3) contrast(1.1);
}

/* Typography Classes */
.text-sub-4 {
  font-family: 'Bevan', serif;
  color: var(--brand-orange);
  text-transform: uppercase;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.text-sub-6 {
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  color: var(--brand-brown);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.text-details {
  font-family: 'Kalam', cursive;
  color: var(--brand-brown);
  font-size: 1rem;
  line-height: 1.2;
}

/* Button Styling */
.btn-custom {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  border-radius: 8px;
  border: 2px solid var(--brand-brown);
  padding: 5px 10px;
  transition: var(--transition);
  width: 100%;
}

.btn-primary.btn-custom {
  background-color: var(--brand-orange);
  color: var(--brand-cream);
}

.btn-secondary.btn-custom {
  background-color: var(--brand-yellow);
  color: var(--brand-brown);
}

.btn-custom:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
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
</style>