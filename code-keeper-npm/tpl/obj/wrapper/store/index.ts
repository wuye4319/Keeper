import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import Form from '@/form/store';
import getters from './getters';

Vue.use(Vuex);

export class GlobalState {
  foo: string = '';
}

export default new Vuex.Store<GlobalState>({
  modules: {
    Form,
  },
  state: new GlobalState(),
  mutations,
  actions,
  getters,
});
