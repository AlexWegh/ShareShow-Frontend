<template>
  <v-container>
    <h1 style="text-align: center;">Friends</h1>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline">
            Your friends
          </v-card-title>
          <v-card-text>
            <p v-if="status1" style="color: orange;">{{ status1 }}</p>
            <p v-if="friendsList.length === 0" style="margin-top: 10px;">No friends added yet</p>
            <v-list v-for="friend in friendsList" :key="friend._id">
              <v-list-item>
                <v-list-item-content>
                  <v-row align="center">
                    <v-col cols="4"><img style="border-radius: 50%; width: 65px; height: 65px; object-fit: cover;" :src="decodeAvatar(friend.avatar)"/></v-col>
                    <v-col cols="7"><h3 style="margin-left: 10px;">{{ friend.name }}</h3></v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="headline">
            Add Friends
          </v-card-title>
          <v-card-text>
            <p v-if="status2" style="color: orange;">{{ status2 }}</p>
            <v-form @submit.prevent>
              <v-row align="center">
                <v-col cols="8">
                  <v-text-field
                    type="text"
                    v-model="searchQuery"
                    label="Friend Name">
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    block
                    color="primary"
                    type="submit"
                    @click="friendsSearch">Search</v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-list v-for="result in searchResults" :key="result._id">
              <v-list-item>
                <v-list-item-content>
                  <div style="display: flex; align-items:center; justify-content: space-between; margin-top: 2px;">
                    <img style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;" :src="decodeAvatar(result.avatar)"/>
                    <h3 style="margin-left: 10px;">{{ result.name }}</h3>
                    <v-btn
                    :disabled="!friendIsRequestable(result)"
                    @click="requestFriend(result)">request
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card style="margin-top: 24px;">
          <v-card-title class="headline">
            Incoming friend requests
          </v-card-title>
          <v-card-text>
            <p v-if="status3" style="color: orange;">{{ status3 }}</p>
            <v-list v-for="(incoming, index) in incomingRequestsList" :key="incoming._id">
              <v-list-item>
                <v-list-item-content>
                  <v-row align="center">
                    <v-col cols="3"><img style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;" :src="decodeAvatar(incoming.avatar)"/></v-col>
                    <v-col cols="5"><h3 style="margin-left: 10px;">{{ incoming.name }}</h3></v-col>
                    <v-col cols="2"><v-btn icon color="primary" @click="acceptFriendRequest(incoming, index)"><v-icon>check</v-icon></v-btn></v-col>
                    <v-col cols="2"><v-btn icon color="error" @click="rejectFriendRequest(incoming, index)"><v-icon>close</v-icon></v-btn></v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card style="margin-top: 24px;">
          <v-card-title class="headline">
            Pending friend requests
          </v-card-title>
          <v-card-text>
            <v-list v-for="outgoing in outgoingRequestsList" :key="outgoing._id">
                <v-list-item>
                  <v-list-item-content>
                    <v-row align="center">
                      <v-col cols="4"><img style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;" :src="decodeAvatar(outgoing.avatar)"/></v-col>
                      <v-col cols="7"><h3 style="margin-left: 10px;">{{ outgoing.name }}</h3></v-col>
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
import shared from '../shared';

export default {
  data() {
    return {
      status1: "",
      status2: "",
      status3: "",
      friendsList: [],
      searchQuery: "",
      searchResults: [],
      incomingRequestsList: [],
      outgoingRequestsList: []
    }
  },
  methods: {
    friendsSearch() {
      if(this.searchQuery == "") {
        this.status2 = "No search input given";
      } else {
        this.status2 = "Loading...";
        const queryParams = new URLSearchParams();
        queryParams.append('searchQuery', this.searchQuery);
        axios.get('/index/search_users', {params: queryParams})
        .then(res => {
          if(res.data.success) {
            if(res.data.results.length > 0) {
              this.status2 = "";
              this.searchResults = res.data.results;
            } else {
              this.status2 = "0 results were found";
            }
          } else {
            console.log("Error: " + res.data.msg);
          }
        })
        .catch((err) => console.log(err))
      }
    },
    requestFriend(friend) {
      this.status2 = "Loading...";
      axios.post('/index/request_friend', { userId: this.$store.getters.user._id, friendId: friend._id })
      .then(res => {
        if(res.data.success) {
          this.status2 = "";
          this.$store.commit('updateUser', res.data.propertiesToUpdate);
          this.outgoingRequestsList.push(friend);
        } else {
          this.status2 = res.data.msg;
          console.log("Error: " + res.data.msg);
        }
      })
    },
    acceptFriendRequest(friend, index) {
      this.status3 = "Loading..."
      axios.post('/index/accept_friend_request', { userId: this.$store.getters.user._id, friendId: friend._id })
      .then(res => {
        if(res.data.success) {
          this.status3 = "";
          this.$store.commit('updateUser', res.data.propertiesToUpdate);
          this.friendsList.push(friend);
          this.incomingRequestsList.splice(index, 1);
        } else {
          this.status3 = res.data.msg;
          console.log("Error: " + res.data.msg);
        }
      })
    },
    rejectFriendRequest(friend, index) {
      this.status3 = "Loading..."
      axios.post('/index/reject_friend_request', { userId: this.$store.getters.user._id, friendId: friend._id })
      .then(res => {
        if(res.data.success) {
          this.status3 = "";
          this.$store.commit('updateUser', res.data.propertiesToUpdate);
          this.incomingRequestsList.splice(index, 1);
        } else {
          this.status3 = res.data.msg;
          console.log("Error: " + res.data.msg);
        }
      })
    },
    decodeAvatar(avatar) {
      return shared.decodeAvatar(avatar);
    },
    friendIsRequestable(friend) {
      return !this.$store.getters.user.incomingFriendRequests.includes(friend._id)
              && !this.$store.getters.user.outgoingFriendRequests.includes(friend._id)
              && !this.$store.getters.user.friends.includes(friend._id)
    }
  },
  mounted() {
    this.status1 = "Loading...";
    axios.get('/index/friends_page_data')
    .then(res => {
      if(res.data.success) {
        this.status1 = "";
        this.$store.dispatch('setUser', res.data.user);
        this.friendsList = res.data.friends;
        this.incomingRequestsList = res.data.incoming;
        this.outgoingRequestsList = res.data.outgoing;
      } else {
        console.log("Error: " + res.data.msg);
      }
    })
  }
}
</script>

<style>

</style>