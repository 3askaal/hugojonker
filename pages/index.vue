<template>
  <Gallery :images="images" />
</template>

<script>
import { random, times, sample } from 'lodash'

export default {
  data() {
    return {
      images: times(12, () => {
        return `https://placeimg.com/${random(sample([300, 600]), sample([300, 600]))}/${random(sample([300, 600]), sample([300, 600]))}/any`
      })
    }
  }
}
</script>
