<template>
  <Gallery :items="items" />
</template>

<script>
import { random, times, sample } from 'lodash'
import * as randomColor from 'random-hex-color'

export default {
  data() {
    return {
      gallerySpace: 400,
      items: times(40, () => {
        return {
          title: 'Lorem ipsum',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa quidem voluptas optio accusamus voluptate facilis hic a sapiente excepturi iure, explicabo architecto nostrum magnam velit neque deleniti inventore magni.',
          src: this.getPlaceholderImageUrl()
        }
      })
    }
  },
  methods: {
    getPlaceholderImageUrl() {
      const color = randomColor()
      const x = random(800, 1600)
      const y = random(800, 1000)
      return `https://picsum.photos/${x}/${y}`
      // return `https://via.placeholder.com/${x}x${y}/${color.slice(1)}`
    }
  }
}
</script>
