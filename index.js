const commandLineArgs = require("command-line-args");
const App = require("./src/App");
const Crawler = require("./src/Crawler");

const {
  ACTION,
  SLUG,
  PAGE,
  ALL_COURCES,
  ALL_LESSONS,
  COURSE,
  LESSON
} = require("./src/constants");

const optionDefinitions = [
  { name: ACTION, type: String },
  { name: SLUG, type: String },
  { name: PAGE, type: Number, defaultValue: 1 }
];

const options = commandLineArgs(optionDefinitions);

const ActionMap = {};

ActionMap[ALL_COURCES] = async () => {
  await App.processCources(options[PAGE]);
};

ActionMap[ALL_LESSONS] = async () => {
  await App.processLessons(options[PAGE]);
};

ActionMap[COURSE] = async () => {
  await App.processCourseBySlug(options[SLUG]);
};

ActionMap[LESSON] = async () => {
  await App.processLesson(options[SLUG]);
};

if (!(options[ACTION] in ActionMap)) {
  throw new Error("Invalid action type");
}

ActionMap[options[ACTION]]();
