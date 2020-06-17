<template>
  <v-card :color="color" :hover="hover" elevation="24" @click="$emit('click')">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-avatar class="ma-3" size="125" tile>
        <v-img :src="data.imageUrl" />
      </v-avatar>
      <div>
        <v-card-title class="headline" v-text="data.label" />
        <v-card-subtitle v-text="data.year" />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Album } from "@/types";
@Component({})
export default class AlbumCard extends Vue {
  @Prop({
    required: true,
    type: Object
  })
  data!: Album;

  @Prop(Boolean) hover!: boolean;
  @Prop(String) color!: string;
}
</script>

<style></style>
