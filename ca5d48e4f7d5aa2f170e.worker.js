/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js?!./src/web/js/workers/FileLoader.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js?!./src/web/js/workers/FileLoader.worker.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--5!./src/web/js/workers/FileLoader.worker.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Web worker for loading files from disk into memory\n */\nself.addEventListener(\"message\", function (e) {\n  if (!e.data) return;\n  var data = e.data;\n  if (!data.command) return;\n\n  switch (data.command) {\n    case \"loadFile\":\n      self.loadFile(data.data);\n      break;\n\n    case \"exit\":\n      if (self.reader.readyState === 1) {\n        self.reader.abort();\n      }\n\n      break;\n\n    default:\n      console.warn(\"Invalid command \\\"\".concat(data.command, \"\\\"\"));\n  }\n});\n/**\n * Loads a file\n *\n * @param {object} fileObj\n */\n\nself.loadFile = function (fileObj) {\n  self.currentfile = {\n    file: fileObj.file,\n    id: fileObj.id\n  };\n  console.log(\"Loading file (ID: \".concat(self.currentfile.id, \", Name: \\\"\").concat(self.currentfile.file.name, \"\\\", Size: \").concat(self.currentfile.file.size, \", MIME: \").concat(self.currentfile.file.type, \")\"));\n  self.reader.readAsArrayBuffer(self.currentfile.file);\n};\n/**\n * Handles events fired by the FileReader\n *\n * @param {Event} event\n */\n\n\nself.handleReaderEvent = function (event) {\n  switch (event.type) {\n    case \"progress\":\n      self.sendProgress(event);\n      break;\n\n    case \"load\":\n      self.sendResult(event);\n      break;\n\n    case \"error\":\n      self.sendError();\n      break;\n\n    default:\n      console.info(\"Invalid event type \".concat(event.type, \".\"));\n  }\n};\n/**\n * Sends the file read progress back to the main thread\n *\n * @param {Event} event\n */\n\n\nself.sendProgress = function (event) {\n  self.postMessage({\n    command: \"progress\",\n    data: {\n      id: self.currentfile.id,\n      loaded: event.loaded,\n      total: event.total\n    }\n  });\n};\n/**\n * Sends the loaded ArrayBuffer back to the main thread\n *\n * @param {Event} event\n */\n\n\nself.sendResult = function (event) {\n  if (!event.target) return;\n  var target = event.target;\n  self.postMessage({\n    command: \"fileLoaded\",\n    data: {\n      id: self.currentfile.id,\n      data: {\n        file: self.currentfile,\n        data: target.result\n      }\n    }\n  }, [target.result]);\n  self.currentfile = null;\n};\n/**\n * Sends the details of the error back to the main thread\n */\n\n\nself.sendError = function () {\n  self.postMessage({\n    command: \"error\",\n    data: {\n      id: self.currentfile.id,\n      data: self.reader.error\n    }\n  });\n};\n\nself.currentid = null;\nself.reader = new FileReader();\nself.reader.addEventListener(\"load\", self.handleReaderEvent);\nself.reader.addEventListener(\"error\", self.handleReaderEvent);\nself.reader.addEventListener(\"progress\", self.handleReaderEvent);\n\n//# sourceURL=webpack:///./src/web/js/workers/FileLoader.worker.js?./node_modules/babel-loader/lib??ref--5");

/***/ })

/******/ });