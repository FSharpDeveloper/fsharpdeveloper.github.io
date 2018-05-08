(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var FUNCTION = 'function';
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    if (global['Zone']) {
        throw new Error('Zone already loaded.');
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._properties = null;
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                throw Error('Already loaded patch: ' + name);
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== FUNCTION) {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = undefined; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            // we have to define an variable here, if not
            // typescript compiler will complain below
            var isNotScheduled = task.state === notScheduled;
            if (isNotScheduled && task.type === eventTask) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = null;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this
                            .name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) {
            return delegate.hasTask(target, hasTaskState);
        },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
        onCancelTask: function (delegate, _, target, task) {
            return delegate.cancelTask(target, task);
        }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt =
                zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ?
                this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ?
                this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                return this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ?
                    ' or \'' + fromState2 + '\'' :
                    '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId;
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return null; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === FUNCTION) {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally          
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise = null || resolve(value));
            }
            function onReject(error) {
                promise && (promise = null || reject(error));
            }
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then(onResolve, onReject);
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            var count = 0;
            var resolvedValues = [];
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then((function (index) { return function (value) {
                    resolvedValues[index] = value;
                    count--;
                    if (!count) {
                        resolve(resolvedValues);
                    }
                }; })(count), reject);
                count++;
            }
            if (!count)
                resolve(resolvedValues);
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    function zoneify(fn) {
        return function () {
            var resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            var ctor = resultPromise.constructor;
            if (!ctor[symbolThenPatched]) {
                patchThen(ctor);
            }
            return resultPromise;
        };
    }
    if (NativePromise) {
        patchThen(NativePromise);
        var fetch_1 = global['fetch'];
        if (typeof fetch_1 == 'function') {
            global['fetch'] = zoneify(fetch_1);
        }
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result = listener && listener.apply(this, arguments);
    if (result != undefined && !result) {
        event.preventDefault();
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask, null);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        var customScheduleGlobal = function () {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var eventName = arguments[0];
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = eventName + FALSE_STR;
                    var trueEventName = eventName + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource + eventName;
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : null;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                task.options = options;
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    handleId: null,
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global.__Zone_ignore_on_properties;
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var _registerElement = document.registerElement;
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    document.registerElement = function (name, opts) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = 'Document.registerElement::' + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return _registerElement.call(document, name, opts);
    };
    attachOriginToPatched(document.registerElement, _registerElement);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
    registerElementPatch(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            XMLHttpRequest[XHR_SCHEDULED] = false;
            var data = task.data;
            var target = data.target;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && XMLHttpRequest[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        task.invoke();
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            XMLHttpRequest[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = {
                    target: self,
                    url: self[XHR_URL],
                    isPeriodic: false,
                    delay: null,
                    args: args,
                    aborted: false
                };
                return scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, license, scripts, private, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"angular-ngrx-material-starter","version":"6.0.0","license":"MIT","scripts":{"ng":"ng","start":"ng serve --open","build":"ng build","test":"npm run lint && ng test","lint":"ng lint","e2e":"ng e2e","watch":"ng test --browsers ChromeHeadless --watch","build:prod":"ng build --prod --build-optimizer --vendor-chunk --common-chunk","clean":"rimraf ./dist/","server":"cd dist && http-server","prod":"npm run clean && npm run build:prod && npm run server","ci":"npm run clean && npm run prettier:ci && ng lint && ng test --browsers ChromeTravisCi && ng e2e && npm run build:prod -- --deploy-url /angular-ngrx-material-starter/ --base-href /angular-ngrx-material-starter","release":"standard-version && git push --follow-tags origin master","prettier":"prettier {src,e2e}/**/*.{ts,json,md,scss} --write","prettier:ci":"prettier {src,e2e}/**/*.{ts,json,md,scss} --list-different","analyze":"npm run clean && npm run build:prod -- --stats-json && webpack-bundle-analyzer ./dist/stats.json"},"private":true,"dependencies":{"@angular/animations":"6.0.0","@angular/cdk":"^6.0.0","@angular/common":"^6.0.0","@angular/compiler":"^6.0.0","@angular/core":"^6.0.0","@angular/forms":"6.0.0","@angular/http":"6.0.0","@angular/material":"^6.0.0","@angular/platform-browser":"^6.0.0","@angular/platform-browser-dynamic":"6.0.0","@angular/router":"6.0.0","@covalent/core":"^2.0.0-beta.1","@covalent/dynamic-forms":"^2.0.0-beta.1","@covalent/highlight":"^2.0.0-beta.1","@covalent/http":"^2.0.0-beta.1","@covalent/markdown":"^2.0.0-beta.1","@ngrx/effects":"^6.0.0-beta.1","@ngrx/store":"^6.0.0-beta.1","@ngrx/store-devtools":"^5.2.0","@swimlane/ngx-charts":"^7.4.0","angularfire2":"^5.0.0-rc.7","bootstrap":"^4.0.0","core-js":"^2.4.1","d3":"^4.9.0","d3-array":"^1.2.1","d3-brush":"^1.0.4","d3-color":"^1.1.0","d3-force":"^1.1.0","d3-format":"^1.2.2","d3-hierarchy":"^1.1.6","d3-interpolate":"^1.1.6","d3-scale":"^2.0.0","d3-selection":"^1.3.0","d3-shape":"^1.2.0","d3-time-format":"^2.1.1","firebase":"^4.10.1","font-awesome":"^4.7.0","fullcalendar":"^3.6.1","hammerjs":"^2.0.8","highlight.js":"9.10.0","jquery":"^3.3.1","ng-fullcalendar":"^1.5.6","ngx-line-chart":"^1.0.0","rxjs":"^6.0.0-rc.0","rxjs-compat":"^6.0.0-rc.0","showdown":"^1.6.4","uuid":"^3.1.0","web-animations-js":"^2.2.5","zone.js":"^0.8.20"},"devDependencies":{"@angular-devkit/build-angular":"~0.6.0","@angular/cli":"^6.0.0","@angular/compiler-cli":"6.0.0","@angular/language-service":"6.0.0","@types/jasmine":"~2.8.3","@types/node":"~9.4.0","codelyzer":"~4.1.0","enhanced-resolve":"~3.4.1","jasmine-core":"~2.99.1","jasmine-spec-reporter":"~4.2.1","karma":"~1.7.1","karma-chrome-launcher":"~2.2.0","karma-coverage-istanbul-reporter":"~1.4.2","karma-jasmine":"~1.1.0","karma-jasmine-html-reporter":"~0.2.2","karma-spec-reporter":"~0.0.31","ngrx-store-freeze":"^0.2.1","prettier":"^1.7.4","protractor":"~5.3.0","rimraf":"^2.6.2","standard-version":"^4.2.0","ts-node":"~5.0.0","tslint":"~5.9.1","typescript":"~2.7.2","webpack-bundle-analyzer":"^2.11.1"}};

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"app/examples/examples.module": [
		"./src/app/examples/examples.module.ts",
		"app-examples-examples-module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids) {
		return Promise.resolve().then(function() {
			var e = new Error('Cannot find module "' + req + '".');
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}
	return __webpack_require__.e(ids[1]).then(function() {
		var module = __webpack_require__(ids[0]);
		return module;
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings */ "./src/app/settings/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
    },
    {
        path: 'settings',
        component: _settings__WEBPACK_IMPORTED_MODULE_2__["SettingsComponent"],
        data: {
            title: 'Settings'
        }
    },
    {
        path: 'examples',
        loadChildren: 'app/examples/examples.module#ExamplesModule'
    },
    {
        path: '**',
        redirectTo: 'about'
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            // useHash supports github.io demo page, remove in your app
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component-covalent.html":
/*!*********************************************!*\
  !*** ./src/app/app.component-covalent.html ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<td-layout>\n  <td-navigation-drawer flex sidenavTitle=\"Covalent\" logo=\"assets:teradata\" name=\"Firstname Lastname\" email=\"firstname.lastname@company.com\">\n    <mat-nav-list>\n      <a *ngFor=\"let item of routes\" mat-list-item><mat-icon>{{item.icon}}</mat-icon>{{item.title}}</a>\n    </mat-nav-list>\n    <div td-navigation-drawer-menu>\n      <mat-nav-list>\n        <a *ngFor=\"let item of usermenu\" mat-list-item><mat-icon>{{item.icon}}</mat-icon>{{item.title}}</a>\n      </mat-nav-list>\n    </div>\n  </td-navigation-drawer>\n  <td-layout-nav color=\"accent\">\n    <div td-toolbar-content layout=\"row\" layout-align=\"start center\" flex>\n      <button mat-icon-button td-menu-button tdLayoutToggle>\n        <mat-icon>menu</mat-icon>\n      </button>\n      <mat-icon [routerLink]=\"['/']\" class=\"mat-icon-logo cursor-pointer\" svgIcon=\"assets:teradata\"></mat-icon>\n      <span [routerLink]=\"['/']\" class=\"cursor-pointer\">Covalent</span>\n      <span flex></span>\n      <a mat-icon-button matTooltip=\"Docs\" href=\"https://teradata.github.io/covalent/\" target=\"_blank\"><mat-icon>chrome_reader_mode</mat-icon></a>\n      <a mat-icon-button matTooltip=\"Github\" href=\"https://github.com/teradata/covalent\" target=\"_blank\"><mat-icon svgIcon=\"assets:github\"></mat-icon></a>\n    </div>\n    <td-layout-card-over color=\"accent\" cardWidth=\"75\">\n      <mat-card-title>Card Over Layout</mat-card-title>\n      <mat-card-subtitle>A card over layout with all available options</mat-card-subtitle>\n      <mat-divider></mat-divider>\n      <mat-card-content>\n        <mat-list>\n          <h3 matSubheader>Metadata</h3>\n          <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"cardlist\">\n            <mat-list-item>\n              <mat-icon matListAvatar>{{item.icon}}</mat-icon>\n              <h3 matLine> {{item.title}} </h3>\n              <p matLine> {{item.description}} </p>\n            </mat-list-item>\n            <mat-divider [inset]=\"true\" *ngIf=\"!last\"></mat-divider>\n          </ng-template>\n          <mat-divider></mat-divider>\n          <h3 matSubheader>Dates</h3>\n          <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"carddates\">\n            <mat-list-item>\n              <mat-icon matListAvatar>{{item.icon}}</mat-icon>\n              <h3 matLine> {{item.date | timeAgo}} </h3>\n              <p matLine> {{item.description}} </p>\n            </mat-list-item>\n            <mat-divider [inset]=\"true\" *ngIf=\"!last\"></mat-divider>\n          </ng-template>\n        </mat-list>\n      </mat-card-content>\n      <mat-divider></mat-divider>\n      <mat-card-actions>\n        <button mat-button color=\"accent\" class=\"text-upper\">Edit</button>\n      </mat-card-actions>\n    </td-layout-card-over>\n  </td-layout-nav>\n</td-layout>\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  height: 100%; }\n\n.footer {\n  -ms-flex: 0 0 auto;\n      flex: 0 0 auto;\n  padding: 0 15px;\n  text-align: center;\n  z-index: 1;\n  background: #03a9f4;\n  color: white; }\n\n.footer .row {\n    padding: 10px 0; }\n\n.footer .row .links a {\n      transition: padding 0.5s;\n      display: inline-block;\n      padding: 20px 5px; }\n\n.footer .row .links a:hover {\n        text-decoration: none; }\n\n.footer .row .links a span {\n        display: inline-block;\n        width: 75px;\n        padding: 0 0 0 5px;\n        overflow: hidden;\n        text-align: left;\n        white-space: nowrap;\n        transition: width 0.5s; }\n\n@media (max-width: 768px) {\n      .footer .row .links a {\n        padding: 20px; }\n        .footer .row .links a span {\n          width: 0;\n          padding: 0; } }\n\n@media (max-width: 576px) {\n      .footer .row .links a {\n        padding: 20px 5px; } }\n\n@media (min-width: 576px) {\n      .footer .row .signature {\n        position: relative; }\n        .footer .row .signature a {\n          position: absolute;\n          right: 15px; } }\n\nmat-sidenav-container {\n  height: 100%; }\n\nmat-sidenav-container .wrapper {\n    z-index: -2;\n    height: 100%;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n        flex-direction: column;\n    position: relative;\n    overflow-y: auto; }\n\nmat-sidenav-container .wrapper .toolbar {\n      position: fixed;\n      width: 100%;\n      z-index: 1;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto; }\n\nmat-sidenav-container .wrapper .toolbar .nav-button {\n        margin: 0 10px 0 0; }\n\nmat-sidenav-container .wrapper .toolbar .branding {\n        cursor: pointer;\n        padding-top: 4px; }\n\nmat-sidenav-container .wrapper .toolbar .branding.center {\n          text-align: center; }\n\nmat-sidenav-container .wrapper .toolbar .branding img {\n          position: relative;\n          top: -2px; }\n\nmat-sidenav-container .wrapper .toolbar .sign-in-button {\n        line-height: 35px;\n        margin-right: 10px; }\n\nmat-sidenav-container .wrapper .toolbar .spacer {\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto; }\n\n@media (max-width: 992px) {\n        mat-sidenav-container .wrapper .toolbar .nav-button {\n          min-width: 0;\n          padding: 0 10px; }\n        mat-sidenav-container .wrapper .toolbar .sign-in-button {\n          min-width: 0;\n          padding: 0 10px;\n          margin: 0 5px 0 0; } }\n\nmat-sidenav-container .wrapper .content {\n      padding-top: 64px;\n      -ms-flex: 1 0 auto;\n          flex: 1 0 auto;\n      position: relative; }\n\n@media (max-width: 576px) {\n      mat-sidenav-container .wrapper .content {\n        padding-top: 56px; } }\n\nmat-sidenav-container .wrapper .footer {\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n      padding: 0 15px;\n      text-align: center;\n      z-index: 1; }\n\nmat-sidenav-container .wrapper .footer .row {\n        padding: 10px 0; }\n\nmat-sidenav-container .wrapper .footer .row .links a {\n          transition: padding 0.5s;\n          display: inline-block;\n          padding: 20px 5px; }\n\nmat-sidenav-container .wrapper .footer .row .links a:hover {\n            text-decoration: none; }\n\nmat-sidenav-container .wrapper .footer .row .links a span {\n            display: inline-block;\n            width: 75px;\n            padding: 0 0 0 5px;\n            overflow: hidden;\n            text-align: left;\n            white-space: nowrap;\n            transition: width 0.5s; }\n\n@media (max-width: 768px) {\n          mat-sidenav-container .wrapper .footer .row .links a {\n            padding: 20px; }\n            mat-sidenav-container .wrapper .footer .row .links a span {\n              width: 0;\n              padding: 0; } }\n\n@media (max-width: 576px) {\n          mat-sidenav-container .wrapper .footer .row .links a {\n            padding: 20px 5px; } }\n\n@media (min-width: 576px) {\n          mat-sidenav-container .wrapper .footer .row .signature {\n            position: relative; }\n            mat-sidenav-container .wrapper .footer .row .signature a {\n              position: absolute;\n              right: 15px; } }\n\nmat-sidenav {\n  width: 250px; }\n\nmat-sidenav .branding {\n    height: 64px;\n    padding: 8px 10px;\n    font-size: 20px;\n    font-weight: 500; }\n\nmat-sidenav .branding img {\n      margin: 0 10px 0 0; }\n\nmat-sidenav .branding span {\n      position: relative;\n      top: 3px; }\n\nmat-sidenav .mat-nav-list {\n    padding-top: 0; }\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/overlay */ "./node_modules/@angular/cdk/esm5/overlay.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./settings */ "./src/app/settings/index.ts");
/* harmony import */ var _auth_state_auth_actions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./auth/state/auth.actions */ "./src/app/auth/state/auth.actions.ts");
/* harmony import */ var _layout_state_layout_reducer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./layout/state/layout.reducer */ "./src/app/layout/state/layout.reducer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var AppComponent = /** @class */ (function () {
    function AppComponent(overlayContainer, store, router, titleService, media) {
        this.overlayContainer = overlayContainer;
        this.store = store;
        this.router = router;
        this.titleService = titleService;
        this.media = media;
        this.unsubscribe$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
        this.name = 'Landing Page';
        this.menuChecked = false;
        this.routes = [{
                icon: 'home',
                route: 'about',
                title: 'About',
            }, {
                icon: 'library_books',
                route: 'features',
                title: 'Features',
            }, {
                icon: 'color_lens',
                route: 'slack',
                title: 'Slack',
            }, {
                icon: 'view_quilt',
                route: '.',
                title: 'Layouts',
            }, {
                icon: 'picture_in_picture',
                route: '.',
                title: 'Components & Addons',
            },
        ];
        this.usermenu = [{
                icon: 'swap_horiz',
                route: '.',
                title: 'Switch account',
            }, {
                icon: 'tune',
                route: '.',
                title: 'Account settings',
            }, {
                icon: 'exit_to_app',
                route: '.',
                title: 'Sign out',
            },
        ];
        this.navmenu = [{
                icon: 'looks_one',
                route: '.',
                title: 'First item',
                description: 'Item description',
            }, {
                icon: 'looks_two',
                route: '.',
                title: 'Second item',
                description: 'Item description',
            }, {
                icon: 'looks_3',
                route: '.',
                title: 'Third item',
                description: 'Item description',
            }, {
                icon: 'looks_4',
                route: '.',
                title: 'Fourth item',
                description: 'Item description',
            }, {
                icon: 'looks_5',
                route: '.',
                title: 'Fifth item',
                description: 'Item description',
            },
        ];
        this.isProd = _env_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].production;
        this.envName = _env_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].envName;
        this.version = _env_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].versions.app;
        this.year = new Date().getFullYear();
        this.logo = __webpack_require__(/*! ../assets/logo.png */ "./src/assets/logo.png");
        this.navigation = [
            { link: 'about', label: 'About' },
            { link: 'features', label: 'Features' },
            { link: 'examples', label: 'Examples' }
        ];
        this.navigationSideMenu = this.navigation.concat([
            { link: 'settings', label: 'Settings' }
        ]);
    }
    AppComponent.prototype.ngOnInit = function () {
        this.subscribeToSettings();
        this.subscribeToAuth();
        this.subscribeToLayout();
        this.subscribeToIsAuthenticated();
        this.subscribeToRouterEvents();
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };
    AppComponent.prototype.onLoginClick = function () {
        this.store.dispatch(new _auth_state_auth_actions__WEBPACK_IMPORTED_MODULE_11__["BeginAuthenticationAction"]({}));
    };
    AppComponent.prototype.onLogoutClick = function () {
        this.store.dispatch(new _app_core__WEBPACK_IMPORTED_MODULE_8__["ActionAuthLogout"]());
    };
    AppComponent.prototype.subscribeToIsAuthenticated = function () {
        var _this = this;
        this.store
            .select(_app_core__WEBPACK_IMPORTED_MODULE_8__["selectorAuth"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (auth) { return (_this.isAuthenticated = auth.isAuthenticated); });
    };
    AppComponent.prototype.subscribeToAuth = function () {
        var _this = this;
        this.store
            .select(_app_core__WEBPACK_IMPORTED_MODULE_8__["selectorAuth"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (auth) { return (_this.isAuthenticated = auth.isAuthenticated); });
    };
    AppComponent.prototype.subscribeToLayout = function () {
        this.store
            .select(_layout_state_layout_reducer__WEBPACK_IMPORTED_MODULE_12__["selectorLayout"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (layout) { return (console.log(layout)); });
    };
    AppComponent.prototype.subscribeToSettings = function () {
        var _this = this;
        this.store
            .select(_settings__WEBPACK_IMPORTED_MODULE_10__["selectorSettings"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (settings) { return _this.setTheme(settings); });
    };
    AppComponent.prototype.setTheme = function (settings) {
        var theme = settings.theme, autoNightMode = settings.autoNightMode;
        var hours = new Date().getHours();
        var effectiveTheme = (autoNightMode && (hours >= 20 || hours <= 6)
            ? _settings__WEBPACK_IMPORTED_MODULE_10__["NIGHT_MODE_THEME"]
            : theme).toLowerCase();
        this.componentCssClass = effectiveTheme;
        var classList = this.overlayContainer.getContainerElement().classList;
        var toRemove = Array.from(classList).filter(function (item) {
            return item.includes('-theme');
        });
        classList.remove.apply(classList, toRemove);
        classList.add(effectiveTheme);
    };
    AppComponent.prototype.subscribeToRouterEvents = function () {
        var _this = this;
        this.router.events
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.unsubscribe$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["filter"])(function (event) {
            return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivationEnd"] || event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"];
        }))
            .subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivationEnd"]) {
                _this.setPageTitle(event);
            }
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"]) {
                _this.trackPageView(event);
            }
        });
    };
    AppComponent.prototype.setPageTitle = function (event) {
        var lastChild = event.snapshot;
        while (lastChild.children.length) {
            lastChild = lastChild.children[0];
        }
        var title = lastChild.data.title;
        this.titleService.setTitle(title ? title + " - " + _env_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].appName : _env_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].appName);
    };
    AppComponent.prototype.trackPageView = function (event) {
        window.ga('set', 'page', event.urlAfterRedirects);
        window.ga('send', 'pageview');
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["HostBinding"])('class'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "componentCssClass", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'anms-root-app',
            template: __webpack_require__(/*! ./app.component-covalent.html */ "./src/app/app.component-covalent.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")],
            animations: [_app_core__WEBPACK_IMPORTED_MODULE_8__["routerTransition"]]
        }),
        __metadata("design:paramtypes", [_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__["OverlayContainer"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["Title"],
            _covalent_core__WEBPACK_IMPORTED_MODULE_6__["TdMediaService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/shared */ "./src/app/shared/index.ts");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings */ "./src/app/settings/index.ts");
/* harmony import */ var _static__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./static */ "./src/app/static/index.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _auth_auth_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./auth/auth.module */ "./src/app/auth/auth.module.ts");
/* harmony import */ var _layout_layout_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./layout/layout.module */ "./src/app/layout/layout.module.ts");
/* harmony import */ var _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store-devtools */ "./node_modules/@ngrx/store-devtools/@ngrx/store-devtools.es5.js");
/* harmony import */ var _layout_default_dialog_default_dialog_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./layout/default-dialog/default-dialog.component */ "./src/app/layout/default-dialog/default-dialog.component.ts");
/* harmony import */ var _layout_animated_menu_animated_menu_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./layout/animated-menu/animated-menu.component */ "./src/app/layout/animated-menu/animated-menu.component.ts");
/* harmony import */ var _layout_default_login_default_login_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./layout/default-login/default-login.component */ "./src/app/layout/default-login/default-login.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                // angular
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
                // core & shared
                _app_core__WEBPACK_IMPORTED_MODULE_4__["CoreModule"],
                _app_shared__WEBPACK_IMPORTED_MODULE_3__["SharedModule"],
                _layout_layout_module__WEBPACK_IMPORTED_MODULE_10__["LayoutModule"].forRoot(),
                _auth_auth_module__WEBPACK_IMPORTED_MODULE_9__["AuthModule"].forRoot(),
                _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_11__["StoreDevtoolsModule"].instrument({
                    maxAge: 5
                }),
                // features
                _static__WEBPACK_IMPORTED_MODULE_6__["StaticModule"],
                _settings__WEBPACK_IMPORTED_MODULE_5__["SettingsModule"],
                // app
                _app_routing_module__WEBPACK_IMPORTED_MODULE_7__["AppRoutingModule"]
            ],
            declarations: [_app_component__WEBPACK_IMPORTED_MODULE_8__["AppComponent"], _layout_animated_menu_animated_menu_component__WEBPACK_IMPORTED_MODULE_13__["AnimatedMenuComponent"]],
            entryComponents: [_layout_default_dialog_default_dialog_component__WEBPACK_IMPORTED_MODULE_12__["DialogComponent"], _layout_default_login_default_login_component__WEBPACK_IMPORTED_MODULE_14__["DefaultLoginComponent"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_8__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/auth/auth.module.ts":
/*!*************************************!*\
  !*** ./src/app/auth/auth.module.ts ***!
  \*************************************/
/*! exports provided: AUTH_SERVICE, AuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTH_SERVICE", function() { return AUTH_SERVICE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthModule", function() { return AuthModule; });
/* harmony import */ var _firebase_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./firebase-auth.service */ "./src/app/auth/firebase-auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var angularfire2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angularfire2 */ "./node_modules/angularfire2/index.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var _interfaces_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./interfaces/consts */ "./src/app/auth/interfaces/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AUTH_SERVICE = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["InjectionToken"]('AuthService');
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule_1 = AuthModule;
    AuthModule.forRoot = function () {
        return {
            ngModule: AuthModule_1,
            providers: [
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_4__["AngularFireAuth"],
                _firebase_auth_service__WEBPACK_IMPORTED_MODULE_0__["FirebaseAuthService"]
                // { provide: AUTH_SERVICE,
                //   useValue: FirebaseAuthService.GetInstance(),
                //   deps: [ AngularFireAuth]}
            ]
        };
    };
    AuthModule = AuthModule_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                // StoreDevtoolsModule.instrument({
                //   maxAge: 5
                // }),
                // StoreModule.forRoot({
                //   auth: authReducer,
                // }),
                // EffectsModule.forRoot([AuthEffects]),
                angularfire2__WEBPACK_IMPORTED_MODULE_3__["AngularFireModule"].initializeApp(_interfaces_consts__WEBPACK_IMPORTED_MODULE_5__["FIREBASE_CONFIG"]),
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_4__["AngularFireAuthModule"]
            ],
            declarations: [],
            providers: [
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_4__["AngularFireAuth"],
                _firebase_auth_service__WEBPACK_IMPORTED_MODULE_0__["FirebaseAuthService"]
                // { provide: AUTH_SERVICE,
                //   useFactory: () => FirebaseAuthService.GetInstance(),
                //   deps: [ AngularFireAuth]}
            ]
        })
    ], AuthModule);
    return AuthModule;
    var AuthModule_1;
}());



/***/ }),

/***/ "./src/app/auth/firebase-auth.service.ts":
/*!***********************************************!*\
  !*** ./src/app/auth/firebase-auth.service.ts ***!
  \***********************************************/
/*! exports provided: FirebaseAuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FirebaseAuthService", function() { return FirebaseAuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FirebaseAuthService = /** @class */ (function () {
    function FirebaseAuthService(srv) {
        this.srv = srv;
        this.user = null;
    }
    FirebaseAuthService_1 = FirebaseAuthService;
    FirebaseAuthService.GetInstance = function () {
        return function (auth) {
            FirebaseAuthService_1.instance$ =
                FirebaseAuthService_1.instance$ != null ? FirebaseAuthService_1.instance$ : new FirebaseAuthService_1(auth);
            return FirebaseAuthService_1.instance$;
        };
    };
    FirebaseAuthService.prototype.ngOnInit = function () {
        // throw new Error('Method not implemented.');
    };
    FirebaseAuthService.prototype.login = function (creds) {
        if (creds.username) {
            return this.srv.auth.signInWithEmailAndPassword(creds.username, creds.password);
        }
        else {
            return this.loginWithProvider(creds);
        }
    };
    FirebaseAuthService.prototype.loginWithRole = function (creds) {
    };
    FirebaseAuthService.prototype.onAuthStateChanged = function (callback) {
        var _this = this;
        this.srv.authState.subscribe(function (state) {
            callback(state);
            if (state) {
                _this.user = state;
            }
            else {
                _this.user = null;
            }
        });
    };
    Object.defineProperty(FirebaseAuthService.prototype, "isAuthenticated", {
        get: function () {
            return this.user != null;
        },
        enumerable: true,
        configurable: true
    });
    FirebaseAuthService.prototype.loginWithProvider = function (provider) {
        return this.srv.auth.signInWithPopup(provider);
    };
    FirebaseAuthService.geInstance$ = function (auth) {
        FirebaseAuthService_1.instance$ =
            FirebaseAuthService_1.instance$ != null ? FirebaseAuthService_1.instance$ : new FirebaseAuthService_1(auth);
        return FirebaseAuthService_1.instance$;
    };
    FirebaseAuthService = FirebaseAuthService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [angularfire2_auth__WEBPACK_IMPORTED_MODULE_1__["AngularFireAuth"]])
    ], FirebaseAuthService);
    return FirebaseAuthService;
    var FirebaseAuthService_1;
}());



/***/ }),

/***/ "./src/app/auth/interfaces/consts.ts":
/*!*******************************************!*\
  !*** ./src/app/auth/interfaces/consts.ts ***!
  \*******************************************/
/*! exports provided: FIREBASE_CONFIG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIREBASE_CONFIG", function() { return FIREBASE_CONFIG; });
var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBePEkMBP9XkF-ByeV7O72yBGDfu1NLPpU',
    authDomain: 'socialite-hub.firebaseapp.com',
    databaseURL: 'https://socialite-hub.firebaseio.com',
    projectId: 'socialite-hub',
    storageBucket: 'socialite-hub.appspot.com',
    messagingSenderId: '695150537357'
};
// export const AUTH_SERVICE = new InjectionToken('AuthService');
/*
  to add plugable provider configuration
, {
  providedIn: 'root', factory: () => {

  }
}); */


/***/ }),

/***/ "./src/app/auth/state/auth.actions.ts":
/*!********************************************!*\
  !*** ./src/app/auth/state/auth.actions.ts ***!
  \********************************************/
/*! exports provided: AuthActionTypes, AnonymousAction, BeginAuthenticationAction, LoginAction, LoginWihRoleAction, SuccessAction, FailAction, LogoutAction, ResultAction, RedirectAction, RequestTokenAction, RefreshTokenAction, ResultTokenAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthActionTypes", function() { return AuthActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnonymousAction", function() { return AnonymousAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BeginAuthenticationAction", function() { return BeginAuthenticationAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginAction", function() { return LoginAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginWihRoleAction", function() { return LoginWihRoleAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SuccessAction", function() { return SuccessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FailAction", function() { return FailAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogoutAction", function() { return LogoutAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResultAction", function() { return ResultAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectAction", function() { return RedirectAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestTokenAction", function() { return RequestTokenAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RefreshTokenAction", function() { return RefreshTokenAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResultTokenAction", function() { return ResultTokenAction; });
var AuthActionTypes;
(function (AuthActionTypes) {
    AuthActionTypes["ANONYMOUS"] = "[Auth] Anonymous";
    AuthActionTypes["BEGIN_AUTHENTICATION"] = "[Auth] Begin Authentication Process";
    AuthActionTypes["LOGIN"] = "[Auth] Login";
    AuthActionTypes["LOGIN_WITH_ROLE"] = "[Auth] Login With Role";
    AuthActionTypes["SUCCESS"] = "[Auth] Success";
    AuthActionTypes["FAIL"] = "[Auth] Fail";
    AuthActionTypes["LOGOUT"] = "[Auth] Logout";
    AuthActionTypes["RESULT"] = "[Auth] Result";
    AuthActionTypes["REDIRECT"] = "[Auth] Redirect";
    AuthActionTypes["REQUEST_TOKEN"] = "[Auth] Request Token";
    AuthActionTypes["REFRESH_TOKEN"] = "[Auth] Refresh Token";
    AuthActionTypes["RESULT_TOKEN"] = "[Auth] Result Token";
})(AuthActionTypes || (AuthActionTypes = {}));
var AnonymousAction = /** @class */ (function () {
    function AnonymousAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.ANONYMOUS;
    }
    return AnonymousAction;
}());

var BeginAuthenticationAction = /** @class */ (function () {
    function BeginAuthenticationAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.BEGIN_AUTHENTICATION;
    }
    return BeginAuthenticationAction;
}());

var LoginAction = /** @class */ (function () {
    function LoginAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOGIN;
    }
    return LoginAction;
}());

var LoginWihRoleAction = /** @class */ (function () {
    function LoginWihRoleAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOGIN_WITH_ROLE;
    }
    return LoginWihRoleAction;
}());

var SuccessAction = /** @class */ (function () {
    function SuccessAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.SUCCESS;
    }
    return SuccessAction;
}());

var FailAction = /** @class */ (function () {
    function FailAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.FAIL;
    }
    return FailAction;
}());

var LogoutAction = /** @class */ (function () {
    function LogoutAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.LOGOUT;
    }
    return LogoutAction;
}());

var ResultAction = /** @class */ (function () {
    function ResultAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.RESULT;
    }
    return ResultAction;
}());

var RedirectAction = /** @class */ (function () {
    function RedirectAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.REDIRECT;
    }
    return RedirectAction;
}());

var RequestTokenAction = /** @class */ (function () {
    function RequestTokenAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.REQUEST_TOKEN;
    }
    return RequestTokenAction;
}());

var RefreshTokenAction = /** @class */ (function () {
    function RefreshTokenAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.REFRESH_TOKEN;
    }
    return RefreshTokenAction;
}());

var ResultTokenAction = /** @class */ (function () {
    function ResultTokenAction(payload) {
        this.payload = payload;
        this.type = AuthActionTypes.RESULT_TOKEN;
    }
    return ResultTokenAction;
}());



/***/ }),

/***/ "./src/app/auth/state/auth.effects.ts":
/*!********************************************!*\
  !*** ./src/app/auth/state/auth.effects.ts ***!
  \********************************************/
/*! exports provided: AuthEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthEffects", function() { return AuthEffects; });
/* harmony import */ var _auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.actions */ "./src/app/auth/state/auth.actions.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _layout_state_layout_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../layout/state/layout.actions */ "./src/app/layout/state/layout.actions.ts");
/* harmony import */ var _firebase_auth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../firebase-auth.service */ "./src/app/auth/firebase-auth.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../core */ "./src/app/core/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var AuthEffects = /** @class */ (function () {
    function AuthEffects(store$, actions$, snackBar$, localStorageService$, authSrv$) {
        var _this = this;
        this.store$ = store$;
        this.actions$ = actions$;
        this.snackBar$ = snackBar$;
        this.localStorageService$ = localStorageService$;
        this.authSrv$ = authSrv$;
        this.beginAuthentication$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].BEGIN_AUTHENTICATION)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                _this.store$.dispatch(new _layout_state_layout_actions__WEBPACK_IMPORTED_MODULE_5__["ShowDialogAction"]({}));
            }));
        };
        this.anonymous$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].ANONYMOUS)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                // this.store$.dispatch({});
            }));
        };
        this.login$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].LOGIN)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                console.log(state);
                _this.authSrv$.login(state.payload)
                    .then(function (result) {
                    _this.store$.dispatch(new _auth_actions__WEBPACK_IMPORTED_MODULE_0__["SuccessAction"](result));
                });
            }));
        };
        this.loginWithRole$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].LOGIN_WITH_ROLE)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                // this.store$.dispatch({});
            }));
        };
        this.success$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].SUCCESS)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                _this.localStorageService$.setItem(_core__WEBPACK_IMPORTED_MODULE_8__["AUTH_KEY"], { isAuthenticated: true });
                _this.snackBar$.open('Authenticated');
                _this.store$.dispatch(new _layout_state_layout_actions__WEBPACK_IMPORTED_MODULE_5__["HideDialogAction"]({}));
            }));
        };
        this.fail$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].FAIL)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                // this.store$.dispatch({});
            }));
        };
        this.logout$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].LOGOUT)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                // this.store$.dispatch({});
            }));
        };
        this.result$ = function () {
            return _this.actions$
                .ofType(_auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].RESULT)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["tap"])(function (state) {
                // this.store$.dispatch({});
            }));
        };
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "beginAuthentication$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "anonymous$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "login$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "loginWithRole$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "success$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "fail$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "logout$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Effect"])({ dispatch: false }),
        __metadata("design:type", Object)
    ], AuthEffects.prototype, "result$", void 0);
    AuthEffects = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _ngrx_effects__WEBPACK_IMPORTED_MODULE_3__["Actions"],
            _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatSnackBar"],
            _core__WEBPACK_IMPORTED_MODULE_8__["LocalStorageService"],
            _firebase_auth_service__WEBPACK_IMPORTED_MODULE_6__["FirebaseAuthService"]])
    ], AuthEffects);
    return AuthEffects;
}());



/***/ }),

/***/ "./src/app/auth/state/auth.interfaces.ts":
/*!***********************************************!*\
  !*** ./src/app/auth/state/auth.interfaces.ts ***!
  \***********************************************/
/*! exports provided: initialState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
var initialState = {
    isAuthenticated: false
};


/***/ }),

/***/ "./src/app/auth/state/auth.reducer.ts":
/*!********************************************!*\
  !*** ./src/app/auth/state/auth.reducer.ts ***!
  \********************************************/
/*! exports provided: authReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return authReducer; });
/* harmony import */ var _auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.actions */ "./src/app/auth/state/auth.actions.ts");
/* harmony import */ var _auth_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.interfaces */ "./src/app/auth/state/auth.interfaces.ts");


function authReducer(state, action) {
    if (state === void 0) { state = _auth_interfaces__WEBPACK_IMPORTED_MODULE_1__["initialState"]; }
    switch (action.type) {
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].ANONYMOUS: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].BEGIN_AUTHENTICATION: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].LOGIN: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].LOGIN_WITH_ROLE: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].SUCCESS: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].FAIL: {
            return state;
        }
        case _auth_actions__WEBPACK_IMPORTED_MODULE_0__["AuthActionTypes"].RESULT: {
            return state;
        }
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/core/animations/router.transition.ts":
/*!******************************************************!*\
  !*** ./src/app/core/animations/router.transition.ts ***!
  \******************************************************/
/*! exports provided: ANIMATE_ON_ROUTE_ENTER, routerTransition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ANIMATE_ON_ROUTE_ENTER", function() { return ANIMATE_ON_ROUTE_ENTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routerTransition", function() { return routerTransition; });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");

var ANIMATE_ON_ROUTE_ENTER = 'route-enter-staggered';
var routerTransition = Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["trigger"])('routerTransition', [
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])('* <=> *', [
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter > *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0, position: 'fixed' }), {
            optional: true
        }),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter .' + ANIMATE_ON_ROUTE_ENTER, Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: 0 }), {
            optional: true
        }),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["sequence"])([
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':leave > *', [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(0%)', opacity: 1 }),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.2s ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(-3%)', opacity: 0 })),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ position: 'fixed' })
            ], { optional: true }),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter > *', [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({
                    transform: 'translateY(-3%)',
                    opacity: 0,
                    position: 'static'
                }),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.5s ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(0%)', opacity: 1 }))
            ], { optional: true })
        ]),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter .' + ANIMATE_ON_ROUTE_ENTER, Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["stagger"])(100, [
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(15%)', opacity: 0 }),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.5s ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(0%)', opacity: 1 }))
        ]), { optional: true })
    ])
]);


/***/ }),

/***/ "./src/app/core/auth/auth-guard.service.ts":
/*!*************************************************!*\
  !*** ./src/app/core/auth/auth-guard.service.ts ***!
  \*************************************************/
/*! exports provided: AuthGuardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuardService", function() { return AuthGuardService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../auth/firebase-auth.service */ "./src/app/auth/firebase-auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuardService = /** @class */ (function () {
    function AuthGuardService(store, authSrv) {
        var _this = this;
        this.store = store;
        this.authSrv = authSrv;
        this.isAuthenticated = false;
        authSrv.onAuthStateChanged(function (state) {
            if (state) {
                _this.isAuthenticated = true;
            }
            else {
                _this.isAuthenticated = false;
            }
        });
        // this.store
        //   .select(selectorAuth)
        //   .subscribe(auth => (this.isAuthenticated = auth.isAuthenticated));
    }
    AuthGuardService.prototype.canActivate = function () {
        return this.isAuthenticated = this.authSrv.isAuthenticated;
    };
    AuthGuardService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_2__["FirebaseAuthService"]])
    ], AuthGuardService);
    return AuthGuardService;
}());



/***/ }),

/***/ "./src/app/core/auth/auth.reducer.ts":
/*!*******************************************!*\
  !*** ./src/app/core/auth/auth.reducer.ts ***!
  \*******************************************/
/*! exports provided: AUTH_KEY, AuthActionTypes, ActionAuthLogin, ActionAuthLogout, initialState, selectorAuth, authReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTH_KEY", function() { return AUTH_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthActionTypes", function() { return AuthActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionAuthLogin", function() { return ActionAuthLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionAuthLogout", function() { return ActionAuthLogout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectorAuth", function() { return selectorAuth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return authReducer; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var AUTH_KEY = 'AUTH';
var AuthActionTypes;
(function (AuthActionTypes) {
    AuthActionTypes["LOGIN"] = "[Auth] Login";
    AuthActionTypes["LOGOUT"] = "[Auth] Logout";
})(AuthActionTypes || (AuthActionTypes = {}));
var ActionAuthLogin = /** @class */ (function () {
    function ActionAuthLogin() {
        this.type = AuthActionTypes.LOGIN;
    }
    return ActionAuthLogin;
}());

var ActionAuthLogout = /** @class */ (function () {
    function ActionAuthLogout() {
        this.type = AuthActionTypes.LOGOUT;
    }
    return ActionAuthLogout;
}());

var initialState = {
    isAuthenticated: false
};
var selectorAuth = function (state) { return state.auth; };
function authReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return __assign({}, state, { isAuthenticated: true });
        case AuthActionTypes.LOGOUT:
            return __assign({}, state, { isAuthenticated: false });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/core/core.module.ts":
/*!*************************************!*\
  !*** ./src/app/core/core.module.ts ***!
  \*************************************/
/*! exports provided: metaReducers, CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metaReducers", function() { return metaReducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return CoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var ngrx_store_freeze__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngrx-store-freeze */ "./node_modules/ngrx-store-freeze/index.js");
/* harmony import */ var ngrx_store_freeze__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ngrx_store_freeze__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
/* harmony import */ var _meta_reducers_debug_reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./meta-reducers/debug.reducer */ "./src/app/core/meta-reducers/debug.reducer.ts");
/* harmony import */ var _meta_reducers_init_state_from_local_storage_reducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./meta-reducers/init-state-from-local-storage.reducer */ "./src/app/core/meta-reducers/init-state-from-local-storage.reducer.ts");
/* harmony import */ var _local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./local-storage/local-storage.service */ "./src/app/core/local-storage/local-storage.service.ts");
/* harmony import */ var _auth_auth_guard_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./auth/auth-guard.service */ "./src/app/core/auth/auth-guard.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








// import { authReducer } from './auth/auth.reducer';
// import { AuthEffects } from './auth/auth.effects';

var metaReducers = [_meta_reducers_init_state_from_local_storage_reducer__WEBPACK_IMPORTED_MODULE_6__["initStateFromLocalStorage"]];
if (!_env_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    metaReducers.unshift(_meta_reducers_debug_reducer__WEBPACK_IMPORTED_MODULE_5__["debug"], ngrx_store_freeze__WEBPACK_IMPORTED_MODULE_3__["storeFreeze"]);
}
var CoreModule = /** @class */ (function () {
    function CoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
    CoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                // angular
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
            ],
            declarations: [],
            providers: [_local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_7__["LocalStorageService"], _auth_auth_guard_service__WEBPACK_IMPORTED_MODULE_8__["AuthGuardService"]]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [CoreModule])
    ], CoreModule);
    return CoreModule;
}());



/***/ }),

/***/ "./src/app/core/index.ts":
/*!*******************************!*\
  !*** ./src/app/core/index.ts ***!
  \*******************************/
/*! exports provided: LocalStorageService, ANIMATE_ON_ROUTE_ENTER, routerTransition, AUTH_KEY, AuthActionTypes, ActionAuthLogin, ActionAuthLogout, initialState, selectorAuth, authReducer, AuthGuardService, metaReducers, CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./local-storage/local-storage.service */ "./src/app/core/local-storage/local-storage.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return _local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_0__["LocalStorageService"]; });

/* harmony import */ var _animations_router_transition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animations/router.transition */ "./src/app/core/animations/router.transition.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ANIMATE_ON_ROUTE_ENTER", function() { return _animations_router_transition__WEBPACK_IMPORTED_MODULE_1__["ANIMATE_ON_ROUTE_ENTER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "routerTransition", function() { return _animations_router_transition__WEBPACK_IMPORTED_MODULE_1__["routerTransition"]; });

/* harmony import */ var _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth/auth.reducer */ "./src/app/core/auth/auth.reducer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AUTH_KEY", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["AUTH_KEY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthActionTypes", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["AuthActionTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionAuthLogin", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["ActionAuthLogin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionAuthLogout", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["ActionAuthLogout"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["initialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectorAuth", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["selectorAuth"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return _auth_auth_reducer__WEBPACK_IMPORTED_MODULE_2__["authReducer"]; });

/* harmony import */ var _auth_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth/auth-guard.service */ "./src/app/core/auth/auth-guard.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthGuardService", function() { return _auth_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]; });

/* harmony import */ var _core_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core.module */ "./src/app/core/core.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "metaReducers", function() { return _core_module__WEBPACK_IMPORTED_MODULE_4__["metaReducers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return _core_module__WEBPACK_IMPORTED_MODULE_4__["CoreModule"]; });








/***/ }),

/***/ "./src/app/core/local-storage/local-storage.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/core/local-storage/local-storage.service.ts ***!
  \*************************************************************/
/*! exports provided: LocalStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return LocalStorageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var APP_PREFIX = 'ANMS-';
var LocalStorageService = /** @class */ (function () {
    function LocalStorageService() {
    }
    LocalStorageService.loadInitialState = function () {
        return Object.keys(localStorage).reduce(function (state, storageKey) {
            if (storageKey.includes(APP_PREFIX)) {
                state = state || {};
                var stateKey_1 = storageKey
                    .replace(APP_PREFIX, '')
                    .toLowerCase()
                    .split('.');
                var currentStateRef_1 = state;
                stateKey_1.forEach(function (key, index) {
                    if (index === stateKey_1.length - 1) {
                        currentStateRef_1[key] = JSON.parse(localStorage.getItem(storageKey));
                        return;
                    }
                    currentStateRef_1[key] = currentStateRef_1[key] || {};
                    currentStateRef_1 = currentStateRef_1[key];
                });
            }
            return state;
        }, undefined);
    };
    LocalStorageService.prototype.setItem = function (key, value) {
        localStorage.setItem("" + APP_PREFIX + key, JSON.stringify(value));
    };
    LocalStorageService.prototype.getItem = function (key) {
        return JSON.parse(localStorage.getItem("" + APP_PREFIX + key));
    };
    LocalStorageService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], LocalStorageService);
    return LocalStorageService;
}());



/***/ }),

/***/ "./src/app/core/meta-reducers/debug.reducer.ts":
/*!*****************************************************!*\
  !*** ./src/app/core/meta-reducers/debug.reducer.ts ***!
  \*****************************************************/
/*! exports provided: debug */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debug", function() { return debug; });
function debug(reducer) {
    return function (state, action) {
        var newState = reducer(state, action);
        console.log("[DEBUG] action: " + action.type, {
            payload: action.payload,
            oldState: state,
            newState: newState
        });
        return newState;
    };
}


/***/ }),

/***/ "./src/app/core/meta-reducers/init-state-from-local-storage.reducer.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/core/meta-reducers/init-state-from-local-storage.reducer.ts ***!
  \*****************************************************************************/
/*! exports provided: initStateFromLocalStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initStateFromLocalStorage", function() { return initStateFromLocalStorage; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local-storage/local-storage.service */ "./src/app/core/local-storage/local-storage.service.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};


function initStateFromLocalStorage(reducer) {
    return function (state, action) {
        var newState = reducer(state, action);
        if ([_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["INIT"].toString(), _ngrx_store__WEBPACK_IMPORTED_MODULE_0__["UPDATE"].toString()].includes(action.type)) {
            return __assign({}, newState, _local_storage_local_storage_service__WEBPACK_IMPORTED_MODULE_1__["LocalStorageService"].loadInitialState());
        }
        return newState;
    };
}


/***/ }),

/***/ "./src/app/layout/animated-menu/animated-menu.component.css":
/*!******************************************************************!*\
  !*** ./src/app/layout/animated-menu/animated-menu.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".menu {\r\n  z-index: 1000;\r\n  -webkit-filter: url(\"#shadowed-goo\");\r\n          filter: url(\"#shadowed-goo\");\r\n}\r\n\r\n.menu-item, .menu-open-button {\r\n  background: #283593;\r\n  border-radius: 100%;\r\n  width: 80px;\r\n  height: 80px;\r\n  margin-left: -40px;\r\n  position: absolute;\r\n  top: 30px;\r\n  color: white;\r\n  text-align: center;\r\n  line-height: 80px;\r\n  -webkit-transform: translate3d(0, 0, 0);\r\n          transform: translate3d(0, 0, 0);\r\n  transition: -webkit-transform ease-out 200ms;\r\n  transition: transform ease-out 200ms;\r\n  transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;\r\n}\r\n\r\n.menu-open {\r\n  display: none;\r\n}\r\n\r\n.hamburger {\r\n  width: 25px;\r\n  height: 3px;\r\n  background: white;\r\n  display: block;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  margin-left: -12.5px;\r\n  margin-top: -1.5px;\r\n  transition: -webkit-transform 200ms;\r\n  transition: transform 200ms;\r\n  transition: transform 200ms, -webkit-transform 200ms;\r\n}\r\n\r\n.hamburger-1 {\r\n  -webkit-transform: translate3d(0, -8px, 0);\r\n          transform: translate3d(0, -8px, 0);\r\n}\r\n\r\n.hamburger-2 {\r\n  -webkit-transform: translate3d(0, 0, 0);\r\n          transform: translate3d(0, 0, 0);\r\n}\r\n\r\n.hamburger-3 {\r\n  -webkit-transform: translate3d(0, 8px, 0);\r\n          transform: translate3d(0, 8px, 0);\r\n}\r\n\r\n.menu-open:checked + .menu-open-button .hamburger-1 {\r\n  -webkit-transform: translate3d(0, 0, 0) rotate(45deg);\r\n          transform: translate3d(0, 0, 0) rotate(45deg);\r\n}\r\n\r\n.menu-open:checked + .menu-open-button .hamburger-2 {\r\n  -webkit-transform: translate3d(0, 0, 0) scale(0.1, 1);\r\n          transform: translate3d(0, 0, 0) scale(0.1, 1);\r\n}\r\n\r\n.menu-open:checked + .menu-open-button .hamburger-3 {\r\n  -webkit-transform: translate3d(0, 0, 0) rotate(-45deg);\r\n          transform: translate3d(0, 0, 0) rotate(-45deg);\r\n}\r\n\r\n.menu {\r\n  position: absolute;\r\n  left: 50%;\r\n  margin-left: -80px;\r\n  padding-top: 20px;\r\n  padding-left: 80px;\r\n  width: 650px;\r\n  height: 150px;\r\n  box-sizing: border-box;\r\n  font-size: 20px;\r\n  text-align: left;\r\n}\r\n\r\n.menu-item:hover {\r\n  background: white;\r\n  color: #ffc107;\r\n}\r\n\r\n.menu-item:nth-child(3) {\r\n  transition-duration: 180ms;\r\n}\r\n\r\n.menu-item:nth-child(4) {\r\n  transition-duration: 180ms;\r\n}\r\n\r\n.menu-item:nth-child(5) {\r\n  transition-duration: 180ms;\r\n}\r\n\r\n.menu-item:nth-child(6) {\r\n  transition-duration: 180ms;\r\n}\r\n\r\n.menu-open-button {\r\n  z-index: 2;\r\n  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n  transition-duration: 400ms;\r\n  -webkit-transform: scale(1.1, 1.1) translate3d(0, 0, 0);\r\n          transform: scale(1.1, 1.1) translate3d(0, 0, 0);\r\n  cursor: pointer;\r\n}\r\n\r\n.menu-open-button:hover {\r\n  -webkit-transform: scale(1.2, 1.2) translate3d(0, 0, 0);\r\n          transform: scale(1.2, 1.2) translate3d(0, 0, 0);\r\n}\r\n\r\n.menu-open:checked + .menu-open-button {\r\n  transition-timing-function: linear;\r\n  transition-duration: 200ms;\r\n  -webkit-transform: scale(0.8, 0.8) translate3d(0, 0, 0);\r\n          transform: scale(0.8, 0.8) translate3d(0, 0, 0);\r\n}\r\n\r\n.menu-open:checked ~ .menu-item {\r\n  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);\r\n}\r\n\r\n.menu-open:checked ~ .menu-item:nth-child(3) {\r\n  transition-duration: 170ms;\r\n  -webkit-transform: translate3d(80px, 0, 0);\r\n          transform: translate3d(80px, 0, 0);\r\n}\r\n\r\n.menu-open:checked ~ .menu-item:nth-child(4) {\r\n  transition-duration: 250ms;\r\n  -webkit-transform: translate3d(160px, 0, 0);\r\n          transform: translate3d(160px, 0, 0);\r\n}\r\n\r\n.menu-open:checked ~ .menu-item:nth-child(5) {\r\n  transition-duration: 330ms;\r\n  -webkit-transform: translate3d(240px, 0, 0);\r\n          transform: translate3d(240px, 0, 0);\r\n}\r\n\r\n.menu-open:checked ~ .menu-item:nth-child(6) {\r\n  transition-duration: 410ms;\r\n  -webkit-transform: translate3d(320px, 0, 0);\r\n          transform: translate3d(320px, 0, 0);\r\n}\r\n"

/***/ }),

/***/ "./src/app/layout/animated-menu/animated-menu.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/layout/animated-menu/animated-menu.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav class=\"menu\" (click)=\"toggleMenu()\">\n    <input type=\"checkbox\" href=\"#\" class=\"menu-open\" name=\"menu-open\" id=\"menu-open\" [checked]=\"menuChecked\"/>\n    <label class=\"menu-open-button\" for=\"menu-open\">\n      <span class=\"hamburger hamburger-1\"></span>\n      <span class=\"hamburger hamburger-2\"></span>\n      <span class=\"hamburger hamburger-3\"></span>\n    </label>\n\n    <a href=\"#\" class=\"menu-item\"> <i class=\"fa fa-bar-chart\"></i> </a>\n    <a href=\"#\" class=\"menu-item\"> <i class=\"fa fa-plus\"></i> </a>\n    <a href=\"#\" class=\"menu-item\"> <i class=\"fa fa-heart\"></i> </a>\n    <a href=\"#\" class=\"menu-item\"> <i class=\"fa fa-envelope\"></i> </a>\n    <a href=\"#\" class=\"menu-item\"> <i class=\"fa fa-cog\"></i> </a>\n\n  </nav>\n\n\n  <!-- filters -->\n  <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n      <defs>\n        <filter id=\"shadowed-goo\">\n\n            <feGaussianBlur in=\"SourceGraphic\" result=\"blur\" stdDeviation=\"10\" />\n            <feColorMatrix in=\"blur\" mode=\"matrix\" values=\"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7\" result=\"goo\" />\n            <feGaussianBlur in=\"goo\" stdDeviation=\"3\" result=\"shadow\" />\n            <feColorMatrix in=\"shadow\" mode=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2\" result=\"shadow\" />\n            <feOffset in=\"shadow\" dx=\"1\" dy=\"1\" result=\"shadow\" />\n            <feBlend in2=\"shadow\" in=\"goo\" result=\"goo\" />\n            <feBlend in2=\"goo\" in=\"SourceGraphic\" result=\"mix\" />\n        </filter>\n        <filter id=\"goo\">\n            <feGaussianBlur in=\"SourceGraphic\" result=\"blur\" stdDeviation=\"10\" />\n            <feColorMatrix in=\"blur\" mode=\"matrix\" values=\"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7\" result=\"goo\" />\n            <feBlend in2=\"goo\" in=\"SourceGraphic\" result=\"mix\" />\n        </filter>\n      </defs>\n  </svg>\n"

/***/ }),

/***/ "./src/app/layout/animated-menu/animated-menu.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/layout/animated-menu/animated-menu.component.ts ***!
  \*****************************************************************/
/*! exports provided: AnimatedMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimatedMenuComponent", function() { return AnimatedMenuComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AnimatedMenuComponent = /** @class */ (function () {
    function AnimatedMenuComponent() {
        this.menuChecked = false;
    }
    AnimatedMenuComponent.prototype.ngOnInit = function () {
    };
    AnimatedMenuComponent.prototype.toggleMenu = function () {
        this.menuChecked = !this.menuChecked;
    };
    AnimatedMenuComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-animated-menu',
            template: __webpack_require__(/*! ./animated-menu.component.html */ "./src/app/layout/animated-menu/animated-menu.component.html"),
            styles: [__webpack_require__(/*! ./animated-menu.component.css */ "./src/app/layout/animated-menu/animated-menu.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AnimatedMenuComponent);
    return AnimatedMenuComponent;
}());



/***/ }),

/***/ "./src/app/layout/default-dashboard/data.ts":
/*!**************************************************!*\
  !*** ./src/app/layout/default-dashboard/data.ts ***!
  \**************************************************/
/*! exports provided: pie, single, multi, times */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pie", function() { return pie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "single", function() { return single; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multi", function() { return multi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "times", function() { return times; });
var pie = [
    {
        "name": "Candy",
        "value": 8940000
    },
    {
        "name": "Ice Cream",
        "value": 5000000
    },
    {
        "name": "Pastry",
        "value": 7200000
    }
];
var single = [
    {
        'value': 87,
        'name': '2017-06-28T03:13:02Z'
    }, {
        'value': 81,
        'name': '2017-06-02T09:40:08Z'
    }, {
        'value': 73,
        'name': '2017-06-06T08:26:45Z'
    }, {
        'value': 82,
        'name': '2017-06-14T06:24:28Z'
    }, {
        'value': 84,
        'name': '2017-06-14T05:18:34Z'
    }, {
        'value': 85,
        'name': '2017-06-16T10:18:00Z'
    }, {
        'value': 80,
        'name': '2017-06-11T05:22:44Z'
    }, {
        'value': 80,
        'name': '2017-06-13T09:06:45Z'
    }, {
        'value': 82,
        'name': '2017-06-12T12:25:03Z'
    }, {
        'value': 86,
        'name': '2017-06-03T08:11:16Z'
    }, {
        'value': 81,
        'name': '2017-06-05T05:18:25Z'
    }, {
        'value': 74,
        'name': '2017-06-21T06:45:43Z'
    }, {
        'value': 76,
        'name': '2017-06-06T09:32:01Z'
    }, {
        'value': 87,
        'name': '2017-06-03T06:14:21Z'
    }, {
        'value': 94,
        'name': '2017-06-28T08:49:56Z'
    }, {
        'value': 83,
        'name': '2017-06-28T23:56:28Z'
    }, {
        'value': 96,
        'name': '2017-06-09T00:37:40Z'
    }, {
        'value': 78,
        'name': '2017-06-05T23:56:10Z'
    }, {
        'value': 73,
        'name': '2017-06-01T20:20:02Z'
    }, {
        'value': 74,
        'name': '2017-06-01T02:27:40Z'
    }, {
        'value': 87,
        'name': '2017-06-01T08:59:09Z'
    }, {
        'value': 90,
        'name': '2017-06-23T05:01:53Z'
    }, {
        'value': 84,
        'name': '2017-06-20T21:48:24Z'
    }, {
        'value': 94,
        'name': '2017-06-08T09:46:48Z'
    }, {
        'value': 87,
        'name': '2017-06-01T08:07:57Z'
    }, {
        'value': 95,
        'name': '2017-06-28T11:18:05Z'
    }, {
        'value': 92,
        'name': '2017-06-20T01:41:47Z'
    }, {
        'value': 92,
        'name': '2017-06-21T07:37:39Z'
    }, {
        'value': 85,
        'name': '2017-06-28T20:00:59Z'
    }, {
        'value': 94,
        'name': '2017-06-18T15:57:28Z'
    }
];
var multi = [
    {
        'name': 'Candy',
        'series': [
            {
                'name': '2016',
                'value': 7300000
            },
            {
                'name': '2017',
                'value': 8940000
            }
        ]
    },
    {
        'name': 'Ice Cream',
        'series': [
            {
                'name': '2016',
                'value': 7870000
            },
            {
                'name': '2017',
                'value': 8270000
            }
        ]
    },
    {
        'name': 'Pastry',
        'series': [
            {
                'name': '2016',
                'value': 5000002
            },
            {
                'name': '2017',
                'value': 5800000
            }
        ]
    }
];
var times = [
    {
        'name': 'Candy',
        'series': [
            {
                'value': 69,
                'name': '2016-09-15T19:25:07.773Z',
            },
            {
                'value': 19,
                'name': '2016-09-17T17:16:53.279Z',
            },
            {
                'value': 85,
                'name': '2016-09-15T10:34:32.344Z',
            },
            {
                'value': 89,
                'name': '2016-09-19T14:33:45.710Z',
            },
            {
                'value': 33,
                'name': '2016-09-12T18:48:58.925Z',
            }
        ]
    },
    {
        'name': 'Ice Cream',
        'series': [
            {
                'value': 52,
                'name': '2016-09-15T19:25:07.773Z',
            },
            {
                'value': 49,
                'name': '2016-09-17T17:16:53.279Z',
            },
            {
                'value': 41,
                'name': '2016-09-15T10:34:32.344Z',
            },
            {
                'value': 38,
                'name': '2016-09-19T14:33:45.710Z',
            },
            {
                'value': 72,
                'name': '2016-09-12T18:48:58.925Z',
            }
        ]
    },
    {
        'name': 'Pastry',
        'series': [
            {
                'value': 40,
                'name': '2016-09-15T19:25:07.773Z',
            },
            {
                'value': 45,
                'name': '2016-09-17T17:16:53.279Z',
            },
            {
                'value': 51,
                'name': '2016-09-15T10:34:32.344Z',
            },
            {
                'value': 68,
                'name': '2016-09-19T14:33:45.710Z',
            },
            {
                'value': 54,
                'name': '2016-09-12T18:48:58.925Z',
            }
        ]
    },
];


/***/ }),

/***/ "./src/app/layout/default-dashboard/default-dashboard.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/layout/default-dashboard/default-dashboard.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/layout/default-dashboard/default-dashboard.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/layout/default-dashboard/default-dashboard.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<td-layout [mode]=\"(media.registerQuery('gt-sm') | async) ? 'side' : 'push'\" [sidenavWidth]=\"(media.registerQuery('gt-xs') | async) ? '240px' : '100%'\" [class]=\"activeTheme\">\n    <td-navigation-drawer flex [sidenavTitle]=\"name\" logo=\"assets:covalent\">\n      <mat-nav-list [tdLayoutClose]=\"!media.query('gt-sm')\">\n        <a *ngFor=\"let item of routes\" mat-list-item><mat-icon matListIcon>{{item.icon}}</mat-icon>{{item.title}}</a>\n      </mat-nav-list>\n      <div td-navigation-drawer-menu>\n        <mat-nav-list>\n          <a *ngFor=\"let item of usermenu\" mat-list-item><mat-icon matListIcon>{{item.icon}}</mat-icon>{{item.title}}</a>\n        </mat-nav-list>\n      </div>\n    </td-navigation-drawer>\n    <td-layout-nav [toolbarTitle]=\"(media.registerQuery('gt-xs') | async) ? 'Dashboard' : ''\" logo=\"assets:covalent\" navigationRoute=\"/\">\n      <button mat-icon-button td-menu-button tdLayoutToggle>\n        <mat-icon>menu</mat-icon>\n      </button>\n      <div td-toolbar-content layout=\"row\" layout-align=\"start center\" flex>\n        <span flex *ngIf=\"!searchBox.searchVisible\"></span>\n        <td-search-box hide-xs flex #searchBox [ngClass]=\"{'push-left push-right mat-whiteframe-z1 bgc-white tc-black': searchBox.searchVisible }\"  placeholder=\"search\"></td-search-box>\n        <span>\n          <button mat-icon-button matTooltip=\"Alerts\" [matMenuTriggerFor]=\"notificationsMenu\">\n            <td-notification-count color=\"accent\" [notifications]=\"4\">\n              <mat-icon>notifications</mat-icon>\n            </td-notification-count>\n          </button>\n          <mat-menu #notificationsMenu=\"matMenu\">\n            <td-menu>\n              <div td-menu-header class=\"mat-subhead\">Notifications</div>\n              <mat-nav-list dense>\n                <ng-template let-last=\"last\" ngFor [ngForOf]=\"[0,1,2]\">\n                  <a mat-list-item>\n                    <mat-icon matListAvatar>today</mat-icon>\n                    <h4 mat-line><span class=\"text-wrap\">Candy sales are on the rise!</span></h4>\n                    <p mat-line>22 minutes ago</p>\n                  </a>\n                  <mat-divider *ngIf=\"!last\"></mat-divider>\n                </ng-template>\n              </mat-nav-list>\n              <button mat-button color=\"accent\" td-menu-footer>\n                See All Notifications\n              </button>\n            </td-menu>\n          </mat-menu>\n        </span>\n        <span>\n          <button mat-icon-button matTooltip=\"More\" [mat-menu-trigger-for]=\"more\">\n            <mat-icon>more_vert</mat-icon>\n          </button>\n          <mat-menu xPosition=\"before\" #more=\"matMenu\">\n              <button mat-menu-item *ngIf=\"activeTheme === 'theme-dark'\" (click)=\"theme('theme-light')\">\n                <mat-icon>brightness_high</mat-icon>\n                <span>Light Mode</span>\n              </button>\n              <button mat-menu-item *ngIf=\"activeTheme != 'theme-dark'\" (click)=\"theme('theme-dark')\">\n                <mat-icon>brightness_low</mat-icon>\n                <span>Dark Mode</span>\n              </button>\n          </mat-menu>\n        </span>\n      </div>\n      <td-layout-manage-list #manageList\n              [opened]=\"media.registerQuery('gt-sm') | async\"\n              [mode]=\"(media.registerQuery('gt-sm') | async) ? 'side' :  'over'\"\n              [sidenavWidth]=\"!miniNav ? '257px' : '64px'\">\n        <div td-sidenav-content layout=\"column\" layout-fill>\n          <mat-toolbar>\n            <mat-icon class=\"push-left-xs\" [matTooltip]=\"!miniNav ? '' : 'Dashboards'\" matTooltipPosition=\"after\">dashboard</mat-icon>\n            <span *ngIf=\"!miniNav\" class=\"push-left-sm\">Dashboards</span>\n          </mat-toolbar>\n          <mat-nav-list flex [tdLayoutManageListClose]=\"!media.query('gt-sm')\">\n            <ng-template let-item let-index=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0, 1, 2, 3]\">\n              <a mat-list-item>\n                <mat-icon matListIcon [matTooltip]=\"!miniNav ? '' : 'Dashboard ' + index\" matTooltipPosition=\"after\">dashboard</mat-icon>\n                <span *ngIf=\"!miniNav\">Dashboard {{index}}</span>\n              </a>\n            </ng-template>\n            <mat-divider></mat-divider>\n            <a mat-list-item>\n              <mat-icon matListIcon [matTooltip]=\"!miniNav ? '' : 'Add Dashboard'\" matTooltipPosition=\"after\">add</mat-icon>\n              <span *ngIf=\"!miniNav\">Add Dashboard</span>\n            </a>\n          </mat-nav-list>\n          <div class=\"td-layout-footer pad-sm\" layout=\"row\" layout-align=\"space-between center\">\n            <button type=\"button\" mat-icon-button (click)=\"toggleMiniNav()\">\n              <mat-icon [@tdRotate]=\"miniNav\">keyboard_arrow_left</mat-icon>\n            </button>\n            <span *ngIf=\"!miniNav\" class=\"mat-caption\">&copy; 2017 Your Company, Inc.</span>\n          </div>\n        </div>\n\n        <mat-sidenav-container flex>\n          <mat-sidenav #sidenav align=\"end\">\n            <div layout=\"column\" layout-fill>\n              <mat-toolbar>Settings</mat-toolbar>\n              <div flex class=\"mat-content\">\n\n              </div>\n            </div>\n\n          </mat-sidenav>\n          <td-layout-nav color=\"none\">\n            <div td-toolbar-content flex layout=\"row\" layout-align=\"start center\">\n              <button mat-icon-button tdLayoutManageListToggle>\n                <mat-icon>menu</mat-icon>\n              </button>\n              <span hide-xs>Dashboard 1</span>\n              <span flex></span>\n              <span [style.width.px]=\"100\" layout=\"row\" class=\"push-left-sm push-right mat-body-1\">\n                <mat-form-field floatPlaceholder=\"never\" flex>\n                  <input matInput [max]=\"maxFromDate\" readonly [(ngModel)]=\"dateFrom\" [matDatepicker]=\"pickerFrom\">\n                  <mat-datepicker-toggle matSuffix matTooltip=\"Start date\" [for]=\"pickerFrom\"></mat-datepicker-toggle>\n                  <mat-datepicker #pickerFrom [startAt]=\"dateFrom\"></mat-datepicker>\n                </mat-form-field>\n\n              </span>\n              <span hide-xs class=\"mat-body-2 push-right\"> to </span>\n              <span [style.width.px]=\"100\" layout=\"row\" class=\"mat-body-1\">\n                <mat-form-field floatPlaceholder=\"never\" flex>\n                  <input matInput [max]=\"maxToDate\" readonly [(ngModel)]=\"dateTo\" [matDatepicker]=\"pickerTo\">\n                  <mat-datepicker-toggle matSuffix matTooltip=\"End date\" [for]=\"pickerTo\"></mat-datepicker-toggle>\n                  <mat-datepicker #pickerTo [startAt]=\"dateTo\"></mat-datepicker>\n                </mat-form-field>\n\n              </span>\n              <button matTooltip=\"Dashboard Settings\" matTooltipPosition=\"before\" type=\"button\" mat-icon-button (click)=\"sidenav.open()\">\n                <mat-icon>settings</mat-icon>\n              </button>\n            </div>\n            <div flex layout-gt-sm=\"row\" tdMediaToggle=\"gt-xs\" layout-wrap [mediaClasses]=\"['push-sm']\">\n              <div flex-gt-sm=\"50\">\n                <mat-card>\n                  <mat-card-title>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <span flex>Card title</span>\n                      <span>\n                        <button mat-icon-button\n                                matTooltip=\"Card settings\"\n                                [mat-menu-trigger-for]=\"settings1\">\n                          <mat-icon>more_vert</mat-icon>\n                        </button>\n                        <mat-menu xPosition=\"before\" #settings1=\"matMenu\">\n                          <button mat-menu-item (click)=\"openTemplate()\"> Settings </button>\n                          <mat-divider></mat-divider>\n                          <button mat-menu-item> Remove </button>\n                        </mat-menu>\n                      </span>\n                    </div>\n                  </mat-card-title>\n                  <mat-divider></mat-divider>\n                  <div [style.height.px]=\"280\" class=\"push-top-sm\">\n                    <ngx-charts-line-chart\n                      [scheme]=\"{ domain: [ '#4DD0E1', '#BA68C8', '#FF7043' ] }\"\n                      [results]=\"times\"\n                      [gradient]=\"gradient\"\n                      [autoScale]=\"false\"\n                      [xAxis]=\"true\"\n                      [yAxis]=\"true\"\n                      [legend]=\"true\"\n                      [showXAxisLabel]=\"true\"\n                      [showYAxisLabel]=\"true\"\n                      [xAxisLabel]=\"xAxisLabel\"\n                      [yAxisLabel]=\"yAxisLabel\"\n                      [xAxisTickFormatting]=\"axisDate\">\n                    </ngx-charts-line-chart>\n                  </div>\n                </mat-card>\n              </div>\n              <div flex-gt-sm=\"50\">\n                <mat-card>\n                  <mat-card-title>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <span flex>Card title</span>\n                      <span>\n                        <button mat-icon-button\n                                matTooltip=\"Card settings\"\n                                [mat-menu-trigger-for]=\"settings2\">\n                          <mat-icon>more_vert</mat-icon>\n                        </button>\n                        <mat-menu xPosition=\"before\" #settings2=\"matMenu\">\n                          <button mat-menu-item> Settings </button>\n                          <mat-divider></mat-divider>\n                          <button mat-menu-item> Remove </button>\n                        </mat-menu>\n                      </span>\n                    </div>\n                  </mat-card-title>\n                  <mat-divider></mat-divider>\n                  <div class=\"pad\">\n                    <div [style.height.px]=\"250\">\n                      <ngx-charts-bar-vertical-2d\n                        [scheme]=\"{ domain: [ '#4DD0E1', '#BA68C8', '#FF7043' ] }\"\n                        [results]=\"multi\"\n                        [barPadding]=\"18\"\n                        [groupPadding]=\"28\"\n                        [gradient]=\"true\"\n                        [xAxis]=\"true\"\n                        [yAxis]=\"true\"\n                        [legend]=\"false\"\n                        [showXAxisLabel]=\"false\"\n                        [showYAxisLabel]=\"false\">\n                      </ngx-charts-bar-vertical-2d>\n                    </div>\n                  </div>\n                </mat-card>\n              </div>\n              <div flex-gt-sm=\"50\">\n                <mat-card>\n                  <mat-card-title>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <span flex>Card title</span>\n                      <span>\n                        <button mat-icon-button\n                                matTooltip=\"Card settings\"\n                                [mat-menu-trigger-for]=\"settings3\">\n                          <mat-icon>more_vert</mat-icon>\n                        </button>\n                        <mat-menu xPosition=\"before\" #settings3=\"matMenu\">\n                          <button mat-menu-item> Settings </button>\n                          <mat-divider></mat-divider>\n                          <button mat-menu-item> Remove </button>\n                        </mat-menu>\n                      </span>\n                    </div>\n                  </mat-card-title>\n                  <mat-divider></mat-divider>\n                  <div class=\"pad-top pad-bottom\">\n                    <div class=\"overflow-hidden\" [style.height.px]=\"250\">\n                      <div [style.height.px]=\"270\">\n                        <ngx-charts-area-chart-stacked\n                          [scheme]=\"{ domain: [ '#4DD0E1', '#BA68C8', '#FF7043' ] }\"\n                          [results]=\"times\"\n                          [gradient]=\"true\"\n                          [xAxis]=\"true\"\n                          [yAxis]=\"true\"\n                          [legend]=\"false\"\n                          [showXAxisLabel]=\"true\"\n                          [showYAxisLabel]=\"true\"\n                          [xAxisLabel]=\"xAxisLabel\"\n                          [yAxisLabel]=\"yAxisLabel\"\n                          [xAxisTickFormatting]=\"axisDate\">\n                        </ngx-charts-area-chart-stacked>\n                      </div>\n                    </div>\n                  </div>\n                </mat-card>\n              </div>\n              <div flex-gt-sm=\"50\">\n                <mat-card>\n                  <mat-card-title>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <span flex>Card title</span>\n                      <span>\n                        <button mat-icon-button\n                                matTooltip=\"Card settings\"\n                                [mat-menu-trigger-for]=\"settings4\">\n                          <mat-icon>more_vert</mat-icon>\n                        </button>\n                        <mat-menu xPosition=\"before\" #settings4=\"matMenu\">\n                          <button mat-menu-item> Settings </button>\n                          <mat-divider></mat-divider>\n                          <button mat-menu-item> Remove </button>\n                        </mat-menu>\n                      </span>\n                    </div>\n                  </mat-card-title>\n                  <mat-divider></mat-divider>\n                  <td-data-table\n                    [data]=\"data\"\n                    [style.height.px]=\"290\">\n                  </td-data-table>\n                </mat-card>\n              </div>\n              <div flex-gt-sm=\"50\">\n                <mat-card>\n                  <mat-card-title>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <span flex>Card title</span>\n                      <span>\n                        <button mat-icon-button\n                                matTooltip=\"Card settings\"\n                                [mat-menu-trigger-for]=\"settings5\">\n                          <mat-icon>more_vert</mat-icon>\n                        </button>\n                        <mat-menu xPosition=\"before\" #settings5=\"matMenu\">\n                            <button mat-menu-item> Settings </button>\n                            <mat-divider></mat-divider>\n                            <button mat-menu-item> Remove </button>\n                        </mat-menu>\n                      </span>\n                    </div>\n                  </mat-card-title>\n                  <mat-divider></mat-divider>\n                  <mat-nav-list>\n                    <a mat-list-item>\n                      <mat-icon matListAvatar color=\"primary\">mood</mat-icon>\n                      <h3 mat-line>Candy</h3>\n                      <p mat-line>exceeding goal!</p>\n                      <div flex=\"100\">\n                        <ngx-charts-linear-gauge\n                          [scheme]=\"{ domain: [ '#4DD0E1' ] }\"\n                          [value]=\"90\"\n                          [previousValue]=\"80\"\n                          [min]=\"0\"\n                          [max]=\"100\"\n                          [units]=\"'alerts'\">\n                        </ngx-charts-linear-gauge>\n                      </div>\n                    </a>\n                    <mat-divider mat-inset></mat-divider>\n                    <a mat-list-item>\n                      <mat-icon matListAvatar color=\"accent\">sentiment_satisfied</mat-icon>\n                      <h3 mat-line>Ice Cream</h3>\n                      <p mat-line>goal almost achieved!</p>\n                      <div flex=\"100\">\n                        <ngx-charts-linear-gauge\n                          [scheme]=\"{ domain: [ '#BA68C8' ] }\"\n                          [value]=\"60\"\n                          [previousValue]=\"70\"\n                          [min]=\"0\"\n                          [max]=\"100\"\n                          [units]=\"'alerts'\">\n                        </ngx-charts-linear-gauge>\n                      </div>\n                    </a>\n                    <mat-divider mat-inset></mat-divider>\n                    <a mat-list-item>\n                      <mat-icon matListAvatar color=\"warn\">sentiment_very_dissatisfied</mat-icon>\n                      <h3 mat-line>Pastry</h3>\n                      <p mat-line>falling short of goal!</p>\n                      <div flex=\"100\">\n                        <ngx-charts-linear-gauge\n                          [scheme]=\"{ domain: [ '#FF7043' ] }\"\n                          [value]=\"40\"\n                          [previousValue]=\"60\"\n                          [min]=\"0\"\n                          [max]=\"100\"\n                          [units]=\"'alerts'\">\n                        </ngx-charts-linear-gauge>\n                      </div>\n                    </a>\n                  </mat-nav-list>\n                </mat-card>\n              </div>\n            </div>\n          </td-layout-nav>\n        </mat-sidenav-container>\n      </td-layout-manage-list>\n      <td-layout-footer>\n        <div layout=\"row\" layout-align=\"start center\">\n          <span class=\"mat-caption\">Made with <mat-icon class=\"text-md\">favorite</mat-icon> using <a href=\"http://getcovalent.com\" class=\"text-nodecoration tc-teal-600\">Covalent</a>, built on Angular v4 + Angular Material + NGX-Charts.</span>\n        </div>\n      </td-layout-footer>\n    </td-layout-nav>\n  </td-layout>\n\n  <ng-template #dialogContent let-dialogRef=\"dialogRef\">\n    <div layout=\"column\" layout-fill>\n      <h2 mat-dialog-title>\n        Card Settings\n      </h2>\n      <mat-divider></mat-divider>\n      <mat-dialog-content flex>\n        <form class=\"pad\">\n          <div layout=\"row\" layout-margin>\n            <mat-form-field flex>\n              <input matInput placeholder=\"Card order\" value=\"1\" type=\"number\">\n            </mat-form-field>\n            <mat-form-field flex>\n              <input matInput placeholder=\"Card width\" value=\"100\" type=\"number\">\n            </mat-form-field>\n          </div>\n        </form>\n      </mat-dialog-content>\n      <mat-divider></mat-divider>\n      <mat-dialog-actions align=\"end\">\n        <button type=\"button\" mat-button class=\"text-upper\" (click)=\"dialogRef.close()\">Close</button>\n        <button type=\"button\" mat-button color=\"accent\" class=\"text-upper\" (click)=\"dialogRef.close()\">Save</button>\n      </mat-dialog-actions>\n    </div>\n  </ng-template>\n"

/***/ }),

/***/ "./src/app/layout/default-dashboard/default-dashboard.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/layout/default-dashboard/default-dashboard.component.ts ***!
  \*************************************************************************/
/*! exports provided: DefaultDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultDashboardComponent", function() { return DefaultDashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data */ "./src/app/layout/default-dashboard/data.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DefaultDashboardComponent = /** @class */ (function () {
    function DefaultDashboardComponent(media, dialog, _changeDetectorRef, _iconRegistry, _domSanitizer) {
        this.media = media;
        this.dialog = dialog;
        this._changeDetectorRef = _changeDetectorRef;
        this._iconRegistry = _iconRegistry;
        this._domSanitizer = _domSanitizer;
        this.name = 'UI Platform';
        this.miniNav = false;
        // Timeframe
        this.dateFrom = new Date(new Date().getTime() - (2 * 60 * 60 * 24 * 1000));
        this.dateTo = new Date(new Date().getTime() - (1 * 60 * 60 * 24 * 1000));
        // Dialog
        this.config = {
            width: '50%',
            height: '50%',
        };
        // Nav
        this.routes = [{
                title: 'Dashboards',
                route: '/',
                icon: 'dashboard',
            }, {
                title: 'Reports',
                route: '/',
                icon: 'insert_chart',
            }, {
                title: 'Sales',
                route: '/',
                icon: 'account_balance',
            }, {
                title: 'Marketplace',
                route: '/',
                icon: 'store',
            },
        ];
        this.usermenu = [{
                title: 'Profile',
                route: '/',
                icon: 'account_box',
            }, {
                title: 'Settings',
                route: '/',
                icon: 'settings',
            },
        ];
        // Data table
        this.data = [
            {
                'name': 'Frozen yogurt',
                'type': 'Ice cream',
                'calories': 159.0,
                'fat': 6.0,
                'carbs': 24.0,
                'protein': 4.0,
            }, {
                'name': 'Ice cream sandwich',
                'type': 'Ice cream',
                'calories': 237.0,
                'fat': 9.0,
                'carbs': 37.0,
                'protein': 4.3,
            }, {
                'name': 'Eclair',
                'type': 'Pastry',
                'calories': 262.0,
                'fat': 16.0,
                'carbs': 24.0,
                'protein': 6.0,
            }, {
                'name': 'Cupcake',
                'type': 'Pastry',
                'calories': 305.0,
                'fat': 3.7,
                'carbs': 67.0,
                'protein': 4.3,
            }, {
                'name': 'Jelly bean',
                'type': 'Candy',
                'calories': 375.0,
                'fat': 0.0,
                'carbs': 94.0,
                'protein': 0.0,
            }, {
                'name': 'Lollipop',
                'type': 'Candy',
                'calories': 392.0,
                'fat': 0.2,
                'carbs': 98.0,
                'protein': 0.0,
            }, {
                'name': 'Honeycomb',
                'type': 'Other',
                'calories': 408.0,
                'fat': 3.2,
                'carbs': 87.0,
                'protein': 6.5,
            }, {
                'name': 'Donut',
                'type': 'Pastry',
                'calories': 452.0,
                'fat': 25.0,
                'carbs': 51.0,
                'protein': 4.9,
            }, {
                'name': 'KitKat',
                'type': 'Candy',
                'calories': 518.0,
                'fat': 26.0,
                'carbs': 65.0,
                'protein': 7.0,
            }, {
                'name': 'Chocolate',
                'type': 'Candy',
                'calories': 518.0,
                'fat': 26.0,
                'carbs': 65.0,
                'protein': 7.0,
            }, {
                'name': 'Chamoy',
                'type': 'Candy',
                'calories': 518.0,
                'fat': 26.0,
                'carbs': 65.0,
                'protein': 7.0,
            },
        ];
        this._iconRegistry.addSvgIconInNamespace('assets', 'covalent', this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));
        Object.assign(this, { pie: _data__WEBPACK_IMPORTED_MODULE_5__["pie"], single: _data__WEBPACK_IMPORTED_MODULE_5__["single"], multi: _data__WEBPACK_IMPORTED_MODULE_5__["multi"], times: _data__WEBPACK_IMPORTED_MODULE_5__["times"] });
    }
    Object.defineProperty(DefaultDashboardComponent.prototype, "activeTheme", {
        // Theme toggle
        get: function () {
            return localStorage.getItem('theme');
        },
        enumerable: true,
        configurable: true
    });
    DefaultDashboardComponent.prototype.theme = function (theme) {
        localStorage.setItem('theme', theme);
    };
    DefaultDashboardComponent.prototype.ngAfterViewInit = function () {
        // broadcast to all listener observables when loading the page
        this.media.broadcast();
        this._changeDetectorRef.detectChanges();
    };
    DefaultDashboardComponent.prototype.toggleMiniNav = function () {
        var _this = this;
        this.miniNav = !this.miniNav;
        setTimeout(function () {
            _this.manageList.sidenav._animationStarted.emit();
        });
    };
    DefaultDashboardComponent.prototype.openTemplate = function () {
        this.dialog.open(this.template, this.config);
    };
    // NGX Charts Axis
    DefaultDashboardComponent.prototype.axisDigits = function (val) {
        return new _covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdDigitsPipe"]().transform(val);
    };
    DefaultDashboardComponent.prototype.axisDate = function (val) {
        return new _angular_common__WEBPACK_IMPORTED_MODULE_4__["DatePipe"]('en').transform(val, 'hh a');
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('manageList'),
        __metadata("design:type", _covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdLayoutManageListComponent"])
    ], DefaultDashboardComponent.prototype, "manageList", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('dialogContent'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"])
    ], DefaultDashboardComponent.prototype, "template", void 0);
    DefaultDashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-root-app',
            template: __webpack_require__(/*! ./default-dashboard.component.html */ "./src/app/layout/default-dashboard/default-dashboard.component.html"),
            styles: [__webpack_require__(/*! ./default-dashboard.component.css */ "./src/app/layout/default-dashboard/default-dashboard.component.css")],
            animations: [
                Object(_covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdRotateAnimation"])(),
            ],
        }),
        __metadata("design:paramtypes", [_covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdMediaService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatIconRegistry"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"]])
    ], DefaultDashboardComponent);
    return DefaultDashboardComponent;
}());



/***/ }),

/***/ "./src/app/layout/default-dialog/default-dialog.component.css":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-dialog/default-dialog.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* .box {\r\n  position: relative;\r\n  top: 0;\r\n  opacity: 1;\r\n  float: left;\r\n  padding: 60px 50px 40px 50px;\r\n  width: 100%;\r\n  background: #fff;\r\n  border-radius: 10px;\r\n  transform: scale(1);\r\n  -webkit-transform: scale(1);\r\n  -ms-transform: scale(1);\r\n  z-index: 5;\r\n}\r\n\r\n.box.back {\r\n  transform: scale(.95);\r\n  -webkit-transform: scale(.95);\r\n  -ms-transform: scale(.95);\r\n  top: -20px;\r\n  opacity: .8;\r\n  z-index: -1;\r\n}\r\n\r\n.box:before {\r\n  content: \"\";\r\n  width: 100%;\r\n  height: 30px;\r\n  border-radius: 10px;\r\n  position: absolute;\r\n  top: -10px;\r\n  background: rgba(255, 255, 255, .6);\r\n  left: 0;\r\n  transform: scale(.95);\r\n  -webkit-transform: scale(.95);\r\n  -ms-transform: scale(.95);\r\n  z-index: -1;\r\n}\r\n\r\n.overbox .title {\r\n  color: #fff;\r\n}\r\n\r\n.overbox .title:before {\r\n  background: #fff;\r\n}\r\n\r\n.title {\r\n  width: 100%;\r\n  float: left;\r\n  line-height: 46px;\r\n  font-size: 34px;\r\n  font-weight: 700;\r\n  letter-spacing: 2px;\r\n  color: #ED2553;\r\n  position: relative;\r\n}\r\n\r\n.title:before {\r\n  content: \"\";\r\n  width: 5px;\r\n  height: 100%;\r\n  position: absolute;\r\n  top: 0;\r\n  left: -50px;\r\n  background: #ED2553;\r\n}\r\n\r\n.input,\r\n.input label,\r\n.input input,\r\n.input .spin,\r\n.button,\r\n.button button .button.login button i.fa,\r\n.material-button .shape:before,\r\n.material-button .shape:after,\r\n.button.login button {\r\n  transition: 300ms cubic-bezier(.4, 0, .2, 1);\r\n  -webkit-transition: 300ms cubic-bezier(.4, 0, .2, 1);\r\n  -ms-transition: 300ms cubic-bezier(.4, 0, .2, 1);\r\n}\r\n\r\n.material-button,\r\n.alt-2,\r\n.material-button .shape,\r\n.alt-2 .shape,\r\n.box {\r\n  transition: 400ms cubic-bezier(.4, 0, .2, 1);\r\n  -webkit-transition: 400ms cubic-bezier(.4, 0, .2, 1);\r\n  -ms-transition: 400ms cubic-bezier(.4, 0, .2, 1);\r\n}\r\n\r\n.input,\r\n.input label,\r\n.input input,\r\n.input .spin,\r\n.button,\r\n.button button {\r\n  width: 100%;\r\n  float: left;\r\n}\r\n\r\n.input,\r\n.button {\r\n  margin-top: 30px;\r\n  height: 70px;\r\n}\r\n\r\n.input,\r\n.input input,\r\n.button,\r\n.button button {\r\n  position: relative;\r\n}\r\n\r\n.input input {\r\n  height: 60px;\r\n  top: 10px;\r\n  border: none;\r\n  background: transparent;\r\n}\r\n\r\n.input input,\r\n.input label,\r\n.button button {\r\n  font-family: 'Roboto', sans-serif;\r\n  font-size: 24px;\r\n  color: rgba(0, 0, 0, 0.8);\r\n  font-weight: 300;\r\n}\r\n\r\n.input:before,\r\n.input .spin {\r\n  width: 100%;\r\n  height: 1px;\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 0;\r\n}\r\n\r\n.input:before {\r\n  content: \"\";\r\n  background: rgba(0, 0, 0, 0.1);\r\n  z-index: 3;\r\n}\r\n\r\n.input .spin {\r\n  background: #ED2553;\r\n  z-index: 4;\r\n  width: 0;\r\n}\r\n\r\n.overbox .input .spin {\r\n  background: rgba(255, 255, 255, 1);\r\n}\r\n\r\n.overbox .input:before {\r\n  background: rgba(255, 255, 255, 0.5);\r\n}\r\n\r\n.input label {\r\n  position: absolute;\r\n  top: 10px;\r\n  left: 0;\r\n  z-index: 2;\r\n  cursor: pointer;\r\n  line-height: 60px;\r\n}\r\n\r\n.button.login {\r\n  width: 60%;\r\n  left: 20%;\r\n}\r\n\r\n.button.login button,\r\n.button button {\r\n  width: 100%;\r\n  line-height: 64px;\r\n  left: 0%;\r\n  background-color: transparent;\r\n  border: 3px solid rgba(0, 0, 0, 0.1);\r\n  font-weight: 900;\r\n  font-size: 18px;\r\n  color: rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.button.login {\r\n  margin-top: 30px;\r\n}\r\n\r\n.button {\r\n  margin-top: 20px;\r\n}\r\n\r\n.button button {\r\n  background-color: #fff;\r\n  color: #ED2553;\r\n  border: none;\r\n}\r\n\r\n.button.login button.active {\r\n  border: 3px solid transparent;\r\n  color: #fff !important;\r\n}\r\n\r\n.button.login button.active span {\r\n  opacity: 0;\r\n  transform: scale(0);\r\n  -webkit-transform: scale(0);\r\n  -ms-transform: scale(0);\r\n}\r\n\r\n.button.login button.active i.fa {\r\n  opacity: 1;\r\n  transform: scale(1) rotate(-0deg);\r\n  -webkit-transform: scale(1) rotate(-0deg);\r\n  -ms-transform: scale(1) rotate(-0deg);\r\n}\r\n\r\n.button.login button i.fa {\r\n  width: 100%;\r\n  height: 100%;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  line-height: 60px;\r\n  transform: scale(0) rotate(-45deg);\r\n  -webkit-transform: scale(0) rotate(-45deg);\r\n  -ms-transform: scale(0) rotate(-45deg);\r\n}\r\n\r\n.button.login button:hover {\r\n  color: #ED2553;\r\n  border-color: #ED2553;\r\n}\r\n\r\n.button {\r\n  margin: 40px 0;\r\n  overflow: hidden;\r\n  z-index: 2;\r\n}\r\n\r\n.button button {\r\n  cursor: pointer;\r\n  position: relative;\r\n  z-index: 2;\r\n}\r\n\r\n.pass-forgot {\r\n  width: 100%;\r\n  float: left;\r\n  text-align: center;\r\n  color: rgba(0, 0, 0, 0.4);\r\n  font-size: 18px;\r\n}\r\n\r\n.click-efect {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  background: #ED2553;\r\n  border-radius: 50%;\r\n}\r\n\r\n.overbox {\r\n  width: 100%;\r\n  height: 100%;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  overflow: inherit;\r\n  border-radius: 10px;\r\n  padding: 60px 50px 40px 50px;\r\n}\r\n\r\n.overbox .title,\r\n.overbox .button,\r\n.overbox .input {\r\n  z-index: 111;\r\n  position: relative;\r\n  color: #fff !important;\r\n  display: none;\r\n}\r\n\r\n.overbox .title {\r\n  width: 80%;\r\n}\r\n\r\n.overbox .input {\r\n  margin-top: 20px;\r\n}\r\n\r\n.overbox .input input,\r\n.overbox .input label {\r\n  color: #fff;\r\n}\r\n\r\n.overbox .material-button,\r\n.overbox .material-button .shape,\r\n.overbox .alt-2,\r\n.overbox .alt-2 .shape {\r\n  display: block;\r\n}\r\n\r\n.material-button,\r\n.alt-2 {\r\n  width: 140px;\r\n  height: 140px;\r\n  border-radius: 50%;\r\n  background: #ED2553;\r\n  position: absolute;\r\n  top: 40px;\r\n  right: -70px;\r\n  cursor: pointer;\r\n  z-index: 100;\r\n  transform: translate(0%, 0%);\r\n  -webkit-transform: translate(0%, 0%);\r\n  -ms-transform: translate(0%, 0%);\r\n}\r\n\r\n.material-button .shape,\r\n.alt-2 .shape {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.material-button .shape:before,\r\n.alt-2 .shape:before,\r\n.material-button .shape:after,\r\n.alt-2 .shape:after {\r\n  content: \"\";\r\n  background: #fff;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%) rotate(360deg);\r\n  -webkit-transform: translate(-50%, -50%) rotate(360deg);\r\n  -ms-transform: translate(-50%, -50%) rotate(360deg);\r\n}\r\n\r\n.material-button .shape:before,\r\n.alt-2 .shape:before {\r\n  width: 25px;\r\n  height: 4px;\r\n}\r\n\r\n.material-button .shape:after,\r\n.alt-2 .shape:after {\r\n  height: 25px;\r\n  width: 4px;\r\n}\r\n\r\n.material-button.active,\r\n.alt-2.active {\r\n  top: 50%;\r\n  right: 50%;\r\n  transform: translate(50%, -50%) rotate(0deg);\r\n  -webkit-transform: translate(50%, -50%) rotate(0deg);\r\n  -ms-transform: translate(50%, -50%) rotate(0deg);\r\n}\r\n\r\nbody {\r\n  background-image: url(https://lh4.googleusercontent.com/-XplyTa1Za-I/VMSgIyAYkHI/AAAAAAAADxM/oL-rD6VP4ts/w1184-h666/Android-Lollipop-wallpapers-Google-Now-Wallpaper-2.png);\r\n  background-position: center;\r\n  background-size: cover;\r\n  background-repeat: no-repeat;\r\n  min-height: 100vh;\r\n  font-family: 'Roboto', sans-serif;\r\n}\r\n\r\nbody,\r\nhtml {\r\n  overflow: hidden;\r\n}\r\n\r\n.materialContainer {\r\n  width: 100%;\r\n  max-width: 460px;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n  -webkit-transform: translate(-50%, -50%);\r\n  -ms-transform: translate(-50%, -50%);\r\n}\r\n\r\n*,\r\n*:after,\r\n*::before {\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n  text-decoration: none;\r\n  list-style-type: none;\r\n  outline: none;\r\n} */\r\n"

/***/ }),

/***/ "./src/app/layout/default-dialog/default-dialog.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/layout/default-dialog/default-dialog.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-dialog-content [formGroup]='loginForm'>\r\n  <mat-toolbar style=\"width: 100%\">\r\n    <span flex></span>\r\n    <button mat-button class=\"mat-icon-button\">\r\n      <i class=\"material-icons\">highlight_off</i>\r\n    </button>\r\n    <h2>Modal LogIn Form</h2>\r\n  </mat-toolbar>\r\n  <mat-form-field>\r\n    <label>User Name</label>\r\n    <input matInput type=\"text\" formControlName=\"username\">\r\n    <mat-error ngxErrors=\"username\">\r\n      <div ngxError=\"required\" when=\"touched\">\r\n        Username is required\r\n      </div>\r\n    </mat-error>\r\n  </mat-form-field>\r\n  <br>\r\n  <mat-form-field>\r\n    <label>User Password</label>\r\n    <input matInput type=\"password\" formControlName=\"password\">\r\n    <mat-error ngxErrors=\"password\">\r\n      <div ngxError=\"required\" when=\"touched\">\r\n        password is required\r\n      </div>\r\n    </mat-error>\r\n  </mat-form-field>\r\n  <br>\r\n  <button mat-button>\r\n    LogIn\r\n  </button>\r\n  <button mat-button>\r\n    Cancel\r\n  </button>\r\n</mat-dialog-content>\r\n"

/***/ }),

/***/ "./src/app/layout/default-dialog/default-dialog.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/layout/default-dialog/default-dialog.component.ts ***!
  \*******************************************************************/
/*! exports provided: DialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogComponent", function() { return DialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DialogComponent = /** @class */ (function () {
    function DialogComponent(dialogRef, router, data) {
        this.dialogRef = dialogRef;
        this.router = router;
        this.data = data;
        this.loginForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({
            'username': new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required),
            'password': new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required)
        });
        this.showSpinner = true;
    }
    DialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DialogComponent.prototype.ngOnInit = function () {
    };
    DialogComponent.prototype.login = function () {
        if (this.username === 'admin' && this.password === 'admin') {
            this.showSpinner = false;
            // this.router.navigate(['user']);
        }
        else {
            alert('Invalid credentials');
        }
    };
    DialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-default-dialog',
            template: __webpack_require__(/*! ./default-dialog.component.html */ "./src/app/layout/default-dialog/default-dialog.component.html"),
            styles: [__webpack_require__(/*! ./default-dialog.component.css */ "./src/app/layout/default-dialog/default-dialog.component.css")]
        }),
        __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], Object])
    ], DialogComponent);
    return DialogComponent;
}());



/***/ }),

/***/ "./src/app/layout/default-footer/default-footer.component.css":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-footer/default-footer.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/layout/default-footer/default-footer.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/layout/default-footer/default-footer.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n<div class=\"footer\">\n      <div class=\"row\">\n        <div class=\"col-sm-12 links\">\n          <a href=\"https://www.github.com/tomastrajan\" target=\"_blank\">\n            <i class=\"fa fa-github fa-2x\" aria-hidden=\"true\"></i>\n            <span>Github</span>\n          </a>\n          <a href=\"https://www.medium.com/@tomastrajan\" target=\"_blank\">\n            <i class=\"fa fa-medium fa-2x\" aria-hidden=\"true\"></i>\n            <span>Medium</span>\n          </a>\n          <a href=\"https://www.twitter.com/tomastrajan\" target=\"_blank\">\n            <i class=\"fa fa-twitter fa-2x\" aria-hidden=\"true\"></i>\n            <span>Twitter</span>\n          </a>\n          <a href=\"https://www.youtube.com/channel/UC7XgRHIVoqnh3U5Vmly9ofQ\"\n             target=\"_blank\">\n            <i class=\"fa fa-youtube fa-2x\" aria-hidden=\"true\"></i>\n            <span>Youtube</span>\n          </a>\n          <a href=\"https://www.instagram.com/tomastrajan\" target=\"_blank\">\n            <i class=\"fa fa-instagram fa-2x\" aria-hidden=\"true\"></i>\n            <span>Instagram</span>\n          </a>\n          <a href=\"https://www.slides.com/tomastrajan\" target=\"_blank\">\n            <i class=\"fa fa-desktop fa-2x\" aria-hidden=\"true\"></i>\n            <span>Slides</span>\n          </a>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 signature\">\n          &#169; <span class=\"year\">{{year}}</span> - Tomas Trajan\n          <br class=\"d-block d-sm-none\">\n          <a matTooltip=\"Show changelog\"\n             matTooltipPosition=\"before\"\n             href=\"https://github.com/tomastrajan/angular-ngrx-material-starter/blob/master/CHANGELOG.md\">\n            <i class=\"fa fa-rocket\"></i> {{version}} <span *ngIf=\"!isProd\">[{{envName}}]</span>\n          </a>\n        </div>\n      </div>\n    </div>\n\n  </div>\n"

/***/ }),

/***/ "./src/app/layout/default-footer/default-footer.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/layout/default-footer/default-footer.component.ts ***!
  \*******************************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FooterComponent = /** @class */ (function () {
    // logo = require('../assets/logo.png');
    function FooterComponent() {
        this.isProd = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production;
        this.envName = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].envName;
        this.version = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].versions.app;
        this.year = new Date().getFullYear();
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-default-footer',
            template: __webpack_require__(/*! ./default-footer.component.html */ "./src/app/layout/default-footer/default-footer.component.html"),
            styles: [__webpack_require__(/*! ./default-footer.component.css */ "./src/app/layout/default-footer/default-footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/layout/default-layout/default-layout.component.css":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-layout/default-layout.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/layout/default-layout/default-layout.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/layout/default-layout/default-layout.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<td-layout>\n  <td-navigation-drawer flex [sidenavTitle]=\"name\" logo=\"assets:covalent\" name=\"Firstname Lastname\" email=\"firstname.lastname@company.com\">\n    <mat-nav-list>\n      <a *ngFor=\"let item of routes\" mat-list-item><mat-icon>{{item.icon}}</mat-icon>{{item.title}}</a>\n    </mat-nav-list>\n    <div td-navigation-drawer-menu>\n      <mat-nav-list>\n        <a *ngFor=\"let item of usermenu\" mat-list-item><mat-icon>{{item.icon}}</mat-icon>{{item.title}}</a>\n      </mat-nav-list>\n    </div>\n  </td-navigation-drawer>\n  <td-layout-nav color=\"none\" logo=\"assets:covalent\"  navigationRoute=\"/\">\n    <button mat-icon-button td-menu-button tdLayoutToggle>\n      <mat-icon>menu</mat-icon>\n    </button>\n    <div td-toolbar-content layout=\"row\" layout-align=\"start center\" flex>\n      <span hide-gt-xs class=\"tc-blue-500 mat-subhead\">Landing</span>\n      <span hide-xs class=\"tc-blue-500 mat-subhead\">Landing Page</span>\n      <span flex ></span>\n      <button mat-icon-button [matMenuTriggerFor]=\"notificationsMenu\">\n        <td-notification-count color=\"accent\" [notifications]=\"12\">\n          <mat-icon>notifications</mat-icon>\n        </td-notification-count>\n      </button>\n      <mat-menu #notificationsMenu=\"matMenu\">\n        <td-menu>\n          <div td-menu-header class=\"mat-subhead\">Job Openings</div>\n          <mat-nav-list dense>\n            <a mat-list-item>\n              <mat-icon mat-list-avatar>fiber_new</mat-icon>\n              <h4 matLine><span class=\"text-wrap\">Sr. Frontend Engineer</span></h4>\n              <p matLine>UX team</p>\n            </a>\n            <mat-divider></mat-divider>\n            <a mat-list-item>\n              <mat-icon mat-list-avatar>fiber_new</mat-icon>\n              <h4 matLine><span class=\"text-wrap\">Sr. Data Scientist</span></h4>\n              <p matLine>Data science team</p>\n            </a>\n            <mat-divider></mat-divider>\n            <a mat-list-item>\n              <mat-icon mat-list-avatar>fiber_new</mat-icon>\n              <h4 matLine><span class=\"text-wrap\">Sr. DevOps Engineer</span></h4>\n              <p matLine>DevOps team</p>\n            </a>\n          </mat-nav-list>\n          <a mat-button color=\"accent\" td-menu-footer>\n            View Jobs\n          </a>\n        </td-menu>\n      </mat-menu>\n    </div>\n    <mat-toolbar class=\"pad-none\">\n      <nav  mat-stretch-tabs mat-tab-nav-bar class=\"pull-bottom-xl pull-top-md text-upper\" flex>\n        <a mat-tab-link [active]=\"true\">\n          <span hide-xs>Home</span>\n          <span hide-gt-xs><mat-icon>home</mat-icon></span>\n        </a>\n        <a mat-tab-link >\n          <span hide-xs>Technology</span>\n          <span hide-gt-xs><mat-icon>laptop_mac</mat-icon></span>\n        </a>\n        <a mat-tab-link>\n          <span hide-xs>Locations</span>\n          <span hide-gt-xs><mat-icon>language</mat-icon></span>\n        </a>\n        <a mat-tab-link>\n          <span hide-xs>Job Openings</span>\n          <span hide-gt-xs><mat-icon>assignment</mat-icon></span>\n        </a>\n        <a mat-tab-link>\n          <span hide-xs>Leadership</span>\n          <span hide-gt-xs><mat-icon>people</mat-icon></span>\n        </a>\n      </nav>\n    </mat-toolbar>\n    <!-- router outlet goes here -->\n    <section class=\"bgc-blue-grey-50\">\n      <div layout-gt-xs=\"row\">\n        <div flex class=\"pad\" tdMediaToggle=\"gt-xs\" [mediaClasses]=\"['pad-xl']\">\n          <div class=\"push-top-xl\" hide-xs></div>\n          <div tdMediaToggle=\"gt-sm\" [mediaClasses]=\"['push-lg']\">\n            <h1 class=\"mat-display-1 tc-blue-A400 push-top-xs push-bottom-sm\">Main Site Slogan</h1>\n            <h2 class=\"mat-headline tc-grey-800 push-top-xs push-bottom-sm\">Supporting Secondary Text</h2>\n            <p class=\"mat-subhead tc-grey-600\">Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>\n            <button mat-raised-button color=\"accent\" class=\"push-bottom text-upper\">Call to Action</button>\n          </div>\n          <div class=\"push-bottom-xl\" hide-xs></div>\n        </div>\n        <div flex=\"40\" layout=\"row\" layout-align=\"center center\">\n          <mat-icon class=\"push\" style=\"height:auto;width:auto;\" svgIcon=\"assets:covalent-mark\"></mat-icon>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"bgc-blue-A700 tc-white\"  tdMediaToggle=\"gt-xs\" [mediaClasses]=\"['pad-top-md', 'pad-bottom-xl']\">\n      <h2 class=\"mat-display-1 text-upper text-center push-bottom\">Work with bleeding edge technology</h2>\n      <div layout=\"row\" layout-align-gt-xs=\"center center\">\n        <div flex-gt-xs=\"80\" layout=\"row\" layout-wrap>\n          <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3]\">\n            <div class=\"text-center\" flex-xs=\"50\" flex-gt-xs=\"25\">\n              <mat-icon class=\"push\" style=\"height:auto;width:auto;\" svgIcon=\"assets:covalent-mark\"></mat-icon>\n            </div>\n          </ng-template>\n        </div>\n      </div>\n      <div class=\"text-center push-top\">\n          <button mat-raised-button color=\"accent\" class=\"mat-button-lg text-upper\">View Technology</button>\n      </div>\n    </section>\n    <section class=\"bgc-blue-grey-100\" tdMediaToggle=\"gt-xs\" [mediaClasses]=\"['pad-top-xl', 'pad-bottom-xl']\">\n      <h2 class=\"mat-display-1 text-upper text-center push-bottom\">Current Team Openings</h2>\n      <div  layout-gt-xs=\"row\" layout-align-gt-xs=\"center center\">\n        <div layout-gt-xs=\"row\" flex-gt-xs=\"90\" layout-margin>\n          <div flex-gt-xs=\"25\">\n            <mat-card>\n              <mat-toolbar color=\"accent\" class=\"bgc-blue-A400 push-bottom\">\n                <span class=\"text-upper\">Frontend</span>\n              </mat-toolbar>\n              <mat-card-subtitle>Openings</mat-card-subtitle>\n              <mat-divider></mat-divider>\n              <mat-list>\n                <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4]\">\n                  <mat-list-item>\n                      <mat-icon mat-list-icon class=\"fill-grey-700\">description</mat-icon>\n                      <h4 matLine>Frontend Engineer</h4>\n                  </mat-list-item>\n                  <mat-divider mat-inset *ngIf=\"!last\"></mat-divider>\n                </ng-template>\n              </mat-list>\n              <mat-divider></mat-divider>\n              <mat-card-actions>\n                <a mat-button color=\"accent\" class=\"text-upper\">View All</a>\n              </mat-card-actions>\n            </mat-card>\n          </div>\n\n          <div flex-gt-xs=\"25\">\n            <mat-card>\n              <mat-toolbar color=\"accent\" class=\"bgc-light-blue-A400 push-bottom\">\n                <span class=\"text-upper\">Backend</span>\n              </mat-toolbar>\n              <mat-card-subtitle>Openings</mat-card-subtitle>\n              <mat-divider></mat-divider>\n              <mat-list>\n                <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4]\">\n                  <mat-list-item>\n                      <mat-icon mat-list-icon class=\"fill-grey-700\">description</mat-icon>\n                      <h4 matLine>Backend Engineer</h4>\n                  </mat-list-item>\n                  <mat-divider mat-inset *ngIf=\"!last\"></mat-divider>\n                </ng-template>\n              </mat-list>\n              <mat-divider></mat-divider>\n              <mat-card-actions>\n                <a mat-button color=\"accent\" class=\"text-upper\">View All</a>\n              </mat-card-actions>\n            </mat-card>\n          </div>\n\n          <div flex-gt-xs=\"25\">\n            <mat-card>\n              <mat-toolbar color=\"accent\" class=\"bgc-cyan-A700 push-bottom\">\n                <span class=\"text-upper\">DevOps</span>\n              </mat-toolbar>\n              <mat-card-subtitle>Openings</mat-card-subtitle>\n              <mat-divider></mat-divider>\n              <mat-list>\n                <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4]\">\n                  <mat-list-item>\n                      <mat-icon mat-list-icon class=\"fill-grey-700\">description</mat-icon>\n                      <h4 matLine>DevOps Engineer</h4>\n                  </mat-list-item>\n                  <mat-divider mat-inset *ngIf=\"!last\"></mat-divider>\n                </ng-template>\n              </mat-list>\n              <mat-divider></mat-divider>\n              <mat-card-actions>\n                <a mat-button color=\"accent\" class=\"text-upper\">View All</a>\n              </mat-card-actions>\n            </mat-card>\n          </div>\n          <div flex-gt-xs=\"25\">\n            <mat-card>\n              <mat-toolbar color=\"accent\" class=\"bgc-teal-A700 push-bottom\">\n                <span class=\"text-upper\">Quality</span>\n              </mat-toolbar>\n              <mat-card-subtitle>Openings</mat-card-subtitle>\n              <mat-divider></mat-divider>\n              <mat-list>\n                <ng-template let-item let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4]\">\n                  <mat-list-item>\n                      <mat-icon mat-list-icon class=\"fill-grey-700\">description</mat-icon>\n                      <h4 matLine>Quality Engineer</h4>\n                  </mat-list-item>\n                  <mat-divider mat-inset *ngIf=\"!last\"></mat-divider>\n                </ng-template>\n              </mat-list>\n              <mat-divider></mat-divider>\n              <mat-card-actions>\n                <a mat-button color=\"accent\" class=\"text-upper\">View All</a>\n              </mat-card-actions>\n            </mat-card>\n          </div>\n        </div>\n      </div>\n      <div class=\"text-center push-top\">\n          <button mat-raised-button color=\"accent\" class=\"mat-button-lg text-upper\">View All Openings</button>\n      </div>\n    </section>\n    <section class=\"bgc-green-A700\">\n      <div layout-gt-xs=\"row\">\n        <div flex=\"40\" layout=\"row\" layout-align=\"center center\">\n          <mat-icon class=\"push\" style=\"height:auto;width:auto;\" svgIcon=\"assets:covalent-mark\"></mat-icon>\n        </div>\n        <div flex class=\"pad\" tdMediaToggle=\"gt-xs\" [mediaClasses]=\"['pad-xxl']\">\n          <div class=\"push-top-xxl\" hide-xs></div>\n          <h3 class=\"mat-display-1 tc-white push-top-xs push-bottom-sm\">The most desirable locations</h3>\n          <p class=\"mat-title tc-blue-50\">Austin, Boston, San Diego and The Bay Area!</p>\n          <button color=\"accent\" mat-raised-button class=\"push-bottom-md text-upper\">View More</button>\n          <div class=\"push-top-xxl\" hide-xs></div>\n        </div>\n      </div>\n    </section>\n    <!-- end content -->\n    <section class=\"bgc-blue-grey-800 tc-blue-grey-100\">\n      <div layout-gt-xs=\"row\" layout-align-gt-xs=\"center center\">\n        <div layout-gt-xs=\"row\" flex-gt-xs=\"80\" layout-margin layout-padding>\n          <div flex-gt-xs>\n            <mat-nav-list>\n              <h3 mat-subheader class=\"text-upper tc-blue-grey-100\">About Teradata</h3>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">Company Info</p>\n              </mat-list-item>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">Our Customers</p>\n              </mat-list-item>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">Press</p>\n              </mat-list-item>\n            </mat-nav-list>\n          </div>\n          <div flex-gt-xs>\n            <mat-nav-list>\n              <h3 mat-subheader class=\"text-upper tc-blue-grey-100\">Career Info</h3>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">Benefits</p>\n              </mat-list-item>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">Locations</p>\n              </mat-list-item>\n              <mat-list-item>\n                <p matLine class=\"tc-blue-grey-300\">List item</p>\n              </mat-list-item>\n            </mat-nav-list>\n          </div>\n          <div flex-gt-xs=\"10\">\n          </div>\n          <div flex layout=\"column\" flex-gt-xs=\"30\">\n            <mat-icon class=\"push-top-md\" svgIcon=\"assets:covalent\" style=\"height:auto;width:auto;\"></mat-icon>\n            <p class=\"mat-body-1\">&copy; Copyright 2017 Teradata, Inc. All rights reserved.</p>\n          </div>\n        </div>\n      </div>\n    </section>\n  <a mat-fab color=\"accent\" matTooltip=\"Contact Us\" matTooltipPosition=\"above\" class=\"mat-fab-position-bottom-right fixed\">\n    <mat-icon>send</mat-icon>\n  </a>\n    <td-layout-footer>\n      <div layout=\"row\" layout-align=\"start center\">\n        <span class=\"mat-caption\">Made with <mat-icon class=\"text-md\">favorite</mat-icon> using <a href=\"http://getcovalent.com\" class=\"text-nodecoration tc-blue-700\">Covalent</a>, built on Angular v4 + Angular Material.</span>\n      </div>\n    </td-layout-footer>\n  </td-layout-nav>\n</td-layout>\n"

/***/ }),

/***/ "./src/app/layout/default-layout/default-layout.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/layout/default-layout/default-layout.component.ts ***!
  \*******************************************************************/
/*! exports provided: LayoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutComponent", function() { return LayoutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LayoutComponent = /** @class */ (function () {
    function LayoutComponent(media, _iconRegistry, _domSanitizer) {
        this.media = media;
        this._iconRegistry = _iconRegistry;
        this._domSanitizer = _domSanitizer;
        this.name = 'Landing Page';
        this.routes = [{
                icon: 'home',
                route: '.',
                title: 'Home',
            }, {
                icon: 'library_books',
                route: '.',
                title: 'Documentation',
            }, {
                icon: 'color_lens',
                route: '.',
                title: 'Style Guide',
            }, {
                icon: 'view_quilt',
                route: '.',
                title: 'Layouts',
            }, {
                icon: 'picture_in_picture',
                route: '.',
                title: 'Components & Addons',
            },
        ];
        this.usermenu = [{
                icon: 'swap_horiz',
                route: '.',
                title: 'Switch account',
            }, {
                icon: 'tune',
                route: '.',
                title: 'Account settings',
            }, {
                icon: 'exit_to_app',
                route: '.',
                title: 'Sign out',
            },
        ];
        this.navmenu = [{
                icon: 'looks_one',
                route: '.',
                title: 'First item',
                description: 'Item description',
            }, {
                icon: 'looks_two',
                route: '.',
                title: 'Second item',
                description: 'Item description',
            }, {
                icon: 'looks_3',
                route: '.',
                title: 'Third item',
                description: 'Item description',
            }, {
                icon: 'looks_4',
                route: '.',
                title: 'Fourth item',
                description: 'Item description',
            }, {
                icon: 'looks_5',
                route: '.',
                title: 'Fifth item',
                description: 'Item description',
            },
        ];
        this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux', this._domSanitizer
            .bypassSecurityTrustResourceUrl('../../../assets/teradata-ux.svg'));
        this._iconRegistry
            .addSvgIconInNamespace('assets', 'covalent', this._domSanitizer
            .bypassSecurityTrustResourceUrl('../../../assets/covalent.svg'));
        this._iconRegistry
            .addSvgIconInNamespace('assets', 'covalent-mark', this._domSanitizer
            .bypassSecurityTrustResourceUrl('../../../assets/covalent-mark.svg'));
    }
    LayoutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-root-app',
            template: __webpack_require__(/*! ./default-layout.component.html */ "./src/app/layout/default-layout/default-layout.component.html"),
            styles: [__webpack_require__(/*! ./default-layout.component.css */ "./src/app/layout/default-layout/default-layout.component.css")]
        }),
        __metadata("design:paramtypes", [_covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdMediaService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatIconRegistry"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"]])
    ], LayoutComponent);
    return LayoutComponent;
}());



/***/ }),

/***/ "./src/app/layout/default-login/animated-login.component.html":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-login/animated-login.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<td-dialog-content>\n    <div class=\"form\">\n      <div class=\"form-toggle\"></div>\n      <div [class]=\"_panelOneClass\">\n        <div class=\"form-header\">\n          <h1>Account Login</h1>\n        </div>\n        <div class=\"form-content\">\n          <form [formGroup]=\"loginForm\">\n            <div class=\"form-group\">\n              <label for=\"username\">Username</label>\n              <input type=\"text\" id=\"username\" name=\"username\" formControlName=\"username\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"password\">Password</label>\n              <input type=\"password\" id=\"password\" name=\"password\" formControlName=\"password\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <label class=\"form-remember\">\n                <input type=\"checkbox\"/>Remember Me\n              </label><a class=\"form-recovery\" href=\"#\">Forgot Password?</a>\n            </div>\n            <div class=\"form-group\">\n                <button *ngIf=\"awaitingResult\">\n                  <mat-spinner center></mat-spinner>\n                </button>\n              <button *ngIf=\"!awaitingResult\" type=\"submit\" (click)=\"login()\">Log In</button>\n            </div>\n          </form>\n        </div>\n      </div>\n      <div [class]=\"_panelTwoClass\">\n        <div class=\"form-header\">\n          <h1>Register Account</h1>\n        </div>\n        <div class=\"form-content\">\n          <form>\n            <div class=\"form-group\">\n              <label for=\"username\">Username</label>\n              <input type=\"text\" id=\"register_username\" name=\"register_username\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"password\">Password</label>\n              <input type=\"password\" id=\"register_password\" name=\"register_password\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"cpassword\">Confirm Password</label>\n              <input type=\"password\" id=\"cpassword\" name=\"cpassword\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"email\">Email Address</label>\n              <input type=\"email\" id=\"email\" name=\"email\" required=\"required\"/>\n            </div>\n            <div class=\"form-group\">\n              <button type=\"submit\">Register</button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </td-dialog-content>\n"

/***/ }),

/***/ "./src/app/layout/default-login/animated-login.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-login/animated-login.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".overlay, .form-panel.one:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: none;\n  background: rgba(0, 0, 0, 0.8);\n  width: 100%;\n  height: 100%; }\n\n.form {\n  z-index: 15;\n  position: relative;\n  background: #FFFFFF;\n  width: 600px;\n  border-radius: 4px;\n  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);\n  box-sizing: border-box;\n  margin: auto auto 10px;\n  overflow: hidden; }\n\n.form-toggle {\n  z-index: 25;\n  position: absolute;\n  top: 0px;\n  margin-top: 15px;\n  right: 60px;\n  background: #FFFFFF;\n  width: 60px;\n  height: 60px;\n  border-radius: 100%;\n  -webkit-transform-origin: center;\n  -ms-transform-origin: center;\n      transform-origin: center;\n  -webkit-transform: translate(0, -25%) scale(0);\n  -ms-transform: translate(0, -25%) scale(0);\n      transform: translate(0, -25%) scale(0);\n  opacity: 0;\n  cursor: pointer;\n  transition: all 0.3s ease; }\n\n.form-toggle:before, .form-toggle:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 30px;\n  height: 4px;\n  background: #4285F4;\n  -webkit-transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n      transform: translate(-50%, -50%); }\n\n.form-toggle:before {\n  -webkit-transform: translate(-50%, -50%) rotate(45deg);\n  -ms-transform: translate(-50%, -50%) rotate(45deg);\n      transform: translate(-50%, -50%) rotate(45deg); }\n\n.form-toggle:after {\n  -webkit-transform: translate(-50%, -50%) rotate(-45deg);\n  -ms-transform: translate(-50%, -50%) rotate(-45deg);\n      transform: translate(-50%, -50%) rotate(-45deg); }\n\n.form-toggle.visible {\n  -webkit-transform: translate(0, -25%) scale(1);\n  -ms-transform: translate(0, -25%) scale(1);\n      transform: translate(0, -25%) scale(1);\n  opacity: 1; }\n\n.form-group {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  margin: 0 0 20px; }\n\n.form-group:last-child {\n  margin: 0; }\n\n.form-group label {\n  display: block;\n  margin: 0 0 10px;\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 1;\n  text-transform: uppercase;\n  letter-spacing: .2em; }\n\n.two .form-group label {\n  color: #FFFFFF; }\n\n.form-group input {\n  outline: none;\n  display: block;\n  background: rgba(0, 0, 0, 0.1);\n  width: 100%;\n  border: 0;\n  border-radius: 4px;\n  box-sizing: border-box;\n  padding: 12px 20px;\n  color: rgba(0, 0, 0, 0.6);\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: 500;\n  line-height: inherit;\n  transition: 0.3s ease; }\n\n.form-group input:focus {\n  color: rgba(0, 0, 0, 0.8); }\n\n.two .form-group input {\n  color: #FFFFFF; }\n\n.two .form-group input:focus {\n  color: #FFFFFF; }\n\n.form-group button {\n  outline: none;\n  background: #4285F4;\n  width: 100%;\n  border: 0;\n  border-radius: 4px;\n  padding: 12px 20px;\n  color: #FFFFFF;\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: 500;\n  line-height: inherit;\n  text-transform: uppercase;\n  cursor: pointer; }\n\n.two .form-group button {\n  background: #FFFFFF;\n  color: #4285F4; }\n\n.form-group .form-remember {\n  font-size: 12px;\n  font-weight: 400;\n  letter-spacing: 0;\n  text-transform: none; }\n\n.form-group .form-remember input[type='checkbox'] {\n  display: inline-block;\n  width: auto;\n  margin: 0 10px 0 0; }\n\n.form-group .form-recovery {\n  color: #4285F4;\n  font-size: 12px;\n  text-decoration: none; }\n\n.form-panel {\n  padding: 60px calc(5% + 60px) 60px 60px;\n  box-sizing: border-box; }\n\n.form-panel.one:before {\n  content: '';\n  display: block;\n  opacity: 0;\n  visibility: hidden;\n  transition: 0.3s ease; }\n\n.form-panel.one.hidden:before {\n  display: block;\n  opacity: 1;\n  visibility: visible; }\n\n.form-panel.two {\n  z-index: 5;\n  position: absolute;\n  top: 0;\n  left: 95%;\n  background: #4285F4;\n  width: 100%;\n  min-height: 100%;\n  padding: 60px calc(10% + 60px) 60px 60px;\n  transition: 0.3s ease;\n  cursor: pointer; }\n\n.form-panel.two:before, .form-panel.two:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 60px;\n  left: 1.5%;\n  background: rgba(255, 255, 255, 0.2);\n  height: 30px;\n  width: 2px;\n  transition: 0.3s ease; }\n\n.form-panel.two:after {\n  left: 3%; }\n\n.form-panel.two:hover {\n  left: 93%;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); }\n\n.form-panel.two:hover:before, .form-panel.two:hover:after {\n  opacity: 0; }\n\n.form-panel.two.active {\n  left: 10%;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  cursor: default; }\n\n.form-panel.two.active:before, .form-panel.two.active:after {\n  opacity: 0; }\n\n.form-header {\n  margin: 0 0 40px; }\n\n.form-header h1 {\n  padding: 4px 0;\n  color: #4285F4;\n  font-size: 24px;\n  font-weight: 700;\n  text-transform: uppercase; }\n\n.two .form-header h1 {\n  position: relative;\n  z-index: 40;\n  color: #FFFFFF; }\n\n.pen-footer {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: row;\n      flex-direction: row;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  width: 600px;\n  margin: 20px auto 100px; }\n\n.pen-footer a {\n  color: #FFFFFF;\n  font-size: 12px;\n  text-decoration: none;\n  text-shadow: 1px 2px 0 rgba(0, 0, 0, 0.1); }\n\n.pen-footer a .material-icons {\n  width: 12px;\n  margin: 0 5px;\n  vertical-align: middle;\n  font-size: 12px; }\n\n.cp-fab {\n  background: #FFFFFF !important;\n  color: #4285F4 !important; }\n"

/***/ }),

/***/ "./src/app/layout/default-login/default-login.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/layout/default-login/default-login.component.ts ***!
  \*****************************************************************/
/*! exports provided: DefaultLoginComponent, initJquery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultLoginComponent", function() { return DefaultLoginComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initJquery", function() { return initJquery; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _auth_state_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../auth/state/auth.actions */ "./src/app/auth/state/auth.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DefaultLoginComponent = /** @class */ (function () {
    function DefaultLoginComponent(store$) {
        this.store$ = store$;
        this.containerClass = 'container';
        this._panelOneClass = 'form-panel one';
        this._panelTwoClass = 'form-panel two';
        this.awaitingResult = false;
        this.loginForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].email]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required])
        });
        this.registerForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].email]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]),
            confirmPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required])
        });
        this.toggle$ = false;
    }
    DefaultLoginComponent.prototype.ngAfterViewInit = function () {
        initJquery();
    };
    DefaultLoginComponent.prototype.toggle = function () {
        this.toggle$ = !this.toggle$;
        this.panelOneClass();
        this.panelTwoClass();
    };
    DefaultLoginComponent.prototype.panelOneClass = function () {
        return this._panelOneClass;
    };
    DefaultLoginComponent.prototype.panelTwoClass = function () {
        return this._panelTwoClass;
    };
    DefaultLoginComponent.prototype.formToggle = function () {
    };
    DefaultLoginComponent.prototype.login = function () {
        var creds = this.loginForm.value;
        this.store$.dispatch(new _auth_state_auth_actions__WEBPACK_IMPORTED_MODULE_2__["LoginAction"]({ username: creds.username, password: creds.password }));
        this.awaitingResult = true;
    };
    DefaultLoginComponent.prototype.register = function () {
    };
    DefaultLoginComponent.prototype.active = function () {
        return this.containerClass = this.toggle$ ? 'container active' : 'container';
    };
    DefaultLoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-default-login',
            template: __webpack_require__(/*! ./animated-login.component.html */ "./src/app/layout/default-login/animated-login.component.html"),
            styles: [__webpack_require__(/*! ./animated-login.component.scss */ "./src/app/layout/default-login/animated-login.component.scss")]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], DefaultLoginComponent);
    return DefaultLoginComponent;
}());

function initJquery() {
    $(document).ready(function () {
        var panelOne = $('.form-panel.two').height(), panelTwo = $('.form-panel.two')[0].scrollHeight;
        $('.form-panel.two').not('.form-panel.two.active').on('click', function (e) {
            e.preventDefault();
            $('.form-toggle').addClass('visible');
            $('.form-panel.one').addClass('hidden');
            $('.form-panel.two').addClass('active');
            $('.form').animate({
                'height': panelTwo
            }, 200);
        });
        $('.form-toggle').on('click', function (e) {
            e.preventDefault();
            $('.form-toggle').removeClass('visible');
            $('.form-panel.one').removeClass('hidden');
            $('.form-panel.two').removeClass('active');
            $('.form').animate({
                'height': panelOne
            }, 200);
        });
    });
}


/***/ }),

/***/ "./src/app/layout/default-navbar/default-navbar.component.css":
/*!********************************************************************!*\
  !*** ./src/app/layout/default-navbar/default-navbar.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/layout/default-navbar/default-navbar.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/layout/default-navbar/default-navbar.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container>\n\n  <mat-sidenav #sidenav mode=\"push\">\n    <div class=\"branding\"><img [src]=\"logo\"/> <span>Angular Starter</span></div>\n    <mat-nav-list>\n      <a mat-list-item *ngFor=\"let item of navigationSideMenu\" (click)=\"sidenav.close()\"\n         [routerLink]=\"[item.link]\" routerLinkActive=\"active\">\n        {{item.label}}\n      </a>\n      <a mat-list-item\n         href=\"https://github.com/tomastrajan/angular-ngrx-material-starter\"\n         target=\"_blank\">\n        Github\n      </a>\n    </mat-nav-list>\n  </mat-sidenav>\n\n  <div class=\"wrapper\">\n\n    <div class=\"toolbar\">\n      <mat-toolbar color=\"primary\">\n        <button mat-icon-button class=\"d-md-none\" (click)=\"sidenav.open()\">\n          <mat-icon>menu</mat-icon>\n        </button>\n\n        <span routerLink=\"\" class=\"branding spacer center d-inline d-sm-none\">\n          <img [src]=\"logo\"/></span>\n        <span routerLink=\"\"\n              class=\"branding spacer center d-none d-sm-inline d-md-none\"><img\n          [src]=\"logo\"/> Angular Starter</span>\n        <span routerLink=\"\" class=\"branding spacer d-none d-md-inline\"><img\n          [src]=\"logo\"/> Angular ngRx Material Starter</span>\n\n        <span class=\"d-none d-md-inline\">\n          <button mat-button class=\"nav-button\" *ngFor=\"let item of navigation\"\n              [routerLink]=\"[item.link]\" routerLinkActive=\"active\">\n            {{item.label}}\n          </button>\n        </span>\n\n        <button mat-button class=\"sign-in-button \"\n                *ngIf=\"!isAuthenticated\"\n                (click)=\"onLoginClick()\">\n          Sign in\n        </button>\n\n        <button *ngIf=\"isAuthenticated\"\n                mat-icon-button\n                [matMenuTriggerFor]=\"toolbarUserMenu\">\n          <mat-icon>person</mat-icon>\n        </button>\n        <mat-menu #toolbarUserMenu=\"matMenu\">\n          <button mat-menu-item (click)=\"onLogoutClick()\">\n            <mat-icon>power_settings_new</mat-icon>\n            <span>Logout</span>\n          </button>\n        </mat-menu>\n\n        <button mat-icon-button routerLink=\"settings\" class=\"d-none d-sm-inline\">\n          <mat-icon>settings</mat-icon>\n        </button>\n\n        <a matTooltip=\"Project Github Repository\"\n           matdTooltipPosition=\"before\"\n           mat-icon-button\n           class=\"link d-none d-sm-inline\"\n           href=\"https://github.com/tomastrajan/angular-ngrx-material-starter\"\n           target=\"_blank\">\n          <i class=\"fa fa-github fa-2x\"></i>\n        </a>\n\n      </mat-toolbar>\n    </div>\n    </div>\n</mat-sidenav-container>\n"

/***/ }),

/***/ "./src/app/layout/default-navbar/default-navbar.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/layout/default-navbar/default-navbar.component.ts ***!
  \*******************************************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NavbarComponent = /** @class */ (function () {
    function NavbarComponent() {
        this.isProd = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production;
        this.envName = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].envName;
        this.version = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].versions.app;
        this.year = new Date().getFullYear();
        this.logo = __webpack_require__(/*! ../../../assets/logo.png */ "./src/assets/logo.png");
        this.navigation = [
            { link: 'about', label: 'About' },
            { link: 'features', label: 'Features' },
            { link: 'examples', label: 'Examples' }
        ];
        this.navigationSideMenu = this.navigation.concat([
            { link: 'settings', label: 'Settings' }
        ]);
    }
    NavbarComponent.prototype.ngOnInit = function () {
    };
    NavbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-navbar',
            template: __webpack_require__(/*! ./default-navbar.component.html */ "./src/app/layout/default-navbar/default-navbar.component.html"),
            styles: [__webpack_require__(/*! ./default-navbar.component.css */ "./src/app/layout/default-navbar/default-navbar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/layout/layout.module.ts":
/*!*****************************************!*\
  !*** ./src/app/layout/layout.module.ts ***!
  \*****************************************/
/*! exports provided: LayoutModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutModule", function() { return LayoutModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _default_layout_default_layout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./default-layout/default-layout.component */ "./src/app/layout/default-layout/default-layout.component.ts");
/* harmony import */ var _default_dialog_default_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./default-dialog/default-dialog.component */ "./src/app/layout/default-dialog/default-dialog.component.ts");
/* harmony import */ var _default_navbar_default_navbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./default-navbar/default-navbar.component */ "./src/app/layout/default-navbar/default-navbar.component.ts");
/* harmony import */ var _default_footer_default_footer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./default-footer/default-footer.component */ "./src/app/layout/default-footer/default-footer.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _state_layout_effects__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./state/layout.effects */ "./src/app/layout/state/layout.effects.ts");
/* harmony import */ var _state_layout_reducer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./state/layout.reducer */ "./src/app/layout/state/layout.reducer.ts");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../shared */ "./src/app/shared/index.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/store-devtools */ "./node_modules/@ngrx/store-devtools/@ngrx/store-devtools.es5.js");
/* harmony import */ var _auth_auth_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../auth/auth.module */ "./src/app/auth/auth.module.ts");
/* harmony import */ var _auth_state_auth_reducer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../auth/state/auth.reducer */ "./src/app/auth/state/auth.reducer.ts");
/* harmony import */ var _auth_state_auth_effects__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../auth/state/auth.effects */ "./src/app/auth/state/auth.effects.ts");
/* harmony import */ var _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../auth/firebase-auth.service */ "./src/app/auth/firebase-auth.service.ts");
/* harmony import */ var angularfire2_auth__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! angularfire2/auth */ "./node_modules/angularfire2/auth/index.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
/* harmony import */ var _default_dashboard_default_dashboard_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./default-dashboard/default-dashboard.component */ "./src/app/layout/default-dashboard/default-dashboard.component.ts");
/* harmony import */ var _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @swimlane/ngx-charts */ "./node_modules/@swimlane/ngx-charts/release/index.js");
/* harmony import */ var _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(_swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var _default_login_default_login_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./default-login/default-login.component */ "./src/app/layout/default-login/default-login.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























var LayoutModule = /** @class */ (function () {
    function LayoutModule() {
    }
    LayoutModule_1 = LayoutModule;
    LayoutModule.forRoot = function () {
        return {
            ngModule: LayoutModule_1,
            providers: [
                angularfire2_auth__WEBPACK_IMPORTED_MODULE_18__["AngularFireAuth"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_19__["TdMediaService"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_19__["TdDialogService"],
                _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_17__["FirebaseAuthService"],
                // { provide: AUTH_SERVICE,
                //   useValue: FirebaseAuthService.GetInstance(),
                //   deps: [AngularFireAuth] },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DEFAULT_OPTIONS"],
                    useValue: { hasBackdrop: true } },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DATA"],
                    useValue: {} }
            ]
        };
    };
    LayoutModule = LayoutModule_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _shared__WEBPACK_IMPORTED_MODULE_11__["SharedModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_12__["RouterModule"],
                _auth_auth_module__WEBPACK_IMPORTED_MODULE_14__["AuthModule"],
                _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__["NgxChartsModule"],
                _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__["AreaChartModule"],
                _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__["BarChartModule"],
                _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_21__["ChartCommonModule"],
                _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_13__["StoreDevtoolsModule"].instrument({
                    maxAge: 5
                }),
                _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["StoreModule"].forRoot({
                    layout: _state_layout_reducer__WEBPACK_IMPORTED_MODULE_10__["layoutReducer"],
                    auth: _auth_state_auth_reducer__WEBPACK_IMPORTED_MODULE_15__["authReducer"]
                }),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_8__["EffectsModule"].forRoot([_state_layout_effects__WEBPACK_IMPORTED_MODULE_9__["LayoutEffects"], _auth_state_auth_effects__WEBPACK_IMPORTED_MODULE_16__["AuthEffects"]]),
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatDialogModule"]
            ],
            declarations: [
                _default_layout_default_layout_component__WEBPACK_IMPORTED_MODULE_2__["LayoutComponent"],
                _default_navbar_default_navbar_component__WEBPACK_IMPORTED_MODULE_4__["NavbarComponent"], _default_footer_default_footer_component__WEBPACK_IMPORTED_MODULE_5__["FooterComponent"], _default_dialog_default_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DialogComponent"], _default_dashboard_default_dashboard_component__WEBPACK_IMPORTED_MODULE_20__["DefaultDashboardComponent"], _default_login_default_login_component__WEBPACK_IMPORTED_MODULE_22__["DefaultLoginComponent"]
            ],
            entryComponents: [_default_dialog_default_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DialogComponent"]],
            providers: [
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatSnackBar"],
                _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_17__["FirebaseAuthService"],
                // { provide: AUTH_SERVICE, useValue: FirebaseAuthService.GetInstance(), deps: [AngularFireAuth] },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DEFAULT_OPTIONS"], useValue: { hasBackdrop: true } },
                { provide: _angular_material__WEBPACK_IMPORTED_MODULE_6__["MAT_DIALOG_DATA"], useValue: {} }
            ]
        })
    ], LayoutModule);
    return LayoutModule;
    var LayoutModule_1;
}());



/***/ }),

/***/ "./src/app/layout/state/layout.actions.ts":
/*!************************************************!*\
  !*** ./src/app/layout/state/layout.actions.ts ***!
  \************************************************/
/*! exports provided: LayoutActionTypes, ShowDialogAction, HideDialogAction, ShowDrawerAction, HideDrawerAction, ShowNotificationAction, HideNotificationAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutActionTypes", function() { return LayoutActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowDialogAction", function() { return ShowDialogAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HideDialogAction", function() { return HideDialogAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowDrawerAction", function() { return ShowDrawerAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HideDrawerAction", function() { return HideDrawerAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowNotificationAction", function() { return ShowNotificationAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HideNotificationAction", function() { return HideNotificationAction; });
var LayoutActionTypes;
(function (LayoutActionTypes) {
    LayoutActionTypes["SHOW_DIALOG"] = "[Layout] Show Dialog";
    LayoutActionTypes["HIDE_DIALOG"] = "[Layout] Hide Dialog";
    LayoutActionTypes["SHOW_DRAWER"] = "[Layout] Show Drawer";
    LayoutActionTypes["HIDE_DRAWER"] = "[Layout] Hide Drawer";
    LayoutActionTypes["SHOW_NOTIFICATION"] = "[Layout] Show Notification";
    LayoutActionTypes["HIDE_NOTIFICATION"] = "[Layout] Hide Notification";
})(LayoutActionTypes || (LayoutActionTypes = {}));
var ShowDialogAction = /** @class */ (function () {
    function ShowDialogAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.SHOW_DIALOG;
    }
    return ShowDialogAction;
}());

var HideDialogAction = /** @class */ (function () {
    function HideDialogAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.HIDE_DIALOG;
    }
    return HideDialogAction;
}());

var ShowDrawerAction = /** @class */ (function () {
    function ShowDrawerAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.SHOW_DRAWER;
    }
    return ShowDrawerAction;
}());

var HideDrawerAction = /** @class */ (function () {
    function HideDrawerAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.HIDE_DRAWER;
    }
    return HideDrawerAction;
}());

var ShowNotificationAction = /** @class */ (function () {
    function ShowNotificationAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.SHOW_NOTIFICATION;
    }
    return ShowNotificationAction;
}());

var HideNotificationAction = /** @class */ (function () {
    function HideNotificationAction(payload) {
        this.payload = payload;
        this.type = LayoutActionTypes.HIDE_NOTIFICATION;
    }
    return HideNotificationAction;
}());



/***/ }),

/***/ "./src/app/layout/state/layout.effects.ts":
/*!************************************************!*\
  !*** ./src/app/layout/state/layout.effects.ts ***!
  \************************************************/
/*! exports provided: LayoutEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutEffects", function() { return LayoutEffects; });
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _layout_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./layout.actions */ "./src/app/layout/state/layout.actions.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../auth/firebase-auth.service */ "./src/app/auth/firebase-auth.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _default_login_default_login_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../default-login/default-login.component */ "./src/app/layout/default-login/default-login.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var LayoutEffects = /** @class */ (function () {
    // tap(action => {
    //     this._dialogService.openPrompt({
    //       message: 'This is how simple it is to create a prompt with this wrapper service. Prompt something.',
    //       disableClose: false, // defaults to false
    //       title: 'Prompt', // OPTIONAL, hides if not provided
    //       value: 'Prepopulated value', // OPTIONAL
    //       cancelButton: 'Cancel', // OPTIONAL, defaults to 'CANCEL'
    //       acceptButton: 'Ok', // OPTIONAL, defaults to 'ACCEPT'
    //       width: '400px', // OPTIONAL, defaults to 400px
    //     }).afterClosed().subscribe((newValue: string) => {
    //       if (newValue) {
    //         // DO SOMETHING
    //       } else {
    //         // DO SOMETHING ELSE
    //       }
    //     });
    // })
    function LayoutEffects(store$, actions$, authSrv, _dialogService, router, dialog$) {
        var _this = this;
        this.store$ = store$;
        this.actions$ = actions$;
        this._dialogService = _dialogService;
        this.router = router;
        this.dialog$ = dialog$;
        this.showDialog$ = this.actions$.ofType(_layout_actions__WEBPACK_IMPORTED_MODULE_4__["LayoutActionTypes"].SHOW_DIALOG)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (action) {
            _this.dialogRef$ = _this._dialogService.open(_default_login_default_login_component__WEBPACK_IMPORTED_MODULE_10__["DefaultLoginComponent"], {
                autoFocus: false,
                panelClass: 'transparent-dialog'
            });
            _this.dialogRef$.afterClosed();
        }));
        this.hideDialog$ = this.actions$.ofType(_layout_actions__WEBPACK_IMPORTED_MODULE_4__["LayoutActionTypes"].HIDE_DIALOG)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (action) { return _this.dialogRef$.close(); }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_0__["Effect"])({ dispatch: false }),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_7__["Observable"])
    ], LayoutEffects.prototype, "showDialog$", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_0__["Effect"])({ dispatch: false }),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_7__["Observable"])
    ], LayoutEffects.prototype, "hideDialog$", void 0);
    LayoutEffects = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _ngrx_effects__WEBPACK_IMPORTED_MODULE_0__["Actions"],
            _auth_firebase_auth_service__WEBPACK_IMPORTED_MODULE_6__["FirebaseAuthService"],
            _covalent_core__WEBPACK_IMPORTED_MODULE_8__["TdDialogService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]])
    ], LayoutEffects);
    return LayoutEffects;
}());



/***/ }),

/***/ "./src/app/layout/state/layout.reducer.ts":
/*!************************************************!*\
  !*** ./src/app/layout/state/layout.reducer.ts ***!
  \************************************************/
/*! exports provided: layoutReducer, initialLayoutState, selectorLayout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layoutReducer", function() { return layoutReducer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialLayoutState", function() { return initialLayoutState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectorLayout", function() { return selectorLayout; });
/* harmony import */ var _layout_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout.actions */ "./src/app/layout/state/layout.actions.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

function layoutReducer(state, action) {
    if (state === void 0) { state = initialLayoutState; }
    switch (action.type) {
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].SHOW_DIALOG: {
            return __assign({}, state, { isDialogOpen: true });
        }
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].HIDE_DIALOG: {
            return __assign({}, state, { isDialogOpen: false });
        }
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].SHOW_DRAWER: {
            return __assign({}, state, { isDrawerOpen: true });
        }
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].HIDE_DRAWER: {
            return __assign({}, state, { isDrawerOpen: false });
        }
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].SHOW_NOTIFICATION: {
            return state;
        }
        case _layout_actions__WEBPACK_IMPORTED_MODULE_0__["LayoutActionTypes"].HIDE_NOTIFICATION: {
            return state;
        }
        default:
            return state;
    }
}
var initialLayoutState = {
    isLoading: false,
    isDrawerOpen: false,
    isDialogOpen: false
};
var selectorLayout = function (state) {
    return (state.layout || initialLayoutState);
};


/***/ }),

/***/ "./src/app/settings/index.ts":
/*!***********************************!*\
  !*** ./src/app/settings/index.ts ***!
  \***********************************/
/*! exports provided: SettingsModule, SETTINGS_KEY, SettingsActionTypes, ActionSettingsChangeTheme, ActionSettingsChangeAutoNightMode, ActionSettingsPersist, NIGHT_MODE_THEME, initialState, selectorSettings, settingsReducer, SettingsEffects, SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settings_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings.module */ "./src/app/settings/settings.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsModule", function() { return _settings_module__WEBPACK_IMPORTED_MODULE_0__["SettingsModule"]; });

/* harmony import */ var _settings_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings.reducer */ "./src/app/settings/settings.reducer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SETTINGS_KEY", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["SETTINGS_KEY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsActionTypes", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["SettingsActionTypes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsChangeTheme", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["ActionSettingsChangeTheme"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsChangeAutoNightMode", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["ActionSettingsChangeAutoNightMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsPersist", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["ActionSettingsPersist"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NIGHT_MODE_THEME", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["NIGHT_MODE_THEME"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["initialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectorSettings", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["selectorSettings"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "settingsReducer", function() { return _settings_reducer__WEBPACK_IMPORTED_MODULE_1__["settingsReducer"]; });

/* harmony import */ var _settings_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings.effects */ "./src/app/settings/settings.effects.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsEffects", function() { return _settings_effects__WEBPACK_IMPORTED_MODULE_2__["SettingsEffects"]; });

/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/settings/settings/settings.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return _settings_settings_component__WEBPACK_IMPORTED_MODULE_3__["SettingsComponent"]; });







/***/ }),

/***/ "./src/app/settings/settings.effects.ts":
/*!**********************************************!*\
  !*** ./src/app/settings/settings.effects.ts ***!
  \**********************************************/
/*! exports provided: SettingsEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsEffects", function() { return SettingsEffects; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
/* harmony import */ var _settings_reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings.reducer */ "./src/app/settings/settings.reducer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SettingsEffects = /** @class */ (function () {
    function SettingsEffects(actions$, localStorageService) {
        this.actions$ = actions$;
        this.localStorageService = localStorageService;
    }
    SettingsEffects.prototype.persistSettings = function () {
        var _this = this;
        return this.actions$
            .ofType(_settings_reducer__WEBPACK_IMPORTED_MODULE_5__["SettingsActionTypes"].PERSIST)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (action) {
            return _this.localStorageService.setItem(_settings_reducer__WEBPACK_IMPORTED_MODULE_5__["SETTINGS_KEY"], action.payload.settings);
        }));
    };
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])({ dispatch: false }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], SettingsEffects.prototype, "persistSettings", null);
    SettingsEffects = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _app_core__WEBPACK_IMPORTED_MODULE_4__["LocalStorageService"]])
    ], SettingsEffects);
    return SettingsEffects;
}());



/***/ }),

/***/ "./src/app/settings/settings.module.ts":
/*!*********************************************!*\
  !*** ./src/app/settings/settings.module.ts ***!
  \*********************************************/
/*! exports provided: SettingsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsModule", function() { return SettingsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared */ "./src/app/shared/index.ts");
/* harmony import */ var _settings_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./settings.reducer */ "./src/app/settings/settings.reducer.ts");
/* harmony import */ var _settings_effects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings.effects */ "./src/app/settings/settings.effects.ts");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/settings/settings/settings.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var SettingsModule = /** @class */ (function () {
    function SettingsModule() {
    }
    SettingsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _shared__WEBPACK_IMPORTED_MODULE_3__["SharedModule"],
                _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["StoreModule"].forFeature('settings', _settings_reducer__WEBPACK_IMPORTED_MODULE_4__["settingsReducer"]),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["EffectsModule"].forFeature([_settings_effects__WEBPACK_IMPORTED_MODULE_5__["SettingsEffects"]])
            ],
            declarations: [_settings_settings_component__WEBPACK_IMPORTED_MODULE_6__["SettingsComponent"]]
        })
    ], SettingsModule);
    return SettingsModule;
}());



/***/ }),

/***/ "./src/app/settings/settings.reducer.ts":
/*!**********************************************!*\
  !*** ./src/app/settings/settings.reducer.ts ***!
  \**********************************************/
/*! exports provided: SETTINGS_KEY, SettingsActionTypes, ActionSettingsChangeTheme, ActionSettingsChangeAutoNightMode, ActionSettingsPersist, NIGHT_MODE_THEME, initialState, selectorSettings, settingsReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SETTINGS_KEY", function() { return SETTINGS_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsActionTypes", function() { return SettingsActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsChangeTheme", function() { return ActionSettingsChangeTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsChangeAutoNightMode", function() { return ActionSettingsChangeAutoNightMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionSettingsPersist", function() { return ActionSettingsPersist; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NIGHT_MODE_THEME", function() { return NIGHT_MODE_THEME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectorSettings", function() { return selectorSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settingsReducer", function() { return settingsReducer; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var SETTINGS_KEY = 'SETTINGS';
var SettingsActionTypes;
(function (SettingsActionTypes) {
    SettingsActionTypes["CHANGE_THEME"] = "[Settings] Change Theme";
    SettingsActionTypes["CHANGE_AUTO_NIGHT_AUTO_MODE"] = "[Settings] Change Auto Night Mode";
    SettingsActionTypes["PERSIST"] = "[Settings] Persist";
})(SettingsActionTypes || (SettingsActionTypes = {}));
var ActionSettingsChangeTheme = /** @class */ (function () {
    function ActionSettingsChangeTheme(payload) {
        this.payload = payload;
        this.type = SettingsActionTypes.CHANGE_THEME;
    }
    return ActionSettingsChangeTheme;
}());

var ActionSettingsChangeAutoNightMode = /** @class */ (function () {
    function ActionSettingsChangeAutoNightMode(payload) {
        this.payload = payload;
        this.type = SettingsActionTypes.CHANGE_AUTO_NIGHT_AUTO_MODE;
    }
    return ActionSettingsChangeAutoNightMode;
}());

var ActionSettingsPersist = /** @class */ (function () {
    function ActionSettingsPersist(payload) {
        this.payload = payload;
        this.type = SettingsActionTypes.PERSIST;
    }
    return ActionSettingsPersist;
}());

var NIGHT_MODE_THEME = 'BLACK-THEME';
var initialState = {
    theme: 'DEFAULT-THEME',
    autoNightMode: false
};
var selectorSettings = function (state) {
    return (state.settings || { theme: '' });
};
function settingsReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case SettingsActionTypes.CHANGE_THEME:
            return __assign({}, state, { theme: action.payload.theme });
        case SettingsActionTypes.CHANGE_AUTO_NIGHT_AUTO_MODE:
            return __assign({}, state, { autoNightMode: action.payload.autoNightMode });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/settings/settings/settings.component.html":
/*!***********************************************************!*\
  !*** ./src/app/settings/settings/settings.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\"><h1>Settings</h1></div>\n  </div>\n  <br>\n  <div class=\"row\">\n    <div class=\"col-md-6 icon-form-field\">\n      <mat-icon color=\"accent\">color_lens</mat-icon>\n      <mat-form-field>\n        <mat-select placeholder=\"Color theme\"\n                    name=\"theme\"\n                    [ngModel]=\"settings?.theme\"\n                    (selectionChange)=\"onThemeSelect($event)\">\n          <mat-option *ngFor=\"let t of themes\" [value]=\"t.value\">\n            {{t.label}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n    </div>\n    <div class=\"col-md-6 icon-form-field\">\n      <mat-icon color=\"accent\">lightbulb_outline</mat-icon>\n      <mat-form-field>\n        <mat-select placeholder=\"Auto night mode (from 21:00 to 7:00)\"\n                    name=\"auto-night-mode\"\n                    [ngModel]=\"settings?.autoNightMode?.toString()\"\n                    (selectionChange)=\"onAutoNightModeSelect($event)\">\n          <mat-option value=\"false\">Off</mat-option>\n          <mat-option value=\"true\">On</mat-option>\n        </mat-select>\n      </mat-form-field>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/settings/settings.component.scss":
/*!***********************************************************!*\
  !*** ./src/app/settings/settings/settings.component.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  margin-top: 20px; }\n\nh1 {\n  margin: 0 0 20px 0;\n  text-transform: uppercase; }\n\n.icon-form-field {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\nmat-icon {\n  margin: 0 10px 0 0; }\n\nmat-form-field {\n  -ms-flex: 1 0 auto;\n      flex: 1 0 auto; }\n"

/***/ }),

/***/ "./src/app/settings/settings/settings.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/settings/settings/settings.component.ts ***!
  \*********************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _settings_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../settings.reducer */ "./src/app/settings/settings.reducer.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(store) {
        var _this = this;
        this.store = store;
        this.unsubscribe$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.themes = [
            { value: 'DEFAULT-THEME', label: 'Blue' },
            { value: 'LIGHT-THEME', label: 'Light' },
            { value: 'NATURE-THEME', label: 'Nature' },
            { value: 'BLACK-THEME', label: 'Dark' },
        ];
        store
            .select(_settings_reducer__WEBPACK_IMPORTED_MODULE_4__["selectorSettings"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.unsubscribe$))
            .subscribe(function (settings) { return (_this.settings = settings); });
    }
    SettingsComponent.prototype.ngOnInit = function () { };
    SettingsComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };
    SettingsComponent.prototype.onThemeSelect = function (_a) {
        var theme = _a.value;
        this.store.dispatch(new _settings_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionSettingsChangeTheme"]({ theme: theme }));
        this.store.dispatch(new _settings_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionSettingsPersist"]({ settings: this.settings }));
    };
    SettingsComponent.prototype.onAutoNightModeSelect = function (_a) {
        var autoNightMode = _a.value;
        this.store.dispatch(new _settings_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionSettingsChangeAutoNightMode"]({
            autoNightMode: autoNightMode === 'true'
        }));
        this.store.dispatch(new _settings_reducer__WEBPACK_IMPORTED_MODULE_4__["ActionSettingsPersist"]({ settings: this.settings }));
    };
    SettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-settings',
            template: __webpack_require__(/*! ./settings.component.html */ "./src/app/settings/settings/settings.component.html"),
            styles: [__webpack_require__(/*! ./settings.component.scss */ "./src/app/settings/settings/settings.component.scss")]
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/shared/big-input/big-input-action.component.html":
/*!******************************************************************!*\
  !*** ./src/app/shared/big-input/big-input-action.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-raised-button color=\"color\" [disabled]=\"disabled\" (click)=\"onClick()\">\n  <mat-icon *ngIf=\"icon\">{{icon}}</mat-icon>\n  <span *ngIf=\"label\">{{label}}</span>\n</button>\n"

/***/ }),

/***/ "./src/app/shared/big-input/big-input-action.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/shared/big-input/big-input-action.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  padding: 0;\n  min-width: 36px;\n  margin-left: 10px; }\n"

/***/ }),

/***/ "./src/app/shared/big-input/big-input-action.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/big-input/big-input-action.component.ts ***!
  \****************************************************************/
/*! exports provided: BigInputActionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BigInputActionComponent", function() { return BigInputActionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BigInputActionComponent = /** @class */ (function () {
    function BigInputActionComponent() {
        this.disabled = false;
        this.icon = '';
        this.label = '';
        this.color = '';
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.hasFocus = false;
    }
    BigInputActionComponent.prototype.onClick = function () {
        this.action.emit();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputActionComponent.prototype, "disabled", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputActionComponent.prototype, "icon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputActionComponent.prototype, "label", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputActionComponent.prototype, "color", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BigInputActionComponent.prototype, "action", void 0);
    BigInputActionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-big-input-action',
            template: __webpack_require__(/*! ./big-input-action.component.html */ "./src/app/shared/big-input/big-input-action.component.html"),
            styles: [__webpack_require__(/*! ./big-input-action.component.scss */ "./src/app/shared/big-input/big-input-action.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], BigInputActionComponent);
    return BigInputActionComponent;
}());



/***/ }),

/***/ "./src/app/shared/big-input/big-input.component.html":
/*!***********************************************************!*\
  !*** ./src/app/shared/big-input/big-input.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card class=\"big-input\" [ngClass]=\"{ 'has-focus': hasFocus }\">\n  <input (focus)=\"hasFocus = true\" (blur)=\"hasFocus = false\"\n         [value]=\"value\"\n         [placeholder]=\"placeholder\"\n         [disabled]=\"disabled\" />\n  <ng-content></ng-content>\n</mat-card>\n"

/***/ }),

/***/ "./src/app/shared/big-input/big-input.component.scss":
/*!***********************************************************!*\
  !*** ./src/app/shared/big-input/big-input.component.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".big-input {\n  width: 100%;\n  transition: all 0.5s;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 10px 10px 10px 20px; }\n  .big-input input {\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n    border: 0;\n    font-size: 20px;\n    min-width: 100px; }\n"

/***/ }),

/***/ "./src/app/shared/big-input/big-input.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/shared/big-input/big-input.component.ts ***!
  \*********************************************************/
/*! exports provided: BigInputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BigInputComponent", function() { return BigInputComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BigInputComponent = /** @class */ (function () {
    function BigInputComponent() {
        this.value = '';
        this.disabled = false;
        this.hasFocus = false;
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BigInputComponent.prototype, "placeholder", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputComponent.prototype, "value", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BigInputComponent.prototype, "disabled", void 0);
    BigInputComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-big-input',
            template: __webpack_require__(/*! ./big-input.component.html */ "./src/app/shared/big-input/big-input.component.html"),
            styles: [__webpack_require__(/*! ./big-input.component.scss */ "./src/app/shared/big-input/big-input.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        })
    ], BigInputComponent);
    return BigInputComponent;
}());



/***/ }),

/***/ "./src/app/shared/index.ts":
/*!*********************************!*\
  !*** ./src/app/shared/index.ts ***!
  \*********************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared.module */ "./src/app/shared/shared.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return _shared_module__WEBPACK_IMPORTED_MODULE_0__["SharedModule"]; });




/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/esm5/button.es5.js");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/toolbar */ "./node_modules/@angular/material/esm5/toolbar.es5.js");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/menu */ "./node_modules/@angular/material/esm5/menu.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-spinner */ "./node_modules/@angular/material/esm5/progress-spinner.es5.js");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/chips */ "./node_modules/@angular/material/esm5/chips.es5.js");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/sidenav */ "./node_modules/@angular/material/esm5/sidenav.es5.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/esm5/checkbox.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/list */ "./node_modules/@angular/material/esm5/list.es5.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm5/icon.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/esm5/snack-bar.es5.js");
/* harmony import */ var _big_input_big_input_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./big-input/big-input.component */ "./src/app/shared/big-input/big-input.component.ts");
/* harmony import */ var _big_input_big_input_action_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./big-input/big-input-action.component */ "./src/app/shared/big-input/big-input-action.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _covalent_core_common__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @covalent/core/common */ "./node_modules/@covalent/core/esm5/covalent-core-common.js");
/* harmony import */ var _covalent_core_layout__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @covalent/core/layout */ "./node_modules/@covalent/core/esm5/covalent-core-layout.js");
/* harmony import */ var _covalent_core_media__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @covalent/core/media */ "./node_modules/@covalent/core/esm5/covalent-core-media.js");
/* harmony import */ var _covalent_core_loading__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @covalent/core/loading */ "./node_modules/@covalent/core/esm5/covalent-core-loading.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


























var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatGridListModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatProgressSpinnerModule"],
                _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatButtonToggleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDatepickerModule"],
                _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_4__["MatToolbarModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__["MatTabsModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatProgressSpinnerModule"],
                _angular_material_chips__WEBPACK_IMPORTED_MODULE_10__["MatChipsModule"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardModule"],
                _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_11__["MatSidenavModule"],
                _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__["MatCheckboxModule"],
                _angular_material_list__WEBPACK_IMPORTED_MODULE_14__["MatListModule"],
                _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__["MatMenuModule"],
                _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__["MatIconModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__["MatTooltipModule"],
                _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__["MatSnackBarModule"],
                _covalent_core_common__WEBPACK_IMPORTED_MODULE_21__["CovalentCommonModule"],
                /** Covalent Modules */
                _covalent_core_common__WEBPACK_IMPORTED_MODULE_21__["CovalentCommonModule"],
                _covalent_core_layout__WEBPACK_IMPORTED_MODULE_22__["CovalentLayoutModule"],
                _covalent_core_media__WEBPACK_IMPORTED_MODULE_23__["CovalentMediaModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentExpansionPanelModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentStepsModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentDialogsModule"],
                _covalent_core_loading__WEBPACK_IMPORTED_MODULE_24__["CovalentLoadingModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentSearchModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentPagingModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentNotificationsModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentMenuModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentDataTableModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentMessageModule"]
            ],
            declarations: [_big_input_big_input_component__WEBPACK_IMPORTED_MODULE_18__["BigInputComponent"], _big_input_big_input_action_component__WEBPACK_IMPORTED_MODULE_19__["BigInputActionComponent"]],
            exports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatGridListModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatProgressSpinnerModule"],
                _angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatButtonToggleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_20__["MatDatepickerModule"],
                _angular_material_menu__WEBPACK_IMPORTED_MODULE_5__["MatMenuModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__["MatTabsModule"],
                _angular_material_chips__WEBPACK_IMPORTED_MODULE_10__["MatChipsModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatProgressSpinnerModule"],
                _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__["MatCheckboxModule"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardModule"],
                _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_11__["MatSidenavModule"],
                _angular_material_list__WEBPACK_IMPORTED_MODULE_14__["MatListModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
                _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_4__["MatToolbarModule"],
                _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__["MatIconModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__["MatTooltipModule"],
                _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__["MatSnackBarModule"],
                _big_input_big_input_component__WEBPACK_IMPORTED_MODULE_18__["BigInputComponent"],
                _big_input_big_input_action_component__WEBPACK_IMPORTED_MODULE_19__["BigInputActionComponent"],
                _covalent_core_common__WEBPACK_IMPORTED_MODULE_21__["CovalentCommonModule"],
                /** Covalent Modules */
                _covalent_core_common__WEBPACK_IMPORTED_MODULE_21__["CovalentCommonModule"],
                _covalent_core_layout__WEBPACK_IMPORTED_MODULE_22__["CovalentLayoutModule"],
                _covalent_core_media__WEBPACK_IMPORTED_MODULE_23__["CovalentMediaModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentExpansionPanelModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentStepsModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentDialogsModule"],
                _covalent_core_loading__WEBPACK_IMPORTED_MODULE_24__["CovalentLoadingModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentSearchModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentPagingModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentNotificationsModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentMenuModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentDataTableModule"],
                _covalent_core__WEBPACK_IMPORTED_MODULE_25__["CovalentMessageModule"]
            ]
        })
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/app/static/about/about.component.html":
/*!***************************************************!*\
  !*** ./src/app/static/about/about.component.html ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"background\">\n  <div class=\"gradient\">\n    <div class=\"container\">\n      <h1>Angular ngRx Material Starter</h1>\n      <div class=\"actions\">\n        <a [ngClass]=\"animateOnRouteEnter\"\n           mat-raised-button class=\"actions-main\" color=\"primary\" routerLink=\"../features\">\n          Features\n        </a>\n        <a mat-raised-button class=\"actions-main\" color=\"accent\" routerLink=\"../examples\"\n           [ngClass]=\"animateOnRouteEnter\">\n          Examples\n        </a>\n        <a mat-raised-button class=\"actions-main\" color=\"warn\" routerLink=\"../settings\"\n           [ngClass]=\"animateOnRouteEnter\">\n          <i class=\"fa fa-gear\"></i> Change Theme\n        </a>\n        <br>\n        <span [ngClass]=\"animateOnRouteEnter\">or check blogs about</span>\n        <br>\n        <a mat-raised-button\n           [ngClass]=\"animateOnRouteEnter\"\n           target=\"_blank\"\n           href=\"https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1\">\n          <i class=\"fa fa-medium\"></i> Material Theming\n        </a>\n        <a mat-raised-button\n           [ngClass]=\"animateOnRouteEnter\"\n           target=\"_blank\"\n           href=\"https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81\">\n          <i class=\"fa fa-medium\"></i> Angular Cli Tips\n        </a>\n        <a mat-raised-button\n           [ngClass]=\"animateOnRouteEnter\"\n           target=\"_blank\"\n           href=\"https://medium.com/@tomastrajan/object-assign-vs-object-spread-in-angular-ngrx-reducers-3d62ecb4a4b0\">\n          <i class=\"fa fa-medium\"></i> Ngrx Typescript Tips\n        </a>\n        <a mat-raised-button\n           [ngClass]=\"animateOnRouteEnter\"\n           target=\"_blank\"\n           href=\"https://medium.com/@tomastrajan/how-to-style-angular-application-loading-with-angular-cli-like-a-boss-cdd4f5358554\">\n          <i class=\"fa fa-medium\"></i> App Loading Style\n        </a>\n      </div>\n      <div class=\"get-started\" [ngClass]=\"animateOnRouteEnter\">\n        <h2>Getting started</h2>\n        <code>git clone\n          https://github.com/tomastrajan/angular-ngrx-material-starter.git\n          new-project</code><br>\n        <code>cd new-project</code><br>\n        <code>npm install</code><br>\n        <code>npm start</code>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"container\">\n  <div class=\"follow-releases\" [ngClass]=\"animateOnRouteEnter\">\n    <h2>Get notified about new releases</h2>\n    <p>\n      Follow <a href=\"https://www.twitter.com/releasebutler\" target=\"_blank\">Release\n      Butler</a>\n      a Twitter bot that helps you to stay up to date with releases of popular frontend\n      frameworks & libraries!\n    </p>\n\n    <img [src]=\"releaseButler\" alt=\"Release Butler tweet example\">\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/static/about/about.component.scss":
/*!***************************************************!*\
  !*** ./src/app/static/about/about.component.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h1 {\n  text-align: center;\n  font-size: 3em;\n  text-transform: uppercase; }\n\nh2 {\n  font-size: 1.5em;\n  text-transform: uppercase; }\n\n.background {\n  padding: 80px 0 0 0;\n  position: relative; }\n\n.background .actions {\n    text-align: center;\n    margin: 50px;\n    z-index: 1; }\n\n.background .actions span {\n      display: inline-block;\n      font-weight: bold;\n      padding: 20px 10px 30px 10px; }\n\n.background .actions a {\n      margin: 0 5px 10px 0; }\n\n.background .actions a.actions-main {\n        text-transform: uppercase;\n        padding: 3px 24px; }\n\n.background .actions a i {\n        position: relative;\n        top: -1px; }\n\n.background .get-started {\n    max-width: 700px;\n    margin: 50px auto;\n    letter-spacing: 0.01px;\n    overflow-wrap: break-word;\n    z-index: 1;\n    overflow: hidden; }\n\n.background .get-started code {\n      font-size: 0.9em;\n      display: inline-block;\n      word-wrap: break-word;\n      white-space: normal;\n      margin: 0 0 10px 0; }\n\n.background::before {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    background: url('intro.jpg') no-repeat center top;\n    background-size: cover;\n    opacity: 0.7;\n    content: '';\n    z-index: 0; }\n\n.background .gradient::before {\n    position: absolute;\n    top: 50%;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    content: '';\n    z-index: 0; }\n\n.background .container {\n    position: relative; }\n\n.follow-releases {\n  max-width: 700px;\n  margin: 0 auto 80px auto; }\n\n.follow-releases p {\n    line-height: 40px; }\n\n.follow-releases p a {\n      border-bottom: 3px solid; }\n\n.follow-releases img {\n    display: block;\n    max-width: 80%;\n    margin: 20px auto 0 auto;\n    border-radius: 5px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n@media (max-width: 768px) {\n  .background .actions {\n    margin: 50px 0; }\n  .background .get-started {\n    width: auto; }\n  .follow-releases {\n    width: auto; }\n    .follow-releases img {\n      max-width: 100%; } }\n\n@media (max-width: 576px) {\n  .background {\n    padding: 40px 0 0 0; }\n    .background h1 {\n      line-height: 1em; }\n    .background .actions {\n      margin: 40px 0 0 0; }\n      .background .actions span {\n        padding: 10px 0 20px 0; }\n      .background .actions a {\n        width: 100%; }\n    .background .get-started {\n      width: auto;\n      margin: 40px auto 40px auto; }\n  .follow-releases {\n    margin: 0 auto 40px auto; } }\n"

/***/ }),

/***/ "./src/app/static/about/about.component.ts":
/*!*************************************************!*\
  !*** ./src/app/static/about/about.component.ts ***!
  \*************************************************/
/*! exports provided: AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return AboutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AboutComponent = /** @class */ (function () {
    function AboutComponent() {
        this.animateOnRouteEnter = _app_core__WEBPACK_IMPORTED_MODULE_1__["ANIMATE_ON_ROUTE_ENTER"];
        this.releaseButler = __webpack_require__(/*! ../../../assets/release-butler.png */ "./src/assets/release-butler.png");
    }
    AboutComponent.prototype.ngOnInit = function () { };
    AboutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-about',
            template: __webpack_require__(/*! ./about.component.html */ "./src/app/static/about/about.component.html"),
            styles: [__webpack_require__(/*! ./about.component.scss */ "./src/app/static/about/about.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "./src/app/static/features/features.component.html":
/*!*********************************************************!*\
  !*** ./src/app/static/features/features.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1 class=\"main-heading\">Features</h1>\n    </div>\n  </div>\n  <div class=\"row align-items-end\">\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.angular}}</code>Angular</mat-card-title>\n        <mat-card-subtitle>\n          Modern powerful framework\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://angular.io/docs/ts/latest/\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://github.com/angular/angular\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.material}}</code>Angular Material</mat-card-title>\n        <mat-card-subtitle>\n          Material design component library\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://material.angular.io/\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://github.com/angular/material2/\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.angularCli}}</code>Angular Cli</mat-card-title>\n        <mat-card-subtitle>\n          Responsive layout from battle tested, world most famous UI library\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://github.com/angular/angular-cli/wiki/generate\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://github.com/angular/angular-cli\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.ngrx}}</code>ngRx</mat-card-title>\n        <mat-card-subtitle>\n          One way data flow powered by RxJS Observables\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://github.com/ngrx/platform\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n          <a mat-button href=\"https://github.com/ngrx/effects/blob/master/docs/testing.md\" target=\"_blank\">\n            <i class=\"fa fa-code fa-lg\"></i> Testing\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.rxjs}}</code>RxJS</mat-card-title>\n        <mat-card-subtitle>\n          Reactive programming with async collections using Observables.\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"http://reactivex.io/rxjs/\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://github.com/ReactiveX/RxJS\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.bootstrap}}</code>Bootstrap</mat-card-title>\n        <mat-card-subtitle>\n          Responsive layout from battle tested, world most famous UI library\n        </mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://v4-alpha.getbootstrap.com/layout/grid/\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://github.com/twbs/bootstrap\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title><code>{{versions.typescript}}</code> Typescript</mat-card-title>\n        <mat-card-subtitle>Superior developer experience, code completion, refactoring and less bugs</mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://github.com/Microsoft/TypeScript\" target=\"_blank\">\n            <i class=\"fa fa-github fa-lg\"></i> Github\n          </a>\n          <a mat-button href=\"https://www.typescriptlang.org/docs/home.html\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title>Themes</mat-card-title>\n        <mat-card-subtitle>Flexible theming support for provided and custom components</mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://material.angular.io/guide/theming\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n          <a mat-button href=\"https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1\" target=\"_blank\">\n            <i class=\"fa fa-medium fa-lg\"></i> Blog\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n    <div  class=\"col-md-6 col-lg-4\" [ngClass]=\"animateOnRouteEnter\">\n      <mat-card>\n        <mat-card-title>Lazy loading</mat-card-title>\n        <mat-card-subtitle>Faster startup time with lazy loaded feature modules</mat-card-subtitle>\n        <mat-card-actions>\n          <a mat-button href=\"https://angular.io/docs/ts/latest/guide/router.html#!#lazy-loading-route-config\" target=\"_blank\">\n            <i class=\"fa fa-book fa-lg\"></i> Docs\n          </a>\n        </mat-card-actions>\n      </mat-card>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/static/features/features.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/static/features/features.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  margin-top: 20px; }\n\n.main-heading {\n  text-transform: uppercase;\n  margin: 0 0 20px 0; }\n\nmat-card {\n  margin: 0 0 20px 0; }\n\nmat-card mat-card-title {\n    position: relative; }\n\nmat-card mat-card-title code {\n      position: absolute;\n      top: 11px;\n      right: 0;\n      float: right;\n      font-size: 10px; }\n\nmat-card mat-card-subtitle {\n    min-height: 60px; }\n\n@media (max-width: 576px) {\n    mat-card mat-card-subtitle {\n      min-height: auto; } }\n\nmat-card a i {\n    position: relative;\n    top: -1px;\n    left: -3px; }\n"

/***/ }),

/***/ "./src/app/static/features/features.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/static/features/features.component.ts ***!
  \*******************************************************/
/*! exports provided: FeaturesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeaturesComponent", function() { return FeaturesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _env_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @env/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/core */ "./src/app/core/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var FeaturesComponent = /** @class */ (function () {
    function FeaturesComponent() {
        this.animateOnRouteEnter = _app_core__WEBPACK_IMPORTED_MODULE_2__["ANIMATE_ON_ROUTE_ENTER"];
        this.versions = _env_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].versions;
    }
    FeaturesComponent.prototype.ngOnInit = function () { };
    FeaturesComponent.prototype.openLink = function (link) {
        window.open(link, '_blank');
    };
    FeaturesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-features',
            template: __webpack_require__(/*! ./features.component.html */ "./src/app/static/features/features.component.html"),
            styles: [__webpack_require__(/*! ./features.component.scss */ "./src/app/static/features/features.component.scss")]
        })
    ], FeaturesComponent);
    return FeaturesComponent;
}());



/***/ }),

/***/ "./src/app/static/index.ts":
/*!*********************************!*\
  !*** ./src/app/static/index.ts ***!
  \*********************************/
/*! exports provided: StaticRoutingModule, StaticModule, AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _static_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./static-routing.module */ "./src/app/static/static-routing.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StaticRoutingModule", function() { return _static_routing_module__WEBPACK_IMPORTED_MODULE_0__["StaticRoutingModule"]; });

/* harmony import */ var _static_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./static.module */ "./src/app/static/static.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StaticModule", function() { return _static_module__WEBPACK_IMPORTED_MODULE_1__["StaticModule"]; });

/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./about/about.component */ "./src/app/static/about/about.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return _about_about_component__WEBPACK_IMPORTED_MODULE_2__["AboutComponent"]; });






/***/ }),

/***/ "./src/app/static/slack/slack.component.html":
/*!***************************************************!*\
  !*** ./src/app/static/slack/slack.component.html ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<td-layout>\r\n    <td-navigation-drawer logo=\"assets:covalent\" sidenavTitle=\"Chat\" name=\"Firstname Lastname\" email=\"firstname.lastname@company.com\">\r\n      <mat-nav-list>\r\n        <ng-template let-item let-last=\"last\" let-index=\"index\" ngFor [ngForOf]=\"[0,1,2,3,4,5]\">\r\n          <a mat-list-item (click)=\"layout.close()\"><mat-icon>group</mat-icon> Team {{index}}</a>\r\n        </ng-template>\r\n      </mat-nav-list>\r\n      <mat-nav-list td-navigation-drawer-menu>\r\n        <a mat-list-item (click)=\"logout()\"><mat-icon>exit_to_app</mat-icon>Sign out</a>\r\n      </mat-nav-list>\r\n    </td-navigation-drawer>\r\n    <td-layout-nav-list #navList [sidenavWidth]=\"'240px'\">\r\n      <button mat-icon-button td-menu-button tdLayoutToggle>\r\n        <mat-icon>menu</mat-icon>\r\n      </button>\r\n      <div td-sidenav-toolbar-content layout=\"row\" flex>\r\n        <div>\r\n          <button mat-button [matMenuTriggerFor]=\"menu\">Team Name <mat-icon>arrow_drop_down</mat-icon></button>\r\n          <mat-menu #menu=\"matMenu\">\r\n            <button mat-menu-item>Set a status</button>\r\n            <button mat-menu-item>Profile &amp; account</button>\r\n            <button mat-menu-item>Preferences</button>\r\n            <button mat-menu-item>Set yourself to away</button>\r\n            <button mat-menu-item>Help &amp; feedback</button>\r\n          </mat-menu>\r\n        </div>\r\n        <span flex></span>\r\n        <div>\r\n          <button mat-icon-button [matMenuTriggerFor]=\"notifyMenu\"><mat-icon>notifications_off</mat-icon></button>\r\n          <mat-menu #notifyMenu=\"matMenu\" x-position=\"before\">\r\n            <button mat-menu-item>Do not disturb ON</button>\r\n            <button mat-menu-item>Turn OFF</button>\r\n            <button mat-menu-item>Adjust schedule...</button>\r\n            <mat-divider></mat-divider>\r\n            <button mat-menu-item>Settings for #channel</button>\r\n            <button mat-menu-item>Notifications preferences...</button>\r\n          </mat-menu>\r\n        </div>\r\n      </div>\r\n      <mat-nav-list td-sidenav-content class=\"bgc-purple-900\" (click)=\"!media.query('gt-sm') && navList.close()\">\r\n        <a mat-list-item class=\"tc-white\"><mat-icon class=\"tc-white\" matListIcon>sort</mat-icon> All Unreads</a>\r\n        <a mat-list-item class=\"tc-white\"><mat-icon class=\"tc-white\" matListIcon>chat</mat-icon> All Threads</a>\r\n        <mat-divider></mat-divider>\r\n        <h3 mat-subheader class=\"tc-white\">STARRED</h3>\r\n        <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1]\">\r\n          <a mat-list-item class=\"tc-white\"><mat-icon class=\"tc-white\" matListIcon>forum</mat-icon> starred-channel-{{i}}</a>\r\n        </ng-template>\r\n        <mat-divider></mat-divider>\r\n        <h3 mat-subheader class=\"tc-white\">CHANNELS (5)</h3>\r\n        <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3]\">\r\n          <a mat-list-item class=\"tc-white\"><mat-icon class=\"tc-white\" matListIcon>forum</mat-icon> channel-name-{{i}}</a>\r\n        </ng-template>\r\n        <mat-divider></mat-divider>\r\n        <h3 mat-subheader class=\"tc-white\">DIRECT MESSAGES</h3>\r\n        <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4,5]\">\r\n          <a mat-list-item class=\"tc-white\"><mat-icon color=\"accent\" matListIcon>lens</mat-icon> username{{i}}</a>\r\n        </ng-template>\r\n      </mat-nav-list>\r\n      <div td-toolbar-content layout=\"row\" layout-align=\"start center\" flex>\r\n        <div flex>\r\n          <div [matMenuTriggerFor]=\"channelMenu\" class=\"cursor-hover pull-bottom-sm\">#channel</div>\r\n          <mat-menu #channelMenu=\"matMenu\">\r\n            <button mat-menu-item>Jump to date...</button>\r\n            <button mat-menu-item>Invite team members to join...</button>\r\n            <button mat-menu-item>View channel details</button>\r\n            <button mat-menu-item>Additional options...</button>\r\n            <mat-divider></mat-divider>\r\n            <button mat-menu-item>Notification preferences</button>\r\n            <button mat-menu-item>Mute #channel</button>\r\n            <mat-divider></mat-divider>\r\n            <button mat-menu-item>Add an app or integration</button>\r\n            <mat-divider></mat-divider>\r\n            <button mat-menu-item>Leave #channel</button>\r\n          </mat-menu>\r\n          <div layout=\"row\" layout-align=\"start center\">\r\n            <mat-icon class=\"md-caption\">star</mat-icon>\r\n            <mat-icon class=\"md-caption push-left-sm\">person</mat-icon>\r\n            <span class=\"md-caption\">94</span>\r\n            <mat-icon class=\"md-caption push-left-sm\">note</mat-icon>\r\n            <span class=\"md-caption\">12</span>\r\n            <span class=\"md-caption push-left-sm\">channel description</span>\r\n          </div>\r\n        </div>\r\n        <button mat-icon-button matTooltip=\"Call\" [style.margin]=\"'0 -5px'\"><mat-icon>phone</mat-icon></button>\r\n        <button mat-icon-button matTooltip=\"Show conversation details\" [style.margin]=\"'0 -5px'\" (click)=\"channelInfo.toggle()\"><mat-icon>info</mat-icon></button>\r\n        <button mat-icon-button matTooltip=\"Conversation settings\" [style.margin]=\"'0 -5px'\"><mat-icon>settings</mat-icon></button>\r\n        <mat-card flex=\"20\">\r\n          <td-search-box [alwaysVisible]=\"true\" #searchBox placeholder=\"Search\" [showUnderline]=\"false\"></td-search-box>\r\n        </mat-card>\r\n        <button mat-icon-button matTooltip=\"Show activity\" [style.margin]=\"'0 -5px'\"><mat-icon>@</mat-icon></button>\r\n        <button mat-icon-button matTooltip=\"Show starred items\" [style.margin]=\"'0 -5px'\"><mat-icon>star_border</mat-icon></button>\r\n        <button mat-icon-button matTooltip=\"More items\" [style.margin]=\"'0 -5px'\"><mat-icon>more_vert</mat-icon></button>\r\n      </div>\r\n      <mat-sidenav-container fullscreen>\r\n        <mat-sidenav #channelInfo mode=\"side\" align=\"end\" [opened]=\"true\" [style.width.px]=\"270\">\r\n          <div layout=\"column\" layout-fill>\r\n            <mat-toolbar>\r\n              <span class=\"md-subhead\">About #channel</span>\r\n              <span flex></span>\r\n              <button mat-icon-button (click)=\"channelInfo.toggle()\"><mat-icon>clear</mat-icon></button>\r\n            </mat-toolbar>\r\n            <td-expansion-panel [expand]=\"true\">\r\n              <ng-template td-expansion-panel-label>\r\n                <mat-icon class=\"tc-grey-600\">info_outline</mat-icon>\r\n                <span>Channel Details</span>\r\n              </ng-template>\r\n              <div>\r\n                <mat-list dense>\r\n                  <h3 matSubheader>Workspaces</h3>\r\n                  <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1]\">\r\n                    <mat-list-item>\r\n                      <mat-icon matListIcon>business</mat-icon>\r\n                      <h3 matLine>Workspace name {{i + 1}}</h3>\r\n                      <p matLine>152 members</p>\r\n                    </mat-list-item>\r\n                  </ng-template>\r\n                  <h3 matSubheader>Purpose</h3>\r\n                  <mat-list-item>\r\n                    <h3 matLine>Channel purpose here</h3>\r\n                  </mat-list-item>\r\n                  <h3 matSubheader>Created</h3>\r\n                  <mat-list-item>\r\n                    <h3 matLine>Created by John Jameson on May 11, 2017</h3>\r\n                  </mat-list-item>\r\n                </mat-list>\r\n              </div>\r\n            </td-expansion-panel>\r\n            <td-expansion-panel>\r\n              <ng-template td-expansion-panel-label>\r\n                <mat-icon class=\"tc-light-blue-600\">flare</mat-icon>\r\n                <span>Highlights</span>\r\n              </ng-template>\r\n              <div class=\"pad-sm md-caption\">\r\n                Nothing yet. When this channel gets a bit more active, check back here.\r\n              </div>\r\n            </td-expansion-panel>\r\n            <td-expansion-panel>\r\n              <ng-template td-expansion-panel-label>\r\n                <mat-icon class=\"tc-green-600\">person_outline</mat-icon>\r\n                <span>94 Members</span>\r\n              </ng-template>\r\n              <div>\r\n                <mat-list dense>\r\n                  <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4,5]\">\r\n                    <a mat-list-item>\r\n                      <mat-icon color=\"accent\" matListIcon>lens</mat-icon>\r\n                      <span layout=\"row\" layout-align=\"start center\">\r\n                        <img class=\"size-16 push-right-sm\" src=\"https://api.adorable.io/avatars/285/{{i}}@adorable.io.png\" /> username{{i}}</span>\r\n                    </a>\r\n                  </ng-template>\r\n                </mat-list>\r\n              </div>\r\n            </td-expansion-panel>\r\n          </div>\r\n        </mat-sidenav>\r\n        <div layout=\"column\" layout-fill>\r\n          <div flex class=\"mat-content\">\r\n            <mat-card tdMediaToggle=\"gt-xs\" [mediaClasses]=\"['push-sm']\">\r\n              <mat-list>\r\n                <ng-template let-item let-i=\"index\" let-last=\"last\" ngFor [ngForOf]=\"[0,1,2,3,4,5,6,7,8,9]\">\r\n                  <mat-list-item class=\"pad-top pad-bottom\">\r\n                    <img matListAvatar src=\"https://api.adorable.io/avatars/285/{{i}}@adorable.io.png\" />\r\n                    <h3 matLine class=\"cursor-pointer\"> Firstname Lastname <span class=\"tc-grey-500 md-caption\">11:24 AM</span></h3>\r\n                    <div matLine>\r\n                      <div class=\"text-wrap\">\r\n                        {{ 'Farm-to-table poke distillery, bushwick messenger bag vaporware neutra artisan paleo. Single-origin coffee shabby chic glossier lumberjack chambray dreamcatcher, blue bottle raclette.' | truncate:200 }}\r\n                      </div>\r\n                    </div>\r\n                  </mat-list-item>\r\n                  <mat-divider *ngIf=\"!last\" mat-inset></mat-divider>\r\n                </ng-template>\r\n              </mat-list>\r\n            </mat-card>\r\n          </div>\r\n          <mat-card>\r\n            <div layout=\"row\" layout-align=\"start center\">\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Add content\" matTooltipPosition=\"after\" [matMenuTriggerFor]=\"chatMenu\"><mat-icon>add</mat-icon></button>\r\n                <mat-menu #chatMenu=\"matMenu\">\r\n                  <button mat-menu-item>Code or text snippet</button>\r\n                  <button mat-menu-item>Google Docs file</button>\r\n                  <button mat-menu-item>Post</button>\r\n                  <button mat-menu-item>Google Drive</button>\r\n                  <button mat-menu-item>Upload file</button>\r\n                </mat-menu>\r\n              </div>\r\n              <mat-form-field class=\"push-left push-right\" flex layout=\"row\" floatPlaceholder=\"never\">\r\n                <textarea flex matInput placeholder=\"message\"></textarea>\r\n              </mat-form-field>\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Add emoji\" matTooltipPosition=\"before\" [matMenuTriggerFor]=\"emojiMenu\"><mat-icon>sentiment_very_satisfied</mat-icon></button>\r\n                <mat-menu #emojiMenu=\"matMenu\" x-position=\"before\">\r\n                  <td-menu>\r\n                    <div td-menu-header>\r\n                      <mat-button-toggle>\r\n                        <mat-icon>access_time</mat-icon>\r\n                      </mat-button-toggle>\r\n                      <mat-button-toggle>\r\n                        <mat-icon>sentiment_very_satisfied</mat-icon>\r\n                      </mat-button-toggle>\r\n                      <mat-button-toggle>\r\n                        <mat-icon>spa</mat-icon>\r\n                      </mat-button-toggle>\r\n                      <mat-button-toggle>\r\n                        <mat-icon>room_service</mat-icon>\r\n                      </mat-button-toggle>\r\n                    </div>\r\n                    <div style=\"height:200px;\" class=\"push\">\r\n                      <div layout=\"row\" layout-wrap>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>mood</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>mood_bad</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>sentiment_dissatisfied</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>sentiment_neutral</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>sentiment_satisfied</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>sentiment_very_dissatisfied</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>sentiment_very_satisfied</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>whatshot</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>face</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>pan_tool</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>pregnant_woman</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>pets</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>rowing</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>touch_app</mat-icon></button>\r\n                        <button flex=\"20\" mat-icon-button><mat-icon>visibility_off</mat-icon></button>\r\n                      </div>\r\n                    </div>\r\n                    <div td-menu-footer>\r\n                      <div layout=\"row\" layout-align=\"center center\" class=\"push-sm\">\r\n                        <span class=\"mat-subhead\">Emoji Deluxe</span>\r\n                        <span flex></span>\r\n                        <span>:happy:</span>\r\n                        <mat-icon>sentiment_very_satisfied</mat-icon>\r\n                      </div>\r\n                    </div>\r\n                  </td-menu>\r\n                </mat-menu>\r\n              </div>\r\n            </div>\r\n          </mat-card>\r\n        </div>\r\n      </mat-sidenav-container>\r\n    </td-layout-nav-list>\r\n  </td-layout>\r\n"

/***/ }),

/***/ "./src/app/static/slack/slack.component.ts":
/*!*************************************************!*\
  !*** ./src/app/static/slack/slack.component.ts ***!
  \*************************************************/
/*! exports provided: SlackComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlackComponent", function() { return SlackComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _covalent_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @covalent/core */ "./node_modules/@covalent/core/esm5/covalent-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SlackComponent = /** @class */ (function () {
    function SlackComponent(media, _iconRegistry, _domSanitizer) {
        this.media = media;
        this._iconRegistry = _iconRegistry;
        this._domSanitizer = _domSanitizer;
        this.name = 'Contacts';
        this.routes = [
            {
                title: 'Inbox',
                route: '/',
                icon: 'email',
            }, {
                title: 'Snoozed',
                route: '/',
                icon: 'access_time',
            }, {
                title: 'Drafts',
                route: '/',
                icon: 'drafts',
            }, {
                title: 'Sent',
                route: '/',
                icon: 'send',
            }, {
                title: 'Trash',
                route: '/',
                icon: 'delete',
            },
        ];
        this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux', this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/teradata-ux.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'covalent', this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));
        this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark', this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent-mark.svg'));
    }
    SlackComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'anms-chat',
            template: __webpack_require__(/*! ./slack.component.html */ "./src/app/static/slack/slack.component.html")
        }),
        __metadata("design:paramtypes", [_covalent_core__WEBPACK_IMPORTED_MODULE_3__["TdMediaService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatIconRegistry"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"]])
    ], SlackComponent);
    return SlackComponent;
}());



/***/ }),

/***/ "./src/app/static/static-routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/static/static-routing.module.ts ***!
  \*************************************************/
/*! exports provided: StaticRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaticRoutingModule", function() { return StaticRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./about/about.component */ "./src/app/static/about/about.component.ts");
/* harmony import */ var _features_features_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/features.component */ "./src/app/static/features/features.component.ts");
/* harmony import */ var _slack_slack_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./slack/slack.component */ "./src/app/static/slack/slack.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    { path: 'about', component: _about_about_component__WEBPACK_IMPORTED_MODULE_2__["AboutComponent"], data: { title: 'About' } },
    {
        path: 'features',
        component: _features_features_component__WEBPACK_IMPORTED_MODULE_3__["FeaturesComponent"],
        data: { title: 'Features' }
    },
    {
        path: 'slack',
        component: _slack_slack_component__WEBPACK_IMPORTED_MODULE_4__["SlackComponent"],
        data: { title: 'Slack Chat' }
    }
];
var StaticRoutingModule = /** @class */ (function () {
    function StaticRoutingModule() {
    }
    StaticRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], StaticRoutingModule);
    return StaticRoutingModule;
}());



/***/ }),

/***/ "./src/app/static/static.module.ts":
/*!*****************************************!*\
  !*** ./src/app/static/static.module.ts ***!
  \*****************************************/
/*! exports provided: StaticModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaticModule", function() { return StaticModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/shared */ "./src/app/shared/index.ts");
/* harmony import */ var _static_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./static-routing.module */ "./src/app/static/static-routing.module.ts");
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./about/about.component */ "./src/app/static/about/about.component.ts");
/* harmony import */ var _slack_slack_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./slack/slack.component */ "./src/app/static/slack/slack.component.ts");
/* harmony import */ var _features_features_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./features/features.component */ "./src/app/static/features/features.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var StaticModule = /** @class */ (function () {
    function StaticModule() {
    }
    StaticModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_app_shared__WEBPACK_IMPORTED_MODULE_1__["SharedModule"], _static_routing_module__WEBPACK_IMPORTED_MODULE_2__["StaticRoutingModule"]],
            declarations: [_about_about_component__WEBPACK_IMPORTED_MODULE_3__["AboutComponent"], _features_features_component__WEBPACK_IMPORTED_MODULE_5__["FeaturesComponent"], _slack_slack_component__WEBPACK_IMPORTED_MODULE_4__["SlackComponent"]]
        })
    ], StaticModule);
    return StaticModule;
}());



/***/ }),

/***/ "./src/assets/logo.png":
/*!*****************************!*\
  !*** ./src/assets/logo.png ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo.png";

/***/ }),

/***/ "./src/assets/release-butler.png":
/*!***************************************!*\
  !*** ./src/assets/release-butler.png ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "release-butler.png";

/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var packageJson = __webpack_require__(/*! ../../package.json */ "./package.json");
var environment = {
    appName: 'Angular Ngrx Material Starter',
    envName: 'DEV',
    production: false,
    versions: {
        app: packageJson.version,
        angular: packageJson.dependencies['@angular/core'],
        ngrx: packageJson.dependencies['@ngrx/store'],
        material: packageJson.dependencies['@angular/material'],
        bootstrap: packageJson.dependencies.bootstrap,
        rxjs: packageJson.dependencies.rxjs,
        angularCli: packageJson.devDependencies['@angular/cli'],
        typescript: packageJson.devDependencies['typescript']
    }
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]);


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\cherk\Demos\mouadcherkaoui.github.io\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map