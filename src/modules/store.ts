import { createStore } from 'redux';
import { reducer } from './reducer';
import { initialState } from './state';

export let store = createStore(reducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());