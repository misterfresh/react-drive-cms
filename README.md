# React Drive CMS
Publish articles directly from Google Drive to your blog with React JS.

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

1) In your Google Drive, create folders and files following the names and structure used here : 
https://docs.google.com/folderview?id=0B0A_zASTMp9WU0NMYW9wXzVQWjg&usp=drivesdk

2) Add to the "Dashboard" sheet the following bound script:
https://gist.github.com/misterfresh/e1c9cf0bb4c777221f84   . 
This will create a new "Update" button with which you can automatically update the Dashboard file. Change the projectFolderName on line 9 in the Dashboard Script to the name of your drive folder if necessary. Publish the Dashboard sheet to the web via File>Publish to the Web.

3) In order for the contact form to work, publish the following script as a Google Web App:
https://gist.github.com/misterfresh/b69d29a97cf415980be2  . In your "Visitors" Google spreadsheet, go to Tools>Script Editor. You can create a free SendGrid account and paste your SendGrid API key in the script. Save the script and click on Publish>Deploy as Web App. .

4) Fill in the correct values in /conf.js

5) Push to a "gh-pages" branch on GitHub to publish on GitHub Pages

That's it!

### How to customize:
1. Install dependencies ````npm install````
2. Start dev server ````npm run dev````
3. Edit source code in /src folder
4. Build the project ````npm run build````
5. Check if the compiled project works  ````npm run local````
