<script setup>
    import { useGlobalStore } from "../stores/global";
    import { onMounted } from "vue";
    import { useRouter } from "vue-router";
    import { Notyf } from "notyf";

    const router = useRouter();
    const { logout } = useGlobalStore();
    const notyf = new Notyf();

    onMounted(() => {
        logout();

        notyf.success("Logged out successfully.");

        router.push("/");
    });

</script>

<template>
</template>