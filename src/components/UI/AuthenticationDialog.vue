<template>
    <v-container>
        <v-dialog
            v-model="dialog"
            width="500">
                <!-- Dialog content -->
                <v-card>
                    <v-card-title class="headline">
                        <div style="margin-left: auto; margin-right: auto;">
                            <v-chip-group v-model="authStatus">
                                <v-chip color="blue lighten-1" class="text-center" :outlined="authStatus ? true : false" :text-color="authStatus ? '' : 'white'" style="margin: 0px; width: 140px; border-radius: 8px 0px 0px 8px">Login</v-chip>
                                <v-chip color="green lighten-1" class="text-center" :outlined="authStatus ? false : true" :text-color="authStatus ? 'white' : ''" style="margin: 0px; width: 140px; border-radius: 0px 8px 8px 0px">Register</v-chip>
                            </v-chip-group>
                        </div>
                    </v-card-title>
                    <p v-if="$store.getters.error !== ''" style="color: red; text-align: center;">{{ $store.getters.error }}</p>
                    <v-form @submit.prevent>
                        <v-card-text>
                            <v-text-field
                                type="email"
                                v-model="email"
                                label="Email">
                            </v-text-field>
                            <v-text-field v-if="authStatus"
                                type="text"
                                v-model="name"
                                label="Name">
                            </v-text-field>
                            <v-text-field
                                type="password"
                                v-model="password"
                                label="Password">
                            </v-text-field>
                            <v-text-field v-if="authStatus"
                                type="password"
                                v-model="passwordConfirm"
                                label="Confirm password">
                            </v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="dialog=false">
                                Close
                            </v-btn>
                            <v-btn v-if="!authStatus"
                                type="submit"
                                color="primary"
                                text
                                @click="login">
                                Login
                            </v-btn>
                            <v-btn v-if="authStatus"
                                type="submit"
                                color="primary"
                                text
                                @click="register">
                                Register
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            authStatus: false, // 0 -> logging in, 1 -> registering
            name: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    },
    methods: {
        setDialog (dialog) {
            this.dialog = dialog;
        },
        login() {
            const user = { email: this.email, password: this.password };
            this.$store.dispatch('login', user)
            .then((loggedIn) => {
                if(loggedIn) {
                    this.dialog = false;
                    this.name = "";
                    this.email = "";
                    this.password = "";
                    this.passwordConfirm = "";
                    this.$router.push('/');
                }
            })
        },
        register() {
            //TODO: email + password validation
            if(this.password === this.passwordConfirm) {
                const user = { email: this.email, name: this.name, password: this.password };
                this.$store.dispatch('register', user)
                .then((loggedIn) => {
                    if(loggedIn) {
                        this.dialog = false;
                        this.name = "";
                        this.email = "";
                        this.password = "";
                        this.passwordConfirm = "";
                        this.$router.push('/');
                    }
                })
            } else {
                this.$store.commit("auth_error", "The password and confirmation password are not equal.");
            }
        }
    }
}
</script>

<style>
</style>