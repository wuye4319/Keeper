import { MutationTree } from 'vuex';
import { DemoState } from '.';
import { DemoMutation } from './types';

const mutations: MutationTree<DemoState> = {
  [DemoMutation.Example](state, payload) {
    state.foo = '';
  }
};

export default mutations;