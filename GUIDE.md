### How to Setup Google Drive to use React Drive CMS

Some users were having trouble setting up their Google Drive folder properly for their website to work, so I've decided to make this detailed step-by-step guide:

##### 1. In your Google Drive, create a new folder named "DriveCMS". Right-click on it and select "Share" and "Public with Link". All the contents of the folder can now be accessed by anonymous users.

##### 2. Double click on DriveCMS to open it. In DriveCMS folder:
- create a new Google Sheets spreadsheet named "Dashboard" and select "create and share" when prompted. 
- Also create spreadsheet "Visitors" and select "create and share".
- create folder "Posts"
- create folder "Images"

##### 3. Double click on "Posts" to open the Posts folder. In the "Posts" folder:
- click on "New" in the upper left corner and select "Google Docs" to create a new Google Docs document in the "Posts" folder. Select "create and share" when prompted.
- create a couple Google Docs documents, give them a title and some content. For testing purposes you can copy some wikipedia articles.

##### 4. Add a couple images in the "Images" folder that you created in step 2.

##### 5. Open the "Dashboard" spreadsheet you created in step 2. 
 - Click on "Tools", then on "Script Editor". A new tab wil open with the Google Script Editor. 
 - Rename "Untitled Project" to DriveCMS.
 - Copy the contents of https://gist.githubusercontent.com/misterfresh/e1c9cf0bb4c777221f84/raw/50c51d82fd1e73e35d64e6c3ce0fdd5a9ac1c7e8/prepareSheets.js and paste it into Code.gs in the Script Editor.
 - Click on "File" and "Save".
 - Go back to the "Dashboard" spreadsheet and force reload it. You should see a new option appear in the top-right of the menu, named "Update".
 - Click on "Update", then on "Update dashboard". When prompted, give full authorization to the bound script. When prompted that the application is not valid, click on "advanced parameters" and select "access DriveCMS (not secure)". When Prompted a third time, scroll down and select "Authorize". After granting all permissions, you will probably need to click one more time on "Update", then "Update dashboard" to finally run the script, and see the spreadsheet updated. (You can also run the script from the Script Editor, by selecting "run", "run function", "prepareSheets").

##### 6. The "Dashboard" spreadsheet should now be pre-filled, open the "Posts" sheet by selecting it in the bottom left tab:
- In the Title column you should see the titles of the posts you created in the "Posts" directory. 
- You can manually type in a subtitle for your posts in the Subtitle column. 
- Define categories in the Category column. If you give two posts the same category, they will be grouped together in the app.
- Select a main image for an article from the dropdown list in the "Image" column. This should automatically update the "Image Id" column with the corresponding ID. You can find all available image IDs in the "Images" sheet (select it by clicking the tab in the bottom left).
- You should not need to manually edit the "Images" sheet. After adding new images to the Images folder, you can re-run the Update/Update Dashboard script to make them available.
- Click on "File", then click on "Publish on the web". You can leave the default settings "Full Document" and "web page". Click the green "Publish" button. This will make the "Dashboard" public.

##### 7. Now let's make sure it works. Fork this repo, then clone it to your computer. Open the project in a text editor.
- in the "dev" folder of the project, open "conf.js". You need to change the "dashboardId" parameter and set it to the ID of your "Dashboard" spreadsheet. You can find that ID by opening the "Dashboard" spreadsheet and looking at the URL in the address bar. The ID is the string between "https://docs.google.com/spreadsheets/d/" and "/edit#gid=0"
- run command "npm run start". Open your browser to http://localhost:8080/. You should see the list of your Posts and Categories displayed in the right pane.

##### 8. To remove a Post you can delete it from the "Posts" folder, then re-run the Update/Update Dashboard script.
