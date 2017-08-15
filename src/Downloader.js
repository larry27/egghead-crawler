"use strict";

const { LOG, DOWNLOAD_ATTEMPT } = require("./constants");
const Helper = require("./Helper");
const fs = require("fs");
const Promise = require("bluebird");
const request = require("request");
const colors = require("colors");
const path = require("path");

class Downloader {
  async getVideoAsBuffer(url) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .on("response", response => {
          LOG &&
            console.log(
              `Download file ${Helper.getFileNameByLessonUrl(url)}`.green
            );
          if (response.statusCode != 200) {
            return reject("Invalid status code");
          }

          let contentLength = response["headers"]["content-length"];
          let result = Buffer.from("");
          response.on("data", data => {
            result = Buffer.concat([result, data]);
          });

          response.on("end", () => {
            let fileSize = Buffer.byteLength(result);
            if (fileSize != contentLength) {
              LOG &&
                console.log(
                  `Invalid file size. Actual ${fileSize} expected ${contentLength}. File url ${url}`
                    .red
                );
              return reject();
            }
            resolve(result);
          });
        })
        .on("error", reject);
    });
  }

  async saveVideo(video, fileName) {
    let writeStream = fs.createWriteStream(fileName);

    writeStream.on("error", err => {
      LOG && console.log(`Error ${err} `.red);
      reject(err);
    });

    writeStream.write(video);
    writeStream.end();
  }

  async parseLesson(url, fileName) {
    let attempt = DOWNLOAD_ATTEMPT;

    while (attempt--) {
      try {
        const video = await this.getVideoAsBuffer(url);
        return await this.saveVideo(video, fileName);
      } catch (e) {
        LOG && console.log(`Download error. ${e}`.red);
      }
    }
  }

  async parseLessons(lessons) {
    if (!Helper.isIterable(lessons)) {
      lessons = [lessons];
    }

    return await Promise.all(
      lessons.map(({ download_url, path: folder }) => {
        let filePath = path.join(
          folder,
          Helper.getFileNameByLessonUrl(download_url)
        );
        return this.parseLesson(download_url, filePath);
      })
    );
  }
}

module.exports = new Downloader();
