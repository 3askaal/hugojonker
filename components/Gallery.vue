<template>
  <div class="wrapper">
    <div
      class="gallery"
      ref="gallery"
      :style="{
        '--gutter': `${(gutter / 2) + 1}px`
      }"
    >
      <div class="gallery__content" ref="logo">
        <div class="gallery__content__logo">
          Hugo Jonker
        </div>
        <!-- <div class="gallery__content__subtitle">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div> -->
      </div>
      <div class="gallery__overlay" v-if="currentImageSrc">
        <img :src="currentImageSrc" alt="" />
      </div>
      <div
        class="gallery__box"
        :style="{
          top: `${logoArea.top}px`,
          left: `${logoArea.left}px`,
          width: `${logoArea.width}px`,
          height: `${logoArea.height}px`,
        }"
      />
      <div
        v-for="(col, index) in cols"
        :ref="`col${index}`"
        :key="`col-${index}`"
        class="gallery__col"
        :style="{
          flex: `1 0 calc(${100 / amountCols}% - 1rem)`,
          marginLeft: `${gutter / 2}px`,
          marginRight: `${gutter / 2}px`,
        }"
      >
        <div
          v-if="col.items && col.items.length"
          class="gallery__col__item gallery__col__item--placeholder"
          :style="{
            height: `${col.items[0].top - gutter + 100 + (col.top || 0)}px`,
            width: `${col.width}px`,
          }"
        />
        <div
          v-for="(image, imageIndex) in col.items"
          :key="`item-${imageIndex}`"
          class="gallery__col__item"
          @mouseover="() => mouseOver(image, imageIndex)"
          @mouseout="() => mouseOver({ src: undefined }, imageIndex)"
          :style="{
            top: `${image.top}px`,
            width: `${image.width}px`,
            transform: image.top < logoTop && `translateY(${col.top}px)`,
          }"
        >
          <img
            :src="image.src"
            class="gallery__col__item__image"
            :style="{
              opacity: currentImageSrc && 0
            }"
          />
        </div>
        <div
          v-if="col.bottom"
          class="gallery__col__item gallery__col__item--placeholder"
          :style="{
            top: `${col.bottom}px`,
            width: `${col.width}px`,
            height: '200px',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { random, times, chunk, sortBy, throttle } from 'lodash'

const elementsHit = (el1, el2) => {
  const el1Top = (el1.offsetTop || el1.top || 0);
  const el1Left = (el1.offsetLeft || el1.left || 0);
  const el1Bottom = (el1.offsetTop || el1.top || 0) + (el1.offsetHeight || el1.height || 0);
  const el1Right = (el1.offsetLeft || el1.left || 0) + (el1.offsetWidth || el1.width || 0);

  const el2Top = (el2.offsetTop || el2.top || 0);
  const el2left = (el2.offsetLeft || el2.left || 0);
  const el2Bottom = (el2.offsetTop || el2.top || 0) + (el2.offsetHeight || el2.height || 0);
  const el2Right = (el2.offsetLeft || el2.left || 0) + (el2.offsetWidth || el2.width || 0);

  return !(
    (el1Bottom < el2Top) ||
    (el1Top > el2Bottom) ||
    (el1Right < el2left) ||
    (el1Left > el2Right)
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

const amountCols = 4

export default {
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      amountCols,
      gutter: 10,
      cols: [],
      logoTop: 0,
      currentImageSrc: '',
      logoArea: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }
  },
  async mounted() {
    await this.generate()
  },
  created() {
    window.addEventListener("resize", throttle(this.generate, 200));
  },
  destroyed() {
    window.removeEventListener("resize", throttle(this.generate, 200));
  },
  methods: {
    mouseOver(item, index) {
      this.isHovering = index
      this.currentImageSrc = item.src
    },
    async generate() {
      this.amountCols = this.calcColAmount()
      this.cols = times(this.amountCols, () => [])

      this.$nextTick(async () => {
        this.cols = await this.calcCols()
      })
    },
    calcColAmount() {
      const galleryWidth = this.$refs.gallery?.getBoundingClientRect().width || 0
      const imageWidth = galleryWidth < 768 ? 180 : 200
      return Math.round(galleryWidth / imageWidth);
    },
    async calcCols() {
      const gallery = this.$refs.gallery
      const logo = this.$refs.logo

      this.logoArea = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }

      if (!logo) return times(this.amountCols, () => []);

      const logoHeight = logo.getBoundingClientRect().height
      this.logoTop = logo.getBoundingClientRect().top

      this.logoArea.top = this.logoTop
      this.logoArea.height = logoHeight

      const colImages = chunk(this.items, Math.round(this.items.length / this.amountCols))

      const cols = await Promise.all(times(this.amountCols, async (colIndex) => {
        const colRef = this.$refs[`col${colIndex}`];
        const colEl = colRef && colRef[0]

        if (!colEl) return {}

        const colElWidth = colEl.getBoundingClientRect().width
        const colElLeft = colEl.getBoundingClientRect().left - gallery.getBoundingClientRect().left

        const colHitsLogo = elementsHit(colEl, logo)

        if (colHitsLogo) {
          if (!this.logoArea.width) {
            this.logoArea.width = colElWidth
          } else {
            this.logoArea.width += (this.gutter + colElWidth)
          }

          if (!this.logoArea.left) {
            this.logoArea.left = colElLeft
          }
        }

        let colTop = 0
        let colBottom = 0
        let currentTop = random(-100, 50);

        const items = await Promise.all(
          colImages[colIndex].map(async (item) => {
            const image = await getImage(item.src)
            const imgWidth = Math.round((colElWidth / image.width) * image.width)
            const imgHeight = Math.round((colElWidth / image.width) * image.height)
            let imgTop = currentTop
            const imageTop = imgTop

            image.width = imgWidth
            image.height = imgHeight
            image.top = Math.round(imgTop)
            image.left = Math.round(colElLeft)

            const imageHitsLogo = colHitsLogo && elementsHit(image, logo)
            const imageHitsBottom = imgTop.plus* + image.height > (window.innerHeight - 50)

            if (imageHitsLogo) {
              imgTop = this.logoTop + logoHeight + this.gutter
              currentTop = imgTop
              colTop = Math.round(this.logoTop - imageTop)
            }

            if (imageHitsBottom) {
              colBottom = currentTop
            } else {
              currentTop += imgHeight + this.gutter
            }

            return {
              ...item,
              top: Math.round(imgTop),
              width: image.width,
              hide: imageHitsLogo,
              imageHitsBottom,
            }
          })
        )

        return {
          items: sortBy(items, ['top', 'desc']).filter(({imageHitsBottom}) => !imageHitsBottom),
          top: colTop,
          bottom: colBottom,
          width: colElWidth
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  height: 100vh;
  overflow: hidden;
}

.gallery__content {
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  display: flex;
  max-width: 400px;
  z-index: 9999;
  text-align: center;
  padding: 1rem;
  top: 30%;
}

.gallery__content__logo {
  font-family: $font-logo;
  text-transform: uppercase;
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1;
}

.gallery__content__subtitle {
  font-size: .75rem;
  margin-top: .5rem;
}

.gallery__box {
  display: block;
  position: absolute;
  background-color: $black;
  box-shadow: 0 0 0 var(--gutter) $black;
}

.gallery__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;


  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
}

.gallery__col {
  height: 100%;
}

.gallery__col__item {
  position: absolute;
  width: 100%;
  border-radius: .125rem;
  transition: all .25s ease;

  &--placeholder {
    background-color: mix(#51557E, black, 40%);
    top: -100px;
    border-radius: 0;
  }

  &:not(.gallery__col__image--placeholder) {
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 var(--gutter) $black;
    z-index: 99999;
  }

  &:hover {
    .gallery__col__item__image {
      opacity: 0;
    }
  }
}

.gallery__col__item__image {
  width: 100%;
  transition: all .4s ease;
}

.gallery__col__image__border {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 0 0 .5rem white;
  z-index: 99999;
}
</style>
