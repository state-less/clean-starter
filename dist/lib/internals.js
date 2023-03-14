"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.Lifecycle = void 0;
var _reactServer = require("@state-less/react-server");
var _types = require("./types");
const Lifecycle = (Component, props, {
  key,
  request
}) => {
  _reactServer.Dispatcher.getCurrent().addCurrentComponent({
    Component,
    props,
    key
  });
  _reactServer.Dispatcher.getCurrent().setClientContext(request);
  const rendered = Component({
    ...props
  }, {
    request
  });
  _reactServer.Dispatcher.getCurrent().popCurrentComponent();
  return {
    __typename: Component.name,
    key,
    ...rendered
  };
};
exports.Lifecycle = Lifecycle;
const render = (tree, request = null, parent = null) => {
  const {
    Component,
    key,
    props
  } = tree;
  console.log('Render', Component, props);
  const processedChildren = [];
  let node = Lifecycle(Component, props, {
    key,
    request
  });
  if ((0, _types.isReactServerComponent)(node)) {
    node = render(node, request, node);
  }
  const children = Array.isArray(props.children) ? props.children : [props.children].filter(Boolean);
  console.log('Render children', children);
  for (const child of children) {
    console.log('Render child', child, children);
    if (!(0, _types.isReactServerComponent)(child)) continue;
    let childResult = null;
    do {
      _reactServer.Dispatcher.getCurrent().setParentNode((childResult || child).key, node);
      childResult = render(childResult || child, request, node);
      console.log('Render parent', Component, childResult.key, node);
    } while ((0, _types.isReactServerComponent)(childResult));
    processedChildren.push(childResult);
  }
  node.children = processedChildren;
  if (parent === null) {
    _reactServer.Dispatcher.getCurrent().setRootComponent(node);
  }
  return {
    key,
    ...node
  };
};
exports.render = render;