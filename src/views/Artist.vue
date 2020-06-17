<template>
  <v-row justify="center">
    <v-col>
      <div class="pt-4 text-h5">Wykonawca</div>
      <v-progress-circular v-if="!artistData" color="white" size="large" />
      <v-card v-else>
        <div
          :style="{
            backgroundImage: `url(${artistData.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        >
          <div style="backdrop-filter: blur(21px);">
            <div>
              <div class="d-flex flex-no-wrap">
                <div class="d-flex align-center justify-center">
                  <v-avatar class="ma-3" size="125" tile>
                    <v-img :src="artistData.imageUrl" />
                  </v-avatar>
                  <v-sheet>
                    <v-card-title
                      class="headline text-h2"
                      v-text="artistData.nazwa"
                    />
                  </v-sheet>
                  <v-card-subtitle
                    class="text-h5"
                    v-html="artistData.artist"
                  ></v-card-subtitle>
                </div>
              </div>
            </div>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Biografia</v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ artistData.bio }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-card>
      <div class="pt-4 text-h5">Albumy</div>
      <div v-if="artistData && !artistData.albums">
        Wykonawca nie ma żadnych albumów :(
      </div>
      <v-row v-else>
        <album-card
          v-for="(album, index) in artistData.albums"
          :data="album"
          :key="album.testLabel2"
          class="ma-1"
          :color="albumColors[index]"
          width="200"
          hover
          @click="currentAlbum = album"
        />
        <router-view name="album" />
      </v-row>
      <v-row v-if="currentAlbum">
        <v-col>
          <transition name="slidecool">
            <v-card
              :color="
                albumColors[
                  artistData.albums.findIndex(x => x === currentAlbum)
                ]
              "
              class="card-transition"
            >
              <v-avatar size="200">
                <v-img :src="currentAlbum.imageUrl" />
              </v-avatar>
              <v-card-title v-text="currentAlbum.label" />
              <v-card-subtitle v-text="currentAlbum.year" />
              <v-data-table
                :items="currentAlbum.songs"
                :headers="tableHeaders"
                hide-default-footer
              >
                <template #item="{item, index}">
                  <div
                    class="d-flex justify-space-between align-center"
                    @click.self="modal = { visible: true, currentSong: item }"
                  >
                    <div class="ma-4">
                      <span class="grey--text text--darken-1">
                        {{ index + 1 }}.
                      </span>
                      <span> {{ item.nazwa }} </span>
                    </div>
                    <div>
                      <v-rating
                        empty-icon="mdi-star-outline"
                        full-icon="mdi-star"
                        half-icon="mdi-star-half-full"
                        :value="
                          (item.ratings &&
                            item.ratings.reduce((acc, x) => acc + x) /
                              item.ratings.length) ||
                            0
                        "
                        color="orange lighten-1"
                        background-color="orange lighten-3"
                        size="16"
                        style="display: inline-block;"
                        class="mr-3"
                        dense
                        hover
                        @input="
                          rating => rate(currentAlbum._id, item._id, rating)
                        "
                      />
                      <v-badge
                        :color="currentAlbumColor"
                        left
                        overlap
                        :content="
                          (item.Comments && item.Comments.length) || '0'
                        "
                      >
                        <v-icon class="mr-4">mdi-chat-outline</v-icon>
                      </v-badge>
                    </div>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </transition>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="modal.visible" width="500" height="500">
      <v-sheet v-if="modal.currentSong">
        <div class="text-h5 ml-4 pt-4">Komentarze</div>
        <v-spacer />
        <v-sheet class="ma-4">
          <v-card
            class="mt-2"
            outlined
            v-for="(comment, index) in modal.currentSong.Comments"
            :key="index"
          >
            <v-card-title v-text="comment.name" />
            <v-card-text v-text="comment.comment"> </v-card-text>
          </v-card>
        </v-sheet>
        <v-sheet class="ma-4 pa-2">
          <v-form>
            <v-card-title class="ml-n3">Dodaj komentarz</v-card-title>
            <v-text-field
              label="Nazwa użytkownika"
              v-model="addComment.name"
              outlined
              required
            />
            <v-textarea
              label="Komentarz"
              v-model="addComment.comment"
              outlined
              required
            />
            <v-btn :color="currentAlbumColor" @click="addCommentMethod"
              >Wyślij</v-btn
            >
          </v-form>
        </v-sheet>
      </v-sheet>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AlbumCard from "../components/AlbumCard.vue";
import { Album, Song, Artist as ArtistType } from "@/types";
import api from "../api";

@Component({
  components: {
    AlbumCard
  }
})
export default class Artist extends Vue {
  addComment = {
    name: "",
    comment: ""
  };
  modal = {
    visible: false,
    currentSong: null as Song | null
  };

  async addCommentMethod() {
    await api.comment.create(
      this.currentAlbum._id,
      this.modal.currentSong._id,
      this.addComment.name,
      this.addComment.comment
    );
    this.artistData = (await api.artist.getOne(this.artistId)).data;
    this.currentAlbum = this.artistData.albums.find(
      x => x._id === this.currentAlbum._id
    );
    this.modal.visible = false;
    this.addComment = { name: "", comment: "" };
  }

  currentAlbum: Album | null = null;

  rate(albumId: string, songId: string, rating: number) {
    api.rating.create(albumId, songId, rating);
  }
  get currentAlbumColor() {
    return this.albumColors[
      this.artistData.albums.findIndex(
        x => x._id.$oid === this.currentAlbum._id.$oid
      ) % 3
    ];
  }
  get tableHeaders(): { text: string; value: keyof Song }[] {
    return [
      {
        text: "Nazwa piosenki",
        value: "nazwa"
      }
    ];
  }
  get albumColors() {
    return ["#F44336", "#E91E63", "#9C27B0", "#673AB7"];
  }

  artistData: ArtistType | null = null;

  async mounted() {
    this.artistData = (await api.artist.getOne(this.artistId)).data;
  }

  get artistId() {
    return this.$route.params.artistId;
  }
}
</script>

<style>
.slidecool-enter {
  transition: height 0.5s ease-in;
  height: 0;
}
.slidecool-enter-to {
  transition: height 0.5s ease-in;
  height: 200px;
}
.card-transition {
  transition: background-color 0.5s ease-in;
}
</style>
