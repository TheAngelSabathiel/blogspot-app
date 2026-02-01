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
<div class="card card-custom">
  <img :src="postData.picture.path" class="card-img-top card-img-custom" style="width : 100%" v-if="postData.picture !== null">
  <div class="card-body">
    <h4 class="card-title text-sub-4">{{ postData.title }}</h4>
    <h6 class="card-text text-sub-6">Written by: {{ postData.userId.username }}</h6>
    <p class="card-text text-details">{{ handleContent(postData.content) }}</p>
    <div class="row align-items-center justify-content-between">
        <div class="col-6 mb-0 text-details">🍞 {{ postData.likes.length - postData.dislikes.length }} Toasts</div>
        <div class="col-3">
            <router-link :to="{path : `/post/${postData._id}`}" class="btn btn-custom btn-primary">View</router-link>
        </div>
        <div class="col-3">
            <router-link to="/" class="btn btn-custom btn-secondary">Edit</router-link>
        </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Color Palette */
:deep() {
  --brand-brown: #4B3633;
  --brand-orange: #D97324;
  --brand-yellow: #E8C547;
  --brand-cream: #F2E9DC;
  --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
</style>