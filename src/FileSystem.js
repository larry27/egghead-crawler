"use strict";

const Helper = require("./Helper");
const {
  COURSE_SAVE_PATH,
  LESSONS_SAVE_PATH,
  BASE_SAVE_PATH
} = require("./constants");

const path = require("path");
const fs = require("fs");
const Promise = require("bluebird");
const mkdir = Promise.promisify(fs.mkdir);
const writeFile = Promise.promisify(fs.writeFile);
const stat = Promise.promisify(fs.stat);
const glob = require("glob");

class FileSystem {
  async createDirectoryIfNotExists(directory) {
    try {
      await stat(directory); // todo detect problem
    } catch (e) {
      await mkdir(directory);
    }

    return directory;
  }

  async createCourseDirectory(slug) {
    return await this.createDirectoryIfNotExists(
      path.join(COURSE_SAVE_PATH, slug)
    );
  }

  async createCourseLessonDirectories(courseFolder, lessons) {
    return await Promise.all(
      lessons.map(async (lesson, i) => {
        ++i;
        let lessonFolder = (i < 10 ? "0" + i : i) + "-" + lesson["slug"];
        lesson["path"] = path.join(courseFolder, lessonFolder);
        return await this.createDirectoryIfNotExists(lesson["path"]);
      })
    );
  }

  async createLessonsFolderStructure(lessons) {
    if (!Helper.isIterable(lessons)) {
      lessons = [lessons];
    }

    return await Promise.all(
      lessons.map(lesson => {
        lesson["path"] = path.join(LESSONS_SAVE_PATH, lesson["slug"]);
        return this.createDirectoryIfNotExists(lesson["path"]);
      })
    );
  }

  async getExistsCourseLessons() {
    return await new Promise((resolve, reject) => {
      glob(BASE_SAVE_PATH + "**/*.mp4", (err, files) => {
        if (err) return resolve(err);
        resolve(files.map(file => path.parse(file)["base"]));
      });
    });
  }
}

module.exports = new FileSystem();
