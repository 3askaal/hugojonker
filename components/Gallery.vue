<template>
  <div class="gallery" v-masonry transition-duration="1s" gutter=".gallery__gutter">
    <div class="gallery__item" v-masonry-tile v-for="(image, imageIndex) of images" :key="imageIndex">
      <div class="gallery__gutter" />
      <img :src="image" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: []
    }
  },
}
</script>

<style lang="scss" scoped>
.gallery {
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.gallery__gutter {
  width: 1rem;
  display: block;
}

.gallery__item {
  max-width: calc(33.33% - 1rem);
  flex: 0 1 auto;
  object-fit: cover;
  object-position: center center;
  margin-bottom: 1rem;

  img {
    display: block;
    width: 100%;
  }
}
</style>
