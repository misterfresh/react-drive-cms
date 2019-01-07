function VNode() {}
let options = {}

const NO_RENDER = 0
const SYNC_RENDER = 1
const FORCE_RENDER = 2
const ASYNC_RENDER = 3

const ATTR_KEY = '__preactattr_'

// DOM properties that should NOT have "px" added when numeric
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i

const EMPTY_CHILDREN = []

function cloneElement(vnode, props) {
    return h(
        vnode.nodeName,
        extend(extend({}, vnode.attributes), props),
        arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
    )
}

function Component(props, context) {
    this._dirty = true

    /** @public
     *	@type {object}
     */
    this.context = context

    /** @public
     *	@type {object}
     */
    this.props = props

    /** @public
     *	@type {object}
     */
    this.state = this.state || {}
}

extend(Component.prototype, {
    /** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
     *	@param {object} nextProps
     *	@param {object} nextState
     *	@param {object} nextContext
     *	@returns {Boolean} should the component re-render
     *	@name shouldComponentUpdate
     *	@function
     */

    /** Update component state by copying properties from `state` to `this.state`.
     *	@param {object} state		A hash of state properties to update with new values
     *	@param {function} callback	A function to be called once component state is updated
     */
    setState(state, callback) {
        let s = this.state
        if (!this.prevState) this.prevState = extend({}, s)
        extend(s, typeof state === 'function' ? state(s, this.props) : state)
        if (callback)
            (this._renderCallbacks = this._renderCallbacks || []).push(callback)
        enqueueRender(this)
    },

    /** Immediately perform a synchronous re-render of the component.
     *	@param {function} callback		A function to be called after component is re-rendered.
     *	@private
     */
    forceUpdate(callback) {
        if (callback)
            (this._renderCallbacks = this._renderCallbacks || []).push(callback)
        renderComponent(this, FORCE_RENDER)
    },

    /** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
     *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
     *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
     *	@param {object} state		The component's current state
     *	@param {object} context		Context object (if a parent component has provided context)
     *	@returns VNode
     */
    render() {}
})

const stack = []

/** JSX/hyperscript reviver
 *	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
    let children = EMPTY_CHILDREN,
        lastSimple,
        child,
        simple,
        i
    for (i = arguments.length; i-- > 2; ) {
        stack.push(arguments[i])
    }
    if (attributes && attributes.children != null) {
        if (!stack.length) stack.push(attributes.children)
        delete attributes.children
    }
    while (stack.length) {
        if ((child = stack.pop()) && child.pop !== undefined) {
            for (i = child.length; i--; ) stack.push(child[i])
        } else {
            if (typeof child === 'boolean') child = null

            if ((simple = typeof nodeName !== 'function')) {
                if (child == null) child = ''
                else if (typeof child === 'number') child = String(child)
                else if (typeof child !== 'string') simple = false
            }

            if (simple && lastSimple) {
                children[children.length - 1] += child
            } else if (children === EMPTY_CHILDREN) {
                children = [child]
            } else {
                children.push(child)
            }

            lastSimple = simple
        }
    }

    let p = new VNode()
    p.nodeName = nodeName
    p.children = children
    p.attributes = attributes == null ? undefined : attributes
    p.key = attributes == null ? undefined : attributes.key

    // if a "vnode hook" is defined, pass every created VNode to it
    if (options.vnode !== undefined) options.vnode(p)

    return p
}

function createNode(nodeName, isSvg) {
    let node = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', nodeName)
        : document.createElement(nodeName)
    node.normalizedNodeName = nodeName
    return node
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
    let parentNode = node.parentNode
    if (parentNode) parentNode.removeChild(node)
}

function isSameNodeType(node, vnode, hydrating) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return node.splitText !== undefined
    }
    if (typeof vnode.nodeName === 'string') {
        return !node._componentConstructor && isNamedNode(node, vnode.nodeName)
    }
    return hydrating || node._componentConstructor === vnode.nodeName
}

/** Check if an Element has a given normalized name.
 *	@param {Element} node
 *	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
    return (
        node.normalizedNodeName === nodeName ||
        node.nodeName.toLowerCase() === nodeName.toLowerCase()
    )
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
    let props = extend({}, vnode.attributes)
    props.children = vnode.children

    let defaultProps = vnode.nodeName.defaultProps
    if (defaultProps !== undefined) {
        for (let i in defaultProps) {
            if (props[i] === undefined) {
                props[i] = defaultProps[i]
            }
        }
    }

    return props
}

function setComponentProps(component, props, opts, context, mountAll) {
    if (component._disable) return
    component._disable = true

    if ((component.__ref = props.ref)) delete props.ref
    if ((component.__key = props.key)) delete props.key

    if (!component.base || mountAll) {
        if (component.componentWillMount) component.componentWillMount()
    } else if (component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props, context)
    }

    if (context && context !== component.context) {
        if (!component.prevContext) component.prevContext = component.context
        component.context = context
    }

    if (!component.prevProps) component.prevProps = component.props
    component.props = props

    component._disable = false

    if (opts !== NO_RENDER) {
        if (
            opts === SYNC_RENDER ||
            options.syncComponentUpdates !== false ||
            !component.base
        ) {
            renderComponent(component, SYNC_RENDER, mountAll)
        } else {
            enqueueRender(component)
        }
    }

    if (component.__ref) component.__ref(component)
}

const components = {}

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
    let name = component.constructor.name
    ;(components[name] || (components[name] = [])).push(component)
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
    let list = components[Ctor.name],
        inst

    if (Ctor.prototype && Ctor.prototype.render) {
        inst = new Ctor(props, context)
        Component.call(inst, props, context)
    } else {
        inst = new Component(props, context)
        inst.constructor = Ctor
        inst.render = doRender
    }

    if (list) {
        for (let i = list.length; i--; ) {
            if (list[i].constructor === Ctor) {
                inst.nextBase = list[i].nextBase
                list.splice(i, 1)
                break
            }
        }
    }
    return inst
}

const mounts = []

/** Diff recursion count, used to track the end of the diff cycle. */
export let diffLevel = 0

/** Global flag indicating if the diff is currently within an SVG */
let isSvgMode = false

/** Global flag indicating if the diff is performing hydration */
let hydrating = false

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
    let c
    while ((c = mounts.pop())) {
        if (options.afterMount) options.afterMount(c)
        if (c.componentDidMount) c.componentDidMount()
    }
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    // diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
    if (!diffLevel++) {
        // when first starting the diff, check if we're diffing an SVG or within an SVG
        isSvgMode = parent != null && parent.ownerSVGElement !== undefined

        // hydration is indicated by the existing element to be diffed not having a prop cache
        hydrating = dom != null && !(ATTR_KEY in dom)
    }

    let ret = idiff(dom, vnode, context, mountAll, componentRoot)

    // append the element if its a new parent
    if (parent && ret.parentNode !== parent) parent.appendChild(ret)

    // diffLevel being reduced to 0 means we're exiting the diff
    if (!--diffLevel) {
        hydrating = false
        // invoke queued componentDidMount lifecycle methods
        if (!componentRoot) flushMounts()
    }

    return ret
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
    let out = dom,
        prevSvgMode = isSvgMode

    // empty values (null, undefined, booleans) render as empty Text nodes
    if (vnode == null || typeof vnode === 'boolean') vnode = ''

    // Fast case: Strings & Numbers create/update Text nodes.
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        // update if it's already a Text node:
        if (
            dom &&
            dom.splitText !== undefined &&
            dom.parentNode &&
            (!dom._component || componentRoot)
        ) {
            /* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
            if (dom.nodeValue != vnode) {
                dom.nodeValue = vnode
            }
        } else {
            // it wasn't a Text node: replace it with one and recycle the old Element
            out = document.createTextNode(vnode)
            if (dom) {
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom)
                recollectNodeTree(dom, true)
            }
        }

        out[ATTR_KEY] = true

        return out
    }

    // If the VNode represents a Component, perform a component diff:
    let vnodeName = vnode.nodeName
    if (typeof vnodeName === 'function') {
        return buildComponentFromVNode(dom, vnode, context, mountAll)
    }

    // Tracks entering and exiting SVG namespace when descending through the tree.
    isSvgMode =
        vnodeName === 'svg'
            ? true
            : vnodeName === 'foreignObject' ? false : isSvgMode

    // If there's no existing element or it's the wrong type, create a new one:
    vnodeName = String(vnodeName)
    if (!dom || !isNamedNode(dom, vnodeName)) {
        out = createNode(vnodeName, isSvgMode)

        if (dom) {
            // move children into the replacement node
            while (dom.firstChild) out.appendChild(dom.firstChild)

            // if the previous Element was mounted into the DOM, replace it inline
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom)

            // recycle the old element (skips non-Element node types)
            recollectNodeTree(dom, true)
        }
    }

    let fc = out.firstChild,
        props = out[ATTR_KEY],
        vchildren = vnode.children

    if (props == null) {
        props = out[ATTR_KEY] = {}
        for (let a = out.attributes, i = a.length; i--; )
            props[a[i].name] = a[i].value
    }

    // Optimization: fast-path for elements containing a single TextNode:
    if (
        !hydrating &&
        vchildren &&
        vchildren.length === 1 &&
        typeof vchildren[0] === 'string' &&
        fc != null &&
        fc.splitText !== undefined &&
        fc.nextSibling == null
    ) {
        if (fc.nodeValue != vchildren[0]) {
            fc.nodeValue = vchildren[0]
        }
    } else if ((vchildren && vchildren.length) || fc != null) {
        // otherwise, if there are existing or new children, diff them:
        innerDiffNode(
            out,
            vchildren,
            context,
            mountAll,
            hydrating || props.dangerouslySetInnerHTML != null
        )
    }

    // Apply attributes/props from VNode to the DOM Element:
    diffAttributes(out, vnode.attributes, props)

    // restore previous SVG mode: (in case we're exiting an SVG namespace)
    isSvgMode = prevSvgMode

    return out
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    let originalChildren = dom.childNodes,
        children = [],
        keyed = {},
        keyedLen = 0,
        min = 0,
        len = originalChildren.length,
        childrenLen = 0,
        vlen = vchildren ? vchildren.length : 0,
        j,
        c,
        f,
        vchild,
        child

    // Build up a map of keyed children and an Array of unkeyed children:
    if (len !== 0) {
        for (let i = 0; i < len; i++) {
            let child = originalChildren[i],
                props = child[ATTR_KEY],
                key =
                    vlen && props
                        ? child._component ? child._component.__key : props.key
                        : null
            if (key != null) {
                keyedLen++
                keyed[key] = child
            } else if (
                props ||
                (child.splitText !== undefined
                    ? isHydrating ? child.nodeValue.trim() : true
                    : isHydrating)
            ) {
                children[childrenLen++] = child
            }
        }
    }

    if (vlen !== 0) {
        for (let i = 0; i < vlen; i++) {
            vchild = vchildren[i]
            child = null

            // attempt to find a node based on key matching
            let key = vchild.key
            if (key != null) {
                if (keyedLen && keyed[key] !== undefined) {
                    child = keyed[key]
                    keyed[key] = undefined
                    keyedLen--
                }
            } else if (!child && min < childrenLen) {
                // attempt to pluck a node of the same type from the existing children
                for (j = min; j < childrenLen; j++) {
                    if (
                        children[j] !== undefined &&
                        isSameNodeType((c = children[j]), vchild, isHydrating)
                    ) {
                        child = c
                        children[j] = undefined
                        if (j === childrenLen - 1) childrenLen--
                        if (j === min) min++
                        break
                    }
                }
            }

            // morph the matched/found/created DOM child to match vchild (deep)
            child = idiff(child, vchild, context, mountAll)

            f = originalChildren[i]
            if (child && child !== dom && child !== f) {
                if (f == null) {
                    dom.appendChild(child)
                } else if (child === f.nextSibling) {
                    removeNode(f)
                } else {
                    dom.insertBefore(child, f)
                }
            }
        }
    }

    // remove unused keyed children:
    if (keyedLen) {
        for (let i in keyed)
            if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false)
    }

    // remove orphaned unkeyed children:
    while (min <= childrenLen) {
        if ((child = children[childrenLen--]) !== undefined)
            recollectNodeTree(child, false)
    }
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
    let component = node._component
    if (component) {
        // if node is owned by a Component, unmount that component (ends up recursing back here)
        unmountComponent(component)
    } else {
        // If the node's VNode had a ref function, invoke it with null here.
        // (this is part of the React spec, and smart for unsetting references)
        if (node[ATTR_KEY] != null && node[ATTR_KEY].ref)
            node[ATTR_KEY].ref(null)

        if (unmountOnly === false || node[ATTR_KEY] == null) {
            removeNode(node)
        }

        removeChildren(node)
    }
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
    node = node.lastChild
    while (node) {
        let next = node.previousSibling
        recollectNodeTree(node, true)
        node = next
    }
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
    let name

    // remove attributes no longer present on the vnode by setting them to undefined
    for (name in old) {
        if (!(attrs && attrs[name] != null) && old[name] != null) {
            setAccessor(
                dom,
                name,
                old[name],
                (old[name] = undefined),
                isSvgMode
            )
        }
    }

    // add new & update changed attributes
    for (name in attrs) {
        if (
            name !== 'children' &&
            name !== 'innerHTML' &&
            (!(name in old) ||
                attrs[name] !==
                (name === 'value' || name === 'checked'
                    ? dom[name]
                    : old[name]))
        ) {
            setAccessor(
                dom,
                name,
                old[name],
                (old[name] = attrs[name]),
                isSvgMode
            )
        }
    }
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
    return this.constructor(props, context)
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
    if (options.beforeUnmount) options.beforeUnmount(component)

    let base = component.base

    component._disable = true

    if (component.componentWillUnmount) component.componentWillUnmount()

    component.base = null

    // recursively tear down & recollect high-order component children:
    let inner = component._component
    if (inner) {
        unmountComponent(inner)
    } else if (base) {
        if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null)

        component.nextBase = base

        removeNode(base)
        collectComponent(component)

        removeChildren(base)
    }

    if (component.__ref) component.__ref(null)
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
    if (name === 'className') name = 'class'

    if (name === 'key') {
        // ignore
    } else if (name === 'ref') {
        if (old) old(null)
        if (value) value(node)
    } else if (name === 'class' && !isSvg) {
        node.className = value || ''
    } else if (name === 'style') {
        if (!value || typeof value === 'string' || typeof old === 'string') {
            node.style.cssText = value || ''
        }
        if (value && typeof value === 'object') {
            if (typeof old !== 'string') {
                for (let i in old) if (!(i in value)) node.style[i] = ''
            }
            for (let i in value) {
                node.style[i] =
                    typeof value[i] === 'number' &&
                    IS_NON_DIMENSIONAL.test(i) === false
                        ? value[i] + 'px'
                        : value[i]
            }
        }
    } else if (name === 'dangerouslySetInnerHTML') {
        if (value) node.innerHTML = value.__html || ''
    } else if (name[0] == 'o' && name[1] == 'n') {
        let useCapture = name !== (name = name.replace(/Capture$/, ''))
        name = name.toLowerCase().substring(2)
        if (value) {
            if (!old) node.addEventListener(name, eventProxy, useCapture)
        } else {
            node.removeEventListener(name, eventProxy, useCapture)
        }
        ;(node._listeners || (node._listeners = {}))[name] = value
    } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
        setProperty(node, name, value == null ? '' : value)
        if (value == null || value === false) node.removeAttribute(name)
    } else {
        let ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''))
        if (value == null || value === false) {
            if (ns)
                node.removeAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    name.toLowerCase()
                )
            else node.removeAttribute(name)
        } else if (typeof value !== 'function') {
            if (ns)
                node.setAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    name.toLowerCase(),
                    value
                )
            else node.setAttribute(name, value)
        }
    }
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
    try {
        node[name] = value
    } catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
    return this._listeners[e.type]((options.event && options.event(e)) || e)
}

function render(vnode, parent, merge) {
    return diff(merge, vnode, {}, false, parent, false)
}

function extend(obj, props) {
    for (let i in props) obj[i] = props[i]
    return obj
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
const defer =
    typeof Promise == 'function'
        ? Promise.resolve().then.bind(Promise.resolve())
        : setTimeout

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
    if (component._disable) return

    let props = component.props,
        state = component.state,
        context = component.context,
        previousProps = component.prevProps || props,
        previousState = component.prevState || state,
        previousContext = component.prevContext || context,
        isUpdate = component.base,
        nextBase = component.nextBase,
        initialBase = isUpdate || nextBase,
        initialChildComponent = component._component,
        skip = false,
        rendered,
        inst,
        cbase

    // if updating
    if (isUpdate) {
        component.props = previousProps
        component.state = previousState
        component.context = previousContext
        if (
            opts !== FORCE_RENDER &&
            component.shouldComponentUpdate &&
            component.shouldComponentUpdate(props, state, context) === false
        ) {
            skip = true
        } else if (component.componentWillUpdate) {
            component.componentWillUpdate(props, state, context)
        }
        component.props = props
        component.state = state
        component.context = context
    }

    component.prevProps = component.prevState = component.prevContext = component.nextBase = null
    component._dirty = false

    if (!skip) {
        rendered = component.render(props, state, context)

        // context to pass to the child, can be updated via (grand-)parent component
        if (component.getChildContext) {
            context = extend(extend({}, context), component.getChildContext())
        }

        let childComponent = rendered && rendered.nodeName,
            toUnmount,
            base

        if (typeof childComponent === 'function') {
            // set up high order component link

            let childProps = getNodeProps(rendered)
            inst = initialChildComponent

            if (
                inst &&
                inst.constructor === childComponent &&
                childProps.key == inst.__key
            ) {
                setComponentProps(inst, childProps, SYNC_RENDER, context, false)
            } else {
                toUnmount = inst

                component._component = inst = createComponent(
                    childComponent,
                    childProps,
                    context
                )
                inst.nextBase = inst.nextBase || nextBase
                inst._parentComponent = component
                setComponentProps(inst, childProps, NO_RENDER, context, false)
                renderComponent(inst, SYNC_RENDER, mountAll, true)
            }

            base = inst.base
        } else {
            cbase = initialBase

            // destroy high order component link
            toUnmount = initialChildComponent
            if (toUnmount) {
                cbase = component._component = null
            }

            if (initialBase || opts === SYNC_RENDER) {
                if (cbase) cbase._component = null
                base = diff(
                    cbase,
                    rendered,
                    context,
                    mountAll || !isUpdate,
                    initialBase && initialBase.parentNode,
                    true
                )
            }
        }

        if (
            initialBase &&
            base !== initialBase &&
            inst !== initialChildComponent
        ) {
            let baseParent = initialBase.parentNode
            if (baseParent && base !== baseParent) {
                baseParent.replaceChild(base, initialBase)

                if (!toUnmount) {
                    initialBase._component = null
                    recollectNodeTree(initialBase, false)
                }
            }
        }

        if (toUnmount) {
            unmountComponent(toUnmount)
        }

        component.base = base
        if (base && !isChild) {
            let componentRef = component,
                t = component
            while ((t = t._parentComponent)) {
                ;(componentRef = t).base = base
            }
            base._component = componentRef
            base._componentConstructor = componentRef.constructor
        }
    }

    if (!isUpdate || mountAll) {
        mounts.unshift(component)
    } else if (!skip) {
        // Ensure that pending componentDidMount() hooks of child components
        // are called before the componentDidUpdate() hook in the parent.
        // Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
        // flushMounts();

        if (component.componentDidUpdate) {
            component.componentDidUpdate(
                previousProps,
                previousState,
                previousContext
            )
        }
        if (options.afterUpdate) options.afterUpdate(component)
    }

    if (component._renderCallbacks != null) {
        while (component._renderCallbacks.length)
            component._renderCallbacks.pop().call(component)
    }

    if (!diffLevel && !isChild) flushMounts()
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
    let c = dom && dom._component,
        originalComponent = c,
        oldDom = dom,
        isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
        isOwner = isDirectOwner,
        props = getNodeProps(vnode)
    while (c && !isOwner && (c = c._parentComponent)) {
        isOwner = c.constructor === vnode.nodeName
    }

    if (c && isOwner && (!mountAll || c._component)) {
        setComponentProps(c, props, ASYNC_RENDER, context, mountAll)
        dom = c.base
    } else {
        if (originalComponent && !isDirectOwner) {
            unmountComponent(originalComponent)
            dom = oldDom = null
        }

        c = createComponent(vnode.nodeName, props, context)
        if (dom && !c.nextBase) {
            c.nextBase = dom
            // passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
            oldDom = null
        }
        setComponentProps(c, props, SYNC_RENDER, context, mountAll)
        dom = c.base

        if (oldDom && dom !== oldDom) {
            oldDom._component = null
            recollectNodeTree(oldDom, false)
        }
    }

    return dom
}

let items = []

function enqueueRender(component) {
    if (
        !component._dirty &&
        (component._dirty = true) &&
        items.push(component) == 1
    ) {
        ;(options.debounceRendering || defer)(rerender)
    }
}

function rerender() {
    let p,
        list = items
    items = []
    while ((p = list.pop())) {
        if (p._dirty) renderComponent(p)
    }
}
const ARR = []
let Children = {
    map(children, fn, ctx) {
        if (children == null) return null
        children = Children.toArray(children)
        if (ctx && ctx !== children) fn = fn.bind(ctx)
        return children.map(fn)
    },
    forEach(children, fn, ctx) {
        if (children == null) return null
        children = Children.toArray(children)
        if (ctx && ctx !== children) fn = fn.bind(ctx)
        children.forEach(fn)
    },
    count(children) {
        return (children && children.length) || 0
    },
    only(children) {
        children = Children.toArray(children)
        if (children.length !== 1)
            throw new Error('Children.only() expects only one child.')
        return children[0]
    },
    toArray(children) {
        if (children == null) return []
        return ARR.concat(children)
    }
}

function shallowDiffers(a, b) {
    for (let i in a) if (!(i in b)) return true
    for (let i in b) if (a[i] !== b[i]) return true
    return false
}

function PureComponent(props, context) {
    Component.call(this, props, context)
}
function F() {}
F.prototype = Component.prototype
PureComponent.prototype = new F()
PureComponent.prototype.isPureReactComponent = true
PureComponent.prototype.shouldComponentUpdate = function(props, state) {
    return (
        shallowDiffers(this.props, props) || shallowDiffers(this.state, state)
    )
}

let createElement = h
function createFactory(type) {
    return createElement.bind(null, type)
}

function isValidElement(element) {
    return (
        element &&
        (element instanceof VNode || element.$$typeof === REACT_ELEMENT_TYPE)
    )
}
function EmptyComponent() {
    return null
}
function unmountComponentAtNode(container) {
    let existing =
        container._preactCompatRendered && container._preactCompatRendered.base
    if (existing && existing.parentNode === container) {
        preactRender(h(EmptyComponent), container, existing)
        return true
    }
    return false
}

export default {
    h,
    createElement,
    cloneElement,
    Component,
    render,
    rerender,
    options,
    Children,
    PureComponent,
    createFactory,
    isValidElement,
    unmountComponentAtNode
}

export {
    h,
    createElement,
    cloneElement,
    Component,
    render,
    rerender,
    options,
    Children,
    PureComponent,
    createFactory,
    isValidElement,
    unmountComponentAtNode
}
