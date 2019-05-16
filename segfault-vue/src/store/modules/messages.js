/**
 * Ce fichier gère l'état Vuex dans l'app des messages
 */

import axios from "axios";

// initial state
const state = {
    // TODO: pour l'instant il y a plusieurs messages ici pour simuler la db, après on fetchera les messages d'une discussion à la fois maximum.
  messages: [{
    id: 1,
    author: "Jean",
    date: "2019-05-11-04-20-42",
    text: "Message en cours de chargement...",
    score: 404,
    hasVoted: "no",
    childMsg: []
  },
  {
    id: 2,
    author: "Paul",
    date: "2019-05-11-04-20-42",
    text: "Coucou",
    score: 404,
    hasVoted: "no",
    childMsg: []
  }],
  
  // à dégager, c'est la db qui gère ça.
  lastId: 2
};

// getters
const getters = {
  // 
  getOneMessage: state => id => state.messages.find(msg => msg.id == id),
  lastId: state => state.lastId
};

// actions
const actions = {
  async fetchMessage ({commit, getters}, msgNb) {
    await axios
      .get(getters.apiURL + "messages/" + msgNb)
      .then(response => {
        if (response.status == 200) {
          commit("setMessage", response.data);
        } else {
          commit();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};


// fonction dégueu qui parcourt tout l'arbre (sauf les descendants du message parent), mais ça marche ^^ 
// TODO: virer quand on a la db
function addMsgRec (newText, user, parentMsg, currentMsg, newId) {

  if (currentMsg.id == parentMsg) {
      currentMsg.childMsg.push({id: newId, author: user, date: new Date().getTime(), text: newText, score: 100, hasVoted: "no", childMsg: []})
  }
  else {
    for (let message of currentMsg.childMsg) {
      addMsgRec (newText, user, parentMsg, message, newId)
    }  
  }
}

// mutations
const mutations = {
  setMessage: (state, payload) => (state.message = payload),
  addMessage: (state, {newText, user, parentMsg}) => {
    // TODO: send to db, this is just for local testing
    if (parentMsg == null) // new discussion
      state.messages.push({id: ++state.lastId, author: user, date: new Date().getTime() , text: newText, score: 100, hasVoted: "no", childMsg: []})
    else // comment
      for (let message of state.messages)
        addMsgRec (newText, user, parentMsg, message, ++state.lastId)
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};
