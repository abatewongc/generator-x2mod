[![npm version](https://badge.fury.io/js/generator-x2mod.svg)](https://badge.fury.io/js/generator-x2mod)

# yo x2mod: Now this is mod-racing
Welcome to `yo x2mod`, a Yeoman generator for mods for Firaxis' XCOM 2!

## How do I get started?
First, get [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/). (NPM comes with node if you don't already have either one.) Then open a terminal, powershell, or command shell and get ready to experience Yeoman magic:

First, install Yeoman and the XCOM2 mod generator.
```
npm i -g yo generator-x2mod
```

Great. Now you can use Yeoman to create an XCOM2 mod.

```
yo x2mod
```

Then open up your favorite text editor, and you're off to the modding races. Wait - how does Yeoman know that you're the commander?

![check it](https://i.imgur.com/K7ox5XB.png)

## Why would I ever do insane command-line crap when I have ModBuddy?

Maybe you wouldn't! If ModBuddy suits your workflow, keep ModBuddying it up. But here's how I got here:

Firaxis graciously ships an SDK called ModBuddy to help modders create community-based content for XCOM 2. This is wonderful. The less wonderful part is that ModBuddy itself is based on Visual Studio 20-something-really-old, and while older versions of Visual Studio can be powerful, they can also be clunky, slow, and, impressively enough for pieces of software, outright vindictive. 

I already started trying to do my part to give us modders more choices by creating [build scripts](https://github.com/jammerware/x2mods-dev-scripts) that we can use to compile and run our mods in other text editors and IDEs. Using these scripts as a standalone replacement for ModBuddy had a cost. It completely hosed one of the great benefits of the Visual-Studio-based SDK: the templates. When you create a new mod with ModBuddy, it offers you a sweet list of templates to get started. These are awesome for getting a new mod off the ground, and I didn't have a solution to that.

... Until now.

[Yeoman](http://yeoman.io/) is the open source community's answer to project templating. It's a generator framework that lets open source programmers create, use, and share templates for any project in any framework and on any platform that they want. Fortunately enough, "any framework and on any platform" includes XCOM 2. This project is a Yeoman generator for mod projects, and getting started with it is really easy.

## FAQ
### Sweet, so I don't need the XCOM 2 SDK anymore?

You still need the SDK because it contains the Unreal compiler, tools, and assets you'll need (and some you'll probably even want) when you're creating your mod. `yo x2mod` just encapsulates a way to create mods from templates and provides scripts to build and run them in development mode. If that covers your modding needs, you never need to open ModBuddy again if you don't want to.

### But ModBuddy has templates for all kinds of mods, like voice packs and missions and weapons and crap. What if I love those?

Good on you! The cool thing about creating a open source Yeoman generator for mods is that we as a community can decide what kinds of templates we want to be available when we use `yo x2mod` to create a mod. I'm not saying we'll all want to have "Example Mod with A Spiky Grenade That Turns All Soldier Hair Blue" as an option when we're spinning up a new mod, but options that we didn't have before like "Example Highlander-Compatible Mod" are possible with this workflow. The bottom line here is that if you're interested in a mod template that `yo x2mod` doesn't have yet (which is likely, since right now it just automatically creates an absolutely bare-bones mod), feel free to open an issue or submit a PR, and we'll talk about it.

### If I create a mod with this tool and decide I want to go back to a ModBuddy-based workflow, can I do that?

You can, but it's not trivial. `yo x2mod` doesn't make any attempt to masquerade your mod as ModBuddy-compatible - rather than using `.XCOM_sln` and `.x2proj` files like ModBuddy does, it just creates an `.XComMod` file in the source directory that its build script knows to consult when building your mod for development and debugging. If you want to move a mod that was bootstrapped with this generator into a ModBuddy project, the easiest way will likely be to create an empty ModBuddy project with the same safe name as your mod and manually add the mod files into it in the appropriate folder structure. TL;DR - Try before you buy. Migrating back to ModBuddy isn't for the faint of heart. Sorry, though.

### What happens when I want to publish my mod? Don't you need an .x2proj file to publish mods?

Publishing is for suckers. Real modders just stay in development for years to avoid commitment.

I'm kidding. I haven't figured out how I'm going to do this yet, but it seems possible. I need to figure out how the `.x2proj` is used when a mod is uploaded via Steam or the Alternative Mod Uploader and possibly generate a fake one for this purpose if necessary. Details coming. Someday.