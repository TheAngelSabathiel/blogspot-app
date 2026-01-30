<script setup>
import { ref, onMounted, watch } from "vue";
import { Notyf } from "notyf";
import api from "../api";
import { useGlobalStore } from "../stores/global";
import { useRouter } from "vue-router";

const notyf = new Notyf;
const { user, getUserDetails } = useGlobalStore();
const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPass = ref("");
const isEnabled = ref(false);

watch([firstName, lastName, username, email, password, confirmPass] , (currentValue, oldValue) => {
    if (currentValue.every(input => input !== "") && currentValue[4] === currentValue[5]) {
        isEnabled.value = true;
    } else {
        isEnabled.value = false;
    }
});

async function handleRegister(e) {
    e.preventDefault();
    user.isLoading = true;

    try {
        const response = await api.post("/users/register", {
            firstName : firstName.value,
            lastName : lastName.value,
            username : username.value,
            email : email.value,
            password : password.value
        });

        if (response.status === 201) {
            notyf.success(response.data.message);
            
            const res = await api.post("/users/login", {
                email : email.value,
                password : password.value
            });

            notyf.success(res.data.message);

            localStorage.setItem("token", res.data.access);
            await getUserDetails(res.data.access);

            firstName.value = "",
            lastName.value = "",
            username.value = "",
            email.value = "",
            password.value = "",
            confirmPass.value = ""

            router.push("/posts");
        }

    } catch(error) {

        const errMsg = error.response?.data?.message || null;
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
                <h2 class="text-center auth-header-custom mb-4">REGISTER <span>HERE!</span></h2>
                <form @submit="handleRegister">
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">First Name</label>
                        <input type="text" class="form-control form-input-custom" placeholder="First Name" v-model="firstName">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Last Name</label>
                        <input type="text" class="form-control form-input-custom" placeholder="Last Name" v-model="lastName">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Username</label>
                        <input type="text" onkeydown="return event.key !== ' ' && event.key !== '@'"
                        oninput="this.value = this.value.replace(/\s|@/g, '')" class="form-control form-input-custom" placeholder="Username (No spaces and '@')" v-model="username">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Email/Username</label>
                        <input type="email" class="form-control form-input-custom" placeholder="Email/Username" v-model="email">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Password</label>
                        <input type="password" class="form-control form-input-custom" placeholder="********" v-model="password">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-text fw-bold">Confirm Password</label>
                        <input type="password" class="form-control form-input-custom" placeholder="********" v-model="confirmPass">
                    </div>
                    <button type="submit" class="btn btn-custom w-100 mb-3" v-if="isEnabled && !user.isLoading">Start Writing</button>
                    <button type="submit" class="btn btn-custom w-100 mb-3" v-else-if="isEnabled && user.isLoading"><div class="spinner-grow"></div></button>
                    <button type="submit" class="btn btn-custom w-100 mb-3" disabled v-else>Start Writing</button>
                </form>
                <div class="mt-4 pt-3 border-top text-center border-secondary">
                    <p class="text-details">Already have an account? <router-link to="/login" class="text-link fw-bold">Login.</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template> 