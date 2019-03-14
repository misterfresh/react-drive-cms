const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param {O} obj The object to copy properties to
 * @param {P} props The object to copy properties from
 * @returns {O & P}
 */
function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return /** @type {O & P} */ (obj);
}

/** @type {import('./index').Options}  */
const options = {};

/**
  * Create an virtual node (used for JSX)
  * @param {import('./internal').VNode["type"]} type The node name or Component
  * constructor for this virtual node
  * @param {object | null | undefined} [props] The properties of the virtual node
  * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
  * @returns {import('./internal').VNode}
  */
function createElement(type, props, children) {
	if (props==null) props = {};
	if (arguments.length>3) {
		children = [children];
		for (let i=3; i<arguments.length; i++) {
			children.push(arguments[i]);
		}
	}
	if (children!=null) {
		props.children = children;
	}

	// "type" may be undefined during development. The check is needed so that
	// we can display a nice error message with our debug helpers
	if (type!=null && type.defaultProps!=null) {
		for (let i in type.defaultProps) {
			if (props[i]===undefined) props[i] = type.defaultProps[i];
		}
	}
	let ref = props.ref;
	if (ref) delete props.ref;
	let key = props.key;
	if (key) delete props.key;

	return createVNode(type, props, null, key, ref);
}

/**
 * Create a VNode (used internally by Preact)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object} props The properites of this virtual node
 * @param {string | number} text If this virtual node represents a text node,
 * this is the text of the node
 * @param {string |number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {import('./internal').VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {import('./internal').VNode}
 */
function createVNode(type, props, text, key, ref) {
	// V8 seems to be better at detecting type shapes if the object is allocated from the same call site
	// Do not inline into createElement and coerceToVNode!
	const vnode = {
		type,
		props,
		text,
		key,
		ref,
		_children: null,
		_dom: null,
		_lastDomChild: null,
		_component: null
	};

	if (options.vnode) options.vnode(vnode);

	return vnode;
}

function createRef() {
	return {};
}

function Fragment() { }

/**
 * Coerce an untrusted value into a VNode
 * Specifically, this should be used anywhere a user could provide a boolean, string, or number where
 * a VNode or Component is desired instead
 * @param {boolean | string | number | import('./internal').VNode} possibleVNode A possible VNode
 * @returns {import('./internal').VNode}
 */
function coerceToVNode(possibleVNode) {
	if (possibleVNode == null || typeof possibleVNode === 'boolean') return null;
	if (typeof possibleVNode === 'string' || typeof possibleVNode === 'number') {
		return createVNode(null, null, possibleVNode, null, null);
	}

	if (Array.isArray(possibleVNode)) {
		return createElement(Fragment, null, possibleVNode);
	}

	// Clone vnode if it has already been used. ceviche/#57
	if (possibleVNode._dom!=null) {
		return createVNode(possibleVNode.type, possibleVNode.props, possibleVNode.text, possibleVNode.key, null);
	}

	return possibleVNode;
}

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
	// if (this.state==null) this.state = {};
	// this.state = {};
	// this._dirty = true;
	// this._renderCallbacks = []; // Only class components

	// Other properties that Component will have set later,
	// shown here as commented out for quick reference
	// this.base = null;
	// this._ancestorComponent = null; // Always set right after instantiation
	// this._vnode = null;
	// this._nextState = null; // Only class components
	// this._prevVNode = null;
	// this._processingException = null; // Always read, set only when handling error
	// this._constructor = null; // Only functional components, always set right after instantiation
}

/**
 * Update component state and schedule a re-render.
 * @param {object | ((s: object, p: object) => object)} update A hash of state
 * properties to update with new values or a function that given the current
 * state and props returns a new partial state
 * @param {() => void} [callback] A function to be called once component state is
 * updated
 */
Component.prototype.setState = function(update, callback) {

	// only clone state when copying to nextState the first time.
	let s = (this._nextState!==this.state && this._nextState) || (this._nextState = assign({}, this.state));

	// if update() mutates state in-place, skip the copy:
	if (typeof update!=='function' || (update = update(s, this.props))) {
		assign(s, update);
	}

	// Skip update if updater function returned null
	if (update==null) return;

	if (callback!=null) this._renderCallbacks.push(callback);

	this._force = false;
	enqueueRender(this);
};

/**
 * Immediately perform a synchronous re-render of the component
 * @param {() => void} [callback] A function to be called after component is
 * re-renderd
 */
Component.prototype.forceUpdate = function(callback) {
	let vnode = this._vnode, dom = this._vnode._dom, parentDom = this._parentDom;
	if (parentDom!=null) {
		// Set render mode so that we can differantiate where the render request
		// is coming from. We need this because forceUpdate should never call
		// shouldComponentUpdate
		if (this._force==null) this._force = true;

		let mounts = [];
		dom = diff(dom, parentDom, vnode, vnode, this._context, parentDom.ownerSVGElement!==undefined, null, mounts, this._ancestorComponent);
		if (dom!=null && dom.parentNode!==parentDom) {
			parentDom.appendChild(dom);
		}
		commitRoot(mounts, vnode);

		// Reset mode to its initial value for the next render
		this._force = null;
	}
	if (callback!=null) callback();
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
 * The render queue
 * @type {Array<import('./internal').Component>}
 */
let q = [];

/**
 * Asynchronously schedule a callback
 * @type {(cb) => void}
 */
const defer = typeof Promise=='function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

/*
 * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
 * important that contributors to Preact can consistenly reason about what calls to `setState`, etc.
 * do, and when their effects will be applied. See the links below for some further reading on designing
 * asynchronous APIs.
 * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
 * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
 */

/**
 * Enqueue a rerender of a component
 * @param {import('./internal').Component} c The component to rerender
 */
function enqueueRender(c) {
	if (!c._dirty && (c._dirty = true) && q.push(c) === 1) {
		(defer)(process);
	}
}

/** Flush the render queue by rerendering all queued components */
function process() {
	let p;
	while ((p=q.pop())) {
		if (p._dirty) p.forceUpdate();
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
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts The list of components
 * which have mounted
 * @param {import('../internal').Component} ancestorComponent The direct parent
 * component to the ones being diffed
 */
function diffChildren(parentDom, newParentVNode, oldParentVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent) {
	let childVNode, i, j, p, index, oldVNode, newDom,
		nextDom, sibDom, focus,
		childDom;

	let newChildren = newParentVNode._children || toChildArray(newParentVNode.props.children, newParentVNode._children=[], coerceToVNode);
	let oldChildren = oldParentVNode!=null && oldParentVNode!=EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR;

	let oldChildrenLength = oldChildren.length;

	childDom = oldChildrenLength ? oldChildren[0] && oldChildren[0]._dom : null;
	if (excessDomChildren!=null) {
		for (i = 0; i < excessDomChildren.length; i++) {
			if (excessDomChildren[i]!=null) {
				childDom = excessDomChildren[i];
				break;
			}
		}
	}

	for (i=0; i<newChildren.length; i++) {
		childVNode = newChildren[i] = coerceToVNode(newChildren[i]);
		oldVNode = index = null;

		// Check if we find a corresponding element in oldChildren and store the
		// index where the element was found.
		p = oldChildren[i];
		if (p != null && (childVNode.key==null && p.key==null ? (childVNode.type === p.type) : (childVNode.key === p.key))) {
			index = i;
		}
		else {
			for (j=0; j<oldChildrenLength; j++) {
				p = oldChildren[j];
				if (p!=null) {
					if (childVNode.key==null && p.key==null ? (childVNode.type === p.type) : (childVNode.key === p.key)) {
						index = j;
						break;
					}
				}
			}
		}

		// If we have found a corresponding old element we store it in a variable
		// and delete it from the array. That way the next iteration can skip this
		// element.
		if (index!=null) {
			oldVNode = oldChildren[index];
			oldChildren[index] = null;
		}

		nextDom = childDom!=null && childDom.nextSibling;

		// Morph the old element into the new one, but don't append it to the dom yet
		newDom = diff(oldVNode==null ? null : oldVNode._dom, parentDom, childVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent);

		// Only proceed if the vnode has not been unmounted by `diff()` above.
		if (childVNode!=null && newDom !=null) {
			// Store focus in case moving children around changes it. Note that we
			// can't just check once for every tree, because we have no way to
			// differentiate wether the focus was reset by the user in a lifecycle
			// hook or by reordering dom nodes.
			focus = document.activeElement;

			if (childVNode._lastDomChild != null) {
				// Only Fragments or components that return Fragment like VNodes will
				// have a non-null _lastDomChild. Continue the diff from the end of
				// this Fragment's DOM tree.
				newDom = childVNode._lastDomChild;
			}
			else if (excessDomChildren==oldVNode || newDom!=childDom || newDom.parentNode==null) {
				// NOTE: excessDomChildren==oldVNode above:
				// This is a compression of excessDomChildren==null && oldVNode==null!
				// The values only have the same type when `null`.

				outer: if (childDom==null || childDom.parentNode!==parentDom) {
					parentDom.appendChild(newDom);
				}
				else {
					sibDom = childDom;
					j = 0;
					while ((sibDom=sibDom.nextSibling) && j++<oldChildrenLength/2) {
						if (sibDom===newDom) {
							break outer;
						}
					}
					parentDom.insertBefore(newDom, childDom);
				}
			}

			// Restore focus if it was changed
			if (focus!==document.activeElement) {
				focus.focus();
			}

			childDom = newDom!=null ? newDom.nextSibling : nextDom;
		}
	}

	// Remove children that are not part of any vnode. Only used by `hydrate`
	if (excessDomChildren!=null && newParentVNode.type!==Fragment) for (i=excessDomChildren.length; i--; ) if (excessDomChildren[i]!=null) excessDomChildren[i].remove();

	// Remove remaining oldChildren if there are any.
	for (i=oldChildrenLength; i--; ) if (oldChildren[i]!=null) unmount(oldChildren[i], ancestorComponent);
}

/**
 * Flatten a virtual nodes children to a single dimensional array
 * @param {import('../index').ComponentChildren} children The unflattened
 * children of a virtual node
 * @param {Array<import('../internal').VNode | null>} [flattened] An flat array of children to modify
 */
function toChildArray(children, flattened, map) {
	if (flattened == null) flattened = [];
	if (children==null || typeof children === 'boolean') ;
	else if (Array.isArray(children)) {
		for (let i=0; i < children.length; i++) {
			toChildArray(children[i], flattened);
		}
	}
	else {
		flattened.push(map ? map(children) : children);
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
 */
function diffProps(dom, newProps, oldProps, isSvg) {
	for (let i in newProps) {
		if (i!=='children' && i!=='key' && (!oldProps || oldProps[i]!=newProps[i])) {
			setProperty(dom, i, newProps[i], oldProps[i], isSvg);
		}
	}
	for (let i in oldProps) {
		if (i!=='children' && i!=='key' && (!newProps || !(i in newProps))) {
			setProperty(dom, i, null, oldProps[i], isSvg);
		}
	}
}

let CAMEL_REG = /-?(?=[A-Z])/g;

/**
 * Set a property value on a DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */
function setProperty(dom, name, value, oldValue, isSvg) {
	let v;
	if (name==='class' || name==='className') name = isSvg ? 'class' : 'className';

	if (name==='style') {

		/* Possible golfing activities for setting styles:
		 *   - we could just drop String style values. They're not supported in other VDOM libs.
		 *   - assigning to .style sets .style.cssText - TODO: benchmark this, might not be worth the bytes.
		 *   - assigning also casts to String, and ignores invalid values. This means assigning an Object clears all styles.
		 */
		let s = dom.style;

		if (typeof value==='string') {
			s.cssText = value;
		}
		else {
			if (typeof oldValue==='string') s.cssText = '';
			// remove values not in the new list
			for (let i in oldValue) {
				if (value==null || !(i in value)) s.setProperty(i.replace(CAMEL_REG, '-'), '');
			}
			for (let i in value) {
				v = value[i];
				if (oldValue==null || v!==oldValue[i]) {
					s.setProperty(i.replace(CAMEL_REG, '-'), typeof v==='number' && IS_NON_DIMENSIONAL.test(i)===false ? (v + 'px') : v);
				}
			}
		}
	}
	else if (name==='dangerouslySetInnerHTML') {
		// Avoid re-applying the same '__html' if it did not changed between re-render
		if (!value || !oldValue || value.__html!=oldValue.__html) {
			dom.innerHTML = value && value.__html || '';
		}
	}
	// Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
	else if (name[0]==='o' && name[1]==='n') {
		let useCapture = name !== (name=name.replace(/Capture$/, ''));
		let nameLower = name.toLowerCase();
		name = (nameLower in dom ? nameLower : name).substring(2);

		if (value) {
			if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
		}
		else {
			dom.removeEventListener(name, eventProxy, useCapture);
		}
		(dom._listeners || (dom._listeners = {}))[name] = value;
	}
	else if (name!=='list' && !isSvg && (name in dom)) {
		dom[name] = value==null ? '' : value;
	}
	else if (value==null || value===false) {
		dom.removeAttribute(name);
	}
	else if (typeof value!=='function') {
		dom.setAttribute(name, value);
	}
}

/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event ? options.event(e) : e);
}

/**
 * Diff two virtual nodes and apply proper changes to the DOM
 * @param {import('../internal').PreactElement | Text} dom The DOM element representing
 * the virtual nodes under diff
 * @param {import('../internal').PreactElement} parentDom The parent of the DOM element
 * @param {import('../internal').VNode | null} newVNode The new virtual node
 * @param {import('../internal').VNode | null} oldVNode The old virtual node
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this element is an SVG node
 * @param {Array<import('../internal').PreactElement>} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts A list of newly
 * mounted components
 * @param {import('../internal').Component | null} ancestorComponent The direct
 * parent component
 */
function diff(dom, parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent) {

	// If the previous type doesn't match the new type we drop the whole subtree
	if (oldVNode==null || newVNode==null || oldVNode.type!==newVNode.type) {
		if (oldVNode!=null) unmount(oldVNode, ancestorComponent);
		if (newVNode==null) return null;
		dom = null;
		oldVNode = EMPTY_OBJ;
	}

	let c, p, isNew = false, oldProps, oldState, oldContext,
		newType = newVNode.type;

	/** @type {import('../internal').Component | null} */
	let clearProcessingException;

	try {
		outer: if (oldVNode.type===Fragment || newType===Fragment) {
			diffChildren(parentDom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, c);

			if (newVNode._children.length) {
				dom = newVNode._children[0]._dom;
				newVNode._lastDomChild = newVNode._children[newVNode._children.length - 1]._dom;
			}
		}
		else if (typeof newType==='function') {

			// Necessary for createContext api. Setting this property will pass
			// the context value as `this.context` just for this component.
			let cxType = newType.contextType;
			let provider = cxType && context[cxType._id];
			let cctx = cxType != null ? (provider ? provider.props.value : cxType._defaultValue) : context;

			// Get component and set it to `c`
			if (oldVNode._component) {
				c = newVNode._component = oldVNode._component;
				clearProcessingException = c._processingException;
			}
			else {
				isNew = true;

				// Instantiate the new component
				if (newType.prototype && newType.prototype.render) {
					newVNode._component = c = new newType(newVNode.props, cctx); // eslint-disable-line new-cap
				}
				else {
					newVNode._component = c = new Component(newVNode.props, cctx);
					c.constructor = newType;
					c.render = doRender;
				}
				c._ancestorComponent = ancestorComponent;
				if (provider) provider.sub(c);

				c.props = newVNode.props;
				if (!c.state) c.state = {};
				c.context = cctx;
				c._context = context;
				c._dirty = true;
				c._renderCallbacks = [];
			}

			c._vnode = newVNode;

			// Invoke getDerivedStateFromProps
			let s = c._nextState || c.state;
			if (newType.getDerivedStateFromProps!=null) {
				oldState = assign({}, c.state);
				if (s===c.state) s = assign({}, s);
				assign(s, newType.getDerivedStateFromProps(newVNode.props, s));
			}

			// Invoke pre-render lifecycle methods
			if (isNew) {
				if (newType.getDerivedStateFromProps==null && c.componentWillMount!=null) c.componentWillMount();
				if (c.componentDidMount!=null) mounts.push(c);
			}
			else {
				if (newType.getDerivedStateFromProps==null && c._force==null && c.componentWillReceiveProps!=null) {
					c.componentWillReceiveProps(newVNode.props, cctx);
					s = c._nextState || c.state;
				}

				if (!c._force && c.shouldComponentUpdate!=null && c.shouldComponentUpdate(newVNode.props, s, cctx)===false) {
					c.props = newVNode.props;
					c.state = s;
					c._dirty = false;
					break outer;
				}

				if (c.componentWillUpdate!=null) {
					c.componentWillUpdate(newVNode.props, s, cctx);
				}
			}

			oldProps = c.props;
			if (!oldState) oldState = c.state;

			oldContext = c.context = cctx;
			c.props = newVNode.props;
			c.state = s;

			if (options.render) options.render(newVNode);

			let prev = c._prevVNode;
			let vnode = c._prevVNode = coerceToVNode(c.render(c.props, c.state, c.context));
			c._dirty = false;

			if (c.getChildContext!=null) {
				context = assign(assign({}, context), c.getChildContext());
			}

			if (!isNew && c.getSnapshotBeforeUpdate!=null) {
				oldContext = c.getSnapshotBeforeUpdate(oldProps, oldState);
			}

			c.base = dom = diff(dom, parentDom, vnode, prev, context, isSvg, excessDomChildren, mounts, c);

			if (vnode!=null) {
				// If this component returns a Fragment (or another component that
				// returns a Fragment), then _lastDomChild will be non-null,
				// informing `diffChildren` to diff this component's VNode like a Fragemnt
				newVNode._lastDomChild = vnode._lastDomChild;
			}

			c._parentDom = parentDom;

			if (newVNode.ref) applyRef(newVNode.ref, c, ancestorComponent);
		}
		else {
			dom = diffElementNodes(dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent);

			if (newVNode.ref && (oldVNode.ref !== newVNode.ref)) {
				applyRef(newVNode.ref, dom, ancestorComponent);
			}
		}

		newVNode._dom = dom;

		if (c!=null) {
			while (p=c._renderCallbacks.pop()) p.call(c);

			// Don't call componentDidUpdate on mount or when we bailed out via
			// `shouldComponentUpdate`
			if (!isNew && oldProps!=null && c.componentDidUpdate!=null) {
				c.componentDidUpdate(oldProps, oldState, oldContext);
			}
		}

		if (clearProcessingException) {
			c._processingException = null;
		}

		if (options.diffed) options.diffed(newVNode);
	}
	catch (e) {
		catchErrorInComponent(e, ancestorComponent);
	}

	return dom;
}

function commitRoot(mounts, root) {
	let c;
	while ((c = mounts.pop())) {
		try {
			c.componentDidMount();
		}
		catch (e) {
			catchErrorInComponent(e, c._ancestorComponent);
		}
	}
}

/**
 * Diff two virtual nodes representing DOM element
 * @param {import('../internal').PreactElement} dom The DOM element representing
 * the virtual nodes being diffed
 * @param {import('../internal').VNode} newVNode The new virtual node
 * @param {import('../internal').VNode} oldVNode The old virtual node
 * @param {object} context The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {*} excessDomChildren
 * @param {Array<import('../internal').Component>} mounts An array of newly
 * mounted components
 * @param {import('../internal').Component} ancestorComponent The parent
 * component to the ones being diffed
 * @returns {import('../internal').PreactElement}
 */
function diffElementNodes(dom, newVNode, oldVNode, context, isSvg, excessDomChildren, mounts, ancestorComponent) {
	let d = dom;

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvg = newVNode.type==='svg' || isSvg;

	if (dom==null && excessDomChildren!=null) {
		for (let i=0; i<excessDomChildren.length; i++) {
			const child = excessDomChildren[i];
			if (child!=null && (newVNode.type===null ? child.nodeType===3 : child.localName===newVNode.type)) {
				dom = child;
				excessDomChildren[i] = null;
				break;
			}
		}
	}

	if (dom==null) {
		dom = newVNode.type===null ? document.createTextNode(newVNode.text) : isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type) : document.createElement(newVNode.type);

		// we created a new parent, so none of the previously attached children can be reused:
		excessDomChildren = null;
	}
	newVNode._dom = dom;

	if (newVNode.type===null) {
		if ((d===null || dom===d) && newVNode.text!==oldVNode.text) {
			dom.data = newVNode.text;
		}
	}
	else {
		if (excessDomChildren!=null && dom.childNodes!=null) {
			excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
		}
		if (newVNode!==oldVNode) {
			let oldProps = oldVNode.props;
			// if we're hydrating, use the element's attributes as its current props:
			if (oldProps==null) {
				oldProps = {};
				if (excessDomChildren!=null) {
					for (let i=0; i<dom.attributes.length; i++) {
						oldProps[dom.attributes[i].name] = dom.attributes[i].value;
					}
				}
			}
			diffProps(dom, newVNode.props, oldProps, isSvg);
		}

		diffChildren(dom, newVNode, oldVNode, context, newVNode.type==='foreignObject' ? false : isSvg, excessDomChildren, mounts, ancestorComponent);
	}

	return dom;
}

/**
 * Invoke or update a ref, depending on whether it is a function or object ref.
 * @param {object|function} [ref=null]
 * @param {any} [value]
 */
function applyRef(ref, value, ancestorComponent) {
	try {
		if (typeof ref=='function') ref(value);
		else ref.current = value;
	}
	catch (e) {
		catchErrorInComponent(e, ancestorComponent);
	}
}

/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param {import('../internal').VNode} vnode The virtual node to unmount
 * @param {import('../internal').Component} ancestorComponent The parent
 * component to this virtual node
 */
function unmount(vnode, ancestorComponent) {
	let r;
	if (options.unmount) options.unmount(vnode);

	if (r = vnode.ref) {
		applyRef(r, null, ancestorComponent);
	}

	if ((r = vnode._dom)!=null) r.remove();

	vnode._dom = vnode._lastDomChild = null;

	if ((r = vnode._component)!=null) {
		if (r.componentWillUnmount) {
			try {
				r.componentWillUnmount();
			}
			catch (e) {
				catchErrorInComponent(e, ancestorComponent);
			}
		}

		r.base = r._parentDom = null;
		if (r = r._prevVNode) unmount(r, ancestorComponent);
	}
	else if (r = vnode._children) {
		for (let i = 0; i < r.length; i++) {
			unmount(r[i], ancestorComponent);
		}
	}
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/**
 * Find the closest error boundary to a thrown error and call it
 * @param {object} error The thrown value
 * @param {import('../internal').Component} component The first ancestor
 * component check for error boundary behaviors
 */
function catchErrorInComponent(error, component) {
	for (; component; component = component._ancestorComponent) {
		if (!component._processingException) {
			try {
				if (component.constructor.getDerivedStateFromError!=null) {
					component.setState(component.constructor.getDerivedStateFromError(error));
				}
				else if (component.componentDidCatch!=null) {
					component.componentDidCatch(error);
				}
				else {
					continue;
				}
				return enqueueRender(component._processingException = component);
			}
			catch (e) {
				error = e;
			}
		}
	}
	throw error;
}

/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./index').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * render into
 */
function render(vnode, parentDom) {
	let oldVNode = parentDom._prevVNode;
	vnode = createElement(Fragment, null, [vnode]);

	let mounts = [];
	diffChildren(parentDom, parentDom._prevVNode = vnode, oldVNode, EMPTY_OBJ, parentDom.ownerSVGElement!==undefined, oldVNode ? null : EMPTY_ARR.slice.call(parentDom.childNodes), mounts, vnode);
	commitRoot(mounts, vnode);
}

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {import('./internal').VNode} vnode The virtual DOM element to clone
 * @param {object} props Attributes/props to add when cloning
 * @param {Array<import('./index').ComponentChildren>} rest Any additional arguments will be used as replacement children.
 */
function cloneElement(vnode, props) {
	props = assign(assign({}, vnode.props), props);
	if (arguments.length>2) props.children = EMPTY_ARR.slice.call(arguments, 2);
	return createVNode(vnode.type, props, null, props.key || vnode.key, props.ref || vnode.ref);
}

let i = 0;

/**
 *
 * @param {any} defaultValue
 */
function createContext(defaultValue) {
	const id = '__cC' + i++;

	let context = {
		_id: id,
		_defaultValue: defaultValue
	};

	function Consumer(props, context) {
		return props.children(context);
	}
	Consumer.contextType = context;
	context.Consumer = Consumer;

	let ctx = { [id]: null };

	function initProvider(comp) {
		let subs = [];
		comp.getChildContext = () => {
			ctx[id] = comp;
			return ctx;
		};
		comp.componentDidUpdate = () => {
			let v = comp.props.value;
			subs.map(c => v!==c.context && (c.context = v, enqueueRender(c)));
		};
		comp.sub = (c) => {
			subs.push(c);
			let old = c.componentWillUnmount;
			c.componentWillUnmount = () => {
				subs.splice(subs.indexOf(c), 1);
				old && old();
			};
		};
	}

	function Provider(props) {
		if (!this.getChildContext) initProvider(this);
		return props.children;
	}
	context.Provider = Provider;

	return context;
}

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const MINI = false;

const TAG_SET = 1;
const PROPS_SET = 2;
const PROPS_ASSIGN = 3;
const CHILD_RECURSE = 4;
const CHILD_APPEND = 0;

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_ATTRIBUTE = 4;

const evaluate = (h, current, fields, args) => {
	for (let i = 1; i < current.length; i++) {
		const field = current[i++];
		const value = typeof field === 'number' ? fields[field] : field;

		if (current[i] === TAG_SET) {
			args[0] = value;
		}
		else if (current[i] === PROPS_SET) {
			(args[1] = args[1] || {})[current[++i]] = value;
		}
		else if (current[i] === PROPS_ASSIGN) {
			args[1] = Object.assign(args[1] || {}, value);
		}
		else if (current[i]) {
			// code === CHILD_RECURSE
			args.push(h.apply(null, evaluate(h, value, fields, ['', null])));
		}
		else {
			// code === CHILD_APPEND
			args.push(value);
		}
	}

	return args;
};

const build = function(statics) {

	let mode = MODE_TEXT;
	let buffer = '';
	let quote = '';
	let current = [0];
	let char, propName;

	const commit = field => {
		if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g,'')))) {
			{
				current.push(field || buffer, CHILD_APPEND);
			}
		}
		else if (mode === MODE_TAGNAME && (field || buffer)) {
			{
				current.push(field || buffer, TAG_SET);
			}
			mode = MODE_WHITESPACE;
		}
		else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
			{
				current.push(field, PROPS_ASSIGN);
			}
		}
		else if (mode === MODE_WHITESPACE && buffer && !field) {
			{
				current.push(true, PROPS_SET, buffer);
			}
		}
		else if (mode === MODE_ATTRIBUTE && propName) {
			{
				current.push(field || buffer, PROPS_SET, propName);
			}
			propName = '';
		}
		buffer = '';
	};

	for (let i=0; i<statics.length; i++) {
		if (i) {
			if (mode === MODE_TEXT) {
				commit();
			}
			commit(i);
		}

		for (let j=0; j<statics[i].length; j++) {
			char = statics[i][j];

			if (mode === MODE_TEXT) {
				if (char === '<') {
					// commit buffer
					commit();
					{
						current = [current];
					}
					mode = MODE_TAGNAME;
				}
				else {
					buffer += char;
				}
			}
			else if (quote) {
				if (char === quote) {
					quote = '';
				}
				else {
					buffer += char;
				}
			}
			else if (char === '"' || char === "'") {
				quote = char;
			}
			else if (char === '>') {
				commit();
				mode = MODE_TEXT;
			}
			else if (!mode) ;
			else if (char === '=') {
				mode = MODE_ATTRIBUTE;
				propName = buffer;
				buffer = '';
			}
			else if (char === '/') {
				commit();
				if (mode === MODE_TAGNAME) {
					current = current[0];
				}
				mode = current;
				{
					(current = current[0]).push(mode, CHILD_RECURSE);
				}
				mode = MODE_SLASH;
			}
			else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
				// <a disabled>
				commit();
				mode = MODE_WHITESPACE;
			}
			else {
				buffer += char;
			}
		}
	}
	commit();
	return current;
};

const getCacheMap = (statics) => {
	let tpl = CACHE.get(statics);
	if (!tpl) {
		CACHE.set(statics, tpl = build(statics));
	}
	return tpl;
};

const getCacheKeyed = (statics) => {
	let key = '';
	for (let i = 0; i < statics.length; i++) {
		key += statics[i].length + '-' + statics[i];
	}
	return CACHE[key] || (CACHE[key] = build(statics));
};

const USE_MAP = typeof Map === 'function';
const CACHE = USE_MAP ? new Map() : {};
const getCache = USE_MAP ? getCacheMap : getCacheKeyed;

const cached = function(statics) {
	const res = evaluate(this, getCache(statics), arguments, []);
	return res.length > 1 ? res : res[0];
};

var htm = MINI ? build : cached;

/** @type {number} */
let currentIndex;

/** @type {import('./internal').Component} */
let currentComponent;

/** @type {Array<import('./internal').Component>} */
let afterPaintEffects = [];

let oldBeforeRender = options.render;
options.render = vnode => {
	if (oldBeforeRender) oldBeforeRender(vnode);

	currentComponent = vnode._component;
	currentIndex = 0;

	if (!currentComponent.__hooks) return;
	currentComponent.__hooks._pendingEffects.forEach(invokeEffect);
	currentComponent.__hooks._pendingEffects = [];
};


let oldAfterDiff = options.diffed;
options.diffed = vnode => {
	if (oldAfterDiff) oldAfterDiff(vnode);

	const c = vnode._component;
	if (!c) return;

	const hooks = c.__hooks;
	if (!hooks) return;

	// TODO: Consider moving to a global queue. May need to move
	// this to the `commit` option
	hooks._pendingLayoutEffects.forEach(invokeEffect);
	hooks._pendingLayoutEffects = [];
};


let oldBeforeUnmount = options.unmount;
options.unmount = vnode => {
	if (oldBeforeUnmount) oldBeforeUnmount(vnode);

	const c = vnode._component;
	if (!c) return;

	const hooks = c.__hooks;
	if (!hooks) return;

	hooks._list.forEach(hook => hook._cleanup && hook._cleanup());
};

/**
 * Get a hook's state from the currentComponent
 * @param {number} index The index of the hook to get
 * @returns {import('./internal').HookState}
 */
function getHookState(index) {
	// Largely inspired by:
	// * https://github.com/michael-klein/funcy.js/blob/master/src/hooks/core_hooks.mjs
	// * https://github.com/michael-klein/funcy.js/blob/master/src/lib/renderer.mjs
	// Other implementations to look at:
	// * https://codesandbox.io/s/mnox05qp8

	const hooks = currentComponent.__hooks || (currentComponent.__hooks = { _list: [], _pendingEffects: [], _pendingLayoutEffects: [] });

	if (index >= hooks._list.length) {
		hooks._list.push({});
	}
	return hooks._list[index];
}

function useState(initialState) {
	return useReducer(invokeOrReturn, initialState);
}

function useReducer(reducer, initialState, init) {

	/** @type {import('./internal').ReducerHookState} */
	const hookState = getHookState(currentIndex++);
	if (hookState._component == null) {
		hookState._component = currentComponent;

		hookState._value = [
			init == null ? invokeOrReturn(null, initialState) : init(initialState),

			action => {
				hookState._value[0] = reducer(hookState._value[0], action);
				hookState._component.setState({});
			}
		];
	}

	return hookState._value;
}

/**
 * @param {import('./internal').Effect} callback
 * @param {any[]} args
 */
function useEffect(callback, args) {

	/** @type {import('./internal').EffectHookState} */
	const state = getHookState(currentIndex++);
	if (argsChanged(state._args, args)) {
		state._value = callback;
		state._args = args;

		currentComponent.__hooks._pendingEffects.push(state);
		afterPaint(currentComponent);
	}
}

/**
 * @param {import('./internal').Effect} callback
 * @param {any[]} args
 */
function useLayoutEffect(callback, args) {

	/** @type {import('./internal').EffectHookState} */
	const state = getHookState(currentIndex++);
	if (argsChanged(state._args, args)) {
		state._value = callback;
		state._args = args;

		currentComponent.__hooks._pendingLayoutEffects.push(state);
	}
}

function useRef(initialValue) {
	const state = getHookState(currentIndex++);
	if (state._value == null) {
		state._value = { current: initialValue };
	}

	return state._value;
}

/**
 * @param {() => any} callback
 * @param {any[]} args
 */
function useMemo(callback, args) {

	/** @type {import('./internal').MemoHookState} */
	const state = getHookState(currentIndex++);
	if (argsChanged(state._args, args)) {
		state._args = args;
		state._callback = callback;
		return state._value = callback();
	}

	return state._value;
}

/**
 * @param {() => void} callback
 * @param {any[]} args
 */
function useCallback(callback, args) {
	return useMemo(() => callback, args);
}

/**
 * @param {import('./internal').PreactContext} context
 */
function useContext(context) {
	const provider = currentComponent.context[context._id];
	if (provider == null) return context._defaultValue;
	const state = getHookState(currentIndex++);
	if (state._value == null) {
		state._value = true;
		provider.sub(currentComponent);
	}
	return provider.props.value;
}

// Note: if someone used Component.debounce = requestAnimationFrame,
// then effects will ALWAYS run on the NEXT frame instead of the current one, incurring a ~16ms delay.
// Perhaps this is not such a big deal.
/**
 * Invoke a component's pending effects after the next frame renders
 * @type {(component: import('./internal').Component) => void}
 */
let afterPaint = () => {};

/**
 * After paint effects consumer.
 */
function flushAfterPaintEffects() {
	afterPaintEffects.forEach(component => {
		component._afterPaintQueued = false;
		if (!component._parentDom) return;
		component.__hooks._pendingEffects.forEach(invokeEffect);
		component.__hooks._pendingEffects = [];
	});
	afterPaintEffects = [];
}

function scheduleFlushAfterPaint() {
	setTimeout(flushAfterPaintEffects, 0);
}

if (typeof window !== 'undefined') {
	afterPaint = (component) => {
		if (!component._afterPaintQueued && (component._afterPaintQueued = true) && afterPaintEffects.push(component) === 1) {
			/* istanbul ignore next */
			{
				requestAnimationFrame(scheduleFlushAfterPaint);
			}
		}
	};
}

/**
 * Invoke a Hook's effect
 * @param {import('./internal').EffectHookState} hook
 */
function invokeEffect(hook) {
	if (hook._cleanup) hook._cleanup();
	const result = hook._value();
	if (typeof result === 'function') hook._cleanup = result;
}

function argsChanged(oldArgs, newArgs) {
	return oldArgs == null || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

function invokeOrReturn(arg, f) {
	return typeof f === 'function' ? f(arg) : f;
}

var hooks = /*#__PURE__*/Object.freeze({
	useState: useState,
	useReducer: useReducer,
	useEffect: useEffect,
	useLayoutEffect: useLayoutEffect,
	useRef: useRef,
	useMemo: useMemo,
	useCallback: useCallback,
	useContext: useContext
});

const html = htm.bind(createElement);

const version = '16.8.0'; // trick libraries to think we are react

/* istanbul ignore next */
const REACT_ELEMENT_TYPE = (typeof Symbol!=='undefined' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

const CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;

let oldEventHook = options.event;
options.event = e => {
	/* istanbul ignore next */
	if (oldEventHook) e = oldEventHook(e);
	e.persist = Object;
	e.nativeEvent = e;
	return e;
};

/**
 * Legacy version of createElement.
 * @param {import('./internal').VNode["type"]} type The node name or Component constructor
 */
function createFactory(type) {
	return createElement$1.bind(null, type);
}

/**
 * Normalize DOM vnode properties.
 * @param {import('./internal').VNode} vnode The vnode to normalize props of
 * @param {object | null | undefined} props props to normalize
 */
function handleElementVNode(vnode, props) {
	let shouldSanitize, attrs, i;
	for (i in props) if ((shouldSanitize = CAMEL_PROPS.test(i))) break;
	if (shouldSanitize) {
		attrs = vnode.props = {};
		for (i in props) {
			attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = props[i];
		}
	}
}

/**
 * Proxy render() since React returns a Component reference.
 * @param {import('./internal').VNode} vnode VNode tree to render
 * @param {import('./internal').PreactElement} parent DOM node to render vnode tree into
 * @param {() => void} [callback] Optional callback that will be called after rendering
 * @returns {import('./internal').Component | null} The root component reference or null
 */
function render$1(vnode, parent, callback) {
	render(vnode, parent, parent.firstElementChild);
	if (typeof callback==='function') callback();

	return vnode!=null ? vnode._component : null;
}

class ContextProvider {
	getChildContext() {
		return this.props.context;
	}
	render(props) {
		return props.children;
	}
}

/**
 * Portal component
 * @param {object | null | undefined} props
 */
function Portal(props) {
	let wrap = createElement(ContextProvider, { context: this.context }, props.vnode);
	render$1(wrap, props.container);
	return null;
}

/**
 * Create a `Portal` to continue rendering the vnode tree at a different DOM node
 * @param {import('./internal').VNode} vnode The vnode to render
 * @param {import('./internal').PreactElement} container The DOM node to continue rendering in to.
 */
function createPortal(vnode, container) {
	return createElement(Portal, { vnode, container });
}

const mapFn = (children, fn) => {
	if (children == null) return null;
	children = toChildArray(children);
	return children.map(fn);
};

// This API is completely unnecessary for Preact, so it's basically passthrough.
let Children = {
	map: mapFn,
	forEach: mapFn,
	count(children) {
		return children ? toChildArray(children).length : 0;
	},
	only(children) {
		children = toChildArray(children);
		if (children.length!==1) throw new Error('Children.only() expects only one child.');
		return children[0];
	},
	toArray: toChildArray
};

/**
 * Wrap `createElement` to apply various vnode normalizations.
 * @param {import('./internal').VNode["type"]} type The node name or Component constructor
 * @param {object | null | undefined} [props] The vnode's properties
 * @param {Array<import('./internal').ComponentChildren>} [children] The vnode's children
 * @returns {import('./internal').VNode}
 */
function createElement$1(...args) {
	let vnode = createElement(...args);

	let type = vnode.type, props = vnode.props;
	if (typeof type!='function') {
		if (props.defaultValue) {
			if (!props.value && props.value!==0) {
				props.value = props.defaultValue;
			}
			delete props.defaultValue;
		}

		handleElementVNode(vnode, props);
	}

	vnode.preactCompatNormalized = false;
	return normalizeVNode(vnode);
}

/**
 * Normalize a vnode
 * @param {import('./internal').VNode} vnode
 */
function normalizeVNode(vnode) {
	vnode.preactCompatNormalized = true;
	applyClassName(vnode);
	applyEventNormalization(vnode);
	return vnode;
}

/**
 * Wrap `cloneElement` to abort if the passed element is not a valid element and apply
 * all vnode normalizations.
 * @param {import('./internal').VNode} element The vnode to clone
 * @param {object} props Props to add when cloning
 * @param {Array<import('./internal').ComponentChildren} rest Optional component children
 */
function cloneElement$1(element) {
	if (!isValidElement(element)) return element;
	let vnode = normalizeVNode(cloneElement.apply(null, arguments));
	vnode.$$typeof = REACT_ELEMENT_TYPE;
	return vnode;
}

/**
 * Check if the passed element is a valid (p)react node.
 * @param {*} element The element to check
 * @returns {boolean}
 */
function isValidElement(element) {
	return element!=null && element.$$typeof===REACT_ELEMENT_TYPE;
}

/**
 * Normalize event handlers like react does. Most famously it uses `onChange` for any input element.
 * @param {import('./internal').VNode} vnode The vnode to normalize events on
 */
function applyEventNormalization({ type, props }) {
	if (!props || typeof type!=='string') return;
	let newProps = {};
	for (let i in props) {
		newProps[i.toLowerCase()] = i;
	}
	if (newProps.ondoubleclick) {
		props.ondblclick = props[newProps.ondoubleclick];
		delete props[newProps.ondoubleclick];
	}
	if (newProps.onbeforeinput) {
		props.onbeforeinput = props[newProps.onbeforeinput];
		delete props[newProps.onbeforeinput];
	}
	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
	if (newProps.onchange && (type==='textarea' || (type.toLowerCase()==='input' && !/^fil|che|rad/i.test(props.type)))) {
		let normalized = newProps.oninput || 'oninput';
		if (!props[normalized]) {
			props[normalized] = props[newProps.onchange];
			delete props[newProps.onchange];
		}
	}
}

/**
 * Remove a component tree from the DOM, including state and event handlers.
 * @param {Element | Document | ShadowRoot | DocumentFragment} container
 * @returns {boolean}
 */
function unmountComponentAtNode(container) {
	if (container._prevVNode!=null) {
		render(null, container);
		return true;
	}
	return false;
}

/**
 * Alias `class` prop to `className` if available
 * @param {import('./internal').VNode} vnode
 */
function applyClassName(vnode) {
	let a = vnode.props;
	if (a.class || a.className) {
		classNameDescriptor.enumerable = 'className' in a;
		if (a.className) a.class = a.className;
		Object.defineProperty(a, 'className', classNameDescriptor);
	}
}

let classNameDescriptor = {
	configurable: true,
	get() { return this.class; }
};

/**
 * Check if two objects have a different shape
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
function shallowDiffers(a, b) {
	for (let i in a) if (!(i in b)) return true;
	for (let i in b) if (a[i]!==b[i]) return true;
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
 * Component class with a predefined `shouldComponentUpdate` implementation
 */
class PureComponent extends Component {
	constructor(props) {
		super(props);
		// Some third-party libraries check if this property is present
		this.isPureReactComponent = true;
	}

	shouldComponentUpdate(props, state) {
		return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
	}
}

// Some libraries like `react-virtualized` explicitely check for this.
Component.prototype.isReactComponent = {};

/**
 * Memoize a component, so that it only updates when the props actually have
 * changed. This was previously known as `React.pure`.
 * @param {import('./internal').ComponentFactory<any>} c The component constructor
 * @param {(prev: object, next: object) => boolean} [comparer] Custom equality function
 * @returns {import('./internal').ComponentFactory<any>}
 */
function memo(c, comparer) {
	function shouldUpdate(nextProps) {
		return !comparer(this.props, nextProps);
	}

	function Memoed(props, context) {
		this.shouldComponentUpdate =
			this.shouldComponentUpdate ||
			(comparer ? shouldUpdate : PureComponent.prototype.shouldComponentUpdate);
		return c.call(this, props, context);
	}
	Memoed.displayName = 'Memo(' + (c.displayName || c.name) + ')';
	return Memoed;
}

// Patch in `UNSAFE_*` lifecycle hooks
function setUnsafeDescriptor(obj, key) {
	Object.defineProperty(obj.prototype, 'UNSAFE_' + key, {
		configurable: true,
		get() { return this[key]; },
		set(v) { this[key] = v; }
	});
}

setUnsafeDescriptor(Component, 'componentWillMount');
setUnsafeDescriptor(Component, 'componentWillReceiveProps');
setUnsafeDescriptor(Component, 'componentWillUpdate');

/**
 * Pass ref down to a child. This is mainly used in libraries with HOCs that
 * wrap components. Using `forwardRef` there is an easy way to get a reference
 * of the wrapped component instead of one of the wrapper itself.
 * @param {import('./internal').ForwardFn} fn
 * @returns {import('./internal').FunctionalComponent}
 */
function forwardRef(fn) {
	function Forwarded(props) {
		let ref = props.ref;
		delete props.ref;
		return fn(props, ref);
	}
	Forwarded._forwarded = true;
	Forwarded.displayName = 'ForwardRef(' + (fn.displayName || fn.name) + ')';
	return Forwarded;
}

let oldVNodeHook = options.vnode;
options.vnode = vnode => {
	vnode.$$typeof = REACT_ELEMENT_TYPE;

	let type = vnode.type;
	if (type!=null && type._forwarded) {
		vnode.props.ref = vnode.ref;
		vnode.ref = null;
	}
	/* istanbul ignore next */
	if (oldVNodeHook) oldVNodeHook(vnode);
};

// React copies the named exports to the default one.
var index = {
	...hooks,
	version,
	Children,
	render: render$1,
	hydrate: render$1,
	unmountComponentAtNode,
	createPortal,
	createElement: createElement$1,
	createContext,
	createFactory,
	cloneElement: cloneElement$1,
	createRef,
	Fragment,
	isValidElement,
	findDOMNode,
	Component,
	PureComponent,
	memo,
	forwardRef,
	html
};

export default index;
export { version, Children, render$1 as render, render$1 as hydrate, unmountComponentAtNode, createPortal, createElement$1 as createElement, createContext, createFactory, cloneElement$1 as cloneElement, createRef, Fragment, isValidElement, findDOMNode, Component, PureComponent, memo, forwardRef, html, useState, useReducer, useEffect, useLayoutEffect, useRef, useMemo, useCallback, useContext };
