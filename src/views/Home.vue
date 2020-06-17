<template>
  <div class="home">
    <h1 class="text-h2">Szpotify</h1>
    <h4 class="text-subtitle-1 mb-6">Twoja muzyka w jednym miejscu</h4>
    <v-autocomplete
      :search-input.sync="searchText"
      @update:search-input="e => (searchText = e.target.value)"
      @change="
        newItem =>
          $router.push({
            name: 'Artist',
            params: { artistId: newItem._id.$oid }
          })
      "
      :items="artists"
      :filter="searchItems"
      clearable
      solo
      outlined
      placeholder="Szukaj ulubionych wykonawców..."
    >
      <template #item="{item}">
        {{ item.nazwa }}
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import api from "../api";
export default {
  name: "Home",
  data() {
    return {
      artists: [],
      searchText: ""
    };
  },
  async mounted() {
    this.artists = (await api.artist.getAll()).data.artists;
  },
  methods: {
    searchItems(item, queryText) {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(queryText.toLowerCase());
    }
  }
};
</script>
