#Yoshieru
##Overview

This project began in the summer of 2019. I was studying Japanese in preparation for a vacation I would take there with some friends. I became frustrated at how many different apps, websites, videos, etc. I was cycling through and having to keep track of.....so I decided to make another :laughing: But in all honesty, I felt there was a lack of comprehensive sources of both plentiful information and engaging assessment. I had no expectation of making such a resource, but I began to think about what I personally would like to see in a resource and how I would go about doing that.

##Web Application

![Yoshieru](https://i.imgur.com/LUliCGU.png)
The application in its current state has the following features:
1. Tool to query a word to find the definition, word type, and other information
2. Simple Flashcard THINGY
3. Tool to gauge listening comprehension. Loads an audio clip and quizzes the user on the correct transcription
4. In Japanese most words are written using **kanji**, a script that has more than 10,000 members. For tough to memorize kanji, the **furigana**, or simplified reading, is provided. Yoshieru allows for on the spot addition of furigana to any kanji
5. In addition to each word receiving its corresponding furigana, each word can also be modified to function as a link, opening up the particular word in the dictionary portion of the web app

##Framework

I have experience with a couple of frameworks, but felt none of them really fit the mold. I found some qualities of Vue to be very attractive, particularly the ease at which you can update the view when receiving new data. A study tool needs to be fast and intuitive in order to encourage good study habits, and the virtual DOM manipulation implemented by Vue seemed like a good fit, as well as being very intuitive.

##Back End

The first step was to implement the back end needed to supply the necessary information for this project. I did a little bit of searching and came across [JMDict](http://edrdg.org/jmdict/j_jmdict.html), which since 1996 has had "at its aim the compilation of a multilingual lexical database with Japanese as the pivot language." The database holds information about 'every' Japanese word, including definitions, word type, and auxiliary information. I imported the JMDict database into a Postgres database and set up a Node.js server to handle read requests to the database. One table contains an entry for each word in the JMDict, a second contains information needed to aid in querying for words, and a third which contains information used for streaming audio files.
