(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Phaser", [], factory);
	else if(typeof exports === 'object')
		exports["Phaser"] = factory();
	else
		root["Phaser"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 50792:
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 11517:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var QuickSet = __webpack_require__(38829);

/**
 * Takes an array of Game Objects and aligns them next to each other.
 *
 * The alignment position is controlled by the `position` parameter, which should be one
 * of the Phaser.Display.Align constants, such as `Phaser.Display.Align.TOP_LEFT`,
 * `Phaser.Display.Align.TOP_CENTER`, etc.
 *
 * The first item isn't moved. The second item is aligned next to the first,
 * then the third next to the second, and so on.
 *
 * @function Phaser.Actions.AlignTo
 * @since 3.22.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} position - The position to align the items with. This is an align constant, such as `Phaser.Display.Align.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var AlignTo = function (items, position, offsetX, offsetY)
{
    var target = items[0];

    for (var i = 1; i < items.length; i++)
    {
        var item = items[i];

        QuickSet(item, target, position, offsetX, offsetY);

        target = item;
    }

    return items;
};

module.exports = AlignTo;


/***/ }),

/***/ 80318:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `angle` property,
 * and then adds the given value to each of their `angle` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `Angle(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.Angle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `angle` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var Angle = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'angle', value, step, index, direction);
};

module.exports = Angle;


/***/ }),

/***/ 60757:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of objects and passes each of them to the given callback.
 *
 * @function Phaser.Actions.Call
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {Phaser.Types.Actions.CallCallback} callback - The callback to be invoked. It will be passed just one argument: the item from the array.
 * @param {*} context - The scope in which the callback will be invoked.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that was passed to this Action.
 */
var Call = function (items, callback, context)
{
    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        callback.call(context, item);
    }

    return items;
};

module.exports = Call;


/***/ }),

/***/ 69927:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of objects and returns the first element in the array that has properties which match
 * all of those specified in the `compare` object. For example, if the compare object was: `{ scaleX: 0.5, alpha: 1 }`
 * then it would return the first item which had the property `scaleX` set to 0.5 and `alpha` set to 1.
 *
 * To use this with a Group: `GetFirst(group.getChildren(), compare, index)`
 *
 * @function Phaser.Actions.GetFirst
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be searched by this action.
 * @param {object} compare - The comparison object. Each property in this object will be checked against the items of the array.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 *
 * @return {?(object|Phaser.GameObjects.GameObject)} The first object in the array that matches the comparison object, or `null` if no match was found.
 */
var GetFirst = function (items, compare, index)
{
    if (index === undefined) { index = 0; }

    for (var i = index; i < items.length; i++)
    {
        var item = items[i];

        var match = true;

        for (var property in compare)
        {
            if (item[property] !== compare[property])
            {
                match = false;
            }
        }

        if (match)
        {
            return item;
        }
    }

    return null;
};

module.exports = GetFirst;


/***/ }),

/***/ 32265:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of objects and returns the last element in the array that has properties which match
 * all of those specified in the `compare` object. For example, if the compare object was: `{ scaleX: 0.5, alpha: 1 }`
 * then it would return the last item which had the property `scaleX` set to 0.5 and `alpha` set to 1.
 *
 * To use this with a Group: `GetLast(group.getChildren(), compare, index)`
 *
 * @function Phaser.Actions.GetLast
 * @since 3.3.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be searched by this action.
 * @param {object} compare - The comparison object. Each property in this object will be checked against the items of the array.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 *
 * @return {?(object|Phaser.GameObjects.GameObject)} The last object in the array that matches the comparison object, or `null` if no match was found.
 */
var GetLast = function (items, compare, index)
{
    if (index === undefined) { index = 0; }

    for (var i = items.length - 1; i >= index; i--)
    {
        var item = items[i];

        var match = true;

        for (var property in compare)
        {
            if (item[property] !== compare[property])
            {
                match = false;
            }
        }

        if (match)
        {
            return item;
        }
    }

    return null;
};

module.exports = GetLast;


/***/ }),

/***/ 94420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AlignIn = __webpack_require__(11879);
var CONST = __webpack_require__(60461);
var GetFastValue = __webpack_require__(95540);
var NOOP = __webpack_require__(29747);
var Zone = __webpack_require__(41481);

var tempZone = new Zone({ sys: { queueDepthSort: NOOP, events: { once: NOOP } } }, 0, 0, 1, 1).setOrigin(0, 0);

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties,
 * and then aligns them based on the grid configuration given to this action.
 *
 * @function Phaser.Actions.GridAlign
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {Phaser.Types.Actions.GridAlignConfig} options - The GridAlign Configuration object.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var GridAlign = function (items, options)
{
    if (options === undefined) { options = {}; }

    var widthSet = options.hasOwnProperty('width');
    var heightSet = options.hasOwnProperty('height');

    var width = GetFastValue(options, 'width', -1);
    var height = GetFastValue(options, 'height', -1);

    var cellWidth = GetFastValue(options, 'cellWidth', 1);
    var cellHeight = GetFastValue(options, 'cellHeight', cellWidth);

    var position = GetFastValue(options, 'position', CONST.TOP_LEFT);
    var x = GetFastValue(options, 'x', 0);
    var y = GetFastValue(options, 'y', 0);

    var cx = 0;
    var cy = 0;
    var w = (width * cellWidth);
    var h = (height * cellHeight);

    tempZone.setPosition(x, y);
    tempZone.setSize(cellWidth, cellHeight);

    for (var i = 0; i < items.length; i++)
    {
        AlignIn(items[i], tempZone, position);

        if (widthSet && width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            tempZone.x += cellWidth;
        }
        else if (heightSet && height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            tempZone.y += cellHeight;
        }
        else if (heightSet && !widthSet)
        {
            //  We keep laying them out until we hit the column limit
            cy += cellHeight;
            tempZone.y += cellHeight;

            if (cy === h)
            {
                cy = 0;
                cx += cellWidth;
                tempZone.y = y;
                tempZone.x += cellWidth;

                if (cx === w)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
            }
        }
        else
        {
            //  We keep laying them out until we hit the column limit
            cx += cellWidth;
            tempZone.x += cellWidth;

            if (cx === w)
            {
                cx = 0;
                cy += cellHeight;
                tempZone.x = x;
                tempZone.y += cellHeight;

                if (cy === h)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
            }
        }
    }

    return items;
};

module.exports = GridAlign;


/***/ }),

/***/ 41721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `alpha` property,
 * and then adds the given value to each of their `alpha` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `IncAlpha(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.IncAlpha
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `alpha` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var IncAlpha = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'alpha', value, step, index, direction);
};

module.exports = IncAlpha;


/***/ }),

/***/ 67285:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `x` property,
 * and then adds the given value to each of their `x` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `IncX(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.IncX
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `x` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var IncX = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'x', value, step, index, direction);
};

module.exports = IncX;


/***/ }),

/***/ 9074:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties,
 * and then adds the given value to each of them.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `IncXY(group.getChildren(), x, y, stepX, stepY)`
 *
 * @function Phaser.Actions.IncXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} x - The amount to be added to the `x` property.
 * @param {number} [y=x] - The amount to be added to the `y` property. If `undefined` or `null` it uses the `x` value.
 * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var IncXY = function (items, x, y, stepX, stepY, index, direction)
{
    if (y === undefined || y === null) { y = x; }

    PropertyValueInc(items, 'x', x, stepX, index, direction);

    return PropertyValueInc(items, 'y', y, stepY, index, direction);
};

module.exports = IncXY;


/***/ }),

/***/ 75222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `y` property,
 * and then adds the given value to each of their `y` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `IncY(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.IncY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `y` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var IncY = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'y', value, step, index, direction);
};

module.exports = IncY;


/***/ }),

/***/ 22983:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Circle.
 *
 * If you wish to pass a `Phaser.GameObjects.Circle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnCircle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Circle} circle - The Circle to position the Game Objects on.
 * @param {number} [startAngle=0] - Optional angle to start position from, in radians.
 * @param {number} [endAngle=6.28] - Optional angle to stop position at, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnCircle = function (items, circle, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / items.length;

    var cx = circle.x;
    var cy = circle.y;
    var radius = circle.radius;

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = cx + (radius * Math.cos(angle));
        items[i].y = cy + (radius * Math.sin(angle));

        angle += angleStep;
    }

    return items;
};

module.exports = PlaceOnCircle;


/***/ }),

/***/ 95253:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of an Ellipse.
 * 
 * If you wish to pass a `Phaser.GameObjects.Ellipse` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnEllipse
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to position the Game Objects on.
 * @param {number} [startAngle=0] - Optional angle to start position from, in radians.
 * @param {number} [endAngle=6.28] - Optional angle to stop position at, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnEllipse = function (items, ellipse, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / items.length;

    var a = ellipse.width / 2;
    var b = ellipse.height / 2;

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = ellipse.x + a * Math.cos(angle);
        items[i].y = ellipse.y + b * Math.sin(angle);

        angle += angleStep;
    }

    return items;
};

module.exports = PlaceOnEllipse;


/***/ }),

/***/ 88505:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetPoints = __webpack_require__(15258);
var GetEasedPoints = __webpack_require__(26708);

/**
 * Positions an array of Game Objects on evenly spaced points of a Line.
 * If the ease parameter is supplied, it will space the points based on that easing function along the line.
 *
 * @function Phaser.Actions.PlaceOnLine
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - The Line to position the Game Objects on.
 * @param {(string|function)} [ease] - An optional ease to use. This can be either a string from the EaseMap, or a custom function.
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnLine = function (items, line, ease)
{
    var points;

    if (ease)
    {
        points = GetEasedPoints(line, ease, items.length);
    }
    else
    {
        points = GetPoints(line, items.length);
    }

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = points[i];

        item.x = point.x;
        item.y = point.y;
    }

    return items;
};

module.exports = PlaceOnLine;


/***/ }),

/***/ 41346:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MarchingAnts = __webpack_require__(14649);
var RotateLeft = __webpack_require__(86003);
var RotateRight = __webpack_require__(49498);

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Rectangle.
 * 
 * Placement starts from the top-left of the rectangle, and proceeds in a clockwise direction.
 * If the `shift` parameter is given you can offset where placement begins.
 *
 * @function Phaser.Actions.PlaceOnRectangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to position the Game Objects on.
 * @param {number} [shift=0] - An optional positional offset.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnRectangle = function (items, rect, shift)
{
    if (shift === undefined) { shift = 0; }

    var points = MarchingAnts(rect, false, items.length);

    if (shift > 0)
    {
        RotateLeft(points, shift);
    }
    else if (shift < 0)
    {
        RotateRight(points, Math.abs(shift));
    }

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = points[i].x;
        items[i].y = points[i].y;
    }

    return items;
};

module.exports = PlaceOnRectangle;


/***/ }),

/***/ 11575:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BresenhamPoints = __webpack_require__(84993);

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the edges of a Triangle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Triangle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.PlaceOnTriangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to position the Game Objects on.
 * @param {number} [stepRate=1] - An optional step rate, to increase or decrease the packing of the Game Objects on the lines.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnTriangle = function (items, triangle, stepRate)
{
    var p1 = BresenhamPoints({ x1: triangle.x1, y1: triangle.y1, x2: triangle.x2, y2: triangle.y2 }, stepRate);
    var p2 = BresenhamPoints({ x1: triangle.x2, y1: triangle.y2, x2: triangle.x3, y2: triangle.y3 }, stepRate);
    var p3 = BresenhamPoints({ x1: triangle.x3, y1: triangle.y3, x2: triangle.x1, y2: triangle.y1 }, stepRate);

    //  Remove overlaps
    p1.pop();
    p2.pop();
    p3.pop();

    p1 = p1.concat(p2, p3);

    var step = p1.length / items.length;
    var p = 0;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = p1[Math.floor(p)];

        item.x = point.x;
        item.y = point.y;

        p += step;
    }

    return items;
};

module.exports = PlaceOnTriangle;


/***/ }),

/***/ 29953:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Play an animation on all Game Objects in the array that have an Animation component.
 *
 * You can pass either an animation key, or an animation configuration object for more control over the playback.
 *
 * @function Phaser.Actions.PlayAnimation
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
 * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlayAnimation = function (items, key, ignoreIfPlaying)
{
    for (var i = 0; i < items.length; i++)
    {
        var gameObject = items[i];

        if (gameObject.anims)
        {
            gameObject.anims.play(key, ignoreIfPlaying);
        }
    }

    return items;
};

module.exports = PlayAnimation;


/***/ }),

/***/ 66979:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects, or any objects that have a public property as defined in `key`,
 * and then adds the given value to it.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `PropertyValueInc(group.getChildren(), key, value, step)`
 *
 * @function Phaser.Actions.PropertyValueInc
 * @since 3.3.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {string} key - The property to be updated.
 * @param {number} value - The amount to be added to the property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var PropertyValueInc = function (items, key, value, step, index, direction)
{
    if (step === undefined) { step = 0; }
    if (index === undefined) { index = 0; }
    if (direction === undefined) { direction = 1; }

    var i;
    var t = 0;
    var end = items.length;

    if (direction === 1)
    {
        //  Start to End
        for (i = index; i < end; i++)
        {
            items[i][key] += value + (t * step);
            t++;
        }
    }
    else
    {
        //  End to Start
        for (i = index; i >= 0; i--)
        {
            items[i][key] += value + (t * step);
            t++;
        }
    }

    return items;
};

module.exports = PropertyValueInc;


/***/ }),

/***/ 43967:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects, or any objects that have a public property as defined in `key`,
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `PropertyValueSet(group.getChildren(), key, value, step)`
 *
 * @function Phaser.Actions.PropertyValueSet
 * @since 3.3.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {string} key - The property to be updated.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var PropertyValueSet = function (items, key, value, step, index, direction)
{
    if (step === undefined) { step = 0; }
    if (index === undefined) { index = 0; }
    if (direction === undefined) { direction = 1; }

    var i;
    var t = 0;
    var end = items.length;

    if (direction === 1)
    {
        //  Start to End
        for (i = index; i < end; i++)
        {
            items[i][key] = value + (t * step);
            t++;
        }
    }
    else
    {
        //  End to Start
        for (i = index; i >= 0; i--)
        {
            items[i][key] = value + (t * step);
            t++;
        }
    }

    return items;
};

module.exports = PropertyValueSet;


/***/ }),

/***/ 88926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = __webpack_require__(28176);

/**
 * Takes an array of Game Objects and positions them at random locations within the Circle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Circle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomCircle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Circle} circle - The Circle to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomCircle = function (items, circle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(circle, items[i]);
    }

    return items;
};

module.exports = RandomCircle;


/***/ }),

/***/ 33286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = __webpack_require__(24820);

/**
 * Takes an array of Game Objects and positions them at random locations within the Ellipse.
 * 
 * If you wish to pass a `Phaser.GameObjects.Ellipse` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomEllipse
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomEllipse = function (items, ellipse)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(ellipse, items[i]);
    }

    return items;
};

module.exports = RandomEllipse;


/***/ }),

/***/ 96000:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = __webpack_require__(65822);

/**
 * Takes an array of Game Objects and positions them at random locations on the Line.
 * 
 * If you wish to pass a `Phaser.GameObjects.Line` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomLine
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - The Line to position the Game Objects randomly on.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomLine = function (items, line)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(line, items[i]);
    }

    return items;
};

module.exports = RandomLine;


/***/ }),

/***/ 28789:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = __webpack_require__(26597);

/**
 * Takes an array of Game Objects and positions them at random locations within the Rectangle.
 *
 * @function Phaser.Actions.RandomRectangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomRectangle = function (items, rect)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(rect, items[i]);
    }

    return items;
};

module.exports = RandomRectangle;


/***/ }),

/***/ 97154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Random = __webpack_require__(90260);

/**
 * Takes an array of Game Objects and positions them at random locations within the Triangle.
 * 
 * If you wish to pass a `Phaser.GameObjects.Triangle` Shape to this function, you should pass its `geom` property.
 *
 * @function Phaser.Actions.RandomTriangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to position the Game Objects within.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RandomTriangle = function (items, triangle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(triangle, items[i]);
    }

    return items;
};

module.exports = RandomTriangle;


/***/ }),

/***/ 20510:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `rotation` property,
 * and then adds the given value to each of their `rotation` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `Rotate(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `rotation` property (in radians).
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var Rotate = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'rotation', value, step, index, direction);
};

module.exports = Rotate;


/***/ }),

/***/ 91051:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateAroundDistance = __webpack_require__(1163);
var DistanceBetween = __webpack_require__(20339);

/**
 * Rotates each item around the given point by the given angle.
 *
 * @function Phaser.Actions.RotateAround
 * @since 3.0.0
 * @see Phaser.Math.RotateAroundDistance
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RotateAround = function (items, point, angle)
{
    var x = point.x;
    var y = point.y;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        RotateAroundDistance(item, x, y, angle, Math.max(1, DistanceBetween(item.x, item.y, x, y)));
    }

    return items;
};

module.exports = RotateAround;


/***/ }),

/***/ 76332:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathRotateAroundDistance = __webpack_require__(1163);

/**
 * Rotates an array of Game Objects around a point by the given angle and distance.
 *
 * @function Phaser.Actions.RotateAroundDistance
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 * @param {number} distance - The distance from the point of rotation in pixels.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var RotateAroundDistance = function (items, point, angle, distance)
{
    var x = point.x;
    var y = point.y;

    //  There's nothing to do
    if (distance === 0)
    {
        return items;
    }

    for (var i = 0; i < items.length; i++)
    {
        MathRotateAroundDistance(items[i], x, y, angle, distance);
    }

    return items;
};

module.exports = RotateAroundDistance;


/***/ }),

/***/ 61619:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `scaleX` property,
 * and then adds the given value to each of their `scaleX` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `ScaleX(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.ScaleX
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `scaleX` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var ScaleX = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'scaleX', value, step, index, direction);
};

module.exports = ScaleX;


/***/ }),

/***/ 94868:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have public `scaleX` and `scaleY` properties,
 * and then adds the given value to each of them.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `ScaleXY(group.getChildren(), scaleX, scaleY, stepX, stepY)`
 *
 * @function Phaser.Actions.ScaleXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scaleX - The amount to be added to the `scaleX` property.
 * @param {number} [scaleY] - The amount to be added to the `scaleY` property. If `undefined` or `null` it uses the `scaleX` value.
 * @param {number} [stepX=0] - This is added to the `scaleX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `scaleY` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var ScaleXY = function (items, scaleX, scaleY, stepX, stepY, index, direction)
{
    if (scaleY === undefined || scaleY === null) { scaleY = scaleX; }

    PropertyValueInc(items, 'scaleX', scaleX, stepX, index, direction);

    return PropertyValueInc(items, 'scaleY', scaleY, stepY, index, direction);
};

module.exports = ScaleXY;


/***/ }),

/***/ 95532:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueInc = __webpack_require__(66979);

/**
 * Takes an array of Game Objects, or any objects that have a public `scaleY` property,
 * and then adds the given value to each of their `scaleY` properties.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `ScaleY(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.ScaleY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to be added to the `scaleY` property.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var ScaleY = function (items, value, step, index, direction)
{
    return PropertyValueInc(items, 'scaleY', value, step, index, direction);
};

module.exports = ScaleY;


/***/ }),

/***/ 8689:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `alpha`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetAlpha(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetAlpha
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetAlpha = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'alpha', value, step, index, direction);
};

module.exports = SetAlpha;


/***/ }),

/***/ 2645:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `blendMode`
 * and then sets it to the given value.
 *
 * To use this with a Group: `SetBlendMode(group.getChildren(), value)`
 *
 * @function Phaser.Actions.SetBlendMode
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {(Phaser.BlendModes|string|number)} value - The Blend Mode to be set.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetBlendMode = function (items, value, index, direction)
{
    return PropertyValueSet(items, 'blendMode', value, 0, index, direction);
};

module.exports = SetBlendMode;


/***/ }),

/***/ 32372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `depth`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetDepth(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetDepth
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetDepth = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'depth', value, step, index, direction);
};

module.exports = SetDepth;


/***/ }),

/***/ 85373:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Passes all provided Game Objects to the Input Manager to enable them for input with identical areas and callbacks.
 *
 * @see {@link Phaser.GameObjects.GameObject#setInteractive}
 *
 * @function Phaser.Actions.SetHitArea
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {(Phaser.Types.Input.InputConfiguration|any)} [hitArea] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
 * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SetHitArea = function (items, hitArea, hitAreaCallback)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setInteractive(hitArea, hitAreaCallback);
    }

    return items;
};

module.exports = SetHitArea;


/***/ }),

/***/ 81583:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public properties `originX` and `originY`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetOrigin(group.getChildren(), originX, originY, stepX, stepY)`
 *
 * @function Phaser.Actions.SetOrigin
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} originX - The amount to set the `originX` property to.
 * @param {number} [originY] - The amount to set the `originY` property to. If `undefined` or `null` it uses the `originX` value.
 * @param {number} [stepX=0] - This is added to the `originX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `originY` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetOrigin = function (items, originX, originY, stepX, stepY, index, direction)
{
    if (originY === undefined || originY === null) { originY = originX; }

    PropertyValueSet(items, 'originX', originX, stepX, index, direction);
    PropertyValueSet(items, 'originY', originY, stepY, index, direction);

    items.forEach(function (item)
    {
        item.updateDisplayOrigin();
    });

    return items;
};

module.exports = SetOrigin;


/***/ }),

/***/ 79939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `rotation`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetRotation(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetRotation
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetRotation = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'rotation', value, step, index, direction);
};

module.exports = SetRotation;


/***/ }),

/***/ 2699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public properties `scaleX` and `scaleY`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScale(group.getChildren(), scaleX, scaleY, stepX, stepY)`
 *
 * @function Phaser.Actions.SetScale
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scaleX - The amount to set the `scaleX` property to.
 * @param {number} [scaleY] - The amount to set the `scaleY` property to. If `undefined` or `null` it uses the `scaleX` value.
 * @param {number} [stepX=0] - This is added to the `scaleX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `scaleY` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScale = function (items, scaleX, scaleY, stepX, stepY, index, direction)
{
    if (scaleY === undefined || scaleY === null) { scaleY = scaleX; }

    PropertyValueSet(items, 'scaleX', scaleX, stepX, index, direction);

    return PropertyValueSet(items, 'scaleY', scaleY, stepY, index, direction);
};

module.exports = SetScale;


/***/ }),

/***/ 98739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `scaleX`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScaleX(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetScaleX
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScaleX = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'scaleX', value, step, index, direction);
};

module.exports = SetScaleX;


/***/ }),

/***/ 98476:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `scaleY`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScaleY(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetScaleY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScaleY = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'scaleY', value, step, index, direction);
};

module.exports = SetScaleY;


/***/ }),

/***/ 6207:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public properties `scrollFactorX` and `scrollFactorY`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScrollFactor(group.getChildren(), scrollFactorX, scrollFactorY, stepX, stepY)`
 *
 * @function Phaser.Actions.SetScrollFactor
 * @since 3.21.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} scrollFactorX - The amount to set the `scrollFactorX` property to.
 * @param {number} [scrollFactorY] - The amount to set the `scrollFactorY` property to. If `undefined` or `null` it uses the `scrollFactorX` value.
 * @param {number} [stepX=0] - This is added to the `scrollFactorX` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `scrollFactorY` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScrollFactor = function (items, scrollFactorX, scrollFactorY, stepX, stepY, index, direction)
{
    if (scrollFactorY === undefined || scrollFactorY === null) { scrollFactorY = scrollFactorX; }

    PropertyValueSet(items, 'scrollFactorX', scrollFactorX, stepX, index, direction);

    return PropertyValueSet(items, 'scrollFactorY', scrollFactorY, stepY, index, direction);
};

module.exports = SetScrollFactor;


/***/ }),

/***/ 6607:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `scrollFactorX`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScrollFactorX(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetScrollFactorX
 * @since 3.21.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScrollFactorX = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'scrollFactorX', value, step, index, direction);
};

module.exports = SetScrollFactorX;


/***/ }),

/***/ 72248:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `scrollFactorY`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetScrollFactorY(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetScrollFactorY
 * @since 3.21.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetScrollFactorY = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'scrollFactorY', value, step, index, direction);
};

module.exports = SetScrollFactorY;


/***/ }),

/***/ 14036:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects, or any objects that have the public method setTint() and then updates it to the given value(s). You can specify tint color per corner or provide only one color value for `topLeft` parameter, in which case whole item will be tinted with that color.
 *
 * @function Phaser.Actions.SetTint
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} topLeft - The tint being applied to top-left corner of item. If other parameters are given no value, this tint will be applied to whole item.
 * @param {number} [topRight] - The tint to be applied to top-right corner of item.
 * @param {number} [bottomLeft] - The tint to be applied to the bottom-left corner of item.
 * @param {number} [bottomRight] - The tint to be applied to the bottom-right corner of item.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SetTint = function (items, topLeft, topRight, bottomLeft, bottomRight)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setTint(topLeft, topRight, bottomLeft, bottomRight);
    }

    return items;
};

module.exports = SetTint;


/***/ }),

/***/ 50159:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `visible`
 * and then sets it to the given value.
 *
 * To use this with a Group: `SetVisible(group.getChildren(), value)`
 *
 * @function Phaser.Actions.SetVisible
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {boolean} value - The value to set the property to.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetVisible = function (items, value, index, direction)
{
    return PropertyValueSet(items, 'visible', value, 0, index, direction);
};

module.exports = SetVisible;


/***/ }),

/***/ 77597:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `x`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetX(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetX
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetX = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'x', value, step, index, direction);
};

module.exports = SetX;


/***/ }),

/***/ 83194:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public properties `x` and `y`
 * and then sets them to the given values.
 *
 * The optional `stepX` and `stepY` properties are applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetXY(group.getChildren(), x, y, stepX, stepY)`
 *
 * @function Phaser.Actions.SetXY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} x - The amount to set the `x` property to.
 * @param {number} [y=x] - The amount to set the `y` property to. If `undefined` or `null` it uses the `x` value.
 * @param {number} [stepX=0] - This is added to the `x` amount, multiplied by the iteration counter.
 * @param {number} [stepY=0] - This is added to the `y` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetXY = function (items, x, y, stepX, stepY, index, direction)
{
    if (y === undefined || y === null) { y = x; }

    PropertyValueSet(items, 'x', x, stepX, index, direction);

    return PropertyValueSet(items, 'y', y, stepY, index, direction);
};

module.exports = SetXY;


/***/ }),

/***/ 67678:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PropertyValueSet = __webpack_require__(43967);

/**
 * Takes an array of Game Objects, or any objects that have the public property `y`
 * and then sets it to the given value.
 *
 * The optional `step` property is applied incrementally, multiplied by each item in the array.
 *
 * To use this with a Group: `SetY(group.getChildren(), value, step)`
 *
 * @function Phaser.Actions.SetY
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} value - The amount to set the property to.
 * @param {number} [step=0] - This is added to the `value` amount, multiplied by the iteration counter.
 * @param {number} [index=0] - An optional offset to start searching from within the items array.
 * @param {number} [direction=1] - The direction to iterate through the array. 1 is from beginning to end, -1 from end to beginning.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var SetY = function (items, value, step, index, direction)
{
    return PropertyValueSet(items, 'y', value, step, index, direction);
};

module.exports = SetY;


/***/ }),

/***/ 35850:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = __webpack_require__(26099);

/**
 * Takes an array of items, such as Game Objects, or any objects with public `x` and
 * `y` properties and then iterates through them. As this function iterates, it moves
 * the position of the current element to be that of the previous entry in the array.
 * This repeats until all items have been moved.
 *
 * The direction controls the order of iteration. A value of 0 (the default) assumes
 * that the final item in the array is the 'head' item.
 *
 * A direction value of 1 assumes that the first item in the array is the 'head' item.
 *
 * The position of the 'head' item is set to the x/y values given to this function.
 * Every other item in the array is then updated, in sequence, to be that of the
 * previous (or next) entry in the array.
 *
 * The final x/y coords are returned, or set in the 'output' Vector2.
 *
 * Think of it as being like the game Snake, where the 'head' is moved and then
 * each body piece is moved into the space of the previous piece.
 *
 * @function Phaser.Actions.ShiftPosition
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 * @generic {Phaser.Math.Vector2} O - [output,$return]
 *
 * @param {(Phaser.Types.Math.Vector2Like[]|Phaser.GameObjects.GameObject[])} items - An array of Game Objects, or objects with public x and y positions. The contents of this array are updated by this Action.
 * @param {number} x - The x coordinate to place the head item at.
 * @param {number} y - The y coordinate to place the head item at.
 * @param {number} [direction=0] - The iteration direction. 0 = first to last and 1 = last to first.
 * @param {Phaser.Types.Math.Vector2Like} [output] - An optional Vec2Like object to store the final position in.
 *
 * @return {Phaser.Types.Math.Vector2Like} The output vector.
 */
var ShiftPosition = function (items, x, y, direction, output)
{
    if (direction === undefined) { direction = 0; }
    if (output === undefined) { output = new Vector2(); }

    var px;
    var py;
    var len = items.length;

    if (len === 1)
    {
        px = items[0].x;
        py = items[0].y;

        items[0].x = x;
        items[0].y = y;
    }
    else
    {
        var i = 1;
        var pos = 0;

        if (direction === 0)
        {
            pos = len - 1;
            i = len - 2;
        }

        px = items[pos].x;
        py = items[pos].y;

        //  Update the head item to the new x/y coordinates
        items[pos].x = x;
        items[pos].y = y;

        for (var c = 0; c < len; c++)
        {
            if (i >= len || i === -1)
            {
                continue;
            }

            //  Current item
            var cur = items[i];

            //  Get current item x/y, to be passed to the next item in the list
            var cx = cur.x;
            var cy = cur.y;

            //  Set current item to the previous items x/y
            cur.x = px;
            cur.y = py;

            //  Set current as previous
            px = cx;
            py = cy;

            if (direction === 0)
            {
                i--;
            }
            else
            {
                i++;
            }
        }
    }

    //  Return the final set of coordinates as they're effectively lost from the shift and may be needed

    output.x = px;
    output.y = py;

    return output;
};

module.exports = ShiftPosition;


/***/ }),

/***/ 8628:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayShuffle = __webpack_require__(33680);

/**
 * Shuffles the array in place. The shuffled array is both modified and returned.
 *
 * @function Phaser.Actions.Shuffle
 * @since 3.0.0
 * @see Phaser.Utils.Array.Shuffle
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var Shuffle = function (items)
{
    return ArrayShuffle(items);
};

module.exports = Shuffle;


/***/ }),

/***/ 21837:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathSmoothStep = __webpack_require__(7602);

/**
 * Smoothstep is a sigmoid-like interpolation and clamping function.
 *
 * The function depends on three parameters, the input x, the "left edge"
 * and the "right edge", with the left edge being assumed smaller than the right edge.
 *
 * The function receives a real number x as an argument and returns 0 if x is less than
 * or equal to the left edge, 1 if x is greater than or equal to the right edge, and smoothly
 * interpolates, using a Hermite polynomial, between 0 and 1 otherwise. The slope of the
 * smoothstep function is zero at both edges.
 *
 * This is convenient for creating a sequence of transitions using smoothstep to interpolate
 * each segment as an alternative to using more sophisticated or expensive interpolation techniques.
 *
 * @function Phaser.Actions.SmoothStep
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - The property of the Game Object to interpolate.
 * @param {number} min - The minimum interpolation value.
 * @param {number} max - The maximum interpolation value.
 * @param {boolean} [inc=false] - Should the property value be incremented (`true`) or set (`false`)?
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SmoothStep = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += MathSmoothStep(i * step, min, max);
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = MathSmoothStep(i * step, min, max);
        }
    }

    return items;
};

module.exports = SmoothStep;


/***/ }),

/***/ 21910:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathSmootherStep = __webpack_require__(54261);

/**
 * Smootherstep is a sigmoid-like interpolation and clamping function.
 * 
 * The function depends on three parameters, the input x, the "left edge" and the "right edge", with the left edge being assumed smaller than the right edge. The function receives a real number x as an argument and returns 0 if x is less than or equal to the left edge, 1 if x is greater than or equal to the right edge, and smoothly interpolates, using a Hermite polynomial, between 0 and 1 otherwise. The slope of the smoothstep function is zero at both edges. This is convenient for creating a sequence of transitions using smoothstep to interpolate each segment as an alternative to using more sophisticated or expensive interpolation techniques.
 *
 * @function Phaser.Actions.SmootherStep
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - The property of the Game Object to interpolate.
 * @param {number} min - The minimum interpolation value.
 * @param {number} max - The maximum interpolation value.
 * @param {boolean} [inc=false] - Should the values be incremented? `true` or set (`false`)
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SmootherStep = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += MathSmootherStep(i * step, min, max);
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = MathSmootherStep(i * step, min, max);
        }
    }

    return items;
};

module.exports = SmootherStep;


/***/ }),

/***/ 62054:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and then modifies their `property` so the value equals, or is incremented, by the
 * calculated spread value.
 * 
 * The spread value is derived from the given `min` and `max` values and the total number of items in the array.
 * 
 * For example, to cause an array of Sprites to change in alpha from 0 to 1 you could call:
 * 
 * ```javascript
 * Phaser.Actions.Spread(itemsArray, 'alpha', 0, 1);
 * ```
 *
 * @function Phaser.Actions.Spread
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - The property of the Game Object to spread.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @param {boolean} [inc=false] - Should the values be incremented? `true` or set (`false`)
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that were passed to this Action.
 */
var Spread = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }
    if (items.length === 0) { return items; }
    if (items.length === 1) // if only one item put it at the center
    {
        if (inc)
        {
            items[0][property] += (max + min) / 2;
        }
        else
        {
            items[0][property] = (max + min) / 2;
        }

        return items;
    }

    var step = Math.abs(max - min) / (items.length - 1);
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += i * step + min;
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = i * step + min;
        }
    }

    return items;
};

module.exports = Spread;


/***/ }),

/***/ 79815:
/***/ ((module) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects and toggles the visibility of each one.
 * Those previously `visible = false` will become `visible = true`, and vice versa.
 *
 * @function Phaser.Actions.ToggleVisible
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var ToggleVisible = function (items)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].visible = !items[i].visible;
    }

    return items;
};

module.exports = ToggleVisible;


/***/ }),

/***/ 39665:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       samme <samme.npm@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Wrap = __webpack_require__(15994);

/**
 * Iterates through the given array and makes sure that each objects x and y
 * properties are wrapped to keep them contained within the given Rectangles
 * area.
 *
 * @function Phaser.Actions.WrapInRectangle
 * @since 3.0.0
 * @see Phaser.Math.Wrap
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle which the objects will be wrapped to remain within.
 * @param {number} [padding=0] - An amount added to each side of the rectangle during the operation.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var WrapInRectangle = function (items, rect, padding)
{
    if (padding === undefined)
    {
        padding = 0;
    }

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        item.x = Wrap(item.x, rect.left - padding, rect.right + padding);
        item.y = Wrap(item.y, rect.top - padding, rect.bottom + padding);
    }

    return items;
};

module.exports = WrapInRectangle;


/***/ }),

/***/ 61061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Actions
 */

module.exports = {

    AlignTo: __webpack_require__(11517),
    Angle: __webpack_require__(80318),
    Call: __webpack_require__(60757),
    GetFirst: __webpack_require__(69927),
    GetLast: __webpack_require__(32265),
    GridAlign: __webpack_require__(94420),
    IncAlpha: __webpack_require__(41721),
    IncX: __webpack_require__(67285),
    IncXY: __webpack_require__(9074),
    IncY: __webpack_require__(75222),
    PlaceOnCircle: __webpack_require__(22983),
    PlaceOnEllipse: __webpack_require__(95253),
    PlaceOnLine: __webpack_require__(88505),
    PlaceOnRectangle: __webpack_require__(41346),
    PlaceOnTriangle: __webpack_require__(11575),
    PlayAnimation: __webpack_require__(29953),
    PropertyValueInc: __webpack_require__(66979),
    PropertyValueSet: __webpack_require__(43967),
    RandomCircle: __webpack_require__(88926),
    RandomEllipse: __webpack_require__(33286),
    RandomLine: __webpack_require__(96000),
    RandomRectangle: __webpack_require__(28789),
    RandomTriangle: __webpack_require__(97154),
    Rotate: __webpack_require__(20510),
    RotateAround: __webpack_require__(91051),
    RotateAroundDistance: __webpack_require__(76332),
    ScaleX: __webpack_require__(61619),
    ScaleXY: __webpack_require__(94868),
    ScaleY: __webpack_require__(95532),
    SetAlpha: __webpack_require__(8689),
    SetBlendMode: __webpack_require__(2645),
    SetDepth: __webpack_require__(32372),
    SetHitArea: __webpack_require__(85373),
    SetOrigin: __webpack_require__(81583),
    SetRotation: __webpack_require__(79939),
    SetScale: __webpack_require__(2699),
    SetScaleX: __webpack_require__(98739),
    SetScaleY: __webpack_require__(98476),
    SetScrollFactor: __webpack_require__(6207),
    SetScrollFactorX: __webpack_require__(6607),
    SetScrollFactorY: __webpack_require__(72248),
    SetTint: __webpack_require__(14036),
    SetVisible: __webpack_require__(50159),
    SetX: __webpack_require__(77597),
    SetXY: __webpack_require__(83194),
    SetY: __webpack_require__(67678),
    ShiftPosition: __webpack_require__(35850),
    Shuffle: __webpack_require__(8628),
    SmootherStep: __webpack_require__(21910),
    SmoothStep: __webpack_require__(21837),
    Spread: __webpack_require__(62054),
    ToggleVisible: __webpack_require__(79815),
    WrapInRectangle: __webpack_require__(39665)

};


/***/ }),

/***/ 42099:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(45319);
var Class = __webpack_require__(83419);
var Events = __webpack_require__(74943);
var FindClosestInSorted = __webpack_require__(81957);
var Frame = __webpack_require__(41138);
var GetValue = __webpack_require__(35154);
var SortByDigits = __webpack_require__(90126);

/**
 * @classdesc
 * A Frame based Animation.
 *
 * Animations in Phaser consist of a sequence of `AnimationFrame` objects, which are managed by
 * this class, along with properties that impact playback, such as the animations frame rate
 * or delay.
 *
 * This class contains all of the properties and methods needed to handle playback of the animation
 * directly to an `AnimationState` instance, which is owned by a Sprite, or similar Game Object.
 *
 * You don't typically create an instance of this class directly, but instead go via
 * either the `AnimationManager` or the `AnimationState` and use their `create` methods,
 * depending on if you need a global animation, or local to a specific Sprite.
 *
 * @class Animation
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationManager} manager - A reference to the global Animation Manager
 * @param {string} key - The unique identifying string for this animation.
 * @param {Phaser.Types.Animations.Animation} config - The Animation configuration.
 */
var Animation = new Class({

    initialize:

    function Animation (manager, key, config)
    {
        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.Animations.Animation#manager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The unique identifying string for this animation.
         *
         * @name Phaser.Animations.Animation#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = key;

        /**
         * A frame based animation (as opposed to a bone based animation)
         *
         * @name Phaser.Animations.Animation#type
         * @type {string}
         * @default frame
         * @since 3.0.0
         */
        this.type = 'frame';

        /**
         * Extract all the frame data into the frames array.
         *
         * @name Phaser.Animations.Animation#frames
         * @type {Phaser.Animations.AnimationFrame[]}
         * @since 3.0.0
         */
        this.frames = this.getFrames(
            manager.textureManager,
            GetValue(config, 'frames', []),
            GetValue(config, 'defaultTextureKey', null),
            GetValue(config, 'sortFrames', true)
        );

        /**
         * The frame rate of playback in frames per second (default 24 if duration is null)
         *
         * @name Phaser.Animations.Animation#frameRate
         * @type {number}
         * @default 24
         * @since 3.0.0
         */
        this.frameRate = GetValue(config, 'frameRate', null);

        /**
         * How long the animation should play for, in milliseconds.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise the `frameRate` is derived from `duration`.
         *
         * @name Phaser.Animations.Animation#duration
         * @type {number}
         * @since 3.0.0
         */
        this.duration = GetValue(config, 'duration', null);

        /**
         * How many ms per frame, not including frame specific modifiers.
         *
         * @name Phaser.Animations.Animation#msPerFrame
         * @type {number}
         * @since 3.0.0
         */
        this.msPerFrame;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.Animation#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = GetValue(config, 'skipMissedFrames', true);

        /**
         * The delay in ms before the playback will begin.
         *
         * @name Phaser.Animations.Animation#delay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.delay = GetValue(config, 'delay', 0);

        /**
         * Number of times to repeat the animation. Set to -1 to repeat forever.
         *
         * @name Phaser.Animations.Animation#repeat
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeat = GetValue(config, 'repeat', 0);

        /**
         * The delay in ms before the a repeat play starts.
         *
         * @name Phaser.Animations.Animation#repeatDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = GetValue(config, 'repeatDelay', 0);

        /**
         * Should the animation yoyo (reverse back down to the start) before repeating?
         *
         * @name Phaser.Animations.Animation#yoyo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.yoyo = GetValue(config, 'yoyo', false);

        /**
         * If the animation has a delay set, before playback will begin, this
         * controls when the first frame is set on the Sprite. If this property
         * is 'false' then the frame is set only after the delay has expired.
         * This is the default behavior.
         *
         * @name Phaser.Animations.Animation#showBeforeDelay
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.showBeforeDelay = GetValue(config, 'showBeforeDelay', false);

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * @name Phaser.Animations.Animation#showOnStart
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.showOnStart = GetValue(config, 'showOnStart', false);

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation finishes?
         *
         * @name Phaser.Animations.Animation#hideOnComplete
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.hideOnComplete = GetValue(config, 'hideOnComplete', false);

        /**
         * Start playback of this animation from a random frame?
         *
         * @name Phaser.Animations.Animation#randomFrame
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.randomFrame = GetValue(config, 'randomFrame', false);

        /**
         * Global pause. All Game Objects using this Animation instance are impacted by this property.
         *
         * @name Phaser.Animations.Animation#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        this.calculateDuration(this, this.getTotalFrames(), this.duration, this.frameRate);

        if (this.manager.on)
        {
            this.manager.on(Events.PAUSE_ALL, this.pause, this);
            this.manager.on(Events.RESUME_ALL, this.resume, this);
        }
    },

    /**
     * Gets the total number of frames in this animation.
     *
     * @method Phaser.Animations.Animation#getTotalFrames
     * @since 3.50.0
     *
     * @return {number} The total number of frames in this animation.
     */
    getTotalFrames: function ()
    {
        return this.frames.length;
    },

    /**
     * Calculates the duration, frame rate and msPerFrame values.
     *
     * @method Phaser.Animations.Animation#calculateDuration
     * @since 3.50.0
     *
     * @param {Phaser.Animations.Animation} target - The target to set the values on.
     * @param {number} totalFrames - The total number of frames in the animation.
     * @param {?number} [duration] - The duration to calculate the frame rate from. Pass `null` if you wish to set the `frameRate` instead.
     * @param {?number} [frameRate] - The frame rate to calculate the duration from.
     */
    calculateDuration: function (target, totalFrames, duration, frameRate)
    {
        if (duration === null && frameRate === null)
        {
            //  No duration or frameRate given, use default frameRate of 24fps
            target.frameRate = 24;
            target.duration = (24 / totalFrames) * 1000;
        }
        else if (duration && frameRate === null)
        {
            //  Duration given but no frameRate, so set the frameRate based on duration
            //  I.e. 12 frames in the animation, duration = 4000 ms
            //  So frameRate is 12 / (4000 / 1000) = 3 fps
            target.duration = duration;
            target.frameRate = totalFrames / (duration / 1000);
        }
        else
        {
            //  frameRate given, derive duration from it (even if duration also specified)
            //  I.e. 15 frames in the animation, frameRate = 30 fps
            //  So duration is 15 / 30 = 0.5 * 1000 (half a second, or 500ms)
            target.frameRate = frameRate;
            target.duration = (totalFrames / frameRate) * 1000;
        }

        target.msPerFrame = 1000 / target.frameRate;
    },

    /**
     * Add frames to the end of the animation.
     *
     * @method Phaser.Animations.Animation#addFrame
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
     */
    addFrame: function (config)
    {
        return this.addFrameAt(this.frames.length, config);
    },

    /**
     * Add frame/s into the animation.
     *
     * @method Phaser.Animations.Animation#addFrameAt
     * @since 3.0.0
     *
     * @param {number} index - The index to insert the frame at within the animation.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
     */
    addFrameAt: function (index, config)
    {
        var newFrames = this.getFrames(this.manager.textureManager, config);

        if (newFrames.length > 0)
        {
            if (index === 0)
            {
                this.frames = newFrames.concat(this.frames);
            }
            else if (index === this.frames.length)
            {
                this.frames = this.frames.concat(newFrames);
            }
            else
            {
                var pre = this.frames.slice(0, index);
                var post = this.frames.slice(index);

                this.frames = pre.concat(newFrames, post);
            }

            this.updateFrameSequence();
        }

        return this;
    },

    /**
     * Check if the given frame index is valid.
     *
     * @method Phaser.Animations.Animation#checkFrame
     * @since 3.0.0
     *
     * @param {number} index - The index to be checked.
     *
     * @return {boolean} `true` if the index is valid, otherwise `false`.
     */
    checkFrame: function (index)
    {
        return (index >= 0 && index < this.frames.length);
    },

    /**
     * Called internally when this Animation first starts to play.
     * Sets the accumulator and nextTick properties.
     *
     * @method Phaser.Animations.Animation#getFirstTick
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    getFirstTick: function (state)
    {
        //  When is the first update due?
        state.accumulator = 0;
        
        state.nextTick = state.frameRate === state.currentAnim.frameRate ? state.currentFrame.duration || state.msPerFrame : state.msPerFrame;
    },

    /**
     * Returns the AnimationFrame at the provided index
     *
     * @method Phaser.Animations.Animation#getFrameAt
     * @since 3.0.0
     *
     * @param {number} index - The index in the AnimationFrame array
     *
     * @return {Phaser.Animations.AnimationFrame} The frame at the index provided from the animation sequence
     */
    getFrameAt: function (index)
    {
        return this.frames[index];
    },

    /**
     * Creates AnimationFrame instances based on the given frame data.
     *
     * @method Phaser.Animations.Animation#getFrames
     * @since 3.0.0
     *
     * @param {Phaser.Textures.TextureManager} textureManager - A reference to the global Texture Manager.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} frames - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     * @param {string} [defaultTextureKey] - The key to use if no key is set in the frame configuration object.
     *
     * @return {Phaser.Animations.AnimationFrame[]} An array of newly created AnimationFrame instances.
     */
    getFrames: function (textureManager, frames, defaultTextureKey, sortFrames)
    {
        if (sortFrames === undefined) { sortFrames = true; }

        var out = [];
        var prev;
        var animationFrame;
        var index = 1;
        var i;
        var textureKey;

        //  if frames is a string, we'll get all the frames from the texture manager as if it's a sprite sheet
        if (typeof frames === 'string')
        {
            textureKey = frames;

            if (!textureManager.exists(textureKey))
            {
                console.warn('Texture "%s" not found', textureKey);

                return out;
            }

            var texture = textureManager.get(textureKey);
            var frameKeys = texture.getFrameNames();

            if (sortFrames)
            {
                SortByDigits(frameKeys);
            }

            frames = [];

            frameKeys.forEach(function (value)
            {
                frames.push({ key: textureKey, frame: value });
            });
        }

        if (!Array.isArray(frames) || frames.length === 0)
        {
            return out;
        }

        for (i = 0; i < frames.length; i++)
        {
            var item = frames[i];

            var key = GetValue(item, 'key', defaultTextureKey);

            if (!key)
            {
                continue;
            }

            //  Could be an integer or a string
            var frame = GetValue(item, 'frame', 0);

            //  The actual texture frame
            var textureFrame = textureManager.getFrame(key, frame);

            if (!textureFrame)
            {
                console.warn('Texture "%s" not found', key);

                continue;
            }

            animationFrame = new Frame(key, frame, index, textureFrame);

            animationFrame.duration = GetValue(item, 'duration', 0);

            animationFrame.isFirst = (!prev);

            //  The previously created animationFrame
            if (prev)
            {
                prev.nextFrame = animationFrame;

                animationFrame.prevFrame = prev;
            }

            out.push(animationFrame);

            prev = animationFrame;

            index++;
        }

        if (out.length > 0)
        {
            animationFrame.isLast = true;

            //  Link them end-to-end, so they loop
            animationFrame.nextFrame = out[0];

            out[0].prevFrame = animationFrame;

            //  Generate the progress data

            var slice = 1 / (out.length - 1);

            for (i = 0; i < out.length; i++)
            {
                out[i].progress = i * slice;
            }
        }

        return out;
    },

    /**
     * Called internally. Sets the accumulator and nextTick values of the current Animation.
     *
     * @method Phaser.Animations.Animation#getNextTick
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    getNextTick: function (state)
    {
        state.accumulator -= state.