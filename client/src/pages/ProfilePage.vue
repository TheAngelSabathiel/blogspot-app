<script setup>
	import { useGlobalStore } from "../stores/global";
	import { Notyf } from "notyf";
	import api from "../api";
	import { ref, onBeforeMount } from "vue";
	let { user, getUserDetails } = useGlobalStore();

	onBeforeMount(() => {
		getUserDetails(localStorage.getItem("token"));
	})
</script>

<template>
	<div class="container card mt-5 profile-card">
		<div class="row g-2 d-flex justify-content-center align-items-center">
			<div class="col-2 p-3 profile-img-wrapper">
				<img :src="user.picture?.path || `/images/placeholderuser.jpg`" class="img-fluid rounded-circle profile-img">
				<button class="edit-avatar-badge" title="Change Photo">
            		&#9999;
          		</button>
			</div>
			<div class="col-1">
				
			</div>
			<div class="col-9 p-3">
				<h1 class="profile-username">{{user.username}}</h1>
				<h2 class="profile-name">{{user.firstName +" "+ user.lastName}}</h2>
				<p class="profile-info">{{user.displayInfo}} aa</p>
			</div>
		</div>

	</div>
</template>

<style scoped>
.profile-img-wrapper {
  position: relative;
  display: inline-block;
  padding: 10px;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #1a1a1a;
}

.edit-avatar-badge {
  position: absolute;
  bottom: 17px;
  right: 17px;
  background: #ffffff;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  padding: 5px 8px;
  border-radius: 50%;
  font-size: 0.8rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  cursor: pointer;
}

.profile-username {

}

.profile-name {

}

.profile-info {

}

.profile-card {

}
</style>