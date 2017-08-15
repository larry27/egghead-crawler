# Egghead Crawler

Egghead Crawler allow download videos from egghead.io by API. You should have egghead subscription.

# Features!
  - Download all cources or concreate course by slug
  - Download all lessons or concreate lesson by slug
  - Attempt to re-download the video file when an error occurs
  - Validate downloaded video size

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies.

```sh
$ npm i
$ cp .env.back .env
```
Add your egghead credentials to .env file. You also can configure video store path. Edit src/constants.js file and change **BASE_SAVE_PATH**

#### Examples
For download all cources from egghead:
```sh
$ node index --action=cources --page=1
```

For download all lessons from egghead:
```sh
$ node index --action=lessons --page=1
```
**Important**: Egghead API return all lessons list regardless of whether the lesson is part of the course or an independent lesson because before downloading all lessons are filtered by exists videos in course directories

For download single coure or lesson by slug:
```sh
$ node index --action=lesson|cource --slug=slug_name
```
