CREATE TABLE states
(
    id SERIAL,
    key character varying(255) NOT NULL,
    scope character varying(255),
    value json,
    CONSTRAINT states_scope_key_unique UNIQUE (scope, key)
);