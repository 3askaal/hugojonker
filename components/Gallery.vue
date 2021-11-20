<template>
  <div class="wrapper">
    <div class="gallery" ref="gallery">
      <nuxt-link class="gallery__item" v-for="(item, itemIndex) of items" :to="`/projects/${item.slug}`" :key="itemIndex">
        <div class="gallery__item__wrap"
          @mouseenter="() => mouseOver(itemIndex)"
          @mouseleave="() => mouseOver(null)"
        >
          <img class="gallery__item__image" :src="item.image" />
          <div class="gallery__item__overlay"
            ref="overlays"
            :style="{
              ...isHovering === itemIndex && {
                width: `${galleryWidth}px`,
                height: `${galleryHeight}px`
              },
              transform: isHovering === itemIndex ?
                `translate(-${items[itemIndex].left}px, -${items[itemIndex].top}px)` :
                null
            }"
          >
            <img :src="item.image" />
          </div>
        </div>
      </nuxt-link>
    </div>
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
  data() {
    return {
      isHovering: null,
      galleryWidth: null,
      galleryheight: null,
      gallerySpace: 400
    }
  },
  mounted() {
    setTimeout(() => {
      const gallery = this.$refs.gallery
      const galleryLeft = gallery.getBoundingClientRect().left
      const galleryTop = gallery.getBoundingClientRect().top
      this.galleryWidth = gallery.getBoundingClientRect().width
      this.galleryHeight = gallery.getBoundingClientRect().height

      this.$refs.overlays.forEach((ref, index) => {
        const left = ref.getBoundingClientRect().left - galleryLeft
        const top = ref.getBoundingClientRect().top - galleryTop
        const width = ref.getBoundingClientRect().width
        const height = ref.getBoundingClientRect().height

        console.log(index, top + 'px')

        this.$props.items[index].left = left
        this.$props.items[index].top = top
        this.$props.items[index].width = width
        this.$props.items[index].height = height

        console.log(
          left,
          top,
          width,
          // galleryWidth,
        )
      })
    }, 1500)
  },
  methods: {
    mouseOver(index) {
      this.isHovering = index
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: block;
  max-height: 600px;
  width: 100%;
  overflow: hidden;
}

.gallery {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 600px;
  max-height: 800px;
  overflow: hidden;
  // margin: 0 auto;

  &:hover {
    .gallery__item__image {
      opacity: 0;
    }
  }
}

.gallery__item {
  position: relative;
  display: block;
  max-width: calc(25% - .25rem);
  height: 25%;
  margin: 0.125rem;
  cursor: pointer;
  z-index: 100;

  .gallery__item__wrap {
    position: relative;
    box-shadow: 0 0 0 .25rem $black;
  }

  &:hover {
    z-index: 0;

    .gallery__item__wrap {
      position: static;
    }

    .gallery__item__overlay {
      display: block;
      opacity: 1;
      z-index: -1;
    }

    img {
      opacity: 1;
      pointer-events: none;
    }

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
  // display: none;
  opacity: 0;
  display: block;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform .5s ease, width .5s ease, height .5s ease;

  img {
    object-fit: cover;
    object-position: center center;
    width: 100%;
    height: 100%;
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
