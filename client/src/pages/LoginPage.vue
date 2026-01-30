<script setup>
import { ref, watch, onMounted } from "vue";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";
import api from "../api";
import { useRouter } from "vue-router";

const { user, getUserDetails } = useGlobalStore();
const router = useRouter();

const notyf = new Notyf;
const email = ref("");
const password = ref("");
const isEnabled = ref(false);

watch([email, password], (currentValue, oldValue) => {
    if (currentValue.every(field => field !== "")) {
        isEnabled.value = true;
    } else {
        isEnabled.value = false;
    }
});

onMounted(() => {
    if (user.token) router.push("/posts");
})

async function handleLogin(e) {
    e.preventDefault();
    user.isLoading = true;
    try {

        const response = await api.post("/users/login", {
            email : email.value,
            password : password.value
        });

        if (response.status === 200) {
            localStorage.setItem("token", response.data.access);
            await getUserDetails(response.data.access);
            email.value = "";
            password.value = "";
            notyf.success(response.data.message);
            router.push("/posts");
        }

    } catch (error) {
        const errMsg = error.response?.data?.message || "An error occured. Please try again."
        notyf.error(errMsg);
    } finally {
        user.isLoading = false;
    }
}


</script>

<template>
    <div class="container auth-container-custom">
        <div class="row w-100 d-flex align-items-center justify-content-center" style="min-height: calc(100vh - 75px);">
            <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
                <h2 class="text-center auth-header-custom mb-4">WELCOME <span>BACK!</span></h2>
                <form @submit="handleLogin">
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Email/Username</label>
                        <input type="text" class="form-control form-input-custom" placeholder="Email/Username" v-model="email">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Password</label>
                        <input type="password" class="form-control form-input-custom" placeholder="********" v-model="password">
                    </div>
                    <button type="submit" class="btn btn-custom w-100 mb-3" v-if="!user.isLoading && isEnabled">Log In</button>
                    <button type="submit" class="btn btn-custom w-100 mb-3" v-else-if="user.isLoading && isEnabled"><div class="spinner-grow"></div></button>
                    <button type="submit" class="btn btn-custom w-100 mb-3" disabled v-else>Log In</button>
                </form>
                <div class="mt-4 pt-3 border-top text-center border-secondary">
                    <p class="text-details">Don't have an account? <router-link to="/register" class="text-link fw-bold">Register here!</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template> 

<style scoped>
.auth-container-custom {

}

.auth-header-custom {

}

.text-details {

}

.text-text {

}

.form-input-custom {

}
.btn-custom {

}

.text-link {
    
}
</style> 