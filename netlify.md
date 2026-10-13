## Visit Site

- https://docs.netlify.com/

## Directory structure

```text
mock-rest-api/
├── netlify/                
├── index.html              
├── main.js                 
├── netlify.toml            
├── package.json
└── vite.config.js          
```

## Install Netlify CLI

Run this command in your project terminal to install it globally:

```bash
npm install -g netlify-cli
npm install netlify-cli --save-dev
```

## Start Your Local Server

Instead of your regular run command, use this one:

```bash
npm install
netlify dev
```


## What Happens Now?

1. The tool will boot your Vite server in the background.
2. It will boot a local serverless environment on a port like http://localhost:8888.
3. It automatically intercepts `/data`, runs your `netlify/functions/data.js` script locally, and returns the pure JSON data.

You can now use http://localhost:8888/data?type=user&id=1 locally, and it will behave exactly like your live website.