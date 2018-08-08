# deploy-elm-now-zeit
> Files needed to deploy (build) an Elm app on zeit.co with now

When you try to deploy an Elm app built with Webpack to [zeit.co] you may wonder why the deployed app doesn't work while the build process shows no errors. However, in the browser console you might notice something like 
```sh
Uncaught TypeError: Cannot read property 'embed' of undefined
    at Object.<anonymous> (main-afc54605910c3ef5ded5.js:1)
    at o (main-afc54605910c3ef5ded5.js:1)
    at main-afc54605910c3ef5ded5.js:1
    at main-afc54605910c3ef5ded5.js:1
```
(Chrome) or
```sh
TypeError: undefined is not an object (evaluating 'r.Main.embed')
```
(Safari).

When looking closer on the build log you may notice that the Elm compiler didn't yield a result:
```sh
>  [11] ./src/elm/Main.elm 0 bytes {0} [depth 1] [built]
```
The problem is actually that elm-make fails to run on the Alpine Linux of [zeit.co] and creates a core dump due to functions missing in the C runtime library.
The best solution I found was to use a Dockerfile that selects a different Linux. Feel free to use the files in this repository and build your Elm apps on [zeit.co] :-).

   [zeit.co]: <https://zeit.co>

