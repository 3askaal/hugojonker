<template>
  <div class="gallery" v-masonry transition-duration="1s" gutter=".gallery__gutter">
    <nuxt-link class="gallery__item" v-masonry-tile v-for="(item, itemIndex) of items" :to="`/projects/${item.slug}`" :key="imageIndex">
      <div class="gallery__gutter" />
      <div class="gallery__item__title">{{ item.title }}</div>
      <img :src="item.image" />
    </nuxt-link>
  </div>
</template>

<script>
import {} from 'lodash'

export default {
  props: {
    items: {
      type: Array,
      default: []
    }
  },
}
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;


  &:hover {
    img {
      opacity: 0;
    }
  }
}

.gallery__gutter {
  width: 0.1rem;
  display: block;
}

.gallery__item {
  position: relative;
  max-width: calc(25% - 1rem);
  flex: 0 1 auto;
  object-fit: cover;
  object-position: center center;
  margin-bottom: 0.1rem;
  cursor: pointer;
  z-index: 100;

  img {
    display: block;
    width: 100%;
  }

  &:before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 0 0.1rem $white;
  }

  &:hover {
    position: absolute;
    width: 100%;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    max-width: 100%;
    z-index: 0;
    transition: all .4s ease;

    img {
      opacity: 1;
    }

    .gallery__item__title {
      opacity: 1 !important;
    }
  }
}

.gallery__item__title {
  background-color: $white;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
}
</style>
