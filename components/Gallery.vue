<template>
  <div class="gallery">
    <nuxt-link class="gallery__item" v-for="(item, itemIndex) of items" :to="`/projects/${item.slug}`" :key="itemIndex">
      <div class="gallery__item__wrap">
        <img class="gallery__item__image" :src="item.image" />
        <img class="gallery__item__overlay" :src="item.image" />
      </div>
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 1200px;
  max-height: 1200px;
  overflow: hidden;
  // margin: 0 auto;

  &:hover {
    .gallery__item__image {
      opacity: 0;
    }
  }
}

.gallery__item {
  flex: 1;
  max-width: calc(25% - 1rem);
  margin: 0.5rem;
  // display: block;
  // max-height: 500px;
  // margin-bottom: 1rem;
  object-fit: cover;
  object-position: center center;
  cursor: pointer;
  z-index: 100;

  .gallery__item__wrap {
    box-shadow: 0 0 0 1rem $white;
  }

  &:hover {
    position: static;

    .gallery__item__overlay {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      transition: all .4s ease;
    }

    // img {
    //   opacity: 1;
    //   pointer-events: none;
    // }

    .gallery__item__title {
      opacity: 1 !important;
    }
  }
}

.gallery__item__image {
  display: block;
  width: 100%;
}

.gallery__item__overlay {
  display: none;
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
