# ReactDrive CMS v4.2.7, updated for 2022!
Publish articles directly from Google Drive to your blog with React JS. Serverless setup with no transpiling.
In 2022, the setup has a couple extra steps, mostly because of changes with the third party services:
- Google Spreadsheets API v3 has been discontinued and the update to the v4 requires the use of an API key that you need to configure in the Google Cloud Console
- Sendgrid requires to create a verified sender account

Live demo here: 
http://misterfresh.github.io/react-drive-cms/

### Features:
- A dynamic site, but no backend to manage, no database, no server, no hosting & no maintenance (almost)
- A MS Word-like and MS Excel-like interface that users are familiar with
- Disqus comments system integration with React Hooks
- SendGrid email forwarding integration so that you can receive messages from the contact form on your email address.
- Regular URLs (no hashbang)
- A simple blog starter kit that can be easily customized to your liking.

### How to use:

1) Connecting your React App to your Google Drive : follow this detailed step-by-step guide: https://github.com/misterfresh/react-drive-cms/blob/master/GUIDE.md

2) In order for the contact form to work, publish the following script as a Google Web App:
https://gist.github.com/misterfresh/b69d29a97cf415980be2  . In your "Visitors" Google spreadsheet, go to Tools>Script Editor. You can create a free SendGrid account and paste your SendGrid API key in the script. You will also need to have a verified sender email with SendGrid, and set that email in the "From" and "ReplyTo" fields in the script on lines 55 and 59. Save the script and click on Publish>Deploy as Web App.

3) Fill in the correct values in ./conf.js :
    - "dashboardId" is the id of the "Dashboard" Google spreadsheet.
    - "sendContactMessageUrlId" is the id of the Google Web App script that does the email forwarding
    - "shortname" is the website's Disqus identifier
    - "root" is an optional url parameter, that would be the name of the project on GitHub pages.

4) Push these changes to your forked repository on GitHub, go to your repo's Settings tab to publish it.

That's it!

### 7 years of ReactDrive CMS!
ReactDrive CMS was started in October 2015. The objective was to provide a free, most hassle-free way of hosting a basic dynamic website. 

It uses Github Pages to host static assets, and uses React to generate the HTML on the client. The CMS part is handled using google Docs, and a google Spreadsheet is the "database". The contact form is the most complicated part : the form data will be sent to a public google apps script which will in turn write the visitor in the logbook spreadsheet and then post the form data to the sendgrid api, which will send an email to the site owner.

This setup has proven remarkably stable over the years, requiring only minor changes every 3 years or so to stay online, and having zero operating costs.

It has evolved with React patterns, starting with Browserify and Gulp and then later using Redux, and now switching to React Hooks and using Preact and htm library under the hood to avoid transpiling the code.

### How to customize, no tools required:
From a terminal, run: 
````
npm run start
````
This will start the local server. Open http://localhost:8080/ in your favorite browser.
