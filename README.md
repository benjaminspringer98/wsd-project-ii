# Project 2: Drill and Practice

## Intro

Live version can be found [here] TODO: add url

This project was completed as part of the module Web Software Development, in
the autumn term 2023, at Aalto University.

It consists of web application where users can create questions, with
corresponding answers, and train them using a quiz.

New users can register at `/auth/register` and afterwards login to the application at `/auth/login`. The main page shows
some basic statistics, such as the number of available topics, or created
questions. At `/topics` as list of available topics is available. Only admins
can create new topics though. After clicking on a topic, users can create new
questions, and when clicking on a created question, corresponding answer
options. At `/quiz` users first select a topic and will be given a random
question from that topic, each round.

## Notes

### Running tests

- the tests expect you to leave the standard topic "Finnish language" in the
  database to work correctly
