const path = require("path");
const BASE_SAVE_PATH = path.join(__dirname, "../videos/");
const videoStorePath = {
  BASE_SAVE_PATH,
  COURSE_SAVE_PATH: path.join(BASE_SAVE_PATH, "/cources/"),
  LESSONS_SAVE_PATH: path.join(BASE_SAVE_PATH, "/lessons/")
};

const cliArgunemts = {
  ALL_COURCES: "cources",
  ALL_LESSONS: "lessons",
  COURSE: "course",
  LESSON: "lesson",
  PAGE: "page",
  SLUG: "slug",
  ACTION: "action"
};

const eggheadUrlData = {
  COURSES_URL: "https://egghead.io/api/v1/series",
  LESSON_URL: "https://egghead.io/api/v1/lessons/",
  AUTH_URL: "https://egghead.io/users/sign_in"
};

const envConstants = require("dotenv").config()["parsed"];
module.exports = Object.assign(
  {},
  videoStorePath,
  eggheadUrlData,
  cliArgunemts,
  envConstants
);
