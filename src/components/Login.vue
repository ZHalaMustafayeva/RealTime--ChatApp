
<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card>
                <v-card-title class="headline"> Sign In </v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="signIn">
                    <v-text-field v-model="email" label="Email" required />
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      required
                    />
                    <v-alert
                      v-if="isError"
                      type="error"
                      icon="mdi-check-circle"
                    >
                      {{ errorMessage }}
                    </v-alert>

                    <!-- <div class="red--text">{{ errorMessage }}</div> -->
                    <v-btn type="submit" color="primary"> Sign In </v-btn>
                    <div class="grey--text mt-4" @click="switchToRegistr">
                      Registr
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
      isError: false,
      errorMessage: "",
      stateObj: {
        register: {
          name: "Register",
          message: "Aleady have an Acoount? login.",
        },
        login: {
          name: "Login",
          message: "Register",
        },
      },
    };
  },
  methods: {
    signIn() {
      const signInURL = `${this.baseURLGlobal}/signin.php`;
      axios
        .post(signInURL, {
          email: this.email,
          password: this.password,
        })
        .then(({ data }) => {
          console.log(data);
          if (data?.data?.id) {
            console.log("Sign in successful:", data);
            this.isError = false;
            this.$router.replace({
              name: "chat",
              params: { userData: data?.data },
            });
            localStorage.setItem("user", JSON.stringify(data?.data));
          } else {
            this.isError = true;
            this.errorMessage = "Sign in failed!";
          }
        });
    },
    switchToRegistr() {
      this.$router.replace({
        name: "registr",
      });
    },
  },
};
</script>