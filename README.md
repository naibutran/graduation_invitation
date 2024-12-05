
  

# Graduation Invitation Website
  

This project is built with NodeJS, following Express Framework.

  
  

# Installation

## 1. Deploy on Render
Go to Render's website, sign up an account: [Cloud Application Platform | Render](https://render.com/)
1. Go to Render's Dashboard: [Render Dashboard](https://dashboard.render.com/).
2. Create a Project.
### 1.1. Get PostgreSQL's API
1. Go to Render's Dashboard: [Render Dashboard](https://dashboard.render.com/).
2. Click New -> PostgreSQL
![enter image description here](https://i.imgur.com/f4GdnOC.png)
3. Fill your PostgreSQL's name, and choose the Project that you have just created.
4. In the Plan Options, i suggest that you should choose the Free Option, because this project is not required much data to store.
5.  Then you choose Create Database.
6. On the top right of PostgreSQL's Dashboard, you could see the Connect option. Click on that, you can see the Internal and External Database URL.![enter image description here](https://i.imgur.com/yeeSSI4.png)
7. Open file `config.json` on the main folder. Change the `internal_api`and `external_api` to the URL you have just got on Render.
### 1.2. Create a Web Service
1. Go to Render's Dashboard: [Render Dashboard](https://dashboard.render.com/).
2. Click New -> Web Service -> Choose your Git Clone of this Project -> Connect ![enter image description here](https://i.imgur.com/f4GdnOC.png)
3. Select your website-name carefully, because we also use it to change the code in `app.js` . ![enter image description here](https://i.imgur.com/aSufdqD.png)
4. Choose the Project field to the one that you created on PostgreSQL.
5. In Build Command, fill it with: `npm install`
6. In Start Command, full it with: `node server.js`
7. In Instance Type, i recommend you should choose Free.
8. Then, hit Start Web Service.
9. Above the Logs screen of the Web Service, you could see the link to your website. Copy that link, add `/api` behind the link. Then change `const apiUrl` in `/public/js/app.js` from your Git Clone of this project, into the link of your website. Example: my link looks like this: https://hoanganh-graduation-invitation.onrender.com/api .
10. After you commit on Github, the Web Service on Render will automatically update the changes. It could take a few minutes. 
11. Your Website is now on-air. But it could be deactive if there is no request to your website in a period of time. It could take a minute or more to reactive your website. So i suggest you should use some external service to keep your website active. In this case, i would use UptimeRobot.
### 1.3. Ping your website
1. Go to UptimeRobot and sign in: [UptimeRobot: Free Website Monitoring Service](https://uptimerobot.com/)
2. Click New Monitor.
3. In Monitor Type, choose Ping Monitor.
4. In IP or host to monitor field, fill it with your website link.
5. In Monitor interval, i suggest picking 5 minutes.
6. Then hit Create Monitor.
