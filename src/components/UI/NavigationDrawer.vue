<template>
  <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position: fixed;">
      <div style="height: 100%; padding-top: 30px; padding-bottom: 60px; background-color: #F5F5F5;">
        <v-card style="display: flex; flex-direction: column; height: 100%; box-shadow: none; border-bottom: 1px solid #BFBFBF;">
          <v-list
          nav
          dense>
            <v-list-item disabled style="color: black;">
              <v-list-item-title>ShareShow</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item :to="'/'">
              <v-list-item-icon>
                  <v-icon>home</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="'/shows'">
              <v-list-item-icon>
                  <v-icon>tv</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Shows</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="'/friends'">
              <v-list-item-icon>
                  <v-icon>people</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Friends</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="'/profile'">
              <v-list-item-icon>
                  <v-icon>person</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-btn small block
          color="error"
          style="margin-top: auto; max-height: 28px;"
          @click="$store.dispatch('logout')">Sign out</v-btn>
        </v-card>
      </div>
    </v-navigation-drawer>
</template>

<script>
export default {
    data () {
        return {
            drawer: false
        } 
    },
    methods: {
        setDrawer (drawer) {
            this.drawer = drawer
        }
    }
}
</script>

<style>

</style>