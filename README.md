# React Drive CMS
Publish articles directly from Google Drive to your blog with React JS. Simple setup with no transpiling.

Live demo here: 
http://misterfresh.github.io/react-drive-cms/

### Features:
- A dynamic site, but no backend to manage, no database, no server, no hosting & no maintenance
- A MS Word-like and MS Excel-like interface that users are familiar with
- Disqus comments system integration
- SendGrid email forwarding integration so that you can receive messages from the contact form on your email address.
- Regular URLs (no hashbang)
- A simple blog starter kit that can be easily customized to your liking.

### How to use:

1) Connecting your React App to your Google Drive : follow this detailed step-by-step guide: https://github.com/misterfresh/react-drive-cms/blob/master/GUIDE.md

2) In order for the contact form to work, publish the following script as a Google Web App:
https://gist.github.com/misterfresh/b69d29a97cf415980be2  . In your "Visitors" Google spreadsheet, go to Tools>Script Editor. You can create a free SendGrid account and paste your SendGrid API key in the script. Save the script and click on Publish>Deploy as Web App.

3) Fill in the correct values in ./conf.js :
    - "dashboardId" is the id of the "Dashboard" Google spreadsheet.
    - "sendContactMessageUrlId" is the id of the Google Web App script that does the email forwarding
    - "shortname" is the website's Disqus identifier
    - "root" is an optional url parameter, that would be the name of the project on GitHub pages.

4) Push these changes to your forked repository on GitHub, go to your repo's Settings tab to publish it.

That's it!

### How to customize, no tools required:
From a terminal, run: 
````
npm run start
````
This will start the local server. Open http://localhost:8080/ in your favorite browser.
