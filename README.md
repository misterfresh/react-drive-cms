# ReactDrive CMS v4.2.7, updated for 2022!
Publish articles directly from Google Drive to your blog with React JS. Serverless setup with no transpiling.
In 2022, the setup has a couple extra steps, mostly because of changes with the third party services:
- Google Spreadsheets API v3 has been discontinued and the update to the v4 requires the use of an API key that you need to configure in the Google Cloud Console
- Sendgrid requires to create a verified sender account

Live Demo: [https://thepurpleclub.github.io/home]

### Features:
- A dynamic site, but no backend to manage, no database, no server, no hosting & no maintenance (almost)
- A MS Word-like and MS Excel-like interface that users are familiar with
- Disqus comments system integration with React Hooks
- SendGrid email forwarding integration so that you can receive messages from the contact form on your email address.
- Regular URLs (no hashbang)
- A simple blog starter kit that can be easily customized to your liking.

### How to use:

1) Connecting your React App to your Google Drive : follow this detailed step-by-step guide: https://github.com/misterfresh/react-drive-cms/blob/master/GUIDE.md

2) For the contact form, create a free access key at https://web3forms.com (just enter the email address that should receive messages). Messages from the form are emailed straight to you.

3) Fill in the correct values in ./conf.js :
    - "dashboardId" is the id of the "Dashboard" Google spreadsheet.
    - "web3formsAccessKey" is your Web3Forms access key for the contact form
    - "googleApiKey" is a Google API key with the Sheets API enabled (restrict it to your site's domain in Google Cloud Console)
    - "shortname" is the website's Disqus identifier
    - "root" is an optional url parameter, that would be the name of the project on GitHub pages.

4) Push these changes to your forked repository on GitHub, go to your repo's Settings tab to publish it.

5) Publishing: the GitHub Action in `.github/workflows/build-static.yml` publishes the site. In your repo's Settings → Pages, set Source to "GitHub Actions". On every push to master, and once a day, it runs `scripts/build_static.py` to build `feed.xml` (the RSS feed), a small page for each post under `articles/` (so links shared on social media show that post's title and photo), and the Gallery (`gallery.json` and `assets/gallery/`), then publishes everything. These generated files aren't committed. A photo is left out of the gallery when the line right after it starts with "Photo source:", so credit other people's photos that way. To publish a new post right away, open the Actions tab, choose "Build and deploy site" and click "Run workflow". To preview them locally, run `python3 scripts/build_static.py`.

6) Birds: `app/data/birds.js` holds the "Bird of the month" list, the xeno-canto recordings behind the Listen buttons, and the pins on the Sightings map. Edit that file to add birds or sightings.

7) Optional extras in ./conf.js: "cloudflareAnalyticsToken" turns on Cloudflare Web Analytics visitor stats, and "buttondownUsername" shows a newsletter sign-up box (Buttondown).

That's it!

### 7 years of ReactDrive CMS!
ReactDrive CMS was started in October 2015. The objective was to provide a free, most hassle-free way of hosting a basic dynamic website. 

It uses Github Pages to host static assets, and uses React to generate the HTML on the client. The CMS part is handled using google Docs, and a google Spreadsheet is the "database". The contact form sends messages through Web3Forms, which emails them to the site owner.

This setup has proven remarkably stable over the years, requiring only minor changes every 3 years or so to stay online, and having zero operating costs.

It has evolved with React patterns, starting with Browserify and Gulp and then later using Redux, and now switching to React Hooks and using Preact and htm library under the hood to avoid transpiling the code.

### How to customize, no tools required:
From a terminal, run: 
````
npm run start
````
This will start the local server. Open http://localhost:8080/ in your favorite browser.
