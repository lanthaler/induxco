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

const DECREASE_COUNTER = 'DECREASE_COUNTER';
const decreaseCounter = makeActionCreator(DECREASE_COUNTER);

const TOGGLE_BUTTON = 'TOGGLE_BUTTON';
const toggleButton = makeActionCreator(TOGGLE_BUTTON, 'checked');


// ---------------- Reducers -------------------

const counter = (state = 0, action, buttonState : boolean) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      if ((state >= 10 ) && buttonState) {
        return state + 2;
      }
      else {
        return state + 1;
      }
    case DECREASE_COUNTER:
      return state - 1;
  }
  return state;
};

const button = (state = false, action) => {
  if (action.type === TOGGLE_BUTTON) {
    return action.checked === true;
  }
  return state;
};


// ---------------- Renderer -------------------

function renderIdom(state) {
  return <div>
      <h1>Scalable Frontend with Redux, Web Components, and Incremental DOM</h1>
      <p>This project is a demo addressing the problem raised at
        <a href="https://github.com/slorber/scalable-frontend-with-elm-or-redux">slorber/scalable-frontend-with-elm-or-redux</a>
        with a combination of Redux, Incremental DOM, and Web Components (Polymer).</p>
      <counter-card heading="Counter" value={state.counter} onIncrement={incrementCounter} onDecrease={decreaseCounter}></counter-card>
      <p>Button <paper-toggle-button onChange={toggleButton}></paper-toggle-button></p>
      <random-gif topic="cats"></random-gif>
      <hr />
      <random-gif-pair left-topic="Left" right-topic="Right"></random-gif-pair>
      <random-gif-pair-pair pair-top-left-topic="Top left" pair-top-right-topic="Top right" pair-bottom-left-topic="Bottom left" pair-bottom-right-topic="Bottom right"></random-gif-pair-pair>
      <random-gif-list></random-gif-list>
      <p></p>
    </div>;
}


// -------------------- App --------------------

import { createStore, combineReducers } from 'redux';
import * as IncrementalDOM from 'incremental-dom';

const rootReducer = (state = {}, action) => {
  let b = button(state.button, action);
  let c = counter(state.counter, action, b);
  return { button: b, counter: c };
};
let store = createStore(rootReducer);

let unsubscribe = store.subscribe(() => {
  console.log(store.getState());
  IncrementalDOM.patch(document.body, renderIdom, store.getState());
});

// TODO: Event listeners should be registered automatically
window.addEventListener('increase', (e) => {
  if (e.target.onIncrement) {
    e.preventDefault();
    store.dispatch(e.target.onIncrement());
  }
});
window.addEventListener('decrease', (e) => {
  if (e.target.onDecrease) {
    e.preventDefault();
    store.dispatch(e.target.onDecrease());
  }
});
window.addEventListener('new-gif', (e) => {
  store.dispatch(incrementCounter());
});
window.addEventListener('change', (e) => {
  if (e.target.onChange) {
    e.preventDefault();
    console.log(e.target.checked);
    store.dispatch(e.target.onChange(e.target.checked));
  }
});

store.dispatch(initializeApp());
