<template>
  <div class="login" v-cloak>
    <h2>Se connecter avec Google</h2>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export default {
  name: 'Login',
  mounted() {
    const self = this;

    if (!self.$store.getters.isAuthenticated) {
      const uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: () => {
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                self.$store.dispatch('validateUser', { user: user }).then(isValid => {
                  if (isValid) {
                    self.$router.push({ name: 'dashboard' });
                  } else {
                    self.$router.push({ name: 'home' });
                  }
                });
              }
            });

            return false;
          },
        },
        signInFlow: 'popup',
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      };

      let ui = firebaseui.auth.AuthUI.getInstance();

      if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
      } else {
        ui.reset();
      }

      ui.start('#firebaseui-auth-container', uiConfig);
    } else {
      self.$router.push({ name: 'dashboard' });
    }
  },
};
</script>
