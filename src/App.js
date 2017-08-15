const Crawler = require("./Crawler");
const FileSystem = require("./FileSystem");
const Downloader = require("./Downloader");
const Helper = require("./Helper");
const { COURSES_URL, LESSON_URL } = require("./constants");
const Promise = require("bluebird");
const { URL } = require("url");

class App {
  async processCources(page = 1) {
    await Crawler.auth();

    while (true) {
      let courseList = await Crawler.getApiData(COURSES_URL, page++);

      if (!courseList.length) {
        break;
      }

      await Promise.all(
        courseList.map(async ({ slug, lessons }) => {
          await FileSystem.createCourseLessonDirectories(
            await FileSystem.createCourseDirectory(slug),
            lessons
          );

          return await Downloader.parseLessons(lessons);
        })
      );
    }
  }

  async processCourseBySlug(slug) {
    await Crawler.auth();
    let courseUrl = new URL(slug, COURSES_URL + "/");
    let course = await Crawler.getApiData(courseUrl);

    await FileSystem.createCourseLessonDirectories(
      await FileSystem.createCourseDirectory(slug),
      course["lessons"]
    );

    await Downloader.parseLessons(course["lessons"]);
  }

  async processLessons(page = 1) {
    await Crawler.auth();
    const existsLesssons = await FileSystem.getExistsCourseLessons();

    while (true) {
      let lessons = await Crawler.getApiData(LESSON_URL, page++);

      if (!lessons.length) {
        break;
      }

      lessons = lessons.filter(({ download_url: url }) => {
        if (url == undefined) return false; // can't download file without url
        return !~existsLesssons.indexOf(Helper.getFileNameByLessonUrl(url));
      });

      await FileSystem.createLessonsFolderStructure(lessons);
      await Downloader.parseLessons(lessons);
    }
  }

  async processLesson(slug) {
    await Crawler.auth();
    let lessonUrl = new URL(slug, LESSON_URL);
    let lesson = await Crawler.getApiData(lessonUrl);
    await FileSystem.createLessonsFolderStructure(lesson);
    await Downloader.parseLessons(lesson);
  }
}

module.exports = new App();
