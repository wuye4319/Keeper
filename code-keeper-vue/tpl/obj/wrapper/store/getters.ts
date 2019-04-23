import { GetterTree } from 'vuex';
import { GlobalState } from '.';

const getters: GetterTree<GlobalState, GlobalState> = {
  bar(state) {
    return state.foo;
  },
};

export default getters;
