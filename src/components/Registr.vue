
<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Registr form</v-toolbar-title>
              </v-toolbar>
              <v-card>
                <v-card-title class="headline">Sign Up</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="register">
                    <v-text-field
                      v-model="fullName"
                      name="fullName"
                      label="Full Name"
                      type="text"
                      placeholder="fullName"
                      required
                    />
                    <v-text-field v-model="email" label="Email" required />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      required
                    />
                    <div class="red--text">{{ errorMessage }}</div>
                    <v-btn type="submit" color="primary"> Sign Up </v-btn>
                    <div class="grey--text mt-4" @click="switchToRegistr">
                      Login
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      fullName: "",
      baseURLGlobal: "http://localhost/Backend",
      isRegister: false,
      errorMessage: "",
    };
  },
  methods: {
    register() {
      const signUpURL = `${this.baseURLGlobal}/signup.php`;
      axios
        .post(signUpURL, {
          fullName: this.fullName,
          email: this.email,
          password: this.password,
        })
        .then(({ data }) => {
          if (data?.data?.id) {
            console.log("Sign up successful:", data);
            this.isError = false;
            this.$router.replace({
              name: "dashboard",
              params: { fullName: this.fullName },
            });
          } else {
            this.isError = true;
            this.errorMessage = "Sign up failed!";
          }
        });
    },
    switchToRegistr() {
      this.$router.replace({
        name: "login",
        params: { fullName: this.fullName },
      });
    },
  },
};
</script>