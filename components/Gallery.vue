<template>
  <div class="wrapper">
    <div class="gallery" ref="gallery">
      <div class="gallery__logo" ref="logo">Hugo Jonker</div>
      <div
        v-for="(col, index) in cols"
        :ref="`col${index}`"
        :key="`col-${index}`"
        class="gallery__col"
      >
        <div
          v-if="col.items && col.items.length"
          class="gallery__col__image gallery__col__image--placeholder"
          :style="{
            height: `${col.items[0].top - gutter + 100 + (col.colMargin || 0)}px`
          }"
        />
        <img
          v-for="image in col.items"
          :src="image.src"
          :key="`image-${image.src}`"
          :style="{
            top: `${image.top}px`,
            transform: col.hitsAtIndex && image.top < col.colLogoTop && `translateY(${col.colMargin}px)`
          }"
          class="gallery__col__image"
        />
        <div class="gallery__col__image gallery__col__image--placeholder" />
      </div>
    </div>
  </div>
</template>

<script>
import { random, times, sampleSize, sortBy } from 'lodash'

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
      cols: [[], [], [], []],
      amountCols: 4,
      gutter: 16
    }
  },
  async mounted() {
    this.cols = await this.generate()
  },
  methods: {
    mouseOver(index) {
      this.isHovering = index
    },
    async generate() {
      const logo = this.$refs.logo
      const logoHeight = logo.getBoundingClientRect().height
      const logoTop = logo.getBoundingClientRect().top

      const cols = await Promise.all(times(this.amountCols, async (index) => {
        const colEl = this.$refs[`col${index}`][0];
        const colElWidth = colEl.getBoundingClientRect().width
        const colElLeft = colEl.getBoundingClientRect().left

        const colHitsLogo = elementsHit(colEl, logo)

        let colMargin = 0
        let hitsAtIndex = 0
        let currentTop = random(50, 100);

        const items = await Promise.all(
          sampleSize(this.items, this.items.length / this.amountCols)
          .map(async (item, index) => {
            const image = await getImage(item.src)
            const imgWidth = Math.floor((colElWidth / image.width) / image.width)
            const imgHeight = Math.floor((colElWidth / image.width) * image.height)
            let imgTop = currentTop
            const imageTop = imgTop

            image.width = imgWidth
            image.height = imgHeight
            image.left = Math.floor(colElLeft)
            image.top = Math.floor(imgTop)

            const imageHitsLogo = colHitsLogo && elementsHit(image, logo)

            if (imageHitsLogo) {
              const randomSpacing = 0
              imgTop = logo.offsetTop + logoHeight + this.gutter
              currentTop = logo.offsetTop + logoHeight + this.gutter

              colMargin = logoTop - imageTop

              hitsAtIndex = index
            }

            currentTop += imgHeight + this.gutter

            return {
              ...item,
              top: Math.floor(imgTop),
              hide: imageHitsLogo
            }
          })
        )

        return {
          items: sortBy(items, ['top', 'desc']),
          colMargin,
          colLogoTop: logo.offsetTop,
          hitsAtIndex
        }
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
  top: 400px;
  align-items: center;
  justify-content: center;
  font-family: $font-logo;
  font-size: 3.6rem;
  line-height: 1;
  padding: 1rem;
  z-index: 9999;
}

.gallery__col {
  position: relative;
  flex: 1 0 calc(25% - 1rem);
  margin-left: .5rem;
  margin-right: .5rem;
  height: 100%;
}

.gallery__col__image {
  position: absolute;
  width: 100%;
  border-radius: .25rem;
  overflow: hidden;

  &--placeholder {
    background-color: #51557E;
    width: 100%;
    top: -100px;
    opacity: .25;
  }
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
