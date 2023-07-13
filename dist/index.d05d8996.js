// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"0Vcoj":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "d21fb554d05d8996";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets, assetsToDispose, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets); // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                } // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle, id) {
    // Execute the module.
    bundle(id); // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            }); // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"eDkEx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _three = require("three");
var _orbitControlsJs = require("three/examples/jsm/controls/OrbitControls.js");
var _gltfloader = require("three/examples/jsm/loaders/GLTFLoader");
var _datGui = require("dat.gui");
var _gsap = require("gsap");
var _gsapDefault = parcelHelpers.interopDefault(_gsap);
var _cannonEs = require("cannon-es");
var _cannonEsDebugger = require("cannon-es-debugger");
var _cannonEsDebuggerDefault = parcelHelpers.interopDefault(_cannonEsDebugger);
var _utilityJs = require("./utility.js");
var _robotJs = require("./robot.js");
var _obstacleJs = require("./obstacle.js");
var _skyBgPng = require("../assets/sky_bg.png");
var _skyBgPngDefault = parcelHelpers.interopDefault(_skyBgPng);
var _landBgPng = require("../assets/land_bg.png");
var _landBgPngDefault = parcelHelpers.interopDefault(_landBgPng);
var _groundtexturePng = require("../assets/groundtexture.png");
var _groundtexturePngDefault = parcelHelpers.interopDefault(_groundtexturePng);
var _shiftPng = require("../assets/shift.png");
var _shiftPngDefault = parcelHelpers.interopDefault(_shiftPng);
var _spacePng = require("../assets/space.png");
var _spacePngDefault = parcelHelpers.interopDefault(_spacePng);
//----NUOVE COSTANTI----
var robotArray = [];
//--------------START -----------------
const timeStep = 1 / 60;
const world = new _cannonEs.World({
    gravity: new _cannonEs.Vec3(0, -100, 0)
});
//---------------- COSTANTI ----------------
let currentPrice = 40;
const settings = {
    spawnAmount: 3
};
//----------------  END COSTANTI ---------------
//-------------- ASSETS -----------
const scuderia = new URL(require("67f826a1e22a7a16"));
const muro1 = new URL(require("504c5afbb73ffd9c"));
const paglia = new URL(require("a50a6ac33660f40a"));
const scene = new _three.Scene();
const loadingManager = new _three.LoadingManager();
const assetLoader = new (0, _gltfloader.GLTFLoader)(loadingManager);
const progressBar = document.querySelector("#progress-bar");
loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = loaded / total * 100;
};
const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function() {
    progressBarContainer.style.display = "none";
};
const cubeTextureLoader = new _three.CubeTextureLoader(loadingManager);
scene.background = cubeTextureLoader.load([
    (0, _skyBgPngDefault.default),
    (0, _skyBgPngDefault.default),
    (0, _skyBgPngDefault.default),
    (0, _landBgPngDefault.default),
    (0, _skyBgPngDefault.default),
    (0, _skyBgPngDefault.default)
]);
let wallList = [];
let wallBodyList = [];
var obstacleArray = [];
//-------------- END ASSETS -----------
// ----------- GLOBAL VARIABLES ----------
const tl = (0, _gsapDefault.default).timeline(); //timeline for animations
let state = 0;
var releaseMode = false;
var time = 0; //time to manage the countdown
//competition variables
var cameraBehindRobotFinished = false;
var countDownFinished = false;
var myRobotIndex = 2;
var myRobotSpeed = 0.3;
var competitionTimerStart = 0;
var timerDelta = 0;
// highlight mesh while robot is apporaching to an obstacle
var highlightMeshTracker = {};
//Sounds variables
var countDownSoundURL = require("314f30ebb82233cc");
var startSoundURL = require("bbea45973c095f65");
var popURL = require("8a4872e16b784997");
var trashURL = require("26020aacc50219ee");
var eyeOfTheTigerURL = require("d4a59e0ddeb70e0c");
var countDownSound = new Audio(countDownSoundURL);
var startSound = new Audio(startSoundURL);
var popSound = new Audio(popURL);
var trashSound = new Audio(trashURL);
var eyeOfTheTigerSound = new Audio(eyeOfTheTigerURL);
var playedSoundsCountdown = [
    false,
    false,
    false,
    false
];
//for animate function
const clock = new _three.Clock();
//creative mode variables
var intersects;
//spawing variables
var spawned = false; //to communicate that the spawning is finished
var cameraSpawningFinished = false; //to communicate that the spawning camera animation is finished
//winnings variables
var winnerScreen = false;
var winnerRobot = null;
//---------- END GLOBAL VARIABLES ----------
const renderer = new _three.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Sets the color of the background
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;
const camera = new _three.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
// Sets orbit control to move the camera around
const orbit = new (0, _orbitControlsJs.OrbitControls)(camera, renderer.domElement);
orbit.update();
const textureLoader = new _three.TextureLoader();
const texture = textureLoader.load((0, _groundtexturePngDefault.default));
const planeMesh = new _three.Mesh(new _three.PlaneGeometry(300, 100), new _three.MeshStandardMaterial({
    side: _three.DoubleSide,
    map: texture,
    bumpMap: texture,
    bumpScale: 5,
    // color: 0x4da42D,
    visible: true
}));
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.receiveShadow = true;
const groundPhysMat = new _cannonEs.Material({
    friction: 100
});
const groundBody = new _cannonEs.Body({
    // shape: new CANNON.Plane(), //infinite plane
    shape: new _cannonEs.Box(new _cannonEs.Vec3(150, 0.1, 50)),
    position: new _cannonEs.Vec3(0, -0.1, 0),
    material: groundPhysMat
});
world.addBody(groundBody);
//END PLANE
//----------START Lights---------
const ambientLight = new _three.AmbientLight(0xFEFEFE, 0.4);
scene.add(ambientLight);
const directionalLight = new _three.DirectionalLight(0xFEFCDB, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-20, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
//--------------END LIGHTS--------------
//set some Options
var options = {
    directionalLight: {
        x: 0,
        y: 50,
        z: 0,
        rot_x: 0,
        rot_y: 0,
        rot_z: 0
    },
    camera: {
        rot_x: camera.rotation.x,
        rot_y: camera.rotation.y,
        rot_z: camera.rotation.z
    },
    gameConstants: {
        num_robots: 5,
        indexCameraFollows: myRobotIndex,
        camera_view: "third_person",
        spawnAnimationCameraDuration: 10,
        buttonsInstructionsFadeDuration: 15
    },
    settings: {
        sound_enabled: true,
        physic_debug: false
    },
    robotAnimationsActive: {
        0: "running",
        1: "running",
        2: "running",
        3: "running",
        4: "running"
    }
};
var PressedKeys = {
    space: false,
    shift: false
};
//--- Cannon debugger
const cannonDebugger = new (0, _cannonEsDebuggerDefault.default)(scene, world, {
    onUpdate: (body, mesh)=>{
        if (options.settings.physic_debug == true) mesh.visible = true;
        else mesh.visible = false;
    }
});
//COMPETITION
function managePreCompetition() {
    let countDownElement = document.querySelector("#countdown-current-value");
    countDownElement.style.opacity = 1;
    //move the camera behind the robot
    if (!cameraBehindRobotFinished) {
        //set the fov of the camera to 75
        camera.fov = 55;
        camera.updateProjectionMatrix();
        cameraBehindRobotFinished = true;
        tl.to(camera.position, {
            x: robotArray[myRobotIndex].mesh.position.x - 30,
            y: robotArray[myRobotIndex].mesh.position.y + 15,
            z: robotArray[myRobotIndex].mesh.position.z,
            duration: 2,
            onUpdate: function() {
                camera.lookAt(robotArray[myRobotIndex].mesh.position.x, robotArray[myRobotIndex].mesh.position.y, robotArray[myRobotIndex].mesh.position.z);
            },
            onComplete: function() {
                console.log("Camera behind the robot ---> complete");
                tl.clear();
            }
        });
    }
    //todo this coundown is repeating even if has been completed
    if (!countDownFinished) {
        countDownStarted = true;
        tl.to(countDownElement, {
            duration: 4.5,
            onUpdate: function() {
                countDownCompetitionManagement(tl.time());
            },
            onComplete: function() {
                console.log("Countdown ---> complete");
                countDownFinished = true;
            }
        });
    } else for(let i = 0; i < robotArray.length; i++)robotArray[i].mixer.stopAllAction();
}
function hideCountdown() {
    let countDownElement = document.querySelector(".countdown-competition");
    if (countDownElement) countDownElement.classList.add("hide-animation");
    setTimeout(function() {
        countDownElement.remove();
    }, 3000);
}
function manageRunning() {
    myRobotCompetitionManager();
    for(let i = 0; i < robotArray.length; i++)if (i != myRobotIndex) robotCompetitionManager(i);
    manageTimer();
    checkForWinner();
}
function manageTimer() {
    timerDelta = ((new Date() - competitionTimerStart) / 1000).toFixed(2);
    document.querySelector("#competition-timer-value").innerHTML = "Timer : " + timerDelta + "s";
}
function robotCompetitionManager(robotIndex) {
    if (robotIndex != myRobotIndex) {
        robotArray[robotIndex].mesh.position.setX(robotArray[robotIndex].mesh.position.x + robotArray[robotIndex].speed);
        robotArray[robotIndex].physicsBody.position.x = robotArray[robotIndex].physicsBody.position.x + robotArray[robotIndex].speed;
    }
}
function myRobotCompetitionManager() {
    robotArray[myRobotIndex].mesh.position.setX(robotArray[myRobotIndex].mesh.position.x + robotArray[myRobotIndex].speed);
    if (options.gameConstants.camera_view == "third_person") {
        camera.position.setX(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x - 30);
        camera.position.setZ(robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
    } else {
        camera.position.setX(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x + 50);
        camera.position.setY(robotArray[options.gameConstants.indexCameraFollows].mesh.position.y + 20);
        camera.position.setZ(50);
    }
    camera.lookAt(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
    orbit.target.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
}
function setRobotInitialSpeed() {
    for(let i = 0; i < robotArray.length; i++)if (i == myRobotIndex) {
        robotArray[i].speed = myRobotSpeed;
        robotArray[i].backup_speed = myRobotSpeed;
        robotArray[i].initial_speed = myRobotSpeed;
    } else {
        //random speed between 0.1 and 0.3
        robotArray[i].speed = Math.random() * (0.3 - 0.1) + 0.1;
        robotArray[i].initial_speed = robotArray[i].speed;
        robotArray[i].backup_speed = robotArray[i].speed;
    }
}
var reducingSpeed = false;
function robotCollisonHandler(e) {
    let spawnedObstacle = obstacleArray.filter((obstacle)=>obstacle.is_spawned == true);
    let index = spawnedObstacle.findIndex((obstacle)=>obstacle.physicsBody.id == e.body.id);
    if (index != -1) {
        if (reducingSpeed == false && robotArray[myRobotIndex].speed > 0.1) {
            robotArray[myRobotIndex].speed -= 0.03;
            console.log("diminuisco la velocita -->", robotArray[myRobotIndex].speed);
        } else reducingSpeed = true;
    }
}
function countDownCompetitionManagement(time) {
    var countDown = document.querySelector("#countdown-current-value");
    document.querySelector("#start-game").style.display = "none";
    if (countDown) {
        if (time > 1 && time < 2) {
            countDown.innerHTML = "3";
            if (!countDownSound.isPlaying && !playedSoundsCountdown[0] && options.settings.sound_enabled == true) {
                countDownSound.play();
                playedSoundsCountdown[0] = true;
            }
        }
        if (time >= 2 && time < 3) {
            countDown.innerHTML = "2";
            if (!countDownSound.isPlaying && !playedSoundsCountdown[1] && options.settings.sound_enabled == true) {
                countDownSound.play();
                playedSoundsCountdown[1] = true;
            }
        }
        if (time > 3 && time < 4) {
            countDown.innerHTML = "1";
            if (!countDownSound.isPlaying && !playedSoundsCountdown[2] && options.settings.sound_enabled == true) {
                countDownSound.play();
                playedSoundsCountdown[2] = true;
            }
        }
        if (time >= 4) {
            countDown.innerHTML = "VIA";
            if (!startSound.isPlaying && !playedSoundsCountdown[3] && options.settings.sound_enabled == true) {
                startSound.play();
                playedSoundsCountdown[3] = true;
            }
        }
    }
}
function checkForWinner() {
    if (!winnerScreen) {
        for(let i = 0; i < robotArray.length; i++)if (robotArray[i].mesh.position.x >= 120) {
            winnerScreen = true;
            winnerRobot = i;
            winnerTimer = timerDelta;
            printWinnerScreen();
            state = "winner";
        }
    }
}
function printWinnerScreen() {
    for(let i = 0; i < robotArray.length; i++)robotArray[i].mixer.stopAllAction();
    document.querySelector(".winner-screen").classList.remove("d-none");
    //add to the .message.competition-timer the class d-none
    document.querySelector(".message.competition-timer").classList.add("d-none");
    if (winnerRobot == myRobotIndex) {
        document.querySelector(".lost-container").classList.add("d-none");
        document.querySelector("#winner-screen-message").innerHTML = "YOU WON!";
        document.querySelector("#winner-time").classList.add("d-none");
        document.querySelector("#your-time").innerHTML = "Your time: <b>" + timerDelta + "s</b>";
    } else {
        document.querySelector(".trofeo-container").classList.add("d-none");
        document.querySelector("#winner-screen-message").innerHTML = "YOU LOST!";
        document.querySelector("#winner-time").innerHTML = "Winner time: <b>" + timerDelta + "s</b>";
        document.querySelector("#your-time").classList.add("d-none");
    }
}
//END COMPETITIOn
function animate() {
    world.step(timeStep);
    TWEEN.update();
    cannonDebugger.update();
    //State management
    switch(state){
        case "spawning":
            document.querySelector(".message-spawning").classList.remove("d-none");
            spawnOstacoli(tl, settings.spawnAmount);
            if (spawned == true && cameraSpawningFinished == true) {
                document.querySelector(".message-spawning").classList.add("d-none");
                state = "competition";
                console.log("Move to competition state");
            }
            break;
        case "competition":
            if (countDownFinished) {
                hideCountdown();
                document.querySelector(".competition-timer").style.display = "block";
                competitionTimerStart = Date.now();
                //enable the running clip for all the robots
                for(let i = 0; i < robotArray.length; i++)robotArray[i].runningClip();
                state = "running";
            } else managePreCompetition();
            break;
        case "running":
            manageRunning();
            break;
        case "winner":
            break;
    }
    linkMeshesAndBody(planeMesh, groundBody);
    linkMeshesAndBody(wallList, wallBodyList);
    if ((0, _obstacleJs.Obstacle).loaded) linkMeshesAndBody(obstacleArray);
    const delta = clock.getDelta();
    if ((0, _robotJs.Robot).loaded) for(let i = 0; i < robotArray.length; i++){
        robotArray[i].linkMeshAndBody();
        robotArray[i].updateMixer(delta);
    }
    renderer.render(scene, camera);
}
// start the rendering loop
requestAnimationFrame(animate);
renderer.setAnimationLoop(animate);
window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//-----------------------FUNCTIONS-----------------
function createWorld(assetLoader) {
    //This function takes care to add all the assets in the world as well as attach to them a cannonjs body
    if ((0, _robotJs.Robot).loaded) {
        createRobots();
        setRobotInitialSpeed();
        camera.position.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x + 30, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y + 14, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
        camera.lookAt(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
        orbit.target.set(robotArray[options.gameConstants.indexCameraFollows].mesh.position.x, robotArray[options.gameConstants.indexCameraFollows].mesh.position.y, robotArray[options.gameConstants.indexCameraFollows].mesh.position.z);
    }
    createScuderie(assetLoader, 5, {
        width: 100,
        heigth: 100
    });
    createPaglia(assetLoader, 5);
    createWalls(assetLoader, 38, 6, {
        width: 100,
        heigth: 100
    });
    if ((0, _robotJs.Robot).loaded) {
        for(let i = 0; i < robotArray.length; i++)if (i == myRobotIndex) {
            console.log("adding collision handler to my robot");
            robotArray[i].physicsBody.addEventListener("collide", robotCollisonHandler);
        } else {
            console.log("adding collision handler to robot " + i);
            robotArray[i].physicsBody.addEventListener("collide", function(e) {
                robotArray[i].jumpAnimation();
                robotArray[i].speed = robotArray[i].backup_speed;
                console.log("Set speed to " + robotArray[i].speed);
            });
        }
        state = "waitingForSpawn";
    }
}
function createRobots() {
    //Create the robots
    for(let i = 0; i < options.gameConstants.num_robots; i++){
        robotArray.push(new (0, _robotJs.Robot)(scene, world, -125, 0.1, -30 + i * 15));
        if (i == myRobotIndex) robotArray[i].is_my_robot = true;
    }
}
function createWalls(assetLoader, num_walls, num_lines, world_size) {
    //Caricamento Muri
    let wallModel;
    assetLoader.load(muro1.href, function(gltf) {
        wallModel = gltf.scene.children[0]; // get the root object of the model
        wallModel.position.set(-130, 0, -37, 5); // set the initial position of the model
        wallModel.scale.set(5, 5, 5);
        scene.add(wallModel); // add the model to the scene
        // Create copies of the model and add them to the scene
        const wallSpacing = 15;
        if (wallModel) {
            for(let i = 0; i < num_lines; i++)for(let j = 0; j < num_walls; j++){
                const wall = wallModel.clone();
                wall.position.set(wall.position.x + j * 7, 0, wall.position.z + i * wallSpacing);
                wallList.push(wall);
                scene.add(wall);
                //create a cannonjs body for the wall
                const boundingBox = new _three.Box3().setFromObject(wallModel);
                const size = new _cannonEs.Vec3();
                size.x = Math.abs(boundingBox.max.x - boundingBox.min.x);
                size.y = Math.abs(boundingBox.max.y - boundingBox.min.y);
                size.z = Math.abs(boundingBox.max.z - boundingBox.min.z);
                const shape = new _cannonEs.Box(size);
                const wallBody = new _cannonEs.Body({
                    mass: 30,
                    shape: shape,
                    position: new _cannonEs.Vec3(wall.position.x, wall.position.y, wall.position.z),
                    type: _cannonEs.Body.STATIC
                });
                world.addBody(wallBody);
                wallBodyList.push(wallBody);
            }
            console.log("Walls added to the scene");
        }
    });
}
function createScuderie(assetLoader, num_lines, world_size) {
    //Caricamento Scuderie
    let scuderiaMesh = null;
    assetLoader.load(scuderia.href, function(gltf) {
        scuderiaMesh = gltf.scene.children[0];
        scene.add(scuderiaMesh);
        scuderiaMesh.traverse(function(node) {
            if (node.isMesh) node.castShadow = true;
        });
        scuderiaMesh.scale.set(8, 8, 8);
        scuderiaMesh.position.set(-130, 0.1, -30);
        scuderiaMesh.rotation.set(0, Math.PI / 2, 0);
        const wallSpacing = 15;
        if (scuderiaMesh) for(let i = 0; i < num_lines; i++){
            const scuderia = scuderiaMesh.clone();
            scuderia.position.set(scuderia.position.x, scuderia.position.y, scuderia.position.z + i * 15);
            scene.add(scuderia);
        }
    }, undefined, function(error) {
        console.log(error);
    });
}
function createPaglia(assetLoader, num_lines) {
    let pagliaMesh = null;
    assetLoader.load(paglia.href, function(gltf) {
        pagliaMesh = gltf.scene.children[0];
        scene.add(pagliaMesh);
        pagliaMesh.traverse(function(node) {
            if (node.isMesh) node.castShadow = true;
        });
        pagliaMesh.scale.set(3, 3, 3);
        pagliaMesh.rotation.set(0, Math.PI / 2, 0);
        if (pagliaMesh) {
            // create and add paglia meshes
            addPagliaMeshes(pagliaMesh, -120, 0.2, -35, 2, 51);
            addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, -19.7, 2, 51, {
                x: 2.7
            });
            addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, -4.7, 2, 51, {
                x: 2.7
            });
            addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, 10.5, 2, 51, {
                x: 2.7
            });
            addPagliaMeshes(pagliaMesh.clone(), -120, 0.2, 25.5, 2, 51, {
                x: 2.7
            });
        }
    }, undefined, function(error) {
        console.log(error);
    });
}
function addPagliaMeshes(pagliaMesh, startX, startY, startZ, numLayers, numColumns, options = {}) {
    const { x =3 , y =3 , z =3  } = options;
    pagliaMesh.scale.set(x, y, z);
    pagliaMesh.position.set(startX, startY, startZ);
    for(let i = 0; i < numLayers; i++)for(let j = 0; j < numColumns; j++){
        const paglia = pagliaMesh.clone();
        paglia.position.set(paglia.position.x + j * 5, paglia.position.y, paglia.position.z + i * 10);
        scene.add(paglia);
    }
}
//FOR CREATIVE MODE MANAGING
var highlightMesh = new _three.Mesh(new _three.PlaneGeometry(3, 3), new _three.MeshBasicMaterial({
    side: _three.DoubleSide,
    transparent: false
}));
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.material.color.setHex(0x0000FF);
scene.add(highlightMesh);
function mouseMoveAddOstacoli(e) {
    const mousePosition = new _three.Vector2();
    const raycaster = new _three.Raycaster();
    mousePosition.x = e.clientX / window.innerWidth * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        // console.log(intersect)
        const highlightPos = new _three.Vector3().copy(intersect.point).floor();
        highlightMesh.position.set(highlightPos.x, 0.1, highlightPos.z);
        const objectExist = obstacleArray.find(function(object) {
            return object.mesh.position.x + 3 >= highlightMesh.position.x && object.mesh.position.x - 3 < highlightMesh.position.x && object.mesh.position.z + 3 >= highlightMesh.position.z && object.mesh.position.z - 3 < highlightMesh.position.z;
        });
        const possibleToRelease = check_possible_release_ostacolo(highlightMesh.position.x, highlightMesh.position.z);
        if (!objectExist && possibleToRelease) highlightMesh.material.color.setHex(0xFFFFFF); //white
        else highlightMesh.material.color.setHex(0xFF0000); //red
    }
}
function insertOstacoli(assetLoader) {
    //AGGIUNGI OSTACOLI ALLA PISTA
    let releaseMode = document.querySelector("#release-obstacle").getAttribute("enabled");
    console.log("Release mode: ", releaseMode);
    if (releaseMode == "false") scene.remove(highlightMesh);
    else {
        scene.add(highlightMesh);
        window.addEventListener("mousemove", mouseMoveAddOstacoli);
        window.addEventListener("mousedown", function() {
            var cash_val = document.querySelector("#cash-value");
            const objectExist = obstacleArray.find(function(object) {
                return object.mesh.position.x + 3 >= highlightMesh.position.x && object.mesh.position.x - 3 < highlightMesh.position.x && object.mesh.position.z + 3 >= highlightMesh.position.z && object.mesh.position.z - 3 < highlightMesh.position.z;
            });
            if (!objectExist) {
                if (currentPrice >= 10) {
                    if (intersects.length > 0) {
                        const possibleToRelease = check_possible_release_ostacolo(highlightMesh.position.x, highlightMesh.position.z);
                        if (possibleToRelease) {
                            let ostacolo = new (0, _obstacleJs.Obstacle)(scene, world, highlightMesh.position.x, highlightMesh.position.y, highlightMesh.position.z, false);
                            if (options.settings.sound_enabled == true) popSound.play();
                            currentPrice -= 10;
                            cash_val.innerHTML = currentPrice;
                            //aggiungo ostacolo al mondo
                            obstacleArray.push(ostacolo);
                            console.log("Ostacoli inseriti-> ", obstacleArray.length);
                        }
                    }
                } else {
                    let budgetFinished = document.querySelector("#budget-finished");
                    budgetFinished.classList.remove("d-none");
                    budgetFinished.style.opacity = 1;
                    new TWEEN.Tween(budgetFinished.style.opacity).to(0, 1000).onComplete(function() {
                        document.querySelector("#budget-finished").classList.add("d-none");
                    }).start();
                }
            } else {
                //rimuovi ostacolo piazzato
                let ostacoliList_obj_index = obstacleArray.findIndex((element)=>element.mesh.uuid === objectExist.mesh.uuid);
                if (ostacoliList_obj_index != -1) {
                    world.removeBody(obstacleArray[ostacoliList_obj_index].physicsBody);
                    scene.remove(obstacleArray[ostacoliList_obj_index].mesh);
                    if (options.settings.sound_enabled == true) trashSound.play();
                    console.log("Obstacle array before remove: ", obstacleArray);
                    obstacleArray = obstacleArray.slice(0, ostacoliList_obj_index).concat(obstacleArray.slice(ostacoliList_obj_index + 1));
                    console.log("Obstacle array after remove: ", obstacleArray);
                    highlightMesh.material.color.setHex(0xFFFFFF);
                    currentPrice += 10;
                    document.querySelector("#budget-finished").classList.add("d-none");
                    cash_val.innerHTML = currentPrice;
                }
            }
        });
    }
//END AGGIUNGI OSTACOLI
}
function check_possible_release_ostacolo(x, z) {
    if (z != 30 && z != 15 && z != -15 && z != -30) return false;
    if (x < -100 || x > 100) return false;
    return true;
}
function getLinesRange() {
    return {
        line0: {
            z_start: 23,
            z_end: -37
        },
        line1: {
            z_start: -9,
            z_end: -22
        },
        line2: {
            z_start: 7,
            z_end: -8
        },
        line3: {
            z_start: 22,
            z_end: 8
        },
        line4: {
            z_start: 37,
            z_end: 23
        }
    };
}
function getObstaclesInLine(lineNumber) {
    const linesRange = getLinesRange();
    const line = `line${lineNumber}`;
    const zStart = linesRange[line].z_start;
    const zEnd = linesRange[line].z_end;
    return ostacoliBodyList.filter((obstacle)=>{
        return obstacle.position.z >= zEnd && obstacle.position.z <= zStart;
    });
}
//END CREATIVE MODE
//Spawn ostacoli
function spawnOstacoli(tl, spawnAmount) {
    if (!spawned) {
        spawned = true;
        console.log("Spawning ostacoli ....");
        tl.clear();
        const obstacleDistance = 20;
        var center = {
            x: 0,
            y: 0,
            z: 0
        };
        var radius = 300;
        var duration = options.gameConstants.spawnAnimationCameraDuration;
        tl.to(camera.position, {
            x: center.x + radius,
            y: 200,
            z: center.z,
            duration: duration / 4,
            ease: "circ.out",
            onUpdate: function() {
                camera.fov = 180;
                camera.lookAt(0, 0, 0);
            }
        }).to(camera.position, {
            x: center.x,
            y: 200,
            z: center.z - radius,
            duration: duration / 4,
            ease: "circ.out",
            onUpdate: function() {
                camera.fov = 180;
                camera.lookAt(0, 0, 0);
            }
        }).to(camera.position, {
            x: center.x - radius,
            y: 200,
            z: center.z,
            duration: duration / 4,
            ease: "circ.out",
            onUpdate: function() {
                camera.fov = 180;
                camera.lookAt(0, 0, 0);
            }
        }).to(camera.position, {
            x: center.x,
            y: 200,
            z: center.z + radius,
            duration: duration / 4,
            ease: "circ.out",
            onUpdate: function() {
                camera.fov = 180;
                camera.lookAt(0, 0, 0);
            },
            onComplete: function() {
                cameraSpawningFinished = true;
                console.log("Camera spawning finished");
            }
        });
        let previousObstacleX = [];
        for(let i = 0; i < spawnAmount; i++){
            //ensure that the obstacles are not spawned too close to each other
            let position = Math.floor(Math.random() * 201) + -100;
            while(isTooClose(position, previousObstacleX, obstacleDistance))position = Math.floor(Math.random() * 201) + -100;
            previousObstacleX.push(position);
            let ostacolo = new (0, _obstacleJs.Obstacle)(scene, world, position, 40, 0, true);
            obstacleArray.push(ostacolo);
        }
    }
}
function isTooClose(position, previousObstacleX, distance) {
    for(let i = 0; i < previousObstacleX.length; i++){
        if (Math.abs(position - previousObstacleX[i]) < distance) return true;
    }
    return false;
}
//PHYSICS FUNCTIONS
function linkMeshesAndBody(meshes, bodies) {
    //check meshes is of class Obstacle
    if (bodies != undefined) {
        if (meshes.length != bodies.length && bodies != undefined) {
            console.log("Error linking meshes and bodies");
            console.log("Meshes: " + meshes.length);
            console.log("Bodies: " + bodies.length);
            return;
        }
    } else {
        if (meshes.length > 0) for(let i = 0; i < meshes.length; i++){
            if (meshes[i] instanceof (0, _obstacleJs.Obstacle)) {
                meshes[i].mesh.position.copy(meshes[i].physicsBody.position);
                meshes[i].mesh.position.y -= (0, _obstacleJs.Obstacle).yBodyDisplacement;
                meshes[i].mesh.quaternion.copy(meshes[i].physicsBody.quaternion);
            } else if (bodies[i]) {
                meshes[i].position.copy(bodies[i].position);
                meshes[i].quaternion.copy(bodies[i].quaternion);
            }
        }
    }
}
//END PHYSICS FUNCTIONS
//------------------END FUNCTIONS-----------------
//---------------- ONLOAD EVENTS ----------------
window.onload = function() {
    createWorld(assetLoader);
    var cash_val = document.querySelector("#cash-value");
    cash_val.innerHTML = currentPrice;
    const swiper = new Swiper(".swiper-container", {
        direction: "horizontal",
        loop: true,
        pagination: {
            el: ".swiper-pagination"
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
};
//----------------- END ONLOAD EVENTS ------------
//----------------- EVENT LISTENERS --------------
document.querySelector("#start-game").addEventListener("click", function() {
    document.querySelector(".container-button-settings").classList.remove("d-none");
    if (currentPrice > 0) alert("You are starting the game but you didn't spend all of your budget! \nThis will make the others robot life easier!");
    if (options.settings.sound_enabled == true) eyeOfTheTigerSound.play();
    state = "spawning";
    camera.fov = 20;
    camera.updateProjectionMatrix();
    document.querySelector("#start-game").style.display = "none";
    document.querySelector(".initial-screen").style.display = "none";
    document.querySelector("#space-img").classList.remove("d-none");
    (0, _gsapDefault.default).to("#space-img", {
        opacity: 0,
        duration: options.gameConstants.buttonsInstructionsFadeDuration,
        onComplete: function() {
            document.querySelector("#space-img").style.display = "none";
        }
    });
    document.querySelector("#shift-img").classList.remove("d-none");
    (0, _gsapDefault.default).to("#shift-img", {
        opacity: 0,
        duration: options.gameConstants.buttonsInstructionsFadeDuration,
        onComplete: function() {
            document.querySelector("#space-img").style.display = "none";
        }
    });
});
//Release Mode Controller
document.querySelector("#release-obstacle").addEventListener("click", function() {
    // releaseMode = !releaseMode;
    releaseMode = true;
    if (releaseMode) {
        console.log("enter release mode hide initial screen");
        document.querySelector("body").classList.add("pencil-cursor");
        document.querySelector(".release-mode-container").classList.remove("d-none");
        document.querySelector("#release-obstacle").setAttribute("enabled", "true");
        document.querySelector(".initial-screen").classList.add("d-none");
    } else {
        document.querySelector(".initial-screen").classList.remove("d-none");
        document.querySelector("body").classList.remove("pencil-cursor");
        document.querySelector("#release-obstacle").setAttribute("enabled", "false");
    }
    document.querySelector(".current-cash-container").classList.toggle("d-none");
    insertOstacoli(assetLoader);
});
document.querySelector("#release-mode-exit").addEventListener("click", function() {
    console.log("exit release mode");
    document.querySelector("#budget-finished").classList.add("d-none");
    releaseMode = false;
    if (!releaseMode) {
        document.querySelector(".initial-screen").classList.remove("d-none");
        document.querySelector("body").classList.remove("pencil-cursor");
        document.querySelector(".release-mode-container").classList.add("d-none");
        document.querySelector("#release-obstacle").setAttribute("enabled", "false");
    }
    document.querySelector(".current-cash-container").classList.toggle("d-none");
});
//END release Mode
// START How it works
document.querySelector("#how-it-works").addEventListener("click", function() {
    document.querySelector(".initial-screen").classList.add("d-none");
    document.querySelector(".how-it-works-container").classList.remove("d-none");
});
document.querySelector("#how-it-works-exit").addEventListener("click", function() {
    document.querySelector(".initial-screen").classList.remove("d-none");
    document.querySelector(".how-it-works-container").classList.add("d-none");
});
// END How it works
document.querySelector("#play-again").addEventListener("click", function() {
    location.reload();
});
// -------For the settings menu
document.querySelector("#settings-button").addEventListener("click", function() {
    document.querySelector(".initial-screen").classList.add("d-none");
    document.querySelector(".settings-container").classList.remove("d-none");
});
document.querySelector("#settings-button").addEventListener("mouseenter", function() {
    document.querySelector("#settings-button").classList.add("fa-spin");
});
document.querySelector("#settings-button").addEventListener("mouseleave", function() {
    document.querySelector("#settings-button").classList.remove("fa-spin");
});
document.querySelectorAll('input[name="camera-view"]').forEach(function(input) {
    input.addEventListener("change", function() {
        options.gameConstants.camera_view = this.value;
        console.log("camera view changed to " + options.gameConstants.camera_view);
    });
});
document.querySelectorAll('input[name="debug"]').forEach(function(input) {
    input.addEventListener("change", function() {
        if (this.value == "true") options.settings.physic_debug = true;
        else options.settings.physic_debug = false;
        console.log("debug changed to " + options.settings.physic_debug);
    });
});
document.querySelectorAll('input[name="audio"]').forEach(function(input) {
    input.addEventListener("change", function() {
        //if this.value is true, then the debug is enabled
        if (this.value == "true") options.settings.sound_enabled = true;
        else options.settings.sound_enabled = false;
    });
});
// to .change-camera-view button change the camera view from options
document.querySelector("#change-camera-view").addEventListener("click", function() {
    if (options.gameConstants.camera_view == "third_person") options.gameConstants.camera_view = "whole_view";
    else options.gameConstants.camera_view = "third_person";
});
//the same to #change-sound
document.querySelector("#change-sound").addEventListener("click", function() {
    options.settings.sound_enabled = !options.settings.sound_enabled;
});
document.querySelector("#settings-exit").addEventListener("click", function() {
    document.querySelector(".initial-screen").classList.remove("d-none");
    document.querySelector(".settings-container").classList.add("d-none");
});
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    if (state == "running") {
        var keyCode = event.which;
        if (keyCode == 16) {
            if (!PressedKeys.shift && state == "running") robotArray[myRobotIndex].jumpAnimation();
            PressedKeys.shift = true;
        } else if (keyCode == 32) {
            //get the obstacle from obstacleArray with the is_spawned flag set to true
            //and call the punch animation on that obstacle
            let spawnedObstacle = obstacleArray.filter((obstacle)=>obstacle.is_spawned == true);
            if (!PressedKeys.space && state == "running") robotArray[myRobotIndex].punchAnimation(null, spawnedObstacle, scene, world);
            PressedKeys.space = true;
        }
    }
}
document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    if (state == "running") {
        var keyCode = event.which;
        if (keyCode == 16) PressedKeys.shift = false;
        else if (keyCode == 32) PressedKeys.space = false;
    }
}
 //----------------- END EVENT LISTENERS ----------

},{"three":"ktPTu","three/examples/jsm/controls/OrbitControls.js":"7mqRv","three/examples/jsm/loaders/GLTFLoader":"dVRsF","dat.gui":"k3xQk","gsap":"fPSuC","cannon-es":"HCu3b","cannon-es-debugger":"a5KNJ","./utility.js":"l5hDi","./robot.js":"aL92C","./obstacle.js":"a6KMl","67f826a1e22a7a16":"gpcha","504c5afbb73ffd9c":"6yNJQ","a50a6ac33660f40a":"7wYsL","../assets/sky_bg.png":"hXuHM","../assets/land_bg.png":"4Qagd","../assets/groundtexture.png":"7EQFP","../assets/shift.png":"fUSW5","../assets/space.png":"l0utk","314f30ebb82233cc":"esCQj","bbea45973c095f65":"fdvLY","8a4872e16b784997":"azU4C","26020aacc50219ee":"5m7bL","d4a59e0ddeb70e0c":"8iwLW","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7mqRv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "OrbitControls", ()=>OrbitControls);
parcelHelpers.export(exports, "MapControls", ()=>MapControls);
var _three = require("three");
// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move
const _changeEvent = {
    type: "change"
};
const _startEvent = {
    type: "start"
};
const _endEvent = {
    type: "end"
};
class OrbitControls extends (0, _three.EventDispatcher) {
    constructor(object, domElement){
        super();
        this.object = object;
        this.domElement = domElement;
        this.domElement.style.touchAction = "none"; // disable touch scroll
        // Set to false to disable this control
        this.enabled = true;
        // "target" sets the location of focus, where the object orbits around
        this.target = new (0, _three.Vector3)();
        // How far you can dolly in and out ( PerspectiveCamera only )
        this.minDistance = 0;
        this.maxDistance = Infinity;
        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0;
        this.maxZoom = Infinity;
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians
        // How far you can orbit horizontally, upper and lower limits.
        // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians
        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.05;
        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 1.0;
        // Set to false to disable panning
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
        this.keyPanSpeed = 7.0; // pixels moved per arrow key push
        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60
        // The four arrow keys
        this.keys = {
            LEFT: "ArrowLeft",
            UP: "ArrowUp",
            RIGHT: "ArrowRight",
            BOTTOM: "ArrowDown"
        };
        // Mouse buttons
        this.mouseButtons = {
            LEFT: (0, _three.MOUSE).ROTATE,
            MIDDLE: (0, _three.MOUSE).DOLLY,
            RIGHT: (0, _three.MOUSE).PAN
        };
        // Touch fingers
        this.touches = {
            ONE: (0, _three.TOUCH).ROTATE,
            TWO: (0, _three.TOUCH).DOLLY_PAN
        };
        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;
        // the target DOM element for key events
        this._domElementKeyEvents = null;
        //
        // public methods
        //
        this.getPolarAngle = function() {
            return spherical.phi;
        };
        this.getAzimuthalAngle = function() {
            return spherical.theta;
        };
        this.getDistance = function() {
            return this.object.position.distanceTo(this.target);
        };
        this.listenToKeyEvents = function(domElement) {
            domElement.addEventListener("keydown", onKeyDown);
            this._domElementKeyEvents = domElement;
        };
        this.stopListenToKeyEvents = function() {
            this._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
            this._domElementKeyEvents = null;
        };
        this.saveState = function() {
            scope.target0.copy(scope.target);
            scope.position0.copy(scope.object.position);
            scope.zoom0 = scope.object.zoom;
        };
        this.reset = function() {
            scope.target.copy(scope.target0);
            scope.object.position.copy(scope.position0);
            scope.object.zoom = scope.zoom0;
            scope.object.updateProjectionMatrix();
            scope.dispatchEvent(_changeEvent);
            scope.update();
            state = STATE.NONE;
        };
        // this method is exposed, but perhaps it would be better if we can make it private...
        this.update = function() {
            const offset = new (0, _three.Vector3)();
            // so camera.up is the orbit axis
            const quat = new (0, _three.Quaternion)().setFromUnitVectors(object.up, new (0, _three.Vector3)(0, 1, 0));
            const quatInverse = quat.clone().invert();
            const lastPosition = new (0, _three.Vector3)();
            const lastQuaternion = new (0, _three.Quaternion)();
            const twoPI = 2 * Math.PI;
            return function update() {
                const position = scope.object.position;
                offset.copy(position).sub(scope.target);
                // rotate offset to "y-axis-is-up" space
                offset.applyQuaternion(quat);
                // angle from z-axis around y-axis
                spherical.setFromVector3(offset);
                if (scope.autoRotate && state === STATE.NONE) rotateLeft(getAutoRotationAngle());
                if (scope.enableDamping) {
                    spherical.theta += sphericalDelta.theta * scope.dampingFactor;
                    spherical.phi += sphericalDelta.phi * scope.dampingFactor;
                } else {
                    spherical.theta += sphericalDelta.theta;
                    spherical.phi += sphericalDelta.phi;
                }
                // restrict theta to be between desired limits
                let min = scope.minAzimuthAngle;
                let max = scope.maxAzimuthAngle;
                if (isFinite(min) && isFinite(max)) {
                    if (min < -Math.PI) min += twoPI;
                    else if (min > Math.PI) min -= twoPI;
                    if (max < -Math.PI) max += twoPI;
                    else if (max > Math.PI) max -= twoPI;
                    if (min <= max) spherical.theta = Math.max(min, Math.min(max, spherical.theta));
                    else spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
                }
                // restrict phi to be between desired limits
                spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
                spherical.makeSafe();
                spherical.radius *= scale;
                // restrict radius to be between desired limits
                spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
                // move target to panned location
                if (scope.enableDamping === true) scope.target.addScaledVector(panOffset, scope.dampingFactor);
                else scope.target.add(panOffset);
                offset.setFromSpherical(spherical);
                // rotate offset back to "camera-up-vector-is-up" space
                offset.applyQuaternion(quatInverse);
                position.copy(scope.target).add(offset);
                scope.object.lookAt(scope.target);
                if (scope.enableDamping === true) {
                    sphericalDelta.theta *= 1 - scope.dampingFactor;
                    sphericalDelta.phi *= 1 - scope.dampingFactor;
                    panOffset.multiplyScalar(1 - scope.dampingFactor);
                } else {
                    sphericalDelta.set(0, 0, 0);
                    panOffset.set(0, 0, 0);
                }
                scale = 1;
                // update condition is:
                // min(camera displacement, camera rotation in radians)^2 > EPS
                // using small-angle approximation cos(x/2) = 1 - x^2 / 8
                if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
                    scope.dispatchEvent(_changeEvent);
                    lastPosition.copy(scope.object.position);
                    lastQuaternion.copy(scope.object.quaternion);
                    zoomChanged = false;
                    return true;
                }
                return false;
            };
        }();
        this.dispose = function() {
            scope.domElement.removeEventListener("contextmenu", onContextMenu);
            scope.domElement.removeEventListener("pointerdown", onPointerDown);
            scope.domElement.removeEventListener("pointercancel", onPointerCancel);
            scope.domElement.removeEventListener("wheel", onMouseWheel);
            scope.domElement.removeEventListener("pointermove", onPointerMove);
            scope.domElement.removeEventListener("pointerup", onPointerUp);
            if (scope._domElementKeyEvents !== null) {
                scope._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
                scope._domElementKeyEvents = null;
            }
        //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
        };
        //
        // internals
        //
        const scope = this;
        const STATE = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_PAN: 4,
            TOUCH_DOLLY_PAN: 5,
            TOUCH_DOLLY_ROTATE: 6
        };
        let state = STATE.NONE;
        const EPS = 0.000001;
        // current position in spherical coordinates
        const spherical = new (0, _three.Spherical)();
        const sphericalDelta = new (0, _three.Spherical)();
        let scale = 1;
        const panOffset = new (0, _three.Vector3)();
        let zoomChanged = false;
        const rotateStart = new (0, _three.Vector2)();
        const rotateEnd = new (0, _three.Vector2)();
        const rotateDelta = new (0, _three.Vector2)();
        const panStart = new (0, _three.Vector2)();
        const panEnd = new (0, _three.Vector2)();
        const panDelta = new (0, _three.Vector2)();
        const dollyStart = new (0, _three.Vector2)();
        const dollyEnd = new (0, _three.Vector2)();
        const dollyDelta = new (0, _three.Vector2)();
        const pointers = [];
        const pointerPositions = {};
        function getAutoRotationAngle() {
            return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
        }
        function getZoomScale() {
            return Math.pow(0.95, scope.zoomSpeed);
        }
        function rotateLeft(angle) {
            sphericalDelta.theta -= angle;
        }
        function rotateUp(angle) {
            sphericalDelta.phi -= angle;
        }
        const panLeft = function() {
            const v = new (0, _three.Vector3)();
            return function panLeft(distance, objectMatrix) {
                v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
                v.multiplyScalar(-distance);
                panOffset.add(v);
            };
        }();
        const panUp = function() {
            const v = new (0, _three.Vector3)();
            return function panUp(distance, objectMatrix) {
                if (scope.screenSpacePanning === true) v.setFromMatrixColumn(objectMatrix, 1);
                else {
                    v.setFromMatrixColumn(objectMatrix, 0);
                    v.crossVectors(scope.object.up, v);
                }
                v.multiplyScalar(distance);
                panOffset.add(v);
            };
        }();
        // deltaX and deltaY are in pixels; right and down are positive
        const pan = function() {
            const offset = new (0, _three.Vector3)();
            return function pan(deltaX, deltaY) {
                const element = scope.domElement;
                if (scope.object.isPerspectiveCamera) {
                    // perspective
                    const position = scope.object.position;
                    offset.copy(position).sub(scope.target);
                    let targetDistance = offset.length();
                    // half of the fov is center to top of screen
                    targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);
                    // we use only clientHeight here so aspect ratio does not distort speed
                    panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                    panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
                } else if (scope.object.isOrthographicCamera) {
                    // orthographic
                    panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                    panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
                } else {
                    // camera neither orthographic nor perspective
                    console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
                    scope.enablePan = false;
                }
            };
        }();
        function dollyOut(dollyScale) {
            if (scope.object.isPerspectiveCamera) scale /= dollyScale;
            else if (scope.object.isOrthographicCamera) {
                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;
            } else {
                console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                scope.enableZoom = false;
            }
        }
        function dollyIn(dollyScale) {
            if (scope.object.isPerspectiveCamera) scale *= dollyScale;
            else if (scope.object.isOrthographicCamera) {
                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;
            } else {
                console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                scope.enableZoom = false;
            }
        }
        //
        // event callbacks - update the object state
        //
        function handleMouseDownRotate(event) {
            rotateStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownDolly(event) {
            dollyStart.set(event.clientX, event.clientY);
        }
        function handleMouseDownPan(event) {
            panStart.set(event.clientX, event.clientY);
        }
        function handleMouseMoveRotate(event) {
            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            const element = scope.domElement;
            rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
            rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
            rotateStart.copy(rotateEnd);
            scope.update();
        }
        function handleMouseMoveDolly(event) {
            dollyEnd.set(event.clientX, event.clientY);
            dollyDelta.subVectors(dollyEnd, dollyStart);
            if (dollyDelta.y > 0) dollyOut(getZoomScale());
            else if (dollyDelta.y < 0) dollyIn(getZoomScale());
            dollyStart.copy(dollyEnd);
            scope.update();
        }
        function handleMouseMovePan(event) {
            panEnd.set(event.clientX, event.clientY);
            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
            pan(panDelta.x, panDelta.y);
            panStart.copy(panEnd);
            scope.update();
        }
        function handleMouseWheel(event) {
            if (event.deltaY < 0) dollyIn(getZoomScale());
            else if (event.deltaY > 0) dollyOut(getZoomScale());
            scope.update();
        }
        function handleKeyDown(event) {
            let needsUpdate = false;
            switch(event.code){
                case scope.keys.UP:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateUp(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(0, scope.keyPanSpeed);
                    needsUpdate = true;
                    break;
                case scope.keys.BOTTOM:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateUp(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(0, -scope.keyPanSpeed);
                    needsUpdate = true;
                    break;
                case scope.keys.LEFT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateLeft(2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(scope.keyPanSpeed, 0);
                    needsUpdate = true;
                    break;
                case scope.keys.RIGHT:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) rotateLeft(-2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight);
                    else pan(-scope.keyPanSpeed, 0);
                    needsUpdate = true;
                    break;
            }
            if (needsUpdate) {
                // prevent the browser from scrolling on cursor keys
                event.preventDefault();
                scope.update();
            }
        }
        function handleTouchStartRotate() {
            if (pointers.length === 1) rotateStart.set(pointers[0].pageX, pointers[0].pageY);
            else {
                const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
                const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
                rotateStart.set(x, y);
            }
        }
        function handleTouchStartPan() {
            if (pointers.length === 1) panStart.set(pointers[0].pageX, pointers[0].pageY);
            else {
                const x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
                const y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
                panStart.set(x, y);
            }
        }
        function handleTouchStartDolly() {
            const dx = pointers[0].pageX - pointers[1].pageX;
            const dy = pointers[0].pageY - pointers[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            dollyStart.set(0, distance);
        }
        function handleTouchStartDollyPan() {
            if (scope.enableZoom) handleTouchStartDolly();
            if (scope.enablePan) handleTouchStartPan();
        }
        function handleTouchStartDollyRotate() {
            if (scope.enableZoom) handleTouchStartDolly();
            if (scope.enableRotate) handleTouchStartRotate();
        }
        function handleTouchMoveRotate(event) {
            if (pointers.length == 1) rotateEnd.set(event.pageX, event.pageY);
            else {
                const position = getSecondPointerPosition(event);
                const x = 0.5 * (event.pageX + position.x);
                const y = 0.5 * (event.pageY + position.y);
                rotateEnd.set(x, y);
            }
            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            const element = scope.domElement;
            rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
            rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
            rotateStart.copy(rotateEnd);
        }
        function handleTouchMovePan(event) {
            if (pointers.length === 1) panEnd.set(event.pageX, event.pageY);
            else {
                const position = getSecondPointerPosition(event);
                const x = 0.5 * (event.pageX + position.x);
                const y = 0.5 * (event.pageY + position.y);
                panEnd.set(x, y);
            }
            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
            pan(panDelta.x, panDelta.y);
            panStart.copy(panEnd);
        }
        function handleTouchMoveDolly(event) {
            const position = getSecondPointerPosition(event);
            const dx = event.pageX - position.x;
            const dy = event.pageY - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            dollyEnd.set(0, distance);
            dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
            dollyOut(dollyDelta.y);
            dollyStart.copy(dollyEnd);
        }
        function handleTouchMoveDollyPan(event) {
            if (scope.enableZoom) handleTouchMoveDolly(event);
            if (scope.enablePan) handleTouchMovePan(event);
        }
        function handleTouchMoveDollyRotate(event) {
            if (scope.enableZoom) handleTouchMoveDolly(event);
            if (scope.enableRotate) handleTouchMoveRotate(event);
        }
        //
        // event handlers - FSM: listen for events and reset state
        //
        function onPointerDown(event) {
            if (scope.enabled === false) return;
            if (pointers.length === 0) {
                scope.domElement.setPointerCapture(event.pointerId);
                scope.domElement.addEventListener("pointermove", onPointerMove);
                scope.domElement.addEventListener("pointerup", onPointerUp);
            }
            //
            addPointer(event);
            if (event.pointerType === "touch") onTouchStart(event);
            else onMouseDown(event);
        }
        function onPointerMove(event) {
            if (scope.enabled === false) return;
            if (event.pointerType === "touch") onTouchMove(event);
            else onMouseMove(event);
        }
        function onPointerUp(event) {
            removePointer(event);
            if (pointers.length === 0) {
                scope.domElement.releasePointerCapture(event.pointerId);
                scope.domElement.removeEventListener("pointermove", onPointerMove);
                scope.domElement.removeEventListener("pointerup", onPointerUp);
            }
            scope.dispatchEvent(_endEvent);
            state = STATE.NONE;
        }
        function onPointerCancel(event) {
            removePointer(event);
        }
        function onMouseDown(event) {
            let mouseAction;
            switch(event.button){
                case 0:
                    mouseAction = scope.mouseButtons.LEFT;
                    break;
                case 1:
                    mouseAction = scope.mouseButtons.MIDDLE;
                    break;
                case 2:
                    mouseAction = scope.mouseButtons.RIGHT;
                    break;
                default:
                    mouseAction = -1;
            }
            switch(mouseAction){
                case (0, _three.MOUSE).DOLLY:
                    if (scope.enableZoom === false) return;
                    handleMouseDownDolly(event);
                    state = STATE.DOLLY;
                    break;
                case (0, _three.MOUSE).ROTATE:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        if (scope.enablePan === false) return;
                        handleMouseDownPan(event);
                        state = STATE.PAN;
                    } else {
                        if (scope.enableRotate === false) return;
                        handleMouseDownRotate(event);
                        state = STATE.ROTATE;
                    }
                    break;
                case (0, _three.MOUSE).PAN:
                    if (event.ctrlKey || event.metaKey || event.shiftKey) {
                        if (scope.enableRotate === false) return;
                        handleMouseDownRotate(event);
                        state = STATE.ROTATE;
                    } else {
                        if (scope.enablePan === false) return;
                        handleMouseDownPan(event);
                        state = STATE.PAN;
                    }
                    break;
                default:
                    state = STATE.NONE;
            }
            if (state !== STATE.NONE) scope.dispatchEvent(_startEvent);
        }
        function onMouseMove(event) {
            switch(state){
                case STATE.ROTATE:
                    if (scope.enableRotate === false) return;
                    handleMouseMoveRotate(event);
                    break;
                case STATE.DOLLY:
                    if (scope.enableZoom === false) return;
                    handleMouseMoveDolly(event);
                    break;
                case STATE.PAN:
                    if (scope.enablePan === false) return;
                    handleMouseMovePan(event);
                    break;
            }
        }
        function onMouseWheel(event) {
            if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE) return;
            event.preventDefault();
            scope.dispatchEvent(_startEvent);
            handleMouseWheel(event);
            scope.dispatchEvent(_endEvent);
        }
        function onKeyDown(event) {
            if (scope.enabled === false || scope.enablePan === false) return;
            handleKeyDown(event);
        }
        function onTouchStart(event) {
            trackPointer(event);
            switch(pointers.length){
                case 1:
                    switch(scope.touches.ONE){
                        case (0, _three.TOUCH).ROTATE:
                            if (scope.enableRotate === false) return;
                            handleTouchStartRotate();
                            state = STATE.TOUCH_ROTATE;
                            break;
                        case (0, _three.TOUCH).PAN:
                            if (scope.enablePan === false) return;
                            handleTouchStartPan();
                            state = STATE.TOUCH_PAN;
                            break;
                        default:
                            state = STATE.NONE;
                    }
                    break;
                case 2:
                    switch(scope.touches.TWO){
                        case (0, _three.TOUCH).DOLLY_PAN:
                            if (scope.enableZoom === false && scope.enablePan === false) return;
                            handleTouchStartDollyPan();
                            state = STATE.TOUCH_DOLLY_PAN;
                            break;
                        case (0, _three.TOUCH).DOLLY_ROTATE:
                            if (scope.enableZoom === false && scope.enableRotate === false) return;
                            handleTouchStartDollyRotate();
                            state = STATE.TOUCH_DOLLY_ROTATE;
                            break;
                        default:
                            state = STATE.NONE;
                    }
                    break;
                default:
                    state = STATE.NONE;
            }
            if (state !== STATE.NONE) scope.dispatchEvent(_startEvent);
        }
        function onTouchMove(event) {
            trackPointer(event);
            switch(state){
                case STATE.TOUCH_ROTATE:
                    if (scope.enableRotate === false) return;
                    handleTouchMoveRotate(event);
                    scope.update();
                    break;
                case STATE.TOUCH_PAN:
                    if (scope.enablePan === false) return;
                    handleTouchMovePan(event);
                    scope.update();
                    break;
                case STATE.TOUCH_DOLLY_PAN:
                    if (scope.enableZoom === false && scope.enablePan === false) return;
                    handleTouchMoveDollyPan(event);
                    scope.update();
                    break;
                case STATE.TOUCH_DOLLY_ROTATE:
                    if (scope.enableZoom === false && scope.enableRotate === false) return;
                    handleTouchMoveDollyRotate(event);
                    scope.update();
                    break;
                default:
                    state = STATE.NONE;
            }
        }
        function onContextMenu(event) {
            if (scope.enabled === false) return;
            event.preventDefault();
        }
        function addPointer(event) {
            pointers.push(event);
        }
        function removePointer(event) {
            delete pointerPositions[event.pointerId];
            for(let i = 0; i < pointers.length; i++)if (pointers[i].pointerId == event.pointerId) {
                pointers.splice(i, 1);
                return;
            }
        }
        function trackPointer(event) {
            let position = pointerPositions[event.pointerId];
            if (position === undefined) {
                position = new (0, _three.Vector2)();
                pointerPositions[event.pointerId] = position;
            }
            position.set(event.pageX, event.pageY);
        }
        function getSecondPointerPosition(event) {
            const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
            return pointerPositions[pointer.pointerId];
        }
        //
        scope.domElement.addEventListener("contextmenu", onContextMenu);
        scope.domElement.addEventListener("pointerdown", onPointerDown);
        scope.domElement.addEventListener("pointercancel", onPointerCancel);
        scope.domElement.addEventListener("wheel", onMouseWheel, {
            passive: false
        });
        // force an update at start
        this.update();
    }
}
// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move
class MapControls extends OrbitControls {
    constructor(object, domElement){
        super(object, domElement);
        this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
        this.mouseButtons.LEFT = (0, _three.MOUSE).PAN;
        this.mouseButtons.RIGHT = (0, _three.MOUSE).ROTATE;
        this.touches.ONE = (0, _three.TOUCH).PAN;
        this.touches.TWO = (0, _three.TOUCH).DOLLY_ROTATE;
    }
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"a5KNJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>CannonDebugger);
var _cannonEs = require("cannon-es");
var _three = require("three");
function CannonDebugger(scene, world, _temp) {
    let { color =0x00ff00 , scale =1 , onInit , onUpdate  } = _temp === void 0 ? {} : _temp;
    const _meshes = [];
    const _material = new (0, _three.MeshBasicMaterial)({
        color: color != null ? color : 0x00ff00,
        wireframe: true
    });
    const _tempVec0 = new (0, _cannonEs.Vec3)();
    const _tempVec1 = new (0, _cannonEs.Vec3)();
    const _tempVec2 = new (0, _cannonEs.Vec3)();
    const _tempQuat0 = new (0, _cannonEs.Quaternion)();
    const _sphereGeometry = new (0, _three.SphereGeometry)(1);
    const _boxGeometry = new (0, _three.BoxGeometry)(1, 1, 1);
    const _planeGeometry = new (0, _three.PlaneGeometry)(10, 10, 10, 10); // Move the planeGeometry forward a little bit to prevent z-fighting
    _planeGeometry.translate(0, 0, 0.0001);
    function createConvexPolyhedronGeometry(shape) {
        const geometry = new (0, _three.BufferGeometry)(); // Add vertices
        const positions = [];
        for(let i = 0; i < shape.vertices.length; i++){
            const vertex = shape.vertices[i];
            positions.push(vertex.x, vertex.y, vertex.z);
        }
        geometry.setAttribute("position", new (0, _three.Float32BufferAttribute)(positions, 3)); // Add faces
        const indices = [];
        for(let i = 0; i < shape.faces.length; i++){
            const face = shape.faces[i];
            const a = face[0];
            for(let j = 1; j < face.length - 1; j++){
                const b = face[j];
                const c = face[j + 1];
                indices.push(a, b, c);
            }
        }
        geometry.setIndex(indices);
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        return geometry;
    }
    function createTrimeshGeometry(shape) {
        const geometry = new (0, _three.BufferGeometry)();
        const positions = [];
        const v0 = _tempVec0;
        const v1 = _tempVec1;
        const v2 = _tempVec2;
        for(let i = 0; i < shape.indices.length / 3; i++){
            shape.getTriangleVertices(i, v0, v1, v2);
            positions.push(v0.x, v0.y, v0.z);
            positions.push(v1.x, v1.y, v1.z);
            positions.push(v2.x, v2.y, v2.z);
        }
        geometry.setAttribute("position", new (0, _three.Float32BufferAttribute)(positions, 3));
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        return geometry;
    }
    function createHeightfieldGeometry(shape) {
        const geometry = new (0, _three.BufferGeometry)();
        const s = shape.elementSize || 1; // assumes square heightfield, else i*x, j*y
        const positions = shape.data.flatMap((row, i)=>row.flatMap((z, j)=>[
                    i * s,
                    j * s,
                    z
                ]));
        const indices = [];
        for(let xi = 0; xi < shape.data.length - 1; xi++)for(let yi = 0; yi < shape.data[xi].length - 1; yi++){
            const stride = shape.data[xi].length;
            const index = xi * stride + yi;
            indices.push(index + 1, index + stride, index + stride + 1);
            indices.push(index + stride, index + 1, index);
        }
        geometry.setIndex(indices);
        geometry.setAttribute("position", new (0, _three.Float32BufferAttribute)(positions, 3));
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();
        return geometry;
    }
    function createMesh(shape) {
        let mesh = new (0, _three.Mesh)();
        const { SPHERE , BOX , PLANE , CYLINDER , CONVEXPOLYHEDRON , TRIMESH , HEIGHTFIELD  } = (0, _cannonEs.Shape).types;
        switch(shape.type){
            case SPHERE:
                mesh = new (0, _three.Mesh)(_sphereGeometry, _material);
                break;
            case BOX:
                mesh = new (0, _three.Mesh)(_boxGeometry, _material);
                break;
            case PLANE:
                mesh = new (0, _three.Mesh)(_planeGeometry, _material);
                break;
            case CYLINDER:
                {
                    const geometry = new (0, _three.CylinderGeometry)(shape.radiusTop, shape.radiusBottom, shape.height, shape.numSegments);
                    mesh = new (0, _three.Mesh)(geometry, _material);
                    shape.geometryId = geometry.id;
                    break;
                }
            case CONVEXPOLYHEDRON:
                {
                    const geometry = createConvexPolyhedronGeometry(shape);
                    mesh = new (0, _three.Mesh)(geometry, _material);
                    shape.geometryId = geometry.id;
                    break;
                }
            case TRIMESH:
                {
                    const geometry = createTrimeshGeometry(shape);
                    mesh = new (0, _three.Mesh)(geometry, _material);
                    shape.geometryId = geometry.id;
                    break;
                }
            case HEIGHTFIELD:
                {
                    const geometry = createHeightfieldGeometry(shape);
                    mesh = new (0, _three.Mesh)(geometry, _material);
                    shape.geometryId = geometry.id;
                    break;
                }
        }
        scene.add(mesh);
        return mesh;
    }
    function scaleMesh(mesh, shape) {
        const { SPHERE , BOX , PLANE , CYLINDER , CONVEXPOLYHEDRON , TRIMESH , HEIGHTFIELD  } = (0, _cannonEs.Shape).types;
        switch(shape.type){
            case SPHERE:
                {
                    const { radius  } = shape;
                    mesh.scale.set(radius * scale, radius * scale, radius * scale);
                    break;
                }
            case BOX:
                mesh.scale.copy(shape.halfExtents);
                mesh.scale.multiplyScalar(2 * scale);
                break;
            case PLANE:
                break;
            case CYLINDER:
                mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
                break;
            case CONVEXPOLYHEDRON:
                mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
                break;
            case TRIMESH:
                mesh.scale.copy(shape.scale).multiplyScalar(scale);
                break;
            case HEIGHTFIELD:
                mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
                break;
        }
    }
    function typeMatch(mesh, shape) {
        if (!mesh) return false;
        const { geometry  } = mesh;
        return geometry instanceof (0, _three.SphereGeometry) && shape.type === (0, _cannonEs.Shape).types.SPHERE || geometry instanceof (0, _three.BoxGeometry) && shape.type === (0, _cannonEs.Shape).types.BOX || geometry instanceof (0, _three.PlaneGeometry) && shape.type === (0, _cannonEs.Shape).types.PLANE || geometry.id === shape.geometryId && shape.type === (0, _cannonEs.Shape).types.CYLINDER || geometry.id === shape.geometryId && shape.type === (0, _cannonEs.Shape).types.CONVEXPOLYHEDRON || geometry.id === shape.geometryId && shape.type === (0, _cannonEs.Shape).types.TRIMESH || geometry.id === shape.geometryId && shape.type === (0, _cannonEs.Shape).types.HEIGHTFIELD;
    }
    function updateMesh(index, shape) {
        let mesh = _meshes[index];
        let didCreateNewMesh = false;
        if (!typeMatch(mesh, shape)) {
            if (mesh) scene.remove(mesh);
            _meshes[index] = mesh = createMesh(shape);
            didCreateNewMesh = true;
        }
        scaleMesh(mesh, shape);
        return didCreateNewMesh;
    }
    function update() {
        const meshes = _meshes;
        const shapeWorldPosition = _tempVec0;
        const shapeWorldQuaternion = _tempQuat0;
        let meshIndex = 0;
        for (const body of world.bodies)for(let i = 0; i !== body.shapes.length; i++){
            const shape = body.shapes[i];
            const didCreateNewMesh = updateMesh(meshIndex, shape);
            const mesh = meshes[meshIndex];
            if (mesh) {
                // Get world position
                body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
                body.position.vadd(shapeWorldPosition, shapeWorldPosition); // Get world quaternion
                body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion); // Copy to meshes
                mesh.position.copy(shapeWorldPosition);
                mesh.quaternion.copy(shapeWorldQuaternion);
                if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape);
                if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape);
            }
            meshIndex++;
        }
        for(let i = meshIndex; i < meshes.length; i++){
            const mesh = meshes[i];
            if (mesh) scene.remove(mesh);
        }
        meshes.length = meshIndex;
    }
    return {
        update
    };
}

},{"cannon-es":"HCu3b","three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gpcha":[function(require,module,exports) {
module.exports = require("a274b913d706c476").getBundleURL("i2u1X") + "Houses_SecondAge_1_Level1.8b615484.gltf" + "?" + Date.now();

},{"a274b913d706c476":"lgJ39"}],"6yNJQ":[function(require,module,exports) {
module.exports = require("712cd13afe0febdf").getBundleURL("i2u1X") + "Wall_FirstAge.1e241b09.gltf" + "?" + Date.now();

},{"712cd13afe0febdf":"lgJ39"}],"7wYsL":[function(require,module,exports) {
module.exports = require("b62b90863023cfce").getBundleURL("i2u1X") + "Farm_FirstAge_Level3_Wheat.70b473cd.gltf" + "?" + Date.now();

},{"b62b90863023cfce":"lgJ39"}],"hXuHM":[function(require,module,exports) {
module.exports = require("41f6f6acbcc0c2f1").getBundleURL("i2u1X") + "sky_bg.f824c11c.png" + "?" + Date.now();

},{"41f6f6acbcc0c2f1":"lgJ39"}],"4Qagd":[function(require,module,exports) {
module.exports = require("26c9186dabd211da").getBundleURL("i2u1X") + "land_bg.facec942.png" + "?" + Date.now();

},{"26c9186dabd211da":"lgJ39"}],"7EQFP":[function(require,module,exports) {
module.exports = require("51a2a174df988c7e").getBundleURL("i2u1X") + "groundtexture.bb0250ef.png" + "?" + Date.now();

},{"51a2a174df988c7e":"lgJ39"}],"fUSW5":[function(require,module,exports) {
module.exports = require("f8e59df321f00d02").getBundleURL("i2u1X") + "shift.4d1a1e41.png" + "?" + Date.now();

},{"f8e59df321f00d02":"lgJ39"}],"l0utk":[function(require,module,exports) {
module.exports = require("e744b1d6a5fc835f").getBundleURL("i2u1X") + "space.991b2c8d.png" + "?" + Date.now();

},{"e744b1d6a5fc835f":"lgJ39"}],"esCQj":[function(require,module,exports) {
module.exports = require("e124ebdc492aebc4").getBundleURL("i2u1X") + "countdown.c7b966a9.mp3" + "?" + Date.now();

},{"e124ebdc492aebc4":"lgJ39"}],"fdvLY":[function(require,module,exports) {
module.exports = require("22c12c77842e365d").getBundleURL("i2u1X") + "start.cf0dfc30.mp3" + "?" + Date.now();

},{"22c12c77842e365d":"lgJ39"}],"azU4C":[function(require,module,exports) {
module.exports = require("98b07ec2a20daf34").getBundleURL("i2u1X") + "pop.10893ad6.mp3" + "?" + Date.now();

},{"98b07ec2a20daf34":"lgJ39"}],"5m7bL":[function(require,module,exports) {
module.exports = require("ddf1bb2ec7c9559d").getBundleURL("i2u1X") + "trash.ed6e187a.mp3" + "?" + Date.now();

},{"ddf1bb2ec7c9559d":"lgJ39"}],"8iwLW":[function(require,module,exports) {
module.exports = require("ac485be37c80e9b4").getBundleURL("i2u1X") + "eyeofthetiger.c44e7f58.mp3" + "?" + Date.now();

},{"ac485be37c80e9b4":"lgJ39"}]},["0Vcoj","eDkEx"], "eDkEx", "parcelRequire94c2")

//# sourceMappingURL=index.d05d8996.js.map
