const url = require("url");

class Helper {
  getFileNameByLessonUrl(lesson_url) {
    return url.parse(lesson_url)["pathname"].split("/").pop();
  }

  isIterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  }
}

module.exports = new Helper();
