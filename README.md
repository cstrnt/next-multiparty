# next-multipart

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

**TL;DR:**

1. `import { withFileUpload, getConfig } from 'next-multipart'`
2. Simply wrap any api route with `withFileUpload`
3. `export const config = getConfig()`
4. You now can access `req.file` (if the request contained one file field) or `req.files`
5. Call `await req.file.toBuffer()` to load the file into the memory

## API

### withFileUpload
The `withFileUpload` function is a higher-order function which should be wrapped around
an api route from next.js:

```js
import { withFileUpload } from 'next-multipart';
export default withFileUpload(async (req, res) => {
    res.json({test: 1})
})
```

By default it will attach the files and files which were posted to that endpoint to the `NextApiRequest` (in this case `req`) **if** the method was `POST`, `PATCH` or `PUT` **and** the `Content-Type` header was set to `multipart/form-data`.

If the request includes files they will be saved to the disk in the `os.tmpdir()` directory.
After the execution of the handler all files will be cleaned up automatically.

The following properties are added to the Request:

- `files`: Array of [EnhancedFile](#EnhancedFile)
- `file`: Single [EnhancedFile](#EnhancedFile). Will be `undefined` if there are no files
- `fields`: Object containing the name of the field as the key and the value of the field as the value

You can also pass a second parameter `options` to `withFileUpload`. Options is an object with the following values:

```ts
// Methods which should be allowed. Defaults to ['POST', 'PATCH', 'PUT']
allowedMethods?: HTTP_METHOD[];

// Flag whether the files should be removed after the execution of the handler. Defaults to true. You will probably not need to touch this.
cleanupFiles?: boolean;

// Options to change the behavior of formidable (e.g. max file size). Please refer to the https://github.com/node-formidable/formidable#options
formidableOptions?: formidable.Options
```


### EnhancedFile
Basically just [formidable.File](https://github.com/node-formidable/formidable#file) but with two added helper functions:

```ts
// Loads the file asynchronously from the file system and loads it into the memory
// will throw if the file doesn't exists anymore
toBuffer: () => Promise<Buffer>

// Deletes the file from the file system if it exists
destroy: () => Promise<void>
```