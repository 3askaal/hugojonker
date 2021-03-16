<template>
  <div class="gallery">
    <div class="gallery__item" v-for="(image, imageIndex) of images" :key="imageIndex">
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
</script>>

<style lang="scss" scoped>
.gallery {
  display: flex;
	flex-direction: column;
	flex-wrap: wrap;
  align-content: stretch;
  align-items: stretch;
  width: 100%;
  height: 100vw;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

.gallery__item {
  flex: 0 1 auto;
  overflow: hidden;
  width: 200px;
  overflow: hidden;
  border: 1px solid $purple;

  img {
    display: block;
    // width: 100%;
  }
}
</style>
