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

const INCREMENT_VIEWS = 'INCREMENT_VIEWS';
const incrementViews = makeActionCreator(INCREMENT_VIEWS);

const INCREMENT_VISITORS = 'INCREMENT_VISITORS';
const incrementVisitors = makeActionCreator(INCREMENT_VISITORS);


// ---------------- Reducers -------------------

const views = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT_VIEWS:
      return state + 1;
  }
  return state;
};

const visitors = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT_VISITORS:
      return state + 1;
  }
  return state;
};


// ---------------- Renderer -------------------

function renderIdom(state) {
  return <div>
      <h1>This is the first <strong>IncrementalDOM</strong> demo</h1>
      <p>Sum of views and visitors: {state.views + state.visitors}</p>
      <counter-card heading="Views" value={state.views} onIncrement={incrementViews}></counter-card>
      <counter-card heading="Visitors" value={state.visitors} onIncrement={incrementVisitors}></counter-card>
    </div>;
}


// -------------------- App --------------------

import { createStore, combineReducers } from 'redux';
import * as IncrementalDOM from 'incremental-dom';

const rootReducer = combineReducers({views, visitors});
let store = createStore(rootReducer);

let unsubscribe = store.subscribe(() => {
  console.log(store.getState())
  IncrementalDOM.patch(document.body, renderIdom, store.getState());
});

// TODO: Event listener should be registered automatically
window.addEventListener('increase', (e) => {
  if (e.target.onIncrement) {
    e.preventDefault();
    store.dispatch(e.target.onIncrement());
  }
});

store.dispatch(initializeApp());
