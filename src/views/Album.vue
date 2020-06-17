<template>
  <div>
    <v-card>
      <div class="pa-4 text-h5">Wykonawca</div>
      <div class="d-flex flex-no-wrap">
        <v-avatar class="ma-3" size="125" tile>
          <v-img :src="item.src" />
        </v-avatar>
        <div>
          <v-card-title
            class="headline text-h1"
            v-text="item.title"
          ></v-card-title>
          <v-card-subtitle
            class="text-h5"
            v-text="item.artist"
          ></v-card-subtitle>
        </div>
      </div>
      <v-card-text v-text="item.desc" />
      <v-card-actions class="pa-4">
        <v-spacer />
        Średnia ocen wykonawcy:
        <v-rating
          empty-icon="mdi-heart-outline"
          full-icon="mdi-heart"
          half-icon="mdi-heart-half-full"
          :value="item.rating"
          color="red lighten-1"
          background-color="red lighten-3"
          size="32"
        />
      </v-card-actions>
    </v-card>
    <v-row>
      <album-card
        v-for="n in 7"
        :key="n"
        class="ma-4"
        width="200"
        hover
        :to="{ name: 'Album', params: { albumId: 0 } }"
      />
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AlbumCard from "../components/AlbumCard.vue";

@Component({
  components: {
    AlbumCard
  }
})
export default class Artist extends Vue {
  get item() {
    return this.$route.params.album;
  }
}
</script>

<style></style>
