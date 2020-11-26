# bethesda-mod-tracker

https://designerjason.github.io/bethesda-mod-tracker/index.html

As a console user, I created this app to keep track of my list(s) of mods. Because I'm not happy with just the one list that the console gives you. Some days I might like to roleplay a synth in Fallout, and use a bunch of synth mods. Another, I might want to focus on managing settlements.

Bethesda was awesome in enabling mods for console users. Unfortunately, there's no system in place to organise my mods into lists, or different 'profiles'. Added to the fact that consoles have a maximum total download cap, I found myself spending far too long trying to rebuild my changed modlist, whenever I wanted to alter my play style. The mod website at bethesda doesn't handle too great, and the in-game UI is somewhat lacking. And when you're trying to search on console for that one esp file with the name ertefsxa.esp, because your save file told you so, it became **such a chore**.

This app was intended as a partial solution. Whilst the process is still somewhat manual, it's more of a quick reference and I can now just search then download on the console. When I'm happy with my console list of mods, I just create a profile for it. I imagine once I have a good list of go-to mods, the search feature will be used less..

## mod search

This feature basically pulls data from the bethesda database of mods. You need to know the mod exists first. Note: there's a **hard limit of 50 search results**. I don't want to upset the guys over at Bethesda, so choose your search terms wisely. If you're just browsing for mods you should probably use the official site at https://bethesda.net/en/mods.

## my mods

Compile as many mod profiles as you want, each with it's own list. Refer back to it when you want to use a specific mod list.
When you create a mod profile, or add mods to a profile - toggle it by ticking it's checkbox - **you'll need to save it**. The page will list **all** mods you have selected by default, irrespective of platform or game. I figured this could be a better approach, say if you have multiple platforms with the same mod or want an overview of **all** your armor mods.

## to do

This is still a rough and ready work in progress, and relies on the bethesda api. Any changes there will most certainly affect whether it continues to work going forwards.

## what's next?

I'd like to add new features as they come, and anyone with some dev experience is welcome to fork this, send feedback, log bugs & get involved etc.

* Add up filesizes on a mod profile, to show you how much potential space you're going to use up on your console.
* Ability to re-order mods in a profile, to match a specific load order
* Front End needs quite a tidy up, implement task runners for sass etc
* Add icons to make mods instantly recognisable as platform/product specific e.g fallout4, xbox
* Probably tweak some of the styling a bit
* Might add mod thumbnails to the mod list page, for easier instant recognition
* Add a toggle to show only active mods in a profile
* *kinda* works on mobile - though a bit untidy in places. Would be nice to make it use service workers and behave more like an app
