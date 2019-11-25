import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import applicationData from './applicationData';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import api from '../connection/api';

const languages = [
  "Kannada",
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Marathi",
  "Malayalam",
  "Punjabi",
  "Bengali",
  "Gujarati",
  "Assamese",
  "Rajasthani",
  "French",
  "Bhojpuri",
  "Arabic",
  "Ladakhi"
];

const logger = createLogger();

const initialData = { application: applicationData, languages :languages };

const data = (state = initialData, action) => {
  return state;
}

const combinedStore = combineReducers({
  applicationData: data,
});

const store = createStore(combinedStore, applyMiddleware(thunk.withExtraArgument(api), reduxPackMiddleware, logger));

console.log(store.getState());

export default store;
