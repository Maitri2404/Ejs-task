const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const querystring = require('querystring');
const dotenv=require('dotenv').config();


const port=process.env.PORT || 3000;

const data = JSON.parse(fs.readFileSync('users.json'));
const verificationForm = fs.readFileSync('email2.ejs', 'utf-8');
const verificationTemplate = fs.readFileSync('verified.ejs', 'utf-8');
const profileTemplate = fs.readFileSync('profile.ejs','utf-8');
const profileForm=fs.readFileSync('profile-form.ejs','utf-8')

const server = http.createServer((req, res) => {
  if (req.url === "/verification" && req.method === "POST") {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = querystring.parse(body);
      //console.log(formData);
      const { email } = formData;
      const verifiedUser = data.users.find(user => user.email === email);
      if (verifiedUser) {
        const output = ejs.render(verificationTemplate, { email });
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(output);
      } else{
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h3>Verification Failed</h3>');
        res.end();
      }
    });
  }
  else if (req.url === "/profile" && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const formData = querystring.parse(body);
        const { email, password } = formData;
        //const password = formData.password.trim();
        const user = data.users.find(user => user.email == email && user.password === password);
        console.log(user);
        if (user) {
            const output = ejs.render(profileTemplate, { user });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(output);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h3>enter valid email and password!!</h3>');
            res.end();
        }
    });
}
else if(req.url==='/profile-form'){
  const output=ejs.render(profileForm);
  res.writeHead(200, {"Content-Type":"text/html"});
    res.end(output);
}
   else {
    const output = ejs.render(verificationForm);
    res.writeHead(200, {"Content-Type":"text/html"});
    res.end(output);
  }
});

server.listen(port,() => {
  console.log(`Server is running on port ${port}`);
});

