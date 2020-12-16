<template>
  <v-container>
    <h1 style="text-align: center;">Profile</h1>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">
            Edit your profile
          </v-card-title>
          <v-card-text>
            <p v-if="status" style="color: orange;">{{ status }}</p>
            <v-row justify="center">
              <v-col cols="4">
                <div style="display: flex; flex-direction: column; align-items:center;">
                  <h3 style="text-align: center;">Profile picture</h3>
                  <img style="border-radius: 50%; width: 90px; height: 90px; object-fit: cover; margin-top: 5px;" :src="$store.getters.user.avatar"/>
                  <div style="margin-top: 8px;">
                    <v-btn v-if="currentlyEditing !== 0" @click="currentlyEditing = 0">Edit</v-btn>
                    <input v-else @change="handleImage" type="file" accept="image/*">
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row justify="center" style="margin-top: 10px;">
              <v-col :cols="currentlyEditing === 1 ? 9 : 8">
                <v-form @submit.prevent>
                  <div style="display: flex; align-items: center;">
                    <v-text-field
                    :disabled="currentlyEditing !== 1"
                    type="text"
                    label="Email"
                    v-model="email"
                    style="margin-right: 25px;">
                    </v-text-field>
                    <v-btn v-if="currentlyEditing !== 1"
                    @click="currentlyEditing = 1"
                    >Edit
                    </v-btn>
                    <v-btn v-else
                    type="submit"
                    color="success"
                    @click="saveProperty({ email: email })"
                    >Save
                    </v-btn>
                  </div>
                </v-form>
              </v-col>
            </v-row>
            <v-row justify="center" style="margin-top: -15px;">
              <v-col :cols="currentlyEditing === 2 ? 9 : 8">
                <v-form @submit.prevent>
                  <div style="display: flex; align-items: center;">
                    <v-text-field
                    :disabled="currentlyEditing !== 2"
                    type="text"
                    label="Name"
                    v-model="name"
                    style="margin-right: 25px;">
                    </v-text-field>
                    <v-btn v-if="currentlyEditing !== 2"
                    @click="currentlyEditing = 2"
                    >Edit
                    </v-btn>
                    <v-btn v-else
                    type="submit"
                    color="success"
                    @click="saveProperty({ name: name })"
                    >Save
                    </v-btn>
                  </div>
                </v-form>
              </v-col>
            </v-row>
            <v-row justify="center" style="margin-top: -15px;">
              <v-col :cols="currentlyEditing === 3 ? 9 : 8">
                <v-form @submit.prevent>
                  <div style="display: flex; align-items: center;">
                    <v-text-field
                    :disabled="currentlyEditing !== 3"
                    type="password"
                    label="Password"
                    v-model="password"
                    style="margin-right: 25px;">
                    </v-text-field>
                    <v-btn v-if="currentlyEditing !== 3"
                    @click="currentlyEditing = 3; password = ''"
                    >Edit
                    </v-btn>
                    <v-btn v-else
                    type="submit"
                    color="success"
                    @click="saveProperty({ password: password })"
                    >Save
                    </v-btn>
                  </div>
                </v-form>
              </v-col>
            </v-row>
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
      status: "",
      currentlyEditing: -1,
      email: "",
      name: "",
      password: "aaaaaaaa"
    }
  },
  methods: {
    handleImage(e) {
      const image = e.target.files[0];
      // To base 64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        this.saveProperty({ avatar: base64 })
      }
      reader.readAsDataURL(image);
    },
    saveProperty(propertyToUpdate) {
      this.status="Saving...";
      this.$store.dispatch('updateUser', propertyToUpdate)
      .then(() => {
        this.status = "";
        this.currentlyEditing = -1;
      })
    }
  },
  mounted() {
    this.status="Loading...";
    axios.get('/index/profile_page_data')
    .then(res => {
      if(res.data.success) {
        this.status = "";
        this.$store.dispatch('setUser', res.data.user)
        this.email = this.$store.getters.user.email;
        this.name = this.$store.getters.user.name;
      } else {
        console.log("Error: " + res.data.msg);
      }
    })
  }
}
</script>

<style>

</style>