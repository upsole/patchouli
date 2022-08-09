# Patchouli
Patchouli is a file storage and organization app. 
It implements authentication and stores its objects through the services of
cloudinary and AWS S3. The app is dockerized for convenicence and scaling

![screenshot](/screenshot.png)

It is built with NextJS (both as a server and frontend) and Prisma (+ psql).

Authentcation is implemented through the next-auth library, with the email provider 
(through my own SMTP server). Pino.js is used for logs.

This is mostly an exploratory and practice project (hence why the DB is dockerized).

### Requirements
To properly run this app, you'll need:
  - A running SMTP server or a third party relay mail service.
  - An object storage service compatible with AWS S3 (I use DigitalOcean's) 

### NGINX
`nginx` contains some lightweight config for a reverse proxy with rate limiting
capabilities. Swap $DOMAIN_NAME with your domain and replace the files in your 
server nginx directory.
