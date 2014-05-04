# Getting Started

<a href="http://sys-lab.github.io/syslib" target="_blank">Doc Index</a>


#Install

Just <a href="http://sys-lab.github.io/syslib" target="_blank">download</a> this latest stable build.

or clone the repo and use

node build.js build

to build on your own


Then link the SYSLIB.js or syslib.min.js to your page.

If you want to use SYSLIB UI,you must <a href="https://raw.githubusercontent.com/Sys-Lab/syslib/gh-pages/src/ui.css" target="_blank">download</a> the ui.css and link to your page.

#One more thing

the lib has it's own require system,and it takes some time.

So you'd better use SYSLIB.include to load your app's file in window.nsloaded;

this will be called once SYSLIB and it's plugins are loaded.


#the lib can also run on phonegap,and this is no need to use window.nsloaded on phonegap.

Now head to <a href="http://sys-lab.github.io/syslib" target="_blank">Basic usage</a>
