# react-drive-cms
Publish articles directly from Google Drive to your blog with React JS.

Live demo here: 
http://misterfresh.github.io/react-drive-cms/

Features:
- A dynamic site, but no backend to manage, no database, no server, no hosting!
- Send emails from the client securely
- A MS Word-like and MS Excel-like interface that users are familiar with
- Disqus comments system integration

Drawbacks:
- Hashbang Urls
- More dependent on third-party services

How to use:

1) In your Google Drive, create folders and files following the names and structure used here : 
https://docs.google.com/folderview?id=0B0A_zASTMp9WU0NMYW9wXzVQWjg&usp=drivesdk

2) Add to the Dashboard sheet the following bound script:
https://gist.github.com/misterfresh/e1c9cf0bb4c777221f84
This will create a new "Update" button with which you can automatically update the Dashboard file. 

3) In order for the contact form to work, publish the following script as a Google Web App:
https://gist.github.com/misterfresh/b69d29a97cf415980be2

4) Fill in the correct values in assets/js/config.js

5) Put the contents of the assets folder on GitHub Pages

That's it!