# Vue GraphEditor

## Summary

Vue GraphEditor is a diagramming plugin for VueJS. This code base contains the library code as well as a sample application demonstrating how to use it.

---

## Quickstart for Development

Developing with a compiled NPM is slower and less ideal for core development. These steps build the sample app
using Vue GraphEditor code directly instead of building an NPM first.

```sh
yarn
yarn start
```

## Developing as a Library

For local development using Vue GraphEditor as a library, you can run `yarn watch` on the library package and `yarn start` on the sample app package. You will need to link the 2.

Edit the App.vue file to import as NPM instead of absolute path:

```javascript
// Comment next line out to NOT use as NPM
// import GraphEditor from 'vue-graph-editor';
// Comment next line out to use as NPM
import GraphEditor from '../../src/components/GraphEditor.vue';
```

In the project directory:

```sh
yarn
yarn link
yarn watch
```

In another terminal window:

```sh
cd sample-app
yarn
yarn link vue-graph-editor
yarn serve
```

### Other yarn scripts

To build an NPM for production:

```sh
yarn build
```

To run lint and prettier over the entire project:

```sh
yarn lint
yarn prettier
```

To fix prettier issues automatically:

```sh
yarn prettier --write
```
