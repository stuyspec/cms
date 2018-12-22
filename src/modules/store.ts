import { createStore } from 'redux';
import { reducer } from './reducer';
import { initialState } from './state';

export let store = createStore(reducer, initialState);