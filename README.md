# ChainTech-Network

In this project I useed bcrypyt,body-parser,express,jsonwebtoken,mongoose and nodemon npm packages.

In this project there are 7 endpoint.UserRegister,UserLogin,CreatETask,GetAllTask,MarkTask,EditTask and DeleteTask.

There are two controllers UserController and TaskController
There are two schemas TaskModule for taskcontroller and usermodule for user controller

# UserRegistretion api
in thi api user have to provide fname,lname,email,phone,password.
user cant provide other fields than mentoned above.
I applied various rejex and validations for frontend inputs.
then I convert incoming decoded password in to encurrpted passsword with the help of bcrypt npm package
then I check the email and phone is already registerd or not if email is already registerd then error will send 

after all of these I create new object in databse.

