# yo x2mod | a Yeoman generator for XCOM 2 mods
Welcome to `generator-x2mod`, a Yeoman generator for mods for Firaxis' XCOM 2!

## What even is this?
Firaxis graciously ships an SDK called ModBuddy to go alongside XCOM 2, which is wonderful. The less wonderful part is that ModBuddy is based on Visual Studio 20-something-really-old, and while older versions of Visual Studio can be powerful, they can also be clunky, slow, and, impressively enough for a piece of software, outright vindictive. 

I already started doing my part to give us modders more choices by creating [build scripts](https://github.com/jammerware/x2mods-dev-scripts) that we can use to compile and run our mods in other text editors and IDEs. Using these scripts had a cost. It completely hosed one of the great benefits of the Visual-Studio-based SDK: the templates. The templates that ship with ModBuddy are great starting places for new modders, and I didn't have a solution to that.

... Until now.

[Yeoman](http://yeoman.io/) is the open source community's answer to repository and project templating. It's a generator framework that lets OSS devs create, use, and share templates for any project in any framework and on any platform that they want. Fortunately enough, "any framework and on any platform" includes XCOM 2. This project is a Yeoman generator for mod projects, and getting started with it is really easy.

## How do I anything?
First, get [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/). (NPM comes with node if you don't already have either one.) Then open a terminal, powershell, or command shell and get ready to experience Yeoman magic:

```
npm i -g yo                    // you'll only have to do these two
npm i -g generator x2mod       // the first time you use generator-x2mod
yo x2mod
```

You're off to the races, and _somehow_, Yeoman even knows that you're the commander!

![check it](https://i.imgur.com/K7ox5XB.png)