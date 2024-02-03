# bus-tracker-frontend [![Build & Publish Release APK](https://github.com/xBaank/bus-tracker-front/actions/workflows/apk.yml/badge.svg)](https://github.com/xBaank/bus-tracker-front/actions/workflows/apk.yml) [![Github tag](https://badgen.net/github/tag/xBaank/bus-tracker-front)](https://github.com/xBaank/bus-tracker-front/tags)

This is the frontend for the MadridTransporte app

## How to deploy

Run

```bash
npm run build
```

and then copy the contents of the build folder to the server that will serve the app.

## How to deploy using Github pages

Edit the package.json file and change the `homepage` property to the url where the app will be served.

Then run

```bash
npm run deploy
```

[Backend](https://github.com/xBaank/bus-tracker-back)
