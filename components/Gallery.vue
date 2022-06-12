<template>
  <div class="wrapper">
    <div class="gallery" ref="gallery">
      <div class="gallery__logo" ref="logo">Hugo Jonker</div>
      <div
        v-for="(col, index) in cols"
        :ref="`col${index}`"
        :key="`col-${index}`"
        class="gallery__col"
        :style="{
          flex: `1 0 calc(${100 / amountCols}% - 1rem)`
        }"
      >
        <div
          v-if="col.items && col.items.length"
          class="gallery__col__image gallery__col__image--placeholder"
          :style="{
            height: `${col.items[0].top - gutter + 100 + (col.top || 0)}px`
          }"
        />
        <img
          v-for="image in col.items"
          :src="image.src"
          :key="`image-${image.src}`"
          :style="{
            top: `${image.top}px`,
            transform: image.top < logoTop && `translateY(${col.top}px)`
          }"
          class="gallery__col__image"
        />
        <div
          v-if="col.bottom"
          class="gallery__col__image gallery__col__image--placeholder"
          :style="{
            top: `${col.bottom}px`,
            height: '200px'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { random, times, sampleSize, chunk, sortBy, throttle } from 'lodash'

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
      gutter: 16,
      cols: [],
      logoTop: 0
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
    mouseOver(index) {
      this.isHovering = index
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
      return Math.floor(galleryWidth / imageWidth);
    },
    // calcGutter() {
    //   return
    // },
    async calcCols() {
      const gallery = this.$refs.gallery
      const logo = this.$refs.logo

      if (!logo) return times(this.amountCols, () => []);

      const logoHeight = logo.getBoundingClientRect().height
      this.logoTop = logo.getBoundingClientRect().top

      const colImages = chunk(this.items, this.items.length / this.amountCols)

      const cols = await Promise.all(times(this.amountCols, async (colIndex) => {
        const colRef = this.$refs[`col${colIndex}`];
        const colEl = colRef && colRef[0]

        if (!colEl) return {}

        const colElWidth = colEl.getBoundingClientRect().width
        const colElLeft = colEl.getBoundingClientRect().left - gallery.getBoundingClientRect().left

        const colHitsLogo = elementsHit(colEl, logo)

        let colTop = 0
        let colBottom = 0
        let currentTop = random(50, 70);

        const items = await Promise.all(
          sampleSize(this.items, this.items.length / this.amountCols)
          .map(async (item) => {
            const image = await getImage(item.src)
            const imgWidth = Math.floor((colElWidth / image.width) * image.width)
            const imgHeight = Math.floor((colElWidth / image.width) * image.height)
            let imgTop = currentTop
            const imageTop = imgTop

            image.width = imgWidth
            image.height = imgHeight
            image.top = Math.floor(imgTop)
            image.left = Math.floor(colElLeft)

            const imageHitsLogo = colHitsLogo && elementsHit(image, logo)
            const imageHitsBottom = imgTop + image.height > (window.innerHeight - 50)

            if (imageHitsLogo) {
              imgTop = this.logoTop + logoHeight + this.gutter + random(0, 10)
              currentTop = imgTop
              colTop = Math.floor(this.logoTop - imageTop - random(0, 10))
            }

            if (imageHitsBottom) {
              colBottom = currentTop
            } else {
              currentTop += imgHeight + this.gutter
            }

            return {
              ...item,
              top: Math.floor(imgTop),
              hide: imageHitsLogo,
              imageHitsBottom,
            }
          })
        )

        return {
          items: sortBy(items, ['top', 'desc']).filter(({imageHitsBottom}) => !imageHitsBottom),
          top: colTop,
          bottom: colBottom,
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
  max-width: 1200px;
  height: 100vh;
  overflow: hidden;
}

.gallery__logo {
  position: absolute;
  align-items: center;
  justify-content: center;
  font-family: $font-logo;
  font-size: 2.5rem;
  line-height: 1;
  padding: 1rem;
  z-index: 9999;
}

.gallery__col {
  position: relative;
  margin-left: .5rem;
  margin-right: .5rem;
  height: 100%;
}

.gallery__col__image {
  position: absolute;
  width: 100%;
  border-radius: .125rem;
  overflow: hidden;
  opacity: .8;
  transition: all .25s ease;

  &--placeholder {
    background-color: #51557E;
    width: 100%;
    top: -100px;
    opacity: .25;
  }

  &:not(.gallery__col__image--placeholder) {
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
