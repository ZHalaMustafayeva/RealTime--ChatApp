<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>Chat Application</v-toolbar-title>
    </v-toolbar>

    <Chat />
  </v-app>
</template>
    
    <script>
import Chat from "./Chat.vue";

export default {
  components: {
    Chat,
  },
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" },
      ],
      username: this.$route.params.username,
    };
  },
  methods: {
    logout() {
      this.$router.replace({ name: "login" });
    },
  },
};
</script>