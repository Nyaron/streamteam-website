import Vue from 'vue';
import Vuex from 'vuex';
import db from './firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    streamers: [],
    livestreams: {},
    user: null,
    isAuthenticated: false,
  },
  mutations: {
    setStreamers(state, payload) {
      state.streamers = payload;
    },
    setLivestreams(state, payload) {
      state.livestreams[payload.login] = payload.data;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated && state.user !== null;
    },
  },
  actions: {
    checkStreamers({ commit }) {
      db.collection('streamers')
        .get()
        .then(querySnapshot => {
          let streamers = [];
          querySnapshot.forEach(doc => streamers.push(doc.data()));
          commit('setStreamers', streamers);
        });
    },
    updateLastLive({ commit, state }, { docId, login, data }) {
      if (data.length > 0) {
        db.collection('streamers')
          .doc(docId)
          .get()
          .then(origDoc => {
            if (origDoc.exists) {
              const finalDoc = origDoc.data();
              finalDoc.last_live = new Date();
              db.collection('streamers')
                .doc(docId)
                .set(finalDoc);
            }
          });
        commit('setLivestreams', { login: login, data: data });
      } else if (state.livestreams[login] && state.livestreams[login].length > 0) {
        commit('setLivestreams', { login: login, data: [] });
      }
    },
    updateLastUpdate({ dispatch }, { docId, data }) {
      db.collection('streamers')
        .doc(docId)
        .get()
        .then(origDoc => {
          if (origDoc.exists) {
            const finalDoc = Object.assign(origDoc.data(), data);
            finalDoc.last_update = new Date();
            db.collection('streamers')
              .doc(docId)
              .set(finalDoc);
          }
        });
      dispatch('checkStreamers');
    },
    validateUser({ commit }, { user }) {
      return new Promise(resolve => {
        db.collection('users')
          .doc(user.uid)
          .get()
          .then(origDoc => {
            if (origDoc.exists) {
              const userDatas = origDoc.data();
              userDatas.role.get().then(roleDoc => {
                const role = roleDoc.data();
                commit('setUser', {
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  uid: user.uid,
                  channel: userDatas.channel,
                  role: role.name,
                });
                commit('setIsAuthenticated', true);
                resolve(true);
              });
            } else {
              commit('setUser', null);
              commit('setIsAuthenticated', false);
              resolve(false);
            }
          });
      });
    },
  },
});
