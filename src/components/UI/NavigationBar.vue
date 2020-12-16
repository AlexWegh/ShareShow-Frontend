<template>
    <v-app-bar
    absolute
    color="white">
        <v-app-bar-nav-icon v-if="$store.getters.isLoggedIn"
        @click.stop="$emit('drawer')"></v-app-bar-nav-icon>

        <v-toolbar-title>ShareShow</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="!$store.getters.isLoggedIn" 
            depressed small
            @click="$emit('dialog')">
            Login/Register
        </v-btn>
        <div v-else
        style="display: flex; flex-direction: column; align-items:center;">
            <p style="margin-bottom: 2px; margin-top: -5px; text-align: center;">Logged in as</p>
            <div style="display: flex; align-items:center; justify-content: center;">
                <img style="border-radius: 50%; width: 25px; height: 25px; object-fit: cover; " :src="$store.getters.user.avatar"/>
                <h4 style="margin-left: 11px;">{{ $store.getters.user.name }}</h4>
            </div>
        </div>
    </v-app-bar>
</template>

<script>

export default {
}
</script>

<style>

</style>