# ScuffedMDB

<p align="center">
  <img alt="Version"  src="https://img.shields.io/github/v/tag/mah51/scuffedmdb?label=Version&style=for-the-badge&color=%23E53E3E" />
   </p>
<p align="center">
  
  <img alt='Issues' src="https://img.shields.io/github/issues/mah51/scuffedmdb?color=%23ED8936&style=for-the-badge">
     <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors">
<img alt="contributors" src="https://img.shields.io/badge/contributors-2-orange.svg?style=for-the-badge&color=%23F6E05E" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  <img alt="Github Stars" src="https://img.shields.io/github/stars/mah51/scuffedmdb?style=for-the-badge&color=%2348BB78" />
    <img alt="Checks Passing" src="https://img.shields.io/github/checks-status/mah51/scuffedmdb/main?color=4299e1&style=for-the-badge" />
   <img alt="License" src="https://img.shields.io/github/license/mah51/Scuffedmdb?style=for-the-badge&color=%239F7AEA" />
</p>

<p align="center">
   <img  height='28px'src="https://forthebadge.com/images/badges/not-a-bug-a-feature.svg" />
  </p>

# Table of Contents

<details>
<summary>Click to expand</summary>
  
- [Introduction](#introduction)
  
- [Environment Variables](#environment-variables)

- [Host this yourself](#how-to-host-this-yourself)

  - [Setting up the local environment](#settting-up-the-local-environment)

  - [Setting up the production environment](#setting-up-the-production-environment)

- [Discord bot integration](#using-the-discord-bot-with-the-website)
- [TODO](#todo)

</details>

## Introduction

Welcome to [ScuffedMDB's&trade;](https://movie.michael-hall.me) code repository. This website is designed to be used by friend groups to rate movies watched together :).

To follow any updates there is a [Changelog](/CHANGELOG.md)

This repo is licensed under an [MIT license](https://github.com/mah51/ScuffedMDB/blob/main/LICENSE), and can therefore be modified and distributed as stated. However, if you do host this yourself, please include some creditation to my github somwhere on the page as a link to this repo / or my homepage. Not only will this help me out, but it allows others to host their own versions if they wish!

Thank you to [@olig89](https://github.com/olig89) for all of the ideas and user testing!

<table>
  <tr>
    <td align="left">
<img src="https://user-images.githubusercontent.com/47287285/125026289-25392280-e07c-11eb-979a-67769c36c4ea.png" align="left" /></td>
    <td align="right"><img src="https://user-images.githubusercontent.com/47287285/125026321-371ac580-e07c-11eb-9881-1ec8a70c0f23.png"  align="right" /></td>
  </tr>
  <tr>
    <td align="left" >
<img src="https://user-images.githubusercontent.com/47287285/125026308-2f5b2100-e07c-11eb-873e-2eabcf0906fb.png" align="left" /></td>
 
  <td align="left"><img src="https://user-images.githubusercontent.com/47287285/125026394-616c8300-e07c-11eb-9678-a6e497119b7d.png" align="right" /></td>
     </tr>
</table>

## Environment variables

#### Required

| Name                | Description                                                                    | Example                                                     |
| ------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| NEXT_PUBLIC_APP_URI | The URI of the app                                                             | `https://movie.michael-hall.me`                             |
| OWNER_ID            | Owner's discord ID                                                             | `234908230323`                                              |
| CLIENT_ID           | Discord Application CLIENT_ID on [console](https://discord.com/developers)     | `2398040239849`                                             |
| CLIENT_SECRET       | Discord Application CLIENT_SECRET on [console](https://discord.com/developers) | `\_adsiojweiurnAWeAFDS23`                                   |
| JWT_H512            | Used to sign token -> `jose newkey -s 256 -t oct -a HS512`                     | `{"kty":"oct","kid":"-token-","alg":"HS512","k":"-token-"}` |
| JWT_CODE            | Random string used to encode token                                             | `dsajoi234opiasdijofp`                                      |
| MONGODB_URI         | Connection string to mongoDB                                                   | `mongodb://localhost:27017/scuffedmdb`                      |
| MOVIE_API_KEY       | TMDB **v3** Api Key                                                            | `q9uqq9emdasDejwo4`                                         |

#### Not required

| Name                        | Description                                                                                                                 | Example                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| ALLOWED_USERS               | A comma separated list of discord ids representing users that can log into the website. If left blank, all users can login. | `234908230323,234908230324`   |
| WEBHOOK_URL                 | Endpoint for the discord_bot webhook                                                                                        | `https://bot.michael-hall.me` |
| WEBHOOK_TOKEN               | Random string used to authenticate movie websites request, required if using the webhook                                    | `dsajoi234opiasdijofp`        |
| COLOR_THEME                 | Color theme for the website, options: [chakra docs](https://chakra-ui.com/docs/theming/theme#colors)                        | `purple`                      |
| SECONDARY_COLOR_THEME       | Secondary accent color of the website, same options as COLOR_THEME                                                          | `cyan`                        |
| NEXT_PUBLIC_SITE_NAME       | Name of the website, default is ScuffedMDB                                                                                  | `ScuffedMDB`                  |
| NEXT_PUBLIC_SHORT_SITE_NAME | Short name of the website, default is SMDB                                                                                  | `SMDB`                        |

## How to host this yourself:

### Setting up the local environment

<details>
  <summary>Click to expand</summary>
It is beneficial to set up a local environment to make quick changes without having to wait for the website to rebuild on vercel.

1. Fork this repository at the top right of this page.

2. Clone to your computer

`git clone https://github.com/<YOUR GITHUB USERNAME>/scuffedmdb`

`cd scuffedmdb`

3. Rename .env.example, to .env.local and enter the local address: http://localhost:3000 n.b Do not include a / at the end of your domain

.env.local
`NEXT_PUBLIC_APP_URI=http://localhost:3000`

4. Create an account on [discord.com](https://discord.com) and go to the [developer console](https://discord.com/developers).
5. Create a new application and copy and past Client ID and client secret into the respective fields in .env.local

```bash
CLIENT_SECRET=_H8z9NKhasaido_diddada4SgqjQj
CLIENT_ID=24534589043255834
```

_(these aren't mine before you try -\_-)_

6. Go to the oauth tab of your new discord application and add your production and development callback urls to the redirect tab. For example mine are: http://localhost:3000/api/auth/callback/discord and https://movie.michael-hall.me/api/auth/callback/discord - <yourdomain>/api/auth/callback/discord
7. Return to your .env.local file and enter a [random string](https://onlinerandomtools.com/generate-random-string) into JWT_CODE which is kept secret (just to encrypt the user data in the cookie).

`JWT_CODE=SlOQwlMMnwVY3ypfNLFOtlEauH5Ra2DE`

_and again_

8. I recommend using [cloud atlas](https://www.mongodb.com/cloud/atlas) to host your mongo database, but just create an account and a m.0 db, (Vercel does not allow you to set location on the free plan, and its normally in NA, I recommend setting the mongo server to NA as well, it is slightly snappier). Also ensure the the ip address in network access is set to 0.0.0.0, as this will allow any server to connect (also why you need to create a user with a strong password), this is because we dont know the IP of the vercel instance that our server will be booted up on. Next copy the connection uri and paste into the .env.local file and append the database name.

`MONGODB_URI=<connection string>/local-movie-database`

9. Go to https://tmdb.org and create an account, then go to the [api settings](https://www.themoviedb.org/settings/api) under your profile and copy the **v3** key and paste it into your .env.local file under MOVIE_API_KEY

`MOVIE_API_KEY=<TMDB API KEY>`

10. Run `npm run dev` in your terminal in the project directory.

11. Stonks! ... if you are having trouble feel free to [submit an issue](https://github.com/mah51/ScuffedMDB/issues/new)
</details>

### Setting up the production environment

<details>
  <summary>Click to expand</summary>
 
__Make sure you have a fork of the repository by clicking the fork button top right__  
  
1. Login to https://vercel.com/ with your github.

2. Go to the homepage and create new project, select 'ScuffedMDB' and click import.

3. All the default settings are as should be, just click deploy. (Be warned it wont work just yet, we still need to provide our environment variables!)

4. Once deployed, click the big 'Go to dashboard' button, follow the tabs at the top to 'settings', then click environment variables on the left hand menu. Here you can add all of the environment variables from your .env.local file, one at a time using the box at the top.

5. CLIENT_ID, CLIENT_SECRET, OWNER_ID, NEXTAUTH_URL, and MOVIE_API_KEY will be the same as your local environment.

6. MONGO_URI should use a production database that is not the same as your local environment so set the database to a different name.

`MONGODB_URI=<connection string>/production-movie-database`

7. NEXT_PUBLIC_APP_URI needs to be the domain of your project on vercel. You can set a custom domain as shown in [vercels' docs](https://vercel.com/docs/custom-domains), but you need to click on your project to see the default domain, normally something like https://scuffedmdb.vercel.com (refer to 6 of setting up local environment to add domain to discord callback if you havent already)

`NEXT_PUBLIC_APP_URI=https://movie.michael-hall.me`

8. Create a HS512 compliant code using the following command:

`npm install -g node-jose-tools`

`jose newkey -s 256 -t oct -a HS512`

Copy the whole output and paste into the .env.local file under 'JWT_HS512'.

9. Finally generate a random string for the JWT_CODE env variable for production and enter into the Vercel settings panel.

10. Go back to the overview tab and click redeploy.

11. Thats it! your very own live movie rating website. The world is yours ... and everytime you push a change to your repo, it automatically redeploys (<3 vercel).
</details>

## Using the discord bot with the website:

Visit [the repo - ScuffedMDB-Bot](https://github.com/mah51/scuffedmdb-bot) containing the bots code and use the readme to integrate with the website. (Make sure the website is setup and working before trying this out).

N.B _The bot does not run on vercel, you have to find your own host, self-hosting is a good option if you have a computer running 24/7, if not I would recommend a cheap VPS._

## TODO:

- Fix bunch of errors to do with incorrect hook usage & react-table. ;(
- Add pagination to the API & FrontEnd cards
- Add tests if you wanna learn how to do em.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.michael-hall.me/"><img src="https://avatars.githubusercontent.com/u/47287285?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Hall</b></sub></a><br /><a href="https://github.com/mah51/ScuffedMDB/commits?author=mah51" title="Code">💻</a> <a href="#content-mah51" title="Content">🖋</a> <a href="https://github.com/mah51/ScuffedMDB/commits?author=mah51" title="Documentation">📖</a> <a href="#design-mah51" title="Design">🎨</a> <a href="#maintenance-mah51" title="Maintenance">🚧</a> <a href="https://github.com/mah51/ScuffedMDB/pulls?q=is%3Apr+reviewed-by%3Amah51" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://olivergill.com"><img src="https://avatars.githubusercontent.com/u/24813487?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Oli Gill</b></sub></a><br /><a href="https://github.com/mah51/ScuffedMDB/issues?q=author%3Aolig89" title="Bug reports">🐛</a> <a href="#ideas-olig89" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/mah51/ScuffedMDB/commits?author=olig89" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
