/* jshint esnext: true */

// -------- Actions and action creators --------

function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    });
    return action;
  }
}

const INITIALIZE_APP = 'INITIALIZE_APP';
const initializeApp = makeActionCreator(INITIALIZE_APP);

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const incrementCounter = makeActionCreator(INCREMENT_COUNTER);


// ---------------- Reducers -------------------

const views = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
  }
  return state;
};


// ---------------- Renderer -------------------

function renderIdom(state) {
  let handler = function() {
    store.dispatch(incrementCounter());
  };
  return <div>
      <h1>This is the first <strong>IncrementalDOM</strong> demo</h1>
      <p>Counter value: {state}</p>
      <counter-card value={state}></counter-card>
      <p><button onclick={handler}>Increment</button></p>
    </div>;
}


// -------------------- App --------------------

import { createStore, combineReducers } from 'redux';
import * as IncrementalDOM from 'incremental-dom';

const rootReducer = combineReducers({views});
let store = createStore(rootReducer);

let unsubscribe = store.subscribe(() => {
  console.log(store.getState())
  IncrementalDOM.patch(document.body, renderIdom, store.getState().views);
});

store.dispatch(initializeApp());
