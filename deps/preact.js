var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

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
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param {Node} node The node to remove
 */

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) { parentNode.removeChild(node); }
}

/**
 * Find the closest error boundary to a thrown error and call it
 * @param {object} error The thrown value
 * @param {import('../internal').VNode} vnode The vnode that threw
 * the error that was caught (except for unmounting when this parameter
 * is the highest parent that was being unmounted)
 */

function _catchError(error, vnode) {
  /** @type {import('../internal').Component} */
  var component, hasCaught;

  for (; vnode = vnode._parent;) {
    if ((component = vnode._component) && !component._processingException) {
      try {
        if (component.constructor && component.constructor.getDerivedStateFromError != null) {
          hasCaught = true;
          component.setState(component.constructor.getDerivedStateFromError(error));
        }

        if (component.componentDidCatch != null) {
          hasCaught = true;
          component.componentDidCatch(error);
        }

        if (hasCaught) { return enqueueRender(component._pendingError = component); }
      } catch (e) {
        error = e;
      }
    }
  }

  throw error;
}

/**
 * The `option` object can potentially contain callback functions
 * that are called during various stages of our renderer. This is the
 * foundation on which all our addons like `preact/debug`, `preact/compat`,
 * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`
 * for a full list of available option hooks (most editors/IDEs allow you to
 * ctrl+click or cmd+click on mac the type definition below).
 * @type {import('./internal').Options}
 */

var options = {
  _catchError: _catchError
};

/**
 * Create an virtual node (used for JSX)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * constructor for this virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
 * @returns {import('./internal').VNode}
 */

function createElement(type, props, children) {
  var arguments$1 = arguments;

  var normalizedProps = {},
      i;

  for (i in props) {
    if (i !== 'key' && i !== 'ref') { normalizedProps[i] = props[i]; }
  }

  if (arguments.length > 3) {
    children = [children]; // https://github.com/preactjs/preact/issues/1916

    for (i = 3; i < arguments.length; i++) {
      children.push(arguments$1[i]);
    }
  }

  if (children != null) {
    normalizedProps.children = children;
  } // If a Component VNode, check for and apply defaultProps
  // Note: type may be undefined in development, must never error here.


  if (typeof type == 'function' && type.defaultProps != null) {
    for (i in type.defaultProps) {
      if (normalizedProps[i] === undefined) {
        normalizedProps[i] = type.defaultProps[i];
      }
    }
  }

  return createVNode(type, normalizedProps, props && props.key, props && props.ref, null);
}
/**
 * Create a VNode (used internally by Preact)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param {string | number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {import('./internal').VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {import('./internal').VNode}
 */

function createVNode(type, props, key, ref, original) {
  // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
  // Do not inline into createElement and coerceToVNode!
  var vnode = {
    type: type,
    props: props,
    key: key,
    ref: ref,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    // _nextDom must be initialized to undefined b/c it will eventually
    // be set to dom.nextSibling which can return `null` and it is important
    // to be able to distinguish between an uninitialized _nextDom and
    // a _nextDom that has been set to `null`
    _nextDom: undefined,
    _component: null,
    constructor: undefined,
    _original: original
  };
  if (original == null) { vnode._original = vnode; }
  if (options.vnode) { options.vnode(vnode); }
  return vnode;
}
function createRef() {
  return {};
}
function Fragment(props) {
  return props.children;
}
/**
 * Check if a the argument is a valid Preact VNode.
 * @param {*} vnode
 * @returns {vnode is import('./internal').VNode}
 */

var isValidElement = function isValidElement(vnode) {
  return vnode != null && vnode.constructor === undefined;
};

/**
 * Base Component class. Provides `setState()` and `forceUpdate()`, which
 * trigger rendering
 * @param {object} props The initial component props
 * @param {object} context The initial context from parent components'
 * getChildContext
 */

function Component(props, context) {
  this.props = props;
  this.context = context;
}
/**
 * Update component state and schedule a re-render.
 * @param {object | ((s: object, p: object) => object)} update A hash of state
 * properties to update with new values or a function that given the current
 * state and props returns a new partial state
 * @param {() => void} [callback] A function to be called once component state is
 * updated
 */

Component.prototype.setState = function (update, callback) {
  // only clone state when copying to nextState the first time.
  var s;

  if (this._nextState !== this.state) {
    s = this._nextState;
  } else {
    s = this._nextState = assign({}, this.state);
  }

  if (typeof update == 'function') {
    update = update(s, this.props);
  }

  if (update) {
    assign(s, update);
  } // Skip update if updater function returned null


  if (update == null) { return; }

  if (this._vnode) {
    if (callback) { this._renderCallbacks.push(callback); }
    enqueueRender(this);
  }
};
/**
 * Immediately perform a synchronous re-render of the component
 * @param {() => void} [callback] A function to be called after component is
 * re-rendered
 */


Component.prototype.forceUpdate = function (callback) {
  if (this._vnode) {
    // Set render mode so that we can differentiate where the render request
    // is coming from. We need this because forceUpdate should never call
    // shouldComponentUpdate
    this._force = true;
    if (callback) { this._renderCallbacks.push(callback); }
    enqueueRender(this);
  }
};
/**
 * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
 * Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
 * @param {object} props Props (eg: JSX attributes) received from parent
 * element/component
 * @param {object} state The component's current state
 * @param {object} context Context object, as returned by the nearest
 * ancestor's `getChildContext()`
 * @returns {import('./index').ComponentChildren | void}
 */


Component.prototype.render = Fragment;
/**
 * @param {import('./internal').VNode} vnode
 * @param {number | null} [childIndex]
 */

function getDomSibling(vnode, childIndex) {
  if (childIndex == null) {
    // Use childIndex==null as a signal to resume the search from the vnode's sibling
    return vnode._parent ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
  }

  var sibling;

  for (; childIndex < vnode._children.length; childIndex++) {
    sibling = vnode._children[childIndex];

    if (sibling != null && sibling._dom != null) {
      // Since updateParentDomPointers keeps _dom pointer correct,
      // we can rely on _dom to tell us if this subtree contains a
      // rendered DOM node, and what the first rendered DOM node is
      return sibling._dom;
    }
  } // If we get here, we have not found a DOM node in this vnode's children.
  // We must resume from this vnode's sibling (in it's parent _children array)
  // Only climb up and search the parent if we aren't searching through a DOM
  // VNode (meaning we reached the DOM parent of the original vnode that began
  // the search)


  return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
}
/**
 * Trigger in-place re-rendering of a component.
 * @param {import('./internal').Component} component The component to rerender
 */

function renderComponent(component) {
  var vnode = component._vnode,
      oldDom = vnode._dom,
      parentDom = component._parentDom;

  if (parentDom) {
    var commitQueue = [];
    var oldVNode = assign({}, vnode);
    oldVNode._original = oldVNode;
    var newDom = diff(parentDom, vnode, oldVNode, component._globalContext, parentDom.ownerSVGElement !== undefined, null, commitQueue, oldDom == null ? getDomSibling(vnode) : oldDom);
    commitRoot(commitQueue, vnode);

    if (newDom != oldDom) {
      updateParentDomPointers(vnode);
    }
  }
}
/**
 * @param {import('./internal').VNode} vnode
 */


function updateParentDomPointers(vnode) {
  if ((vnode = vnode._parent) != null && vnode._component != null) {
    vnode._dom = vnode._component.base = null;

    for (var i = 0; i < vnode._children.length; i++) {
      var child = vnode._children[i];

      if (child != null && child._dom != null) {
        vnode._dom = vnode._component.base = child._dom;
        break;
      }
    }

    return updateParentDomPointers(vnode);
  }
}
/**
 * The render queue
 * @type {Array<import('./internal').Component>}
 */


var rerenderQueue = [];
var rerenderCount = 0;
/**
 * Asynchronously schedule a callback
 * @type {(cb: () => void) => void}
 */

/* istanbul ignore next */
// Note the following line isn't tree-shaken by rollup cuz of rollup/rollup#2566

var defer = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
/*
 * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
 * important that contributors to Preact can consistently reason about what calls to `setState`, etc.
 * do, and when their effects will be applied. See the links below for some further reading on designing
 * asynchronous APIs.
 * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
 * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
 */

var prevDebounce;
/**
 * Enqueue a rerender of a component
 * @param {import('./internal').Component} c The component to rerender
 */

function enqueueRender(c) {
  if (!c._dirty && (c._dirty = true) && rerenderQueue.push(c) && !rerenderCount++ || prevDebounce !== options.debounceRendering) {
    prevDebounce = options.debounceRendering;
    (prevDebounce || defer)(process);
  }
}
/** Flush the render queue by rerendering all queued components */

function process() {
  var queue;

  while (rerenderCount = rerenderQueue.length) {
    queue = rerenderQueue.sort(function (a, b) {
      return a._vnode._depth - b._vnode._depth;
    });
    rerenderQueue = []; // Don't update `renderCount` yet. Keep its value non-zero to prevent unnecessary
    // process() calls from getting scheduled while `queue` is still being consumed.

    queue.some(function (c) {
      if (c._dirty) { renderComponent(c); }
    });
  }
}

/**
 * Diff the children of a virtual node
 * @param {import('../internal').PreactElement} parentDom The DOM element whose
 * children are being diffed
 * @param {import('../internal').VNode} newParentVNode The new virtual
 * node whose children should be diff'ed against oldParentVNode
 * @param {import('../internal').VNode} oldParentVNode The old virtual
 * node whose children should be diff'ed against newParentVNode
 * @param {object} globalContext The current context object - modified by getChildContext
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {Node | Text} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} isHydrating Whether or not we are in hydration
 */

function diffChildren(parentDom, newParentVNode, oldParentVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating) {
  var i, j, oldVNode, newDom, sibDom, firstChildDom, refs; // This is a compression of oldParentVNode!=null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR
  // as EMPTY_OBJ._children should be `undefined`.

  var oldChildren = oldParentVNode && oldParentVNode._children || EMPTY_ARR;
  var oldChildrenLength = oldChildren.length; // Only in very specific places should this logic be invoked (top level `render` and `diffElementNodes`).
  // I'm using `EMPTY_OBJ` to signal when `diffChildren` is invoked in these situations. I can't use `null`
  // for this purpose, because `null` is a valid value for `oldDom` which can mean to skip to this logic
  // (e.g. if mounting a new tree in which the old DOM should be ignored (usually for Fragments).

  if (oldDom == EMPTY_OBJ) {
    if (excessDomChildren != null) {
      oldDom = excessDomChildren[0];
    } else if (oldChildrenLength) {
      oldDom = getDomSibling(oldParentVNode, 0);
    } else {
      oldDom = null;
    }
  }

  i = 0;
  newParentVNode._children = toChildArray(newParentVNode._children, function (childVNode) {
    if (childVNode != null) {
      childVNode._parent = newParentVNode;
      childVNode._depth = newParentVNode._depth + 1; // Check if we find a corresponding element in oldChildren.
      // If found, delete the array item by setting to `undefined`.
      // We use `undefined`, as `null` is reserved for empty placeholders
      // (holes).

      oldVNode = oldChildren[i];

      if (oldVNode === null || oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
        oldChildren[i] = undefined;
      } else {
        // Either oldVNode === undefined or oldChildrenLength > 0,
        // so after this loop oldVNode == null or oldVNode is a valid value.
        for (j = 0; j < oldChildrenLength; j++) {
          oldVNode = oldChildren[j]; // If childVNode is unkeyed, we only match similarly unkeyed nodes, otherwise we match by key.
          // We always match by type (in either case).

          if (oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type) {
            oldChildren[j] = undefined;
            break;
          }

          oldVNode = null;
        }
      }

      oldVNode = oldVNode || EMPTY_OBJ; // Morph the old element into the new one, but don't append it to the dom yet

      newDom = diff(parentDom, childVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating);

      if ((j = childVNode.ref) && oldVNode.ref != j) {
        if (!refs) { refs = []; }
        if (oldVNode.ref) { refs.push(oldVNode.ref, null, childVNode); }
        refs.push(j, childVNode._component || newDom, childVNode);
      } // Only proceed if the vnode has not been unmounted by `diff()` above.


      if (newDom != null) {
        if (firstChildDom == null) {
          firstChildDom = newDom;
        }

        var nextDom;

        if (childVNode._nextDom !== undefined) {
          // Only Fragments or components that return Fragment like VNodes will
          // have a non-undefined _nextDom. Continue the diff from the sibling
          // of last DOM child of this child VNode
          nextDom = childVNode._nextDom; // Eagerly cleanup _nextDom. We don't need to persist the value because
          // it is only used by `diffChildren` to determine where to resume the diff after
          // diffing Components and Fragments. Once we store it the nextDOM local var, we
          // can clean up the property

          childVNode._nextDom = undefined;
        } else if (excessDomChildren == oldVNode || newDom != oldDom || newDom.parentNode == null) {
          // NOTE: excessDomChildren==oldVNode above:
          // This is a compression of excessDomChildren==null && oldVNode==null!
          // The values only have the same type when `null`.
          outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
            parentDom.appendChild(newDom);
            nextDom = null;
          } else {
            // `j<oldChildrenLength; j+=2` is an alternative to `j++<oldChildrenLength/2`
            for (sibDom = oldDom, j = 0; (sibDom = sibDom.nextSibling) && j < oldChildrenLength; j += 2) {
              if (sibDom == newDom) {
                break outer;
              }
            }

            parentDom.insertBefore(newDom, oldDom);
            nextDom = oldDom;
          } // Browsers will infer an option's `value` from `textContent` when
          // no value is present. This essentially bypasses our code to set it
          // later in `diff()`. It works fine in all browsers except for IE11
          // where it breaks setting `select.value`. There it will be always set
          // to an empty string. Re-applying an options value will fix that, so
          // there are probably some internal data structures that aren't
          // updated properly.
          //
          // To fix it we make sure to reset the inferred value, so that our own
          // value check in `diff()` won't be skipped.


          if (newParentVNode.type == 'option') {
            parentDom.value = '';
          }
        } // If we have pre-calculated the nextDOM node, use it. Else calculate it now
        // Strictly check for `undefined` here cuz `null` is a valid value of `nextDom`.
        // See more detail in create-element.js:createVNode


        if (nextDom !== undefined) {
          oldDom = nextDom;
        } else {
          oldDom = newDom.nextSibling;
        }

        if (typeof newParentVNode.type == 'function') {
          // Because the newParentVNode is Fragment-like, we need to set it's
          // _nextDom property to the nextSibling of its last child DOM node.
          //
          // `oldDom` contains the correct value here because if the last child
          // is a Fragment-like, then oldDom has already been set to that child's _nextDom.
          // If the last child is a DOM VNode, then oldDom will be set to that DOM
          // node's nextSibling.
          newParentVNode._nextDom = oldDom;
        }
      } else if (oldDom && oldVNode._dom == oldDom && oldDom.parentNode != parentDom) {
        // The above condition is to handle null placeholders. See test in placeholder.test.js:
        // `efficiently replace null placeholders in parent rerenders`
        oldDom = getDomSibling(oldVNode);
      }
    }

    i++;
    return childVNode;
  });
  newParentVNode._dom = firstChildDom; // Remove children that are not part of any vnode.

  if (excessDomChildren != null && typeof newParentVNode.type != 'function') {
    for (i = excessDomChildren.length; i--;) {
      if (excessDomChildren[i] != null) { removeNode(excessDomChildren[i]); }
    }
  } // Remove remaining oldChildren if there are any.


  for (i = oldChildrenLength; i--;) {
    if (oldChildren[i] != null) { unmount(oldChildren[i], oldChildren[i]); }
  } // Set refs only after unmount


  if (refs) {
    for (i = 0; i < refs.length; i++) {
      applyRef(refs[i], refs[++i], refs[++i]);
    }
  }
}
/**
 * Flatten and loop through the children of a virtual node
 * @param {import('../index').ComponentChildren} children The unflattened
 * children of a virtual node
 * @param {(vnode: import('../internal').VNode) => import('../internal').VNode} [callback]
 * A function to invoke for each child before it is added to the flattened list.
 * @param {Array<import('../internal').VNode | string | number>} [flattened] An flat array of children to modify
 * @returns {import('../internal').VNode[]}
 */

function toChildArray(children, callback, flattened) {
  if (flattened == null) { flattened = []; }

  if (children == null || typeof children == 'boolean') {
    if (callback) { flattened.push(callback(null)); }
  } else if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      toChildArray(children[i], callback, flattened);
    }
  } else if (!callback) {
    flattened.push(children);
  } else if (typeof children == 'string' || typeof children == 'number') {
    flattened.push(callback(createVNode(null, children, null, null, children)));
  } else if (children._dom != null || children._component != null) {
    flattened.push(callback(createVNode(children.type, children.props, children.key, null, children._original)));
  } else {
    flattened.push(callback(children));
  }

  return flattened;
}

/**
 * Diff the old and new properties of a VNode and apply changes to the DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to apply
 * changes to
 * @param {object} newProps The new props
 * @param {object} oldProps The old props
 * @param {boolean} isSvg Whether or not this node is an SVG node
 * @param {boolean} hydrate Whether or not we are in hydration mode
 */

function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
  var i;

  for (i in oldProps) {
    if (i !== 'children' && i !== 'key' && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i], isSvg);
    }
  }

  for (i in newProps) {
    if ((!hydrate || typeof newProps[i] == 'function') && i !== 'children' && i !== 'key' && i !== 'value' && i !== 'checked' && oldProps[i] !== newProps[i]) {
      setProperty(dom, i, newProps[i], oldProps[i], isSvg);
    }
  }
}

function setStyle(style, key, value) {
  if (key[0] === '-') {
    style.setProperty(key, value);
  } else if (typeof value == 'number' && IS_NON_DIMENSIONAL.test(key) === false) {
    style[key] = value + 'px';
  } else if (value == null) {
    style[key] = '';
  } else {
    style[key] = value;
  }
}
/**
 * Set a property value on a DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */


function setProperty(dom, name, value, oldValue, isSvg) {
  var s, useCapture, nameLower;

  if (isSvg) {
    if (name === 'className') {
      name = 'class';
    }
  } else if (name === 'class') {
    name = 'className';
  }

  if (name === 'style') {
    s = dom.style;

    if (typeof value == 'string') {
      s.cssText = value;
    } else {
      if (typeof oldValue == 'string') {
        s.cssText = '';
        oldValue = null;
      }

      if (oldValue) {
        for (var i in oldValue) {
          if (!(value && i in value)) {
            setStyle(s, i, '');
          }
        }
      }

      if (value) {
        for (var _i in value) {
          if (!oldValue || value[_i] !== oldValue[_i]) {
            setStyle(s, _i, value[_i]);
          }
        }
      }
    }
  } // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
  else if (name[0] === 'o' && name[1] === 'n') {
      useCapture = name !== (name = name.replace(/Capture$/, ''));
      nameLower = name.toLowerCase();
      name = (nameLower in dom ? nameLower : name).slice(2);

      if (value) {
        if (!oldValue) { dom.addEventListener(name, eventProxy, useCapture); }
        (dom._listeners || (dom._listeners = {}))[name] = value;
      } else {
        dom.removeEventListener(name, eventProxy, useCapture);
      }
    } else if (name !== 'list' && name !== 'tagName' && // HTMLButtonElement.form and HTMLInputElement.form are read-only but can be set using
    // setAttribute
    name !== 'form' && name !== 'type' && name !== 'size' && !isSvg && name in dom) {
      dom[name] = value == null ? '' : value;
    } else if (typeof value != 'function' && name !== 'dangerouslySetInnerHTML') {
      if (name !== (name = name.replace(/^xlink:?/, ''))) {
        if (value == null || value === false) {
          dom.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
        } else {
          dom.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
        }
      } else if (value == null || value === false && // ARIA-attributes have a different notion of boolean values.
      // The value `false` is different from the attribute not
      // existing on the DOM, so we can't remove it. For non-boolean
      // ARIA-attributes we could treat false as a removal, but the
      // amount of exceptions would cost us too many bytes. On top of
      // that other VDOM frameworks also always stringify `false`.
      !/^ar/.test(name)) {
        dom.removeAttribute(name);
      } else {
        dom.setAttribute(name, value);
      }
    }
}
/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */

function eventProxy(e) {
  this._listeners[e.type](options.event ? options.event(e) : e);
}

/**
 * Diff two virtual nodes and apply proper changes to the DOM
 * @param {import('../internal').PreactElement} parentDom The parent of the DOM element
 * @param {import('../internal').VNode} newVNode The new virtual node
 * @param {import('../internal').VNode} oldVNode The old virtual node
 * @param {object} globalContext The current context object. Modified by getChildContext
 * @param {boolean} isSvg Whether or not this element is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {Element | Text} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} [isHydrating] Whether or not we are in hydration
 */

function diff(parentDom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating) {
  var tmp,
      newType = newVNode.type; // When passing through createElement it assigns the object
  // constructor as undefined. This to prevent JSON-injection.

  if (newVNode.constructor !== undefined) { return null; }
  if (tmp = options._diff) { tmp(newVNode); }

  try {
    outer: if (typeof newType == 'function') {
      var c, isNew, oldProps, oldState, snapshot, clearProcessingException;
      var newProps = newVNode.props; // Necessary for createContext api. Setting this property will pass
      // the context value as `this.context` just for this component.

      tmp = newType.contextType;
      var provider = tmp && globalContext[tmp._id];
      var componentContext = tmp ? provider ? provider.props.value : tmp._defaultValue : globalContext; // Get component and set it to `c`

      if (oldVNode._component) {
        c = newVNode._component = oldVNode._component;
        clearProcessingException = c._processingException = c._pendingError;
      } else {
        // Instantiate the new component
        if ('prototype' in newType && newType.prototype.render) {
          newVNode._component = c = new newType(newProps, componentContext); // eslint-disable-line new-cap
        } else {
          newVNode._component = c = new Component(newProps, componentContext);
          c.constructor = newType;
          c.render = doRender;
        }

        if (provider) { provider.sub(c); }
        c.props = newProps;
        if (!c.state) { c.state = {}; }
        c.context = componentContext;
        c._globalContext = globalContext;
        isNew = c._dirty = true;
        c._renderCallbacks = [];
      } // Invoke getDerivedStateFromProps


      if (c._nextState == null) {
        c._nextState = c.state;
      }

      if (newType.getDerivedStateFromProps != null) {
        if (c._nextState == c.state) {
          c._nextState = assign({}, c._nextState);
        }

        assign(c._nextState, newType.getDerivedStateFromProps(newProps, c._nextState));
      }

      oldProps = c.props;
      oldState = c.state; // Invoke pre-render lifecycle methods

      if (isNew) {
        if (newType.getDerivedStateFromProps == null && c.componentWillMount != null) {
          c.componentWillMount();
        }

        if (c.componentDidMount != null) {
          c._renderCallbacks.push(c.componentDidMount);
        }
      } else {
        if (newType.getDerivedStateFromProps == null && newProps !== oldProps && c.componentWillReceiveProps != null) {
          c.componentWillReceiveProps(newProps, componentContext);
        }

        if (!c._force && c.shouldComponentUpdate != null && c.shouldComponentUpdate(newProps, c._nextState, componentContext) === false || newVNode._original === oldVNode._original && !c._processingException) {
          c.props = newProps;
          c.state = c._nextState; // More info about this here: https://gist.github.com/JoviDeCroock/bec5f2ce93544d2e6070ef8e0036e4e8

          if (newVNode._original !== oldVNode._original) { c._dirty = false; }
          c._vnode = newVNode;
          newVNode._dom = oldVNode._dom;
          newVNode._children = oldVNode._children;

          if (c._renderCallbacks.length) {
            commitQueue.push(c);
          }

          for (tmp = 0; tmp < newVNode._children.length; tmp++) {
            if (newVNode._children[tmp]) {
              newVNode._children[tmp]._parent = newVNode;
            }
          }

          break outer;
        }

        if (c.componentWillUpdate != null) {
          c.componentWillUpdate(newProps, c._nextState, componentContext);
        }

        if (c.componentDidUpdate != null) {
          c._renderCallbacks.push(function () {
            c.componentDidUpdate(oldProps, oldState, snapshot);
          });
        }
      }

      c.context = componentContext;
      c.props = newProps;
      c.state = c._nextState;
      if (tmp = options._render) { tmp(newVNode); }
      c._dirty = false;
      c._vnode = newVNode;
      c._parentDom = parentDom;
      tmp = c.render(c.props, c.state, c.context);
      var isTopLevelFragment = tmp != null && tmp.type == Fragment && tmp.key == null;
      newVNode._children = isTopLevelFragment ? tmp.props.children : Array.isArray(tmp) ? tmp : [tmp];

      if (c.getChildContext != null) {
        globalContext = assign(assign({}, globalContext), c.getChildContext());
      }

      if (!isNew && c.getSnapshotBeforeUpdate != null) {
        snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState);
      }

      diffChildren(parentDom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating);
      c.base = newVNode._dom;

      if (c._renderCallbacks.length) {
        commitQueue.push(c);
      }

      if (clearProcessingException) {
        c._pendingError = c._processingException = null;
      }

      c._force = false;
    } else if (excessDomChildren == null && newVNode._original === oldVNode._original) {
      newVNode._children = oldVNode._children;
      newVNode._dom = oldVNode._dom;
    } else {
      newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating);
    }

    if (tmp = options.diffed) { tmp(newVNode); }
  } catch (e) {
    newVNode._original = null;

    options._catchError(e, newVNode, oldVNode);
  }

  return newVNode._dom;
}
/**
 * @param {Array<import('../internal').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {import('../internal').VNode} root
 */

function commitRoot(commitQueue, root) {
  if (options._commit) { options._commit(root, commitQueue); }
  commitQueue.some(function (c) {
    try {
      commitQueue = c._renderCallbacks;
      c._renderCallbacks = [];
      commitQueue.some(function (cb) {
        cb.call(c);
      });
    } catch (e) {
      options._catchError(e, c._vnode);
    }
  });
}
/**
 * Diff two virtual nodes representing DOM element
 * @param {import('../internal').PreactElement} dom The DOM element representing
 * the virtual nodes being diffed
 * @param {import('../internal').VNode} newVNode The new virtual node
 * @param {import('../internal').VNode} oldVNode The old virtual node
 * @param {object} globalContext The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {*} excessDomChildren
 * @param {Array<import('../internal').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {boolean} isHydrating Whether or not we are in hydration
 * @returns {import('../internal').PreactElement}
 */

function diffElementNodes(dom, newVNode, oldVNode, globalContext, isSvg, excessDomChildren, commitQueue, isHydrating) {
  var i;
  var oldProps = oldVNode.props;
  var newProps = newVNode.props; // Tracks entering and exiting SVG namespace when descending through the tree.

  isSvg = newVNode.type === 'svg' || isSvg;

  if (excessDomChildren != null) {
    for (i = 0; i < excessDomChildren.length; i++) {
      var child = excessDomChildren[i]; // if newVNode matches an element in excessDomChildren or the `dom`
      // argument matches an element in excessDomChildren, remove it from
      // excessDomChildren so it isn't later removed in diffChildren

      if (child != null && ((newVNode.type === null ? child.nodeType === 3 : child.localName === newVNode.type) || dom == child)) {
        dom = child;
        excessDomChildren[i] = null;
        break;
      }
    }
  }

  if (dom == null) {
    if (newVNode.type === null) {
      return document.createTextNode(newProps);
    }

    dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type) : document.createElement(newVNode.type, newProps.is && {
      is: newProps.is
    }); // we created a new parent, so none of the previously attached children can be reused:

    excessDomChildren = null; // we are creating a new node, so we can assume this is a new subtree (in case we are hydrating), this deopts the hydrate

    isHydrating = false;
  }

  if (newVNode.type === null) {
    if (oldProps !== newProps && dom.data != newProps) {
      dom.data = newProps;
    }
  } else {
    if (excessDomChildren != null) {
      excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
    }

    oldProps = oldVNode.props || EMPTY_OBJ;
    var oldHtml = oldProps.dangerouslySetInnerHTML;
    var newHtml = newProps.dangerouslySetInnerHTML; // During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
    // @TODO we should warn in debug mode when props don't match here.

    if (!isHydrating) {
      // But, if we are in a situation where we are using existing DOM (e.g. replaceNode)
      // we should read the existing DOM attributes to diff them
      if (excessDomChildren != null) {
        oldProps = {};

        for (var _i = 0; _i < dom.attributes.length; _i++) {
          oldProps[dom.attributes[_i].name] = dom.attributes[_i].value;
        }
      }

      if (newHtml || oldHtml) {
        // Avoid re-applying the same '__html' if it did not changed between re-render
        if (!newHtml || !oldHtml || newHtml.__html != oldHtml.__html) {
          dom.innerHTML = newHtml && newHtml.__html || '';
        }
      }
    }

    diffProps(dom, newProps, oldProps, isSvg, isHydrating); // If the new vnode didn't have dangerouslySetInnerHTML, diff its children

    if (newHtml) {
      newVNode._children = [];
    } else {
      newVNode._children = newVNode.props.children;
      diffChildren(dom, newVNode, oldVNode, globalContext, newVNode.type === 'foreignObject' ? false : isSvg, excessDomChildren, commitQueue, EMPTY_OBJ, isHydrating);
    } // (as above, don't diff props during hydration)


    if (!isHydrating) {
      if ('value' in newProps && (i = newProps.value) !== undefined && i !== dom.value) {
        setProperty(dom, 'value', i, oldProps.value, false);
      }

      if ('checked' in newProps && (i = newProps.checked) !== undefined && i !== dom.checked) {
        setProperty(dom, 'checked', i, oldProps.checked, false);
      }
    }
  }

  return dom;
}
/**
 * Invoke or update a ref, depending on whether it is a function or object ref.
 * @param {object|function} ref
 * @param {any} value
 * @param {import('../internal').VNode} vnode
 */


function applyRef(ref, value, vnode) {
  try {
    if (typeof ref == 'function') { ref(value); }else { ref.current = value; }
  } catch (e) {
    options._catchError(e, vnode);
  }
}
/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param {import('../internal').VNode} vnode The virtual node to unmount
 * @param {import('../internal').VNode} parentVNode The parent of the VNode that
 * initiated the unmount
 * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
 * current element is already detached from the DOM.
 */

function unmount(vnode, parentVNode, skipRemove) {
  var r;
  if (options.unmount) { options.unmount(vnode); }

  if (r = vnode.ref) {
    if (!r.current || r.current === vnode._dom) { applyRef(r, null, parentVNode); }
  }

  var dom;

  if (!skipRemove && typeof vnode.type != 'function') {
    skipRemove = (dom = vnode._dom) != null;
  } // Must be set to `undefined` to properly clean up `_nextDom`
  // for which `null` is a valid value. See comment in `create-element.js`


  vnode._dom = vnode._nextDom = undefined;

  if ((r = vnode._component) != null) {
    if (r.componentWillUnmount) {
      try {
        r.componentWillUnmount();
      } catch (e) {
        options._catchError(e, parentVNode);
      }
    }

    r.base = r._parentDom = null;
  }

  if (r = vnode._children) {
    for (var i = 0; i < r.length; i++) {
      if (r[i]) { unmount(r[i], parentVNode, skipRemove); }
    }
  }

  if (dom != null) { removeNode(dom); }
}
/** The `.render()` method for a PFC backing instance. */

function doRender(props, state, context) {
  return this.constructor(props, context);
}

var IS_HYDRATE = EMPTY_OBJ;
/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./index').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * render into
 * @param {Element | Text} [replaceNode] Optional: Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */

function render(vnode, parentDom, replaceNode) {
  if (options._root) { options._root(vnode, parentDom); } // We abuse the `replaceNode` parameter in `hydrate()` to signal if we
  // are in hydration mode or not by passing `IS_HYDRATE` instead of a
  // DOM element.

  var isHydrating = replaceNode === IS_HYDRATE; // To be able to support calling `render()` multiple times on the same
  // DOM node, we need to obtain a reference to the previous tree. We do
  // this by assigning a new `_children` property to DOM nodes which points
  // to the last rendered tree. By default this property is not present, which
  // means that we are mounting a new tree for the first time.

  var oldVNode = isHydrating ? null : replaceNode && replaceNode._children || parentDom._children;
  vnode = createElement(Fragment, null, [vnode]); // List of effects that need to be called after diffing.

  var commitQueue = [];
  diff(parentDom, // Determine the new vnode tree and store it on the DOM element on
  // our custom `_children` property.
  (isHydrating ? parentDom : replaceNode || parentDom)._children = vnode, oldVNode || EMPTY_OBJ, EMPTY_OBJ, parentDom.ownerSVGElement !== undefined, replaceNode && !isHydrating ? [replaceNode] : oldVNode ? null : parentDom.childNodes.length ? EMPTY_ARR.slice.call(parentDom.childNodes) : null, commitQueue, replaceNode || EMPTY_OBJ, isHydrating); // Flush all queued effects

  commitRoot(commitQueue, vnode);
}
/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param {import('./index').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * update
 */

function hydrate(vnode, parentDom) {
  render(vnode, parentDom, IS_HYDRATE);
}

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {import('./internal').VNode} vnode The virtual DOM element to clone
 * @param {object} props Attributes/props to add when cloning
 * @param {Array<import('./index').ComponentChildren>} rest Any additional arguments will be used as replacement children.
 * @returns {import('./internal').VNode}
 */

function cloneElement(vnode, props) {
  props = assign(assign({}, vnode.props), props);
  if (arguments.length > 2) { props.children = EMPTY_ARR.slice.call(arguments, 2); }
  var normalizedProps = {};

  for (var i in props) {
    if (i !== 'key' && i !== 'ref') { normalizedProps[i] = props[i]; }
  }

  return createVNode(vnode.type, normalizedProps, props.key || vnode.key, props.ref || vnode.ref, null);
}

var i = 0;
function createContext(defaultValue) {
  var ctx = {};
  var context = {
    _id: '__cC' + i++,
    _defaultValue: defaultValue,
    Consumer: function Consumer(props, context) {
      return props.children(context);
    },
    Provider: function Provider(props) {
      var _this = this;

      if (!this.getChildContext) {
        var subs = [];

        this.getChildContext = function () {
          ctx[context._id] = _this;
          return ctx;
        };

        this.shouldComponentUpdate = function (_props) {
          if (_this.props.value !== _props.value) {
            subs.some(function (c) {
              c.context = _props.value;
              enqueueRender(c);
            });
          }
        };

        this.sub = function (c) {
          subs.push(c);
          var old = c.componentWillUnmount;

          c.componentWillUnmount = function () {
            subs.splice(subs.indexOf(c), 1);
            old && old.call(c);
          };
        };
      }

      return props.children;
    }
  };
  context.Consumer.contextType = context; // Devtools needs access to the context object when it
  // encounters a Provider. This is necessary to support
  // setting `displayName` on the context object instead
  // of on the component itself. See:
  // https://reactjs.org/docs/context.html#contextdisplayname

  context.Provider._contextRef = context;
  return context;
}

export { render, hydrate, createElement, createElement as h, Fragment, createRef, isValidElement, Component, cloneElement, createContext, toChildArray, unmount as _unmount, options };
