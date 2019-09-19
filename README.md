## Broken ToDo List with Awesome Authentication

your glitch link e.g. https://a3-brandon-m-navarro-brandon-navarro.glitch.me/login

For my project, I wasn't able to completely implement all the required concepts. My project doesn't make use of a database,
so it is unable to persist users through different sessions, but users are able to create an account and log in. The design
for the login and register page were done using bootstrap, while I tried to implement my own CSS on the task creation page.
I think this is where I went wrong, because I spent way too much time playing around with my CSS and not implementing all
the server requirements. For user authentication, I was able to successfully implement passport, along with encrypting users
passwords. Although I wasn't able to complete the server, I was still able to use a number of middleware packages. The first
of which is 'morgan', which allowed me to generate log files about the users requests.
I also used 'passport' with the 'passport-local' strategy as another middleware, and that was for user authentication 
with an email and password. The third middleware I used was 'express-flash'. Express-flash allowed me to define a flash message 
and render it without redirecting the request. This was used for alerting the user that either an account didn't exist, or if the
password was incorrect. The fourth middleware used was bcrypt. This was used for hashing users passwords for added security.
Also, I used 'express-session' to create a session and 'dotenv' store the SESSION_SECRET key. Finally, I used helmet to set various HTTP headers to help protect my app. Please note the add/remove/edit functionality does
not work.


## Technical Achievements
- **Password Encyption**: I used bcrypt to encrypt a users password for added security.
- **Session**: Once the user logs in, they will not be able to return back to the login page or register page until they
              click the log out button.
- **Flash Messages**: The user will be alerted of whether their email was incorrect, or if their password was incorrect.
                      In a practical application, I would keep it more vague and just say 'Invalid email/password', but I wanted
                      to show that both errors were beinng captured.
- **Asynchronous Programming**: The use of bcrypt led me to ultimatly having to use the 'async' & 'await' keyword in order to
                                correctly handle the promise that is created by calling bcrypt.hash().
                                                      

### Design/Evaluation Achievements
- **Custom CSS**: I spent a lot of time try to create a nice background and layout for the task list, but in hindsight I really
                  should have just expedited the process with a framework. I'm listing this as an achievement because I spent a lot
                  of time on it, but in reality it's not very responsive.