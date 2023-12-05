<template>
  <v-app>
    <v-container fluid style="height: 100%">
      <v-row style="height: 100%">
        <!-- Sidebar for contacts -->
        <v-col cols="3" class="menu">
          <v-list class="menu2">
            <v-subheader>Contacts</v-subheader>
            <v-list-item-group
              v-for="contact in contacts"
              :key="contact.id"
              v-model="activeContact"
            >
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="contact.avatar" alt="avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ storedData }}
                    <button @click="handleLogout" class="logoutBtn">
                      Log Out
                    </button>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list lines="one">
              <v-list-item
                class="user"
                :class="{ activeUser: userID === user.id }"
                v-for="user in users"
                :key="user.id"
                :title="user.fullName"
                subtitle="user.fullName"
                @click="() => getUser(user.id, user)"
              >
                {{ user.fullName }}
              </v-list-item>
            </v-list>
          </v-list>
        </v-col>

        <!-- Main chat area -->
        <v-col cols="9">
          <div
            class="main-chat-container"
            style="overflow-y: auto; height: 100%"
          >
            <v-card flat height="100%" width="100%">
              <v-card-text>
                <v-row v-for="message in messages" :key="message.id">
                  <v-col v-if="message.sender !== 'me'" cols="8">
                    <v-chip color="primary" label>{{ message.message }}</v-chip>
                    <v-list-item-subtitle class="message-time">
                      {{ message.begDate.split(" ")[1] }}
                    </v-list-item-subtitle>
                  </v-col>

                  <v-col v-else cols="8" class="text-right">
                    <v-chip color="secondary" label>
                      {{ message.message }}
                    </v-chip>
                    <v-list-item-subtitle class="message-time">
                      {{ message.begDate.split(" ")[1] }}
                    </v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="cardFooter">
                <v-text-field
                  class="messageInput"
                  v-model="inputMessage"
                  placeholder="Type a message..."
                  required
                />
                <v-btn class="sendBtn" @click="sendMessage">Send</v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <!-- Input for sending messages -->
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
  
<script>
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:3333");
export default {
  data: () => ({
    storedData: null,
    users: [],
    userID: null,
    userData: null,
    selectedUser: null,
    baseURLGlobal: "http://localhost/Backend",
    contacts: [
      {
        id: 1,
        name: "John Doe",
        avatar: "https://picsum.photos/200",
      },
    ],
    activeContact: null,
    messages: [],
    inputMessage: "",
  }),

  mounted() {
    this.getUserDataFromLocalStorage();
    this.fetchUsers();
    this.userData = this.$route.params.userData;
    socket.on("receiveMessage", (msg) => {
      console.log(msg);
      if (msg) {
        this.getUser(this.userID);
      }
    });
  },
  methods: {
    getUserDataFromLocalStorage() {
      const dataString = localStorage.getItem("user");
      if (dataString) {
        this.storedData = JSON.parse(dataString)?.fullName;
      }
    },

    fetchUsers() {
      const url = `${this.baseURLGlobal}/selectUser.php?pag=-1`;
      axios.get(url).then(({ data }) => {
        this.users = data?.data[1] || [];
      });
    },

    sendMessage() {
      const url = `${this.baseURLGlobal}/insert.php`;
      const data = {
        _sendId: this.getUserIDFromLocalStorage(),
        _acceptId: this.userID,
        _type: 1,
        message: this.inputMessage.trim(),
      };

      axios.post(url, data).then(({ data }) => {
        if (data.data) {
          this.getUser(this.userID);
          socket.emit("sendMessage", this.inputMessage);

          this.inputMessage = null;
        }
      });
    },

    getUserIDFromLocalStorage() {
      const dataString = localStorage.getItem("user");
      return JSON.parse(dataString)?.id;
    },

    getUser(userID, user) {
      this.selectedUser = user;

      this.userID = userID;
      const url = `${this.baseURLGlobal}/select.php`;
      const data = {
        _sendId: this.getUserIDFromLocalStorage(),
        _acceptId: userID,
        pag: "-1",
      };

      axios.get(url, { params: { ...data } }).then(({ data }) => {
        this.messages = this.mapMessagesForSender(data?.data[1] || []);
      });
    },

    mapMessagesForSender(messages) {
      const currentUserId = this.getUserIDFromLocalStorage();

      return messages.map((message) => {
        message.sender = message?._sendId == currentUserId ? "me" : "you";
        return message;
      });
    },

    handleLogout() {
      localStorage.removeItem("user");
      this.$router.replace({
        name: "login",
        params: { fullName: this.fullName },
      });
    },
  },
};
</script>
  

<style scoped>
.menu2 {
  width: 400px;
  position: fixed;
  top: 0;
  left: 0;
  padding: 16px;
  height: 100%; /* Ensure the sidebar takes up the full height of the container */
  background-color: #f0f0f0; /* Set the desired background color */
  border-right: 1px solid #ccc; /* Add a border to separate the sidebar from the main content */
  overflow-y: auto;
}
.main-chat-container {
  height: 100%; /* Make sure the main chat area takes up the full height of the container */
  overflow-y: auto; /* Subtract any header or footer heights if needed */
  width: 100%;
}

.activeUser {
  border-radius: 6px;
  border: 2px solid #23a4dd;
  background: rgba(35, 164, 221, 0.05);
}
.user {
  /* background: #b7b5b5; */
  border-radius: 6px;
  background: rgba(35, 164, 221, 0.05);
  margin: 5px;
  cursor: pointer;
}
/* Sidebar */
v-col[cols="3"] {
  border-right: 1px solid #e0e0e0;
  max-height: 85vh;
  overflow-y: auto;
}

v-list-item-group {
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

v-list-item-group:hover {
  background-color: #f6f6f6;
}

v-list-item-avatar img {
  border: 2px solid #e0e0e0;
  border-radius: 50%;
}

/* Main chat area */
.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-bottom: 1px solid #e0e0e0;
}
.cardFooter {
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 73%;
  padding-bottom: 30px;
}
v-chip {
  max-width: 70%;
  word-wrap: break-word;
  padding-left: 15px;
  padding-right: 15px;
}

/* Chat messages */
v-row {
  margin-bottom: 10px;
}

v-chip[color="primary"] {
  background-color: #e8f4fe;
  border: 1px solid #cfe2f9;
}

v-chip[color="secondary"] {
  background-color: #e5e5e5;
  border: 1px solid #d4d4d4;
}
.sendBtn {
  border-radius: 6px !important;
  background: #23a4dd !important;
  height: 48px !important;
  color: #fff;
  padding: 10px 24px !important;
  margin-left: 16px;
}
.logoutBtn {
  border-radius: 6px !important;
  background: rgba(35, 164, 221, 0.05);
  color: #000;
  padding: 10px 24px !important;
  border: 2px solid #23a4dd;
  margin-left: 16px;
}
</style>