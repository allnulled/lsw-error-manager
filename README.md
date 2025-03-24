# lsw-error-manager

Error manager tool for LSW.

## Installation

```sh
npm i -s @allnulled/lsw-error-manager
```

## Importation

From node.js:

```js
require("@allnulled/lsw-error-manager");
```

From html:

```html
<script src="node_modules/@allnulled/lsw-error-manager/lsw-error-manager.js"></script>
```

## Usage

**ATENTION:** this library overrides the default `Error` global behaviour, so it is a very bad practice.

- It calls the default error constructor.
- It creates a `accumulated = []` property.
- It overrides `toString` to return a JSON.
- It overrides `toJSON` to return the typical properties (`name`, `message`, `stack`) + `accumulated`.

## Test

This is the official test right now:

```js
require(__dirname + "/lsw-error-manager.js");

describe("LSW Error Manager API Test", function (it) {

  it("can create an instance", async function () {

    try {
      try {
        try {
          try {
            throw new Error("OriginalError");
          } catch (error) {
            throw error.appendError(new Error("Phase 1.1.1 broken"));
          }
        } catch (error) {
          throw error.appendError(new Error("Phase 1.1 broken"));
        }
      } catch (error) {
        throw error.appendError(new Error("Phase 1 broken"));
      }
    } catch (error) {
      console.log(`Phase 1 aborted due to: ${error}`);
      console.log(`Phase 1 aborted due to: ${error.summarized()}`);
    }

  });

  it("can still debug extended errors", async function () {

    try {
      const err = new Error("");
      err.otherProperty = 500;
      throw err;
    } catch (error) {
      console.log(`Can see the error extended property: ${error}`);
    }

  });

});
```

The second test, you can ignore it.

There are 2 logs, 1 summarized.

The not summarized is still stringified:

```json
Phase 1 aborted due to: {
  "name": "Error",
  "message": "OriginalError",
  "stack": [
    "Error: OriginalError",
    "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:15:19)",
    "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
    "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
    "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
    "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:7:1)",
    "Module._compile (node:internal/modules/cjs/loader:1256:14)",
    "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
    "Module.load (node:internal/modules/cjs/loader:1119:32)",
    "Module._load (node:internal/modules/cjs/loader:960:12)",
    "Module.require (node:internal/modules/cjs/loader:1143:19)"
  ],
  "accumulated": [
    {
      "name": "Error",
      "message": "Phase 1 broken",
      "stack": [
        "Error: Phase 1 broken",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:23:25)",
        "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
        "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
        "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:7:1)",
        "Module._compile (node:internal/modules/cjs/loader:1256:14)",
        "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
        "Module.load (node:internal/modules/cjs/loader:1119:32)",
        "Module._load (node:internal/modules/cjs/loader:960:12)",
        "Module.require (node:internal/modules/cjs/loader:1143:19)"
      ]
    },
    {
      "name": "Error",
      "message": "Phase 1.1 broken",
      "stack": [
        "Error: Phase 1.1 broken",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:20:27)",
        "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
        "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
        "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:7:1)",
        "Module._compile (node:internal/modules/cjs/loader:1256:14)",
        "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
        "Module.load (node:internal/modules/cjs/loader:1119:32)",
        "Module._load (node:internal/modules/cjs/loader:960:12)",
        "Module.require (node:internal/modules/cjs/loader:1143:19)"
      ]
    },
    {
      "name": "Error",
      "message": "Phase 1.1.1 broken",
      "stack": [
        "Error: Phase 1.1.1 broken",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:17:29)",
        "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
        "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
        "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
        "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:7:1)",
        "Module._compile (node:internal/modules/cjs/loader:1256:14)",
        "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
        "Module.load (node:internal/modules/cjs/loader:1119:32)",
        "Module._load (node:internal/modules/cjs/loader:960:12)",
        "Module.require (node:internal/modules/cjs/loader:1143:19)"
      ]
    }
  ]
}
```

The summarized version looks like this:

```json
Phase 1 aborted due to: {
  "name": "Error",
  "message": "OriginalError",
  "stack": [
    "Error: OriginalError",
    "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:11:19)",
    "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
    "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
    "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
    "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:3:1)",
    "Module._compile (node:internal/modules/cjs/loader:1256:14)",
    "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
    "Module.load (node:internal/modules/cjs/loader:1119:32)",
    "Module._load (node:internal/modules/cjs/loader:960:12)",
    "Module.require (node:internal/modules/cjs/loader:1143:19)"
  ],
  "uniqueTraces": [
    [
      "Error: Phase 1 broken",
      "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:19:25)"
    ],
    [
      "Error: Phase 1.1 broken",
      "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:16:27)"
    ],
    [
      "Error: Phase 1.1.1 broken",
      "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:13:29)"
    ]
  ],
  "commonTraces": [
    "/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:265:45",
    "runQueue (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:130:23)",
    "describe (/home/carlos/Escritorio/ANTERIOR/universal-tester/universal-tester.bundled.js:295:16)",
    "Object.<anonymous> (/home/carlos/Escritorio/lsw/src/lsw-framework/src/apis/lsw-error-manager/test.js:3:1)",
    "Module._compile (node:internal/modules/cjs/loader:1256:14)",
    "Module._extensions..js (node:internal/modules/cjs/loader:1310:10)",
    "Module.load (node:internal/modules/cjs/loader:1119:32)",
    "Module._load (node:internal/modules/cjs/loader:960:12)",
    "Module.require (node:internal/modules/cjs/loader:1143:19)"
  ]
}
```