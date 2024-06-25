1.set up appwrite fetch the value from appwrite and put at it on env. file
2.set up that env file to conf/conf.js for getting string output and futher advantage
3.make structure of website for website basic need is login/logout  and create account and get the access of current account for that make /appwrite/auth.js on tha base of documnet create a authservice using parameter of client and account and then create method of login/logout and create account or getcurrentaccount
4.after the making struture of the website create the components that are store on the database /appwrite/config.js
 - using documnet can create database service using parameter of client ,database, storage, id query
 - after creating  the database cretae method using document methods are:-
    -createPost
    -updatePost 
    -deletePost
    -getPost
    -getposts
    -uploadfile
    -deletefile
    -getfilepreview
5.now create a /store/authslice in authslice using redux toolkit  make two method that fethc data of login and logout data and make     change on that data using redux toolkit 
- and also import that file into store/store.js and give the access of authslice
