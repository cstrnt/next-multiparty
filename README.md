# Next-Multipart

Next-multipart is a small utility library to ease the process of file uploads with Next.js.
It uses [formidable](https://github.com/node-formidable/formidable) under the hood, but with much less work to do and a modern API


## Installation

Installation is pretty straight forward. Simply run one of the following commands to install
it to your Next.js app.

```
yarn add next-multipart
npm i next-multipart
pnpm add next-multipart
```

## Usage

*TL;DR: *

1. `import { withFileUpload, getConfig } from 'next-multipart'`
2. Simply wrap any api route with `withFileUpload`
3. `export const config = getConfig()`
4. You now can access `req.file` (if the request contained one file field) or `req.files`
5. Call `await req.file.toBuffer()` to load the file into the memory