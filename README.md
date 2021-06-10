# Yoshieru
## Overview

This project began in the summer of 2019. I was studying Japanese in preparation for a vacation I would take there with some friends. I became frustrated at how many different apps, websites, videos, etc. I was cycling through and having to keep track of.....so I decided to make another :laughing: But in all honesty, I felt there was a lack of comprehensive sources of both plentiful information and engaging assessment. I had no expectation of making such a resource, but I began to think about what I personally would like to see in a resource and how I would go about doing that.

## Web Application

![Yoshieru](https://i.imgur.com/U7F36mR.png)
The application in its current state has the following features:
1. Dictionary tool to query a word to find the definition, word type, and other information
2. Audo quizes to gauge listening comprehension. Loads an audio clip and quizzes the user on the correct transcription. These audio clips are credited and sourced by real users working with [Tatoeba](https://tatoeba.org/)
3. Read news articles curated for beginner-intermediate learners. Article feed provied by [NHK EasyNews](https://www3.nhk.or.jp/news/easy/)
4. Simple Flashcard Widget. Flashcard dislay format is entirely customizeable
5. Word segmentation and analysis - In Japanese many words are written using **kanji**, a script that has more than 10,000 members. For tough to memorize kanji, the **furigana**, or simplified reading, is provided. Yoshieru allows for on the spot addition of furigana to any kanji. Upon hovering over a word, a small popup is created containing brief information about the word. If you click on the word, it gets defined in the Dictionary portion of the app
6. Each component is contained within a window that behaves like a modern PC window. Windows can be opened, closed, minimized, and are moveable, resizeable. There is a tray for holding 'minimized' windows

## Framework

I have experience with a couple of frameworks, but felt none of them really fit the mold. I found some qualities of Vue to be very attractive, particularly the ease at which you can update the view when receiving new data. A study tool needs to be fast and intuitive in order to encourage good study habits, and the virtual DOM manipulation implemented by Vue seemed like a good fit, as well as being very intuitive.

## Back End

The first step was to implement the back end needed to supply the necessary information for this project. I did a little bit of searching and came across [JMDict](http://edrdg.org/jmdict/j_jmdict.html), which since 1999 has had "at its aim the compilation of a multilingual lexical database with Japanese as the pivot language." The lexical database holds information about 'every' Japanese word, including definitions, word type, and auxiliary information. I have an Express server which parses the JSON file, stores information regarding each entry in the database, then uses that information to handle searches in the form of API calls.


You can access the application [here.](http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/)
