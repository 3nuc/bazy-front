<template>
  <div>
    <div>
      <v-sheet outlined class="pa-8 mb-8">
        <div class="text-h4">
          Dodaj/Edytuj wykonawcę
        </div>
        <v-form>
          <v-text-field
            label="Nazwa"
            outlined
            v-model="formData.addArtist.nazwa"
          />
          <v-textarea label="Bio" outlined v-model="formData.addArtist.bio" />
          <v-text-field
            label="Link do obrazka"
            outlined
            v-model="formData.addArtist.imageUrl"
          />
          <v-btn color="success" @click="sendArtist">Wyślij</v-btn>
        </v-form>
      </v-sheet>
      <v-sheet outlined class="pa-8 mb-8">
        <div class="text-h4">Dodaj/edytuj album do wykonawcy</div>
        <v-form>
          <v-text-field
            label="Nazwa albumu"
            outlined
            v-model="formData.addAlbum.name"
          />
          <v-text-field
            label="Rok wydania"
            outlined
            v-model="formData.addAlbum.year"
          />
          <v-text-field
            label="Obrazek"
            outlined
            v-model="formData.addAlbum.labelUrl"
          />
          <v-btn color="success" @click="sendAlbum">Wyślij</v-btn>
        </v-form>
      </v-sheet>
      <v-sheet outlined class="pa-8 mb-8">
        <div class="text-h4">
          Dodaj/edytuj piosenkę
        </div>
        <v-form>
          <v-text-field
            label="Nazwa piosenki"
            outlined
            v-model="formData.addSong.name"
          />
          <v-btn color="success" @click="sendSong">Wyślij</v-btn>
        </v-form>
      </v-sheet>
    </div>
    <div>
      <v-sheet
        outlined
        class="pa-4"
        style="position:fixed; top:2px; right:0; z-index:1000;"
      >
        <div class="text-h3">Opcje</div>
        <div>
          <v-select
            v-model="current.artist"
            :items="artists"
            item-text="nazwa"
            label="Wykonawca"
            return-object
          />
          <v-btn color="error" @click="deleteArtist">Usuń</v-btn>
          <v-divider />
        </div>
        <div v-if="current.artist">
          <v-select
            v-model="current.album"
            :items="current.artist.albums"
            item-text="label"
            label="Album"
            return-object
          />
          <v-btn color="error" @click="deleteAlbum">Usuń</v-btn>
          <v-divider />
        </div>
        <div v-if="current.album">
          <v-select
            v-model="current.song"
            :items="current.album.songs"
            item-text="nazwa"
            v-if="current.album"
            label="Piosenka"
            return-object
          />
          <v-btn color="error">Usuń</v-btn>
          <v-divider />
        </div>
        <v-radio-group v-model="current.method">
          <v-radio value="create" label="Create" />
          <v-radio value="edit" label="Edit" />
        </v-radio-group>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import api from "../api";
export default {
  data() {
    return {
      artists: [],
      formData: {
        addArtist: {
          nazwa: "",
          bio: "",
          imageUrl: ""
        },
        addAlbum: {
          name: "",
          year: 2020,
          labelUrl: ""
        },
        addSong: {
          name: ""
        }
      },
      current: {
        artist: null,
        album: null,
        song: null,
        method: "create"
      }
    };
  },
  async mounted() {
    this.artists = (await api.artist.getAll()).data.artists;
  },
  methods: {
    async refresh() {
      this.artists = (await api.artist.getAll()).data.artists;
    },
    async sendArtist() {
      const { method } = this.current;
      if (method === "create") await api.artist.create(this.formData.addArtist);
      else if (method === "edit")
        console.log(this.current.artist._id.$oid, this.formData.addArtist);
      await api.artist.update(
        this.current.artist._id.$oid,
        this.formData.addArtist
      );
      Object.keys(this.formData.addArtist).forEach(
        key => (this.formData.addArtist[key] = "")
      );
      this.refresh();
    },

    async sendAlbum() {
      await api.album.create({
        ...this.formData.addAlbum,
        artistId: this.current.artist._id.$oid
      });
      Object.keys(this.formData.addAlbum).forEach(
        key => (this.formData.addAlbum[key] = "")
      );
      this.refresh();
    },
    async sendSong() {
      await api.song.create(
        this.current.artist._id.$oid,
        this.current.album._id,
        this.formData.addSong.name
      );
      Object.keys(this.formData.addSong).forEach(
        key => (this.formData.addAlbum[key] = "")
      );
      this.refresh();
    },
    async deleteArtist() {
      await api.artist.remove(this.current.artist._id.$oid);
      this.current.artist = null;
      this.refresh();
    },
    async deleteAlbum() {
      await api.album.remove(this.current.album._id);
      this.current.album = null;
      this.refresh();
    }
  }
};
</script>

<style></style>
