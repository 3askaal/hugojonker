<template>
  <div class="gallery">
    <div class="gallery__item" v-for="(image, imageIndex) of images" :key="imageIndex">
      <img :src="image" />
      <div class="gallery__item__gutter" />
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
  // display: flex;
  // justify-content: space-between;

  // display: grid;
  // gap: 1rem;
  // grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  // grid-template-rows: masonry;
  column-fill: initial;
  column-gap: 1rem;
  column-count: 4;
  height: calc(1200px + 2rem);
}

// .gallery__gutter {
//   width: 1rem;
//   display: block;
// }

.gallery__item {
  // max-width: calc(25% - 1rem);
  // flex: 0 1 auto;
  object-fit: cover;
  object-position: center center;
  // margin-bottom: 1rem;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
  }
}

.gallery__item__gutter {
  display: inline-block;
  background-color: $red;
  width: 100%;
}
</style>
