<template>
  <Gallery :images="images" />
</template>

<script>
import { random, times, sample } from 'lodash'

export default {
  data() {
    return {
      images: times(20, () => {
        return `https://placeimg.com/${random(sample([1000, 2000]), sample([1000, 2000]))}/${random(sample([1000, 2000]), sample([1000, 2000]))}/any`
      })
    }
  }
}
</script>
