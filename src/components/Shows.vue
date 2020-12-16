<template>
  <v-container>
    <h1 style="text-align: center;">Shows</h1>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="7" lg="6">
        <!-- Add Show card -->
        <v-card>
          <v-card-title class="headline">
            Add show
          </v-card-title>
          <v-card-text>
            <p v-if="status1" style="color: orange;">{{ status1 }}</p>
            <v-form @submit.prevent>
              <v-row dense>
                <v-col cols="9">
                  <v-text-field
                      type="text"
                      v-model="searchQuery"
                      label="Show name">
                  </v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn
                      @click="showSearch()"
                      type="submit"
                      style="margin-top: 10px;">
                      Search
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <!-- Search results -->
            <v-list
              dense>
              <v-list-item-group
                v-model="selectedResult"
                color="primary">
                <v-list-item v-for="result in searchResults" :key="result.imdbid">
                  <v-list-item-content>
                    <v-row align="center">
                      <v-col cols="2">
                        <img style="max-width:100%; max-height:100%;" :src="result.poster"/>
                      </v-col>
                      <v-col cols="8">
                        <v-list-item-title style="text-align: center;">{{ result.name }}</v-list-item-title>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-row v-if="selectedResult !== undefined" justify="center">
              <v-col cols="7"><p>Are you currently watching this show?</p></v-col>
              <v-col cols="2"><v-checkbox v-model="currentlyWatching" style="margin-top: -4px;"></v-checkbox></v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="selectedResult !== undefined"
                @click="addShow()"
                color="primary"
                text>
                Add Show
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- List of shows watched by user -->
        <v-card style="margin-top: 50px;">
          <v-card-title class="headline">
            List of shows
          </v-card-title>
          <v-card-text>
            <p v-if="status2" style="color: orange;">{{ status2 }}</p>
            <p v-if="showsList.length === 0">No shows added yet... Use the box above to add your first show!</p>
            <v-list dense v-else>
              <v-list-item v-for="(show, index) in showsList" :key="show.imdbid">
                <v-list-item-content>
                  <v-row align="center">
                    <v-col cols="3">
                      <img style="max-width:100%; max-height:100%;" :src="show.poster"/>
                    </v-col>
                    <v-col cols="4">
                      <h3 style="text-align: center;">{{ show.name }}</h3>
                    </v-col>
                    <v-col style="display: flex; flex-direction: column; align-items:center;" cols="3">
                      <v-checkbox style="margin-top: 21px;" hide-details :input-value="show.currentlyWatching" @click="updateCurrentlyWatchingShow(index, !show.currentlyWatching)"></v-checkbox>
                      <p style="font-size: 10px; color: grey; text-align: center; margin-top: 2px;">Currently watching?</p>
                    </v-col>
                    <v-col cols="2">
                      <v-btn @click="deleteShow(index)" icon>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      status1: "",
      status2: "",
      searchQuery: "",
      searchResults: [],
      selectedResult: undefined,
      currentlyWatching: false,
      showsList: [],
    }
  },
  methods: {
    showSearch() {
      if(this.searchQuery == "") {
        this.status1 = "No search input given"
      } else {
        this.status1 = "Loading..."
        const queryParams = new URLSearchParams();
        queryParams.append('searchQuery', this.searchQuery);
        axios.get('/index/search_shows', {params: queryParams})
        .then(res => {
          if(res.data.success) {
            if(res.data.results.length > 0) {
              this.status1 = "";
              this.searchResults = res.data.results;
            } else {
              this.status1 = "0 results were found";
            }
          } else {
            console.log("Error: " + res.data.msg);
          }
        })
        .catch((err) => console.log(err))
      }
    },
    addShow() {
      const selectedShow = this.searchResults[this.selectedResult];
      const shows = this.$store.getters.user.shows.slice();
      var duplicate = false;
      shows.forEach(show => {
        if(show.imdbId === selectedShow.imdbid) {
          duplicate = true;
        }
      });
      if(!duplicate) {
        this.status2 = "Saving...";
        shows.push({ imdbId: selectedShow.imdbid, currentlyWatching: this.currentlyWatching });
        this.$store.dispatch('updateUser', { shows })
        .then(() => {
          // Add show to current listed shows
          this.status2 = "";
          selectedShow.currentlyWatching = this.currentlyWatching;
          this.showsList.push(selectedShow);
        })
      } else {
        this.status1 = "This show is already added";
      }
    },
    updateCurrentlyWatchingShow(index, value) {
      this.status2 = "Saving...";
      const shows = this.$store.getters.user.shows.slice();
      shows[index].currentlyWatching = value;
      this.$store.dispatch('updateUser', { shows })
      .then(() => {
        // Update current listed shows
        this.showsList[index].currentlyWatching = value;
        this.status2 = ""
      })
    },
    deleteShow(index) {
      this.status2 = "Saving...";
      const shows = this.$store.getters.user.shows.slice();
      shows.splice(index, 1);
      this.$store.dispatch('updateUser', { shows: shows })
      .then(() => { 
        // Remove show from current listed shows
        this.showsList.splice(index, 1);
        this.status2 = "";
      })
    }
  },
  mounted() {
    this.status2 = "Loading...";
    axios.get('/index/shows_page_data')
    .then(res => {
      if(res.data.success) {
        this.status2 = "";
        this.$store.dispatch('setUser', res.data.user);
        this.showsList = res.data.shows;
      } else {
        console.log("Error: " + res.data.msg);
      }
    })
  }
}
</script>

<style>

</style>