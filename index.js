// In Node.js each file is a module

/* fs=>is file system
so by using this module , we will get access to functions for reading and writing data
require('fs') => calling this function with  built in fs module name will return an object
  in which there are alot of functions that we can use
*/
const fs = require("fs");
// http module which give networking capbability.
const http = require("http");

// for setting url we use url module
const url = require("url");

// provide specific string which given to the url
// how slug works open the documentation
const slugify = require("slugify");

// in require function the dot means the current location of this module
const replaceTemplate = require(`./modules1/replacetemp1`);

////////////////////////////////////////////
//files

// // blocking, synchronous way
// //readFileSync this function=> take two Arguments 1). path => from where we're reading 2). character encoded
// const textIn = fs.readFileSync('./starter/txt/input.txt','utf-8');
// console.log(textIn);
//  const textOut = `This is what we know avacado: ${textIn}.\nCreated on ${Date.now()} `;
//  //the second argument=> what will we want to write!
// fs.writeFileSync('./starter/txt/output.txt',textOut);
// console.log('written');

// // Non blocking, asynchronous way.
// // (err,data)=> it is call back function and has 2 arguments the second argument is data
// // method => directly it read the file and and the remainging code execute normally.
// fs.readFile(`./starter/txt/start.txt`, 'utf-8', (err, data1) => {
//   if (err) return console.log('Here is error');
//   fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);
//       // concatenate two file text.
//       fs.writeFile(`./starter/txt/final.txt`, `${data2}\n ${data3}`, 'utf-8', err => {
//         console.log('the file is written');
//       })
//     });
//   });
// });
// console.log(`will read file!`);

////////////////////////////////////
//Sever

// in js we never change the original string so original data is in temp and to make cahnges here
// is output which we update
// const replaceTemplate = (temp, product) => {
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);

//  // if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not_organic');

// if (!product.organic) {
//   output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
// } else {
//   output = output.replace(/{%NOT_ORGANIC%}/g, '');
// }

//   return output;
// }
// to understand the concept of server go through the node.js official doc (introduction to node.js)
// ${__dirname}=> is an exception of require function.
const tempOverview = fs.readFileSync(
  `${__dirname}/final/templates/template-overview.html`,
  `utf-8`,
);
const tempCard = fs.readFileSync(
  `${__dirname}/final/templates/template-card.html`,
  `utf-8`,
);
const tempProduct = fs.readFileSync(
  `${__dirname}/final/templates/template-product.html`,
  `utf-8`,
);
const data = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);

// console.log(dataObj[0,1,2,3,4].id); wrong
// const slugs=dataObj.map(el=>slugify(el.productName,{
//   replacement: '-',
//   lower: false
// }));
// console.log(slugs);

// To build sever we did two things => 1. create the sever 2. start the server.
//createServer()=> take a call back function which call each time when a neaw
// request hits our sever.
//call back function have access of req obj that hold ex: url,and here is resp obj
// for sending out response.

// test slugify:
console.log(
  slugify("fresh Avacados", {
    replacement: "-",
    lower: false,
  }),
);

const server = http.createServer((req, res) => {
  // console.log(req.url);

  // /product?id=3&name=apple Everything after ? is called the query string.
  // Pathname decides WHAT page Query decides WHICH data
  // console.log(url.parse(req.url));  // i pass the querry in the parse the function

  // implementing routing
  // In real world apllication routing becomes very diffcult => for solving routing problem we use Express toll
  // Routing means implement different actions on different URLS
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });

    // console.log(query); //id =0
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === "/api") {
    // whenEver  requist hits the api  it read the file again but i want that it read file  once
    // whenever it hit the request it only send the response so we use  function in synchronus way on the top
    // fs.readFile(`${__dirname}/final/dev-data/data.json`,`utf-8`,(err,data)=>{
    //   // JSON.parse()=> it is built in function that uses to convert string into javascript obj
    //      const productData = JSON.parse(data);
    //
    // });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  }

  // Not found
  else {
    //header

    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    // response content
    res.end("<h1>Page not found</h1");
  }

  // console.log(req.url);
});

//listen=> it take a port as argument and the port means that a subAddress on a certain host
// the next arg to specify the  local host . (local host => means that your computer)
// the third argument is optional which is call back function which is run when sever start listening
server.listen(4000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});

// Express is node frameWork
// two types of packages
//1. dependies packages => that package include some code built in and also contain our code known as dependies
// 2. dev dependency:
// slugy tool packages => tool which contain more readable urls
// to install npm package :

//Syntax:
//npm install slugify=>(package name)
//Question : where is package is install and how to check it that install correctly
// development dependency => nodemon
//syntax:
// npm install nodemon --save-dev=> this tool automatically restart server if we did change in code
// the npm and slugify install locally
// how to access npm locally

// the global package to install => other version of nodeman where we access it anywhere
// package name=> nodemon
//syntax
// npm i nodemon --global
//
// Backlog Question: how i use local nodemon instead of global nodemon

// Talking about the version of npm
// for ex: "nodemon": "^3.1.11"
// ^ this symbol represent that npm accept minor update version
// ~ npm accept patch update version => safest version
// * npm accept major update version => its not a good idea

// 11=> is patch version for bug fixing
// 1=> is minor version //introduce new features
// 3=> is major version // new changes that old code not work

// Steps to updating new packages
// 1. first check out dated package
// =>npm outdate => it show a table of outdated packages that install in project
// to install package of any version
// syntax : npm install slugify@1.0.0

// to uninstalling npm packages
// syntax :
// npm uninstall package name
// we never share node_modules on github repositary
// to reconstruct node modeule file always share package.json
// and package-lock.json file
//  package-lock.json file contain all version that we using in our project
// test file
var c =5+2;