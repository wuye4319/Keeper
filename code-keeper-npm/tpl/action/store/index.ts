import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';

export class DemoState {
  foo: string = '';
}

const demoModule: Module<DemoState, any> = {
  namespaced: true,
  state: new DemoState(),
  mutations,
  actions,
};

export default demoModule;
