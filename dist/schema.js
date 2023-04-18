"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _apolloServer = require("apollo-server");
var _templateObject;
var typeDefs = (0, _apolloServer.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n    scalar JSON\n    scalar Timestamp\n\n    union Components = Server | TestComponent | ServerSideProps | Provider\n\n    type Query {\n        hello: String\n        getState(key: ID!, scope: String!): State\n        renderComponent(key: ID!, props: JSON): Component\n    }\n\n    type Component {\n        id: ID!\n        props: JSON\n        clientProps: JSON\n        rendered: Components\n    }\n\n    type State {\n        id: ID!\n        key: ID!\n        scope: String!\n        value: JSON\n    }\n\n    type Mutation {\n        setState(key: ID!, scope: String!, value: JSON): State!\n        callFunction(key: ID!, prop: String!, args: JSON): JSON\n        authenticate(strategy: String!, data: JSON): AuthenticationResult\n    }\n\n    type Subscription {\n        updateState(key: ID!, scope: String!): State!\n        updateComponent(\n            key: ID!\n            scope: String!\n            id: String!\n            bearer: String\n        ): Component!\n    }\n\n    type TestComponent {\n        bar: String\n        foo: String\n    }\n\n    type Server {\n        version: String\n        uptime: Timestamp\n        platform: String\n        children: [Components]\n    }\n\n    type Provider {\n        children: [Components]\n    }\n\n    type ServerSideProps {\n        key: ID!\n        props: JSON!\n        children: JSON\n    }\n\n    type AuthenticationResult {\n        id: ID!\n        email: String\n        strategy: String!\n        strategies: JSON!\n        token: String!\n    }\n"])));
exports.typeDefs = typeDefs;