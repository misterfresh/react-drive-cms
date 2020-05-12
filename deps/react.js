import { useState, useReducer, useEffect, useLayoutEffect, useRef, useImperativeHandle, useMemo, useCallback, useContext, useDebugValue } from './hooks.module.js';
export * from './hooks.module.js';
import { Component, createElement, options, toChildArray, hydrate, render, _unmount, cloneElement, createRef, createContext, Fragment } from './preact.js';
export { createElement, createContext, createRef, Fragment, Component } from './preact.js';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param {O} obj The object to copy properties to
 * @param {P} props The object to copy properties from
 * @returns {O & P}
 */
function assign(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return (
    /** @type {O & P} */
    obj
  );
}
/**
 * Check if two objects have a different shape
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */

function shallowDiffers(a, b) {
  for (var i in a) {
    if (i !== '__source' && !(i in b)) { return true; }
  }

  for (var _i in b) {
    if (_i !== '__source' && a[_i] !== b[_i]) { return true; }
  }

  return false;
}

/**
 * Component class with a predefined `shouldComponentUpdate` implementation
 */

var PureComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(PureComponent, _Component);

  function PureComponent(props) {
    var _this;

    _this = _Component.call(this, props) || this; // Some third-party libraries check if this property is present

    _this.isPureReactComponent = true;
    return _this;
  }

  var _proto = PureComponent.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(props, state) {
    return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
  };

  return PureComponent;
}(Component);

/**
 * Memoize a component, so that it only updates when the props actually have
 * changed. This was previously known as `React.pure`.
 * @param {import('./internal').FunctionalComponent} c functional component
 * @param {(prev: object, next: object) => boolean} [comparer] Custom equality function
 * @returns {import('./internal').FunctionalComponent}
 */

function memo(c, comparer) {
  function shouldUpdate(nextProps) {
    var ref = this.props.ref;
    var updateRef = ref == nextProps.ref;

    if (!updateRef && ref) {
      ref.call ? ref(null) : ref.current = null;
    }

    if (!comparer) {
      return shallowDiffers(this.props, nextProps);
    }

    return !comparer(this.props, nextProps) || !updateRef;
  }

  function Memoed(props) {
    this.shouldComponentUpdate = shouldUpdate;
    return createElement(c, assign({}, props));
  }

  Memoed.prototype.isReactComponent = true;
  Memoed.displayName = 'Memo(' + (c.displayName || c.name) + ')';
  Memoed._forwarded = true;
  return Memoed;
}

var oldDiffHook = options._diff;

options._diff = function (vnode) {
  if (vnode.type && vnode.type._forwarded && vnode.ref) {
    vnode.props.ref = vnode.ref;
    vnode.ref = null;
  }

  if (oldDiffHook) { oldDiffHook(vnode); }
};
/**
 * Pass ref down to a child. This is mainly used in libraries with HOCs that
 * wrap components. Using `forwardRef` there is an easy way to get a reference
 * of the wrapped component instead of one of the wrapper itself.
 * @param {import('./index').ForwardFn} fn
 * @returns {import('./internal').FunctionalComponent}
 */


function forwardRef(fn) {
  function Forwarded(props) {
    var clone = assign({}, props);
    delete clone.ref;
    return fn(clone, props.ref);
  }

  Forwarded.prototype.isReactComponent = Forwarded._forwarded = true;
  Forwarded.displayName = 'ForwardRef(' + (fn.displayName || fn.name) + ')';
  return Forwarded;
}

var mapFn = function mapFn(children, fn) {
  if (!children) { return null; }
  return toChildArray(children).reduce(function (acc, value, index) {
    return acc.concat(fn(value, index));
  }, []);
}; // This API is completely unnecessary for Preact, so it's basically passthrough.


var Children = {
  map: mapFn,
  forEach: mapFn,
  count: function count(children) {
    return children ? toChildArray(children).length : 0;
  },
  only: function only(children) {
    children = toChildArray(children);

    if (children.length !== 1) {
      throw new Error('Children.only() expects only one child.');
    }

    return children[0];
  },
  toArray: toChildArray
};

var oldCatchError = options._catchError;

options._catchError = function (error, newVNode, oldVNode) {
  if (error.then) {
    /** @type {import('./internal').Component} */
    var component;
    var vnode = newVNode;

    for (; vnode = vnode._parent;) {
      if ((component = vnode._component) && component._childDidSuspend) {
        // Don't call oldCatchError if we found a Suspense
        return component._childDidSuspend(error, newVNode._component);
      }
    }
  }

  oldCatchError(error, newVNode, oldVNode);
};

function detachedClone(vnode) {
  if (vnode) {
    vnode = assign({}, vnode);
    vnode._component = null;
    vnode._children = vnode._children && vnode._children.map(detachedClone);
  }

  return vnode;
} // having custom inheritance instead of a class here saves a lot of bytes


function Suspense() {
  // we do not call super here to golf some bytes...
  this._pendingSuspensionCount = 0;
  this._suspenders = null;
  this._detachOnNextRender = null;
} // Things we do here to save some bytes but are not proper JS inheritance:
// - call `new Component()` as the prototype
// - do not set `Suspense.prototype.constructor` to `Suspense`

Suspense.prototype = new Component();
/**
 * @param {Promise} promise The thrown promise
 * @param {Component<any, any>} suspendingComponent The suspending component
 */

Suspense.prototype._childDidSuspend = function (promise, suspendingComponent) {
  /** @type {import('./internal').SuspenseComponent} */
  var c = this;

  if (c._suspenders == null) {
    c._suspenders = [];
  }

  c._suspenders.push(suspendingComponent);

  var resolve = suspended(c._vnode);
  var resolved = false;

  var onResolved = function onResolved() {
    if (resolved) { return; }
    resolved = true;

    if (resolve) {
      resolve(onSuspensionComplete);
    } else {
      onSuspensionComplete();
    }
  };

  suspendingComponent._suspendedComponentWillUnmount = suspendingComponent.componentWillUnmount;

  suspendingComponent.componentWillUnmount = function () {
    onResolved();

    if (suspendingComponent._suspendedComponentWillUnmount) {
      suspendingComponent._suspendedComponentWillUnmount();
    }
  };

  var onSuspensionComplete = function onSuspensionComplete() {
    if (! --c._pendingSuspensionCount) {
      c._vnode._children[0] = c.state._suspended;
      c.setState({
        _suspended: c._detachOnNextRender = null
      });

      var _suspended;

      while (_suspended = c._suspenders.pop()) {
        _suspended.forceUpdate();
      }
    }
  };

  if (!c._pendingSuspensionCount++) {
    c.setState({
      _suspended: c._detachOnNextRender = c._vnode._children[0]
    });
  }

  promise.then(onResolved, onResolved);
};

Suspense.prototype.render = function (props, state) {
  if (this._detachOnNextRender) {
    this._vnode._children[0] = detachedClone(this._detachOnNextRender);
    this._detachOnNextRender = null;
  }

  return [createElement(Component, null, state._suspended ? null : props.children), state._suspended && props.fallback];
};
/**
 * Checks and calls the parent component's _suspended method, passing in the
 * suspended vnode. This is a way for a parent (e.g. SuspenseList) to get notified
 * that one of its children/descendants suspended.
 *
 * The parent MAY return a callback. The callback will get called when the
 * suspension resolves, notifying the parent of the fact.
 * Moreover, the callback gets function `unsuspend` as a parameter. The resolved
 * child descendant will not actually get unsuspended until `unsuspend` gets called.
 * This is a way for the parent to delay unsuspending.
 *
 * If the parent does not return a callback then the resolved vnode
 * gets unsuspended immediately when it resolves.
 *
 * @param {import('../src/internal').VNode} vnode
 * @returns {((unsuspend: () => void) => void)?}
 */


function suspended(vnode) {
  var component = vnode._parent._component;
  return component && component._suspended && component._suspended(vnode);
}
function lazy(loader) {
  var prom;
  var component;
  var error;

  function Lazy(props) {
    if (!prom) {
      prom = loader();
      prom.then(function (exports) {
        component = exports.default || exports;
      }, function (e) {
        error = e;
      });
    }

    if (error) {
      throw error;
    }

    if (!component) {
      throw prom;
    }

    return createElement(component, props);
  }

  Lazy.displayName = 'Lazy';
  Lazy._forwarded = true;
  return Lazy;
}

var SUSPENDED_COUNT = 0;
var RESOLVED_COUNT = 1;
var NEXT_NODE = 2; // Having custom inheritance instead of a class here saves a lot of bytes.

function SuspenseList() {
  this._next = null;
  this._map = null;
} // Mark one of child's earlier suspensions as resolved.
// Some pending callbacks may become callable due to this
// (e.g. the last suspended descendant gets resolved when
// revealOrder === 'together'). Process those callbacks as well.

var resolve = function resolve(list, child, node) {
  if (++node[RESOLVED_COUNT] === node[SUSPENDED_COUNT]) {
    // The number a child (or any of its descendants) has been suspended
    // matches the number of times it's been resolved. Therefore we
    // mark the child as completely resolved by deleting it from ._map.
    // This is used to figure out when *all* children have been completely
    // resolved when revealOrder is 'together'.
    list._map.delete(child);
  } // If revealOrder is falsy then we can do an early exit, as the
  // callbacks won't get queued in the node anyway.
  // If revealOrder is 'together' then also do an early exit
  // if all suspended descendants have not yet been resolved.


  if (!list.props.revealOrder || list.props.revealOrder[0] === 't' && list._map.size) {
    return;
  } // Walk the currently suspended children in order, calling their
  // stored callbacks on the way. Stop if we encounter a child that
  // has not been completely resolved yet.


  node = list._next;

  while (node) {
    while (node.length > 3) {
      node.pop()();
    }

    if (node[RESOLVED_COUNT] < node[SUSPENDED_COUNT]) {
      break;
    }

    list._next = node = node[NEXT_NODE];
  }
}; // Things we do here to save some bytes but are not proper JS inheritance:
// - call `new Component()` as the prototype
// - do not set `Suspense.prototype.constructor` to `Suspense`


SuspenseList.prototype = new Component();

SuspenseList.prototype._suspended = function (child) {
  var list = this;
  var delegated = suspended(list._vnode);

  var node = list._map.get(child);

  node[SUSPENDED_COUNT]++;
  return function (unsuspend) {
    var wrappedUnsuspend = function wrappedUnsuspend() {
      if (!list.props.revealOrder) {
        // Special case the undefined (falsy) revealOrder, as there
        // is no need to coordinate a specific order or unsuspends.
        unsuspend();
      } else {
        node.push(unsuspend);
        resolve(list, child, node);
      }
    };

    if (delegated) {
      delegated(wrappedUnsuspend);
    } else {
      wrappedUnsuspend();
    }
  };
};

SuspenseList.prototype.render = function (props) {
  this._next = null;
  this._map = new Map();
  var children = toChildArray(props.children);

  if (props.revealOrder && props.revealOrder[0] === 'b') {
    // If order === 'backwards' (or, well, anything starting with a 'b')
    // then flip the child list around so that the last child will be
    // the first in the linked list.
    children.reverse();
  } // Build the linked list. Iterate through the children in reverse order
  // so that `_next` points to the first linked list node to be resolved.


  for (var i = children.length; i--;) {
    // Create a new linked list node as an array of form:
    // 	[suspended_count, resolved_count, next_node]
    // where suspended_count and resolved_count are numeric counters for
    // keeping track how many times a node has been suspended and resolved.
    //
    // Note that suspended_count starts from 1 instead of 0, so we can block
    // processing callbacks until componentDidMount has been called. In a sense
    // node is suspended at least until componentDidMount gets called!
    //
    // Pending callbacks are added to the end of the node:
    // 	[suspended_count, resolved_count, next_node, callback_0, callback_1, ...]
    this._map.set(children[i], this._next = [1, 0, this._next]);
  }

  return props.children;
};

SuspenseList.prototype.componentDidUpdate = SuspenseList.prototype.componentDidMount = function () {
  // Iterate through all children after mounting for two reasons:
  // 1. As each node[SUSPENDED_COUNT] starts from 1, this iteration increases
  //    each node[RELEASED_COUNT] by 1, therefore balancing the counters.
  //    The nodes can now be completely consumed from the linked list.
  // 2. Handle nodes that might have gotten resolved between render and
  //    componentDidMount.
  var list = this;

  list._map.forEach(function (node, child) {
    resolve(list, child, node);
  });
};

var ContextProvider =
/*#__PURE__*/
function () {
  function ContextProvider() {}

  var _proto = ContextProvider.prototype;

  _proto.getChildContext = function getChildContext() {
    return this.props.context;
  };

  _proto.render = function render$$1(props) {
    return props.children;
  };

  return ContextProvider;
}();
/**
 * Portal component
 * @param {object | null | undefined} props
 */


function Portal(props) {
  var _this = this;

  var container = props.container;
  var wrap = createElement(ContextProvider, {
    context: _this.context
  }, props.vnode); // When we change container we should clear our old container and
  // indicate a new mount.

  if (_this._container && _this._container !== container) {
    if (_this._temp.parentNode) { _this._container.removeChild(_this._temp); }

    _unmount(_this._wrap);

    _this._hasMounted = false;
  } // When props.vnode is undefined/false/null we are dealing with some kind of
  // conditional vnode. This should not trigger a render.


  if (props.vnode) {
    if (!_this._hasMounted) {
      // Create a placeholder that we can use to insert into.
      _this._temp = document.createTextNode(''); // Hydrate existing nodes to keep the dom intact, when rendering
      // wrap into the container.

      hydrate('', container); // Append to the container (this matches React's behavior)

      container.appendChild(_this._temp); // At this point we have mounted and should set our container.

      _this._hasMounted = true;
      _this._container = container; // Render our wrapping element into temp.

      render(wrap, container, _this._temp);
      _this._children = _this._temp._children;
    } else {
      // When we have mounted and the vnode is present it means the
      // props have changed or a parent is triggering a rerender.
      // This implies we only need to call render. But we need to keep
      // the old tree around, otherwise will treat the vnodes as new and
      // will wrongly call `componentDidMount` on them
      container._children = _this._children;
      render(wrap, container);
      _this._children = container._children;
    }
  } // When we come from a conditional render, on a mounted
  // portal we should clear the DOM.
  else if (_this._hasMounted) {
      if (_this._temp.parentNode) { _this._container.removeChild(_this._temp); }

      _unmount(_this._wrap);
    } // Set the wrapping element for future unmounting.


  _this._wrap = wrap;

  _this.componentWillUnmount = function () {
    if (_this._temp.parentNode) { _this._container.removeChild(_this._temp); }

    _unmount(_this._wrap);
  };

  return null;
}
/**
 * Create a `Portal` to continue rendering the vnode tree at a different DOM node
 * @param {import('./internal').VNode} vnode The vnode to render
 * @param {import('./internal').PreactElement} container The DOM node to continue rendering in to.
 */


function createPortal(vnode, container) {
  return createElement(Portal, {
    vnode: vnode,
    container: container
  });
}

/**
 * Normalize event handlers like react does. Most famously it uses `onChange` for any input element.
 * @param {import('./internal').VNode} vnode The vnode to normalize events on
 */
function applyEventNormalization(_ref) {
  var type = _ref.type,
      props = _ref.props;
  if (!props || typeof type != 'string') { return; }
  var newProps = {};

  for (var i in props) {
    if (/^on(Ani|Tra|Tou)/.test(i)) {
      props[i.toLowerCase()] = props[i];
      delete props[i];
    }

    newProps[i.toLowerCase()] = i;
  }

  if (newProps.ondoubleclick) {
    props.ondblclick = props[newProps.ondoubleclick];
    delete props[newProps.ondoubleclick];
  }

  if (newProps.onbeforeinput) {
    props.onbeforeinput = props[newProps.onbeforeinput];
    delete props[newProps.onbeforeinput];
  } // for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:


  if (newProps.onchange && (type === 'textarea' || type.toLowerCase() === 'input' && !/^fil|che|ra/i.test(props.type))) {
    var normalized = newProps.oninput || 'oninput';

    if (!props[normalized]) {
      props[normalized] = props[newProps.onchange];
      delete props[newProps.onchange];
    }
  }
}

var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/; // Some libraries like `react-virtualized` explicitly check for this.

Component.prototype.isReactComponent = {};
var REACT_ELEMENT_TYPE$1 = typeof Symbol != 'undefined' && Symbol.for && Symbol.for('react.element') || 0xeac7;
/**
 * Proxy render() since React returns a Component reference.
 * @param {import('./internal').VNode} vnode VNode tree to render
 * @param {import('./internal').PreactElement} parent DOM node to render vnode tree into
 * @param {() => void} [callback] Optional callback that will be called after rendering
 * @returns {import('./internal').Component | null} The root component reference or null
 */

function render$1(vnode, parent, callback) {
  // React destroys any existing DOM nodes, see #1727
  // ...but only on the first render, see #1828
  if (parent._children == null) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  render(vnode, parent);
  if (typeof callback == 'function') { callback(); }
  return vnode ? vnode._component : null;
}
function hydrate$1(vnode, parent, callback) {
  hydrate(vnode, parent);
  if (typeof callback == 'function') { callback(); }
  return vnode ? vnode._component : null;
}
var oldEventHook = options.event;

options.event = function (e) {
  if (oldEventHook) { e = oldEventHook(e); }

  e.persist = function () {};

  var stoppedPropagating = false,
      defaultPrevented = false;
  var origStopPropagation = e.stopPropagation;

  e.stopPropagation = function () {
    origStopPropagation.call(e);
    stoppedPropagating = true;
  };

  var origPreventDefault = e.preventDefault;

  e.preventDefault = function () {
    origPreventDefault.call(e);
    defaultPrevented = true;
  };

  e.isPropagationStopped = function () {
    return stoppedPropagating;
  };

  e.isDefaultPrevented = function () {
    return defaultPrevented;
  };

  return e.nativeEvent = e;
}; // Patch in `UNSAFE_*` lifecycle hooks


function setSafeDescriptor(proto, key) {
  if (proto['UNSAFE_' + key] && !proto[key]) {
    Object.defineProperty(proto, key, {
      configurable: false,
      get: function get() {
        return this['UNSAFE_' + key];
      },
      // This `set` is only used if a user sets a lifecycle like cWU
      // after setting a lifecycle like UNSAFE_cWU. I doubt anyone
      // actually does this in practice so not testing it

      /* istanbul ignore next */
      set: function set(v) {
        this['UNSAFE_' + key] = v;
      }
    });
  }
}

var classNameDescriptor = {
  configurable: true,
  get: function get() {
    return this.class;
  }
};
var oldVNodeHook = options.vnode;

options.vnode = function (vnode) {
  vnode.$$typeof = REACT_ELEMENT_TYPE$1;
  var type = vnode.type;
  var props = vnode.props;

  if (type) {
    // Alias `class` prop to `className` if available
    if (props.class != props.className) {
      classNameDescriptor.enumerable = 'className' in props;
      if (props.className != null) { props.class = props.className; }
      Object.defineProperty(props, 'className', classNameDescriptor);
    } // Apply DOM VNode compat


    if (typeof type != 'function') {
      // Apply defaultValue to value
      if (props.defaultValue && props.value !== undefined) {
        if (!props.value && props.value !== 0) {
          props.value = props.defaultValue;
        }

        delete props.defaultValue;
      } // Add support for array select values: <select value={[]} />


      if (Array.isArray(props.value) && props.multiple && type === 'select') {
        toChildArray(props.children).forEach(function (child) {
          if (props.value.indexOf(child.props.value) != -1) {
            child.props.selected = true;
          }
        });
        delete props.value;
      } // Normalize DOM vnode properties.


      var shouldSanitize, attrs, i;

      for (i in props) {
        if (shouldSanitize = CAMEL_PROPS.test(i)) { break; }
      }

      if (shouldSanitize) {
        attrs = vnode.props = {};

        for (i in props) {
          attrs[CAMEL_PROPS.test(i) ? i.replace(/[A-Z0-9]/, '-$&').toLowerCase() : i] = props[i];
        }
      }
    } // Events


    applyEventNormalization(vnode); // Component base class compat
    // We can't just patch the base component class, because components that use
    // inheritance and are transpiled down to ES5 will overwrite our patched
    // getters and setters. See #1941

    if (typeof type == 'function' && !type._patchedLifecycles && type.prototype) {
      setSafeDescriptor(type.prototype, 'componentWillMount');
      setSafeDescriptor(type.prototype, 'componentWillReceiveProps');
      setSafeDescriptor(type.prototype, 'componentWillUpdate');
      type._patchedLifecycles = true;
    }
  }

  if (oldVNodeHook) { oldVNodeHook(vnode); }
};

var version = '16.8.0'; // trick libraries to think we are react

/**
 * Legacy version of createElement.
 * @param {import('./internal').VNode["type"]} type The node name or Component constructor
 */

function createFactory(type) {
  return createElement.bind(null, type);
}
/**
 * Check if the passed element is a valid (p)react node.
 * @param {*} element The element to check
 * @returns {boolean}
 */


function isValidElement(element) {
  return !!element && element.$$typeof === REACT_ELEMENT_TYPE$1;
}
/**
 * Wrap `cloneElement` to abort if the passed element is not a valid element and apply
 * all vnode normalizations.
 * @param {import('./internal').VNode} element The vnode to clone
 * @param {object} props Props to add when cloning
 * @param {Array<import('./internal').ComponentChildren>} rest Optional component children
 */


function cloneElement$1(element) {
  if (!isValidElement(element)) { return element; }
  return cloneElement.apply(null, arguments);
}
/**
 * Remove a component tree from the DOM, including state and event handlers.
 * @param {import('./internal').PreactElement} container
 * @returns {boolean}
 */


function unmountComponentAtNode(container) {
  if (container._children) {
    render(null, container);
    return true;
  }

  return false;
}
/**
 * Get the matching DOM node for a component
 * @param {import('./internal').Component} component
 * @returns {import('./internal').PreactElement | null}
 */


function findDOMNode(component) {
  return component && (component.base || component.nodeType === 1 && component) || null;
}
/**
 * Deprecated way to control batched rendering inside the reconciler, but we
 * already schedule in batches inside our rendering code
 * @template Arg
 * @param {(arg: Arg) => void} callback function that triggers the updated
 * @param {Arg} [arg] Optional argument that can be passed to the callback
 */
// eslint-disable-next-line camelcase


var unstable_batchedUpdates = function unstable_batchedUpdates(callback, arg) {
  return callback(arg);
};

import htm from './htm.module.js';

const html = htm.bind(createElement);

var index = {
  useState: useState,
  useReducer: useReducer,
  useEffect: useEffect,
  useLayoutEffect: useLayoutEffect,
  useRef: useRef,
  useImperativeHandle: useImperativeHandle,
  useMemo: useMemo,
  useCallback: useCallback,
  useContext: useContext,
  useDebugValue: useDebugValue,
  version: version,
  Children: Children,
  render: render$1,
  hydrate: render$1,
  unmountComponentAtNode: unmountComponentAtNode,
  createPortal: createPortal,
  createElement: createElement,
  createContext: createContext,
  createFactory: createFactory,
  cloneElement: cloneElement$1,
  createRef: createRef,
  Fragment: Fragment,
  isValidElement: isValidElement,
  findDOMNode: findDOMNode,
  Component: Component,
  PureComponent: PureComponent,
  memo: memo,
  forwardRef: forwardRef,
  unstable_batchedUpdates: unstable_batchedUpdates,
  Suspense: Suspense,
  SuspenseList: SuspenseList,
  lazy: lazy,
  html: html,
};

export default index;
export { version, Children, render$1 as render, hydrate$1 as hydrate, unmountComponentAtNode, createPortal, createFactory, cloneElement$1 as cloneElement, isValidElement, findDOMNode, PureComponent, memo, forwardRef, unstable_batchedUpdates, Suspense, SuspenseList, lazy, html };
