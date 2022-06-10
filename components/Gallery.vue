<template>
  <div class="wrapper">
    <div class="gallery" ref="gallery">
      <div class="gallery__logo" ref="logo">Hugo Jonker</div>
      <div
        v-for="(images, index) in cols"
        :key="`col-${index}`"
        :ref="`col${index}`"
        class="gallery__col"
      >
        <img
          v-for="image in images"
          :src="image.src"
          :key="`image-${image.src}`"
          :style="{
            top: `${image.top}px`,
          }"
          class="gallery__col__image"
        />
            <!-- opacity: image.hide && .2 -->
      </div>
      <!-- <nuxt-link class="gallery__item" v-for="(item, itemIndex) of items" :to="`/projects/${item.slug}`" :key="itemIndex">
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
    </div> -->
    </div>
  </div>
</template>

<script>
import { random, times, sampleSize } from 'lodash'

const elementsHit = (el1, el2) => {
  el1.offsetBottom = (el1.offsetTop || el1.top) + (el1.offsetHeight || el1.height);
  el1.offsetRight = (el1.offsetLeft || el1.left) + (el1.offsetWidth || el1.width);
  el2.offsetBottom = (el2.offsetTop || el2.top) + (el2.offsetHeight || el2.height);
  el2.offsetRight = (el2.offsetLeft || el2.left) + (el2.offsetWidth || el2.width);

  return !(
    (el1.offsetBottom < (el2.offsetTop || el2.top)) ||
    ((el1.offsetTop || el1.top) > el2.offsetBottom) ||
    (el1.offsetRight < (el2.offsetLeft || el2.left)) ||
    ((el1.offsetLeft || el1.left) > el2.offsetRight)
  )
}

const getImage = (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default {
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      cols: [[], [], [], []]
    }
  },
  async mounted() {
    this.cols = await this.generate()
    // setTimeout(() => {
    //   const gallery = this.$refs.gallery
    //   const galleryLeft = gallery.getBoundingClientRect().left
    //   const galleryTop = gallery.getBoundingClientRect().top
    //   this.galleryWidth = gallery.getBoundingClientRect().width
    //   this.galleryHeight = gallery.getBoundingClientRect().height

    //   this.$refs.overlays.forEach((ref, index) => {
    //     const left = ref.getBoundingClientRect().left - galleryLeft
    //     const top = ref.getBoundingClientRect().top - galleryTop
    //     const width = ref.getBoundingClientRect().width
    //     const height = ref.getBoundingClientRect().height

    //     console.log(index, top + 'px')

    //     this.$props.items[index].left = left
    //     this.$props.items[index].top = top
    //     this.$props.items[index].width = width
    //     this.$props.items[index].height = height

    //     console.log(
    //       left,
    //       top,
    //       width,
    //     )
    //   })
    // }, 1500)
  },
  methods: {
    mouseOver(index) {
      this.isHovering = index
    },
    async generate() {
      const amountCols = 4;
      const gutter = 16

      const logo = this.$refs.logo

      const cols = await Promise.all(times(amountCols, async (index) => {
        const colEl = this.$refs[`col${index}`][0];
        const colElWidth = colEl.getBoundingClientRect().width
        const colElLeft = colEl.getBoundingClientRect().left

        const colHitsLogo = elementsHit(colEl, logo)

        let currentTop = random(-20, -100);

        return await Promise.all(sampleSize(this.items, this.items.length / amountCols)
          .map(async (item) => {
            const image = await getImage(item.src)
            const imgWidth = Math.floor((colElWidth / image.width) / image.width)
            const imgHeight = Math.floor((colElWidth / image.width) * image.height)
            let imgTop = currentTop

            image.width = imgWidth
            image.height = imgHeight
            image.left = Math.floor(colElLeft)
            image.top = Math.floor(imgTop)

            const imageHitsLogo = colHitsLogo && elementsHit(image, logo)

            if (imageHitsLogo) {
              const logoHeight = logo.getBoundingClientRect().height
              const randomSpacing = 20
              imgTop = logo.offsetTop + logoHeight + randomSpacing
              currentTop = logo.offsetTop + logoHeight + randomSpacing
            }

            currentTop += imgHeight + gutter

            return {
              ...item,
              top: Math.floor(imgTop),
              hide: imageHitsLogo
            }
          }))
      }));

      return cols;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: block;
  /* max-height: 100vh; */
  width: 100%;
  overflow: hidden;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 800px;
  height: 120vh;
  overflow: hidden;
}

.gallery__logo {
  position: absolute;
  display: flex;
  top: 200px;
  align-items: center;
  justify-content: center;
  font-family: $font-logo;
  font-size: 3rem;
  line-height: 1;
  padding: 1rem;
  z-index: 9999;
}

.gallery__col {
  position: relative;
  flex: 1 0 calc(25% - 1rem);
  margin: 0 .5rem;
  height: 100%;
}

.gallery__col__image {
  position: absolute;
  width: 100%;
}

/* .gallery__item {
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
} */
</style>
