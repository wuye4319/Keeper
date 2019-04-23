import { MutationTree } from 'vuex';
import { GlobalState } from '.';
import { GlobalMutation } from './types';

const mutations: MutationTree<GlobalState> = {
  [GlobalMutation.Example](state, payload) {
    state.foo = '';
  }
};

export default mutations;