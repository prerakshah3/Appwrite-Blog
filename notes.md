1.set up appwrite fetch the value from appwrite and put at it on env. file , for different react app their are different value ex. like for vite app there is value call vite_appwrite and to access it use import.meta.env.vite_appwrite and for create react there are different value for that read the doc carefully    
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
5.now create a /store/authslice in authslice using redux toolkit  make two method that fetch data of login and logout data and make     change on that data using redux toolkit 
- and also import that file into store/store.js and give the access of authslice
6.now create a one folder component and in that folder add two file  of header and footer and create one index.js for extracting all component file 
-and create usedispatch method from react-redux int this method it will help authslice.action for login and logout methhod using authslice.getcurrentuser can fetch the data of current user and see that user is login or not  
-and then write if there is any userdata then it will show the loading page and show all the post
7.contianer hold the part between header and footer of all page then create header file and in that file create navitem that store the link and active status of header  after the creating navitem using navigate map the each link on the base of authstatus
-also introduce one hook called forwardref it help to forward refernace to the other page for authtication (very imp video.23 after 25 min)
8.create select.jsx in that using forwardref taking input from the drop down menu and using that ref implement you can give post authetication if it is active or not 
-after that crate two file of signup.jsx and login.jsx  and in these both we use register and handlesubmit from the reacthook form handlesubmit method is give the access to submit button funcality and register method set for register id is for email,username,password and also gice validation with writing match pattern and for pattern there is regex code for mathc the require email 
-now create authlayout.jsx which give authetication to nevigate page to login or loader 
9.RTE.jsx  it is real time editor library import from the tiny mce in this file we are using one funacation from react hook form call controller all the rte component are written in this controller tag it use as ref hook 
-in postform.jsx we use another funcation of react hook  in post form   we take data from post from the post generate data like title ,slug ,content , status. now we also use useselector from the react-redux useselector select the state of userdata
-now create a submit button check if there is file then show the image or show the upload image anf tthe data as null
-if file is there and for delete file delete file of post.feauredimage
-and for more funaclity (video no.25 after 24 min)