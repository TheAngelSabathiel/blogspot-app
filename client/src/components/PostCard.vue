<script setup>
const { postData } = defineProps({
    postData : Object
});

function handleContent(content) {
    if (content.length > 40) {
        content = content.slice(0,40);
        content += "..."
    }
    return content;
}

</script>

<template>
<div class="card col-md-4 card-custom">
  <img :src="postData.picture.path" class="card-img-top card-img-custom" v-if="postData.picture !== null">
  <div class="card-body">
    <h4 class="card-title text-sub-4">{{ postData.title }}</h4>
    <h5 class="card-text text-sub-5">Written by: {{ postData.userId.username }}</h5>
    <p class="card-text text-details">{{ handleContent(postData.content) }}</p>
    <div class="row align-items-center justify-content-between">
        <div class="col-auto mb-0 text-details">{{ postData.likes.length - postData.dislikes.length }} Toasts</div>
        <div class="col-auto">
            <router-link :to="{path : `/post/${postData._id}`}" class="btn btn-custom">View Post</router-link>
        </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.card-custom {

}

.card-img-custom {

}

.text-sub-4 {

}

.text-sub-5 {

}

.btn-custom {

}

.text-details {
    
}
</style>