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
    <div class="container-fluid auth-container-custom">
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
@import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;700&family=Bevan&family=Kalam:wght@400;700&family=League+Spartan:wght@400;700;800&display=swap');

/* Local Design Variables */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.auth-container-custom {
  min-height: 100vh;
  /* subtle texture or solid cream to contrast the navbar */
  background-color: var(--brand-cream); 
}

/* Header Styling - Bevan Font */
.auth-header-custom {
  font-family: 'Bevan', serif;
  color: var(--brand-brown);
  letter-spacing: 2px;
  font-size: 2.2rem;
}

.auth-header-custom span {
  color: var(--brand-orange);
  display: block; /* Stacked look for impact */
  font-size: 3rem;
  line-height: 0.8;
}

/* Form Labels - League Spartan */
.text-text {
  font-family: 'League Spartan', sans-serif;
  color: var(--brand-brown);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Sleek Input Fields */
.form-input-custom {
  background-color: white;
  border: 2px solid var(--brand-brown);
  border-radius: 12px;
  font-family: 'Archivo Narrow', sans-serif;
  padding: 12px 15px;
  transition: var(--transition);
}

.form-input-custom:focus {
  border-color: var(--brand-orange);
  box-shadow: 5px 5px 0px var(--brand-orange); /* Hard shadow focus */
  outline: none;
}

/* The Tactile Button */
.btn-custom {
  font-family: 'League Spartan', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid var(--brand-brown);
  background-color: var(--brand-orange);
  color: var(--brand-cream);
  transition: var(--transition);
  box-shadow: 4px 4px 0px var(--brand-brown);
}

.btn-custom:hover:not(:disabled) {
  background-color: var(--brand-yellow);
  color: var(--brand-brown);
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0px var(--brand-brown);
}

.btn-custom:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px transparent;
}

.btn-custom:disabled {
  background-color: #ccc;
  border-color: #999;
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
}

/* Footer Details - Kalam */
.text-details {
  font-family: 'Kalam', cursive;
  font-size: 1.1rem;
  color: var(--brand-brown);
}

.text-link {
  color: var(--brand-orange);
  text-decoration: none;
  transition: var(--nav-transition);
}

.text-link:hover {
  color: var(--brand-yellow);
  text-decoration: underline;
}

/* Spinner adjustment */
.spinner-grow {
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--brand-brown);
}
</style> 