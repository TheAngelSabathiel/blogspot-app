import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "notyf/notyf.min.css";
import './assets/main.css';

import { createPinia } from "pinia";
import { createApp } from 'vue';
import App from './App.vue';

// Import Route Components;
import MainPage from "./pages/MainPage.vue";
import PostsPage from "./pages/PostsPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import LogoutPage from "./pages/Logout.vue";
import BlogPost from "./pages/BlogPost.vue";
import ProfilePage from "./pages/ProfilePage.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history : createWebHistory(),
	routes : [
		{
			path : "/",
			name : "Main",
			component : MainPage
		},
		{
			path : "/posts",
			name : "Posts",
			component : PostsPage
		},
		{
			path : "/login",
			name : "Login",
			component : LoginPage
		},
		{
			path : "/register",
			name : "Register",
			component : RegisterPage
		},
		{
			path : "/logout",
			name : "Logout",
			component : LogoutPage
		},
		{
			path : "/user/:userId",
			name : "Profile",
			component : ProfilePage
		},
		{
			path : "/post/:postId",
			name : "BlogPost",
			component : BlogPost
		}
	]
});


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');