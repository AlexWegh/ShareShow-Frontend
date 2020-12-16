<template>
  <v-container>
    <h1 style="text-align: center;">Home</h1>
    <p v-if="status" style="color: orange; text-align: center; margin-top: 30px;">{{ status }}</p>
    <p v-else-if="Object.keys(allTimePopular).length === 0" style="text-align: center; margin-top: 20px;">You have to add friends first to be able to see their activity on this page</p>
    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline">
            Your friends are currently watching
          </v-card-title>
          <v-card-text>
            <v-list v-for="(shows, friendId) in currentlyWatching" :key="friendId">
              <v-list-item>
                <v-list-item-content>
                  <v-row align="center">
                    <v-col cols="12" md="4">
                      <v-row align="center">
                        <v-col cols="5"><img style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;" :src="decodeAvatar(getObjectWherePropertyEquals(cachedFriends, '_id', friendId).avatar)"/></v-col>
                        <v-col cols="7"><h3 style="margin-left: 10px;">{{ getObjectWherePropertyEquals(cachedFriends, '_id', friendId).name }}</h3></v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="8">
                      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-around;">
                        <div v-for="show in shows" :key="show.imdbId"
                        style="flex: 0 27%; margin-bottom: 20px;">
                          <img style="width: 100%; margin: 5px;" :src="getObjectWherePropertyEquals(cachedShows, 'imdbid', show.imdbId).poster"/>
                          <h5 style="text-align: center; margin-top: -3px;">{{ getObjectWherePropertyEquals(cachedShows, 'imdbid', show.imdbId).name }}</h5>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="headline">
            Most popular shows of all time among your friends
          </v-card-title>
          <v-card-text>
            <v-list v-for="(friends, imdbId) in allTimePopular" :key="imdbId">
              <v-list-item>
                <v-list-item-content>
                  <div>
                    <div style="display: flex; justify-content: center; align-items: flex-start;">
                      <img style="width: 45%;" :src="getObjectWherePropertyEquals(cachedShows, 'imdbid', imdbId).poster"/>
                    </div>
                    <h4 style="text-align: center; margin-top: 6px;">{{ getObjectWherePropertyEquals(cachedShows, 'imdbid', imdbId).name }}</h4>
                  </div>
                  <h3 style="margin-top: 5px;">Watched by:</h3>
                  <div style="display: flex; flex-wrap: wrap;">
                    <div v-for="friend in friends" :key="friend.friendId"
                    style="flex: 0 10%;">
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <img v-bind="attrs" v-on="on"
                            style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover; margin-right: 5px; margin-top: 2px;"
                            :src="decodeAvatar(getObjectWherePropertyEquals(cachedFriends, '_id', friend.friendId).avatar)"/>
                          </template>
                        <span>{{ getObjectWherePropertyEquals(cachedFriends, '_id', friend.friendId).name }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import shared from '../shared'

export default {
  data () {
    return {
      status: "",
      currentlyWatching: {},
      allTimePopular: {},
      cachedShows: [],
      cachedFriends: []
    }
  },
  methods: {
    // Get object from array of object where a property equals a certain value
    getObjectWherePropertyEquals(array, property, value) {
      var object = {};
      array.forEach(element => {
        if(element[property] === value) {
          object = element;
        }
      })
      return object;
    },
    decodeAvatar(avatar) {
      return shared.decodeAvatar(avatar);
    },
  },
  mounted() {
    this.status = "Loading...";
    axios.get('/index/home_page_data')
    .then(res => {
      if(res.data.success) {
        this.status = "";
        this.$store.dispatch('setUser', res.data.user);
        this.currentlyWatching = res.data.currentlyWatching;
        this.allTimePopular = res.data.allTimePopular;
        this.cachedShows = res.data.cachedShows;
        this.cachedFriends = res.data.cachedFriends;
      } else {
        console.log("Error: " + res.data.msg);
      }
    })
  }
}
</script>

<style>

</style>