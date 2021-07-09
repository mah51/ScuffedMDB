# Movie-Rating website 2.0 aka ScuffedMDB

This is the movie rating website v2.0 (now with dark mode&trade;)

Designed to be used by friends to rate movies watched together :).

![Screen Shot 2021-07-09 at 06 08 38](https://user-images.githubusercontent.com/47287285/125026289-25392280-e07c-11eb-979a-67769c36c4ea.png)
![Screen Shot 2021-07-09 at 06 09 20](https://user-images.githubusercontent.com/47287285/125026321-371ac580-e07c-11eb-9881-1ec8a70c0f23.png)
![Screen Shot 2021-07-09 at 06 09 06](https://user-images.githubusercontent.com/47287285/125026308-2f5b2100-e07c-11eb-873e-2eabcf0906fb.png)
![Screen Shot 2021-07-09 at 06 10 31](https://user-images.githubusercontent.com/47287285/125026394-616c8300-e07c-11eb-9678-a6e497119b7d.png)


## How to host this yourself:

1. Fork this repo
2. Clone to your computer and change .env.example, to .env.local and enter the domain the website is going to be hosted at into NEXT_PUBLIC_APP_URI n.b Do not include a / at the end of your domain e.g. mine is https://michael-hall.me NOT https://michael-hall.me/
3. Create an account on discord.com and go to the developer console; create a new application and copy and past Client ID and client secret into the respective fields in .env.local then go to the oauth tab and add your production and development callback urls to the redirect tab. For example mine are: http://localhost:3000/api/oauth and https://movie.michael-hall.me/api/oauth - <yourdomain>/api/oauth
4. Enter a random string into JWT_CODE which is kept secret (just to encrypt the user data in the cookie)
5. I recommend using [cloud atlas](https://www.mongodb.com/cloud/atlas) to host your mongo database, but just create an account and a m.0 db, then copy the connection uri and paste into the .env.local file.
6. Go to tmdb.org and create an account, and get an api key and enter into .env.local

TODO:


- Fix bunch of errors to do with incorrect hook usage & react-table. ;(
- Add pagination to the API & FrontEnd cards
- Add tests if you wanna learn how to do em.
