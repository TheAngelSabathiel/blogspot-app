import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "../api";

export const useGlobalStore = defineStore("global", () => {

	let user = reactive({
		token : localStorage.getItem("token"),
		email : null,
		username : null,
		firstName : null,
		lastName : null,
		isAdmin : false,
		displayInfo : null,
		picture : null,
		id : null,
		isLoading : false
	});

	async function getUserDetails(token) {
		if (!token) {
			user.token = null;
			user.email = null;
			user.username = null;
			user.firstName = null;
			user.lastName = null;
			user.isAdmin = false;
			user.displayInfo = null;
			user.picture = null;
			user.id = null;
			user.isLoading = false;
		}

		user.isLoading = true;

		const response = await api.get("/users/details");
			user.token = token;
			user.email = response.data.email;
			user.username = response.data.username;
			user.firstName = response.data.firstName;
			user.lastName = response.data.lastName;
			user.isAdmin = response.data.isAdmin;
			user.displayInfo = response.data.displayInfo;
			user.picture = response.data.picture;
			user.id = response.data._id;
			user.isLoading = false;
	}

	function logout() {
		localStorage.clear();

		user.token = null;
		user.email = null;
		user.username = null;
		user.firstName = null;
		user.lastName = null;
		user.isAdmin = false;
		user.displayInfo = null;
		user.picture = null;
		user.id = null;
		user.isLoading = false;
	}

	return {
		user,
		getUserDetails,
		logout
	};
}); 