# Project 2: Drill and Practice

## Intro

Live version can be found [here] TODO: add url (don't worry if the page takes a
while to load for the first time!)

This project was completed as part of the module Web Software Development, in
the autumn term 2023, at Aalto University.

It consists of web application where users can create questions for topics, with
corresponding answers, and train them using a quiz.

New users can register at `/auth/register` and afterwards login to the
application at `/auth/login`. The main page shows some basic statistics, such as
the number of available topics, or created questions. At `/topics` as list of
available topics is available. Only admins can create new topics. For admin
login credentials please refer to the WSD course platform. After clicking on a
topic, users can create new questions, and when clicking on a created question,
corresponding answer options. At `/quiz` users first select a topic and will be
given a random question from that topic, each round.

## Local setup

- should have docker and docker compose installed before
- run `docker-compose up` in the root directory of the project
- application starts to run at http://localhost:7777

### Notes

- Tests:
  - run E2E tests with Playwright:
    `docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf`
  - the tests expect you to leave the standard topic "Finnish language" in the
    database to work correctly
  - note that I had to add the line `RUN npx playwright install` to the
    Playwright Dockerfile, because it just stopped working randomly at some
    point
  - if you are interested, the error was
    `Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1080/chrome-linux/chrome`
  - if you run into any problems, try removing the above mentioned line and
    building the container again
- Development platform:
  - I'm working on a MacBook M2 (ARM64)
  - therefore, I had to change the base images of the shopping-lists and
    Playwright Dockerfiles
  - if you're on another platform, and these are not working for you, please
    change the following:
    - in drill-and-practice Dockerfile, change `FROM lukechannings/deno:v1.29.2`
      back to `FROM denoland/deno:alpine-1.29.2`
