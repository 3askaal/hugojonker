<template>
  <Gallery :items="items" />
</template>

<script>
import { random, times, sample } from 'lodash'

export default {
  data() {
    return {
      items: times(20, () => {
        return {
          title: 'Lorem ipsum',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa quidem voluptas optio accusamus voluptate facilis hic a sapiente excepturi iure, explicabo architecto nostrum magnam velit neque deleniti inventore magni.',
          image: `https://placeimg.com/${random(sample([500, 1000]), sample([500, 1000]))}/${random(sample([500, 1000]), sample([500, 1000]))}/any`
        }
      })
    }
  }
}
</script>
