<template>
  <v-app id="app">
    <NavigationBar ref="navigationBar" @drawer="$refs.navigationDrawer.setDrawer(true)" @dialog="$refs.authenticationDialog.setDialog(true)"/>
    <NavigationDrawer ref="navigationDrawer"/>
    <AuthenticationDialog ref="authenticationDialog"/>

    <v-main id="main" style="margin-top: 40px;">
      <router-view/>
    </v-main>

  </v-app>
</template>

<script>
import NavigationDrawer from './components/UI/NavigationDrawer'
import NavigationBar from './components/UI/NavigationBar'
import AuthenticationDialog from './components/UI/AuthenticationDialog'

export default {
  data () {
    return {
      drawer: false,
      dialog: false
    }
  },
  components: { NavigationDrawer, NavigationBar, AuthenticationDialog }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

.headline {
  word-break: break-word;
  text-align: center;
}
</style>
