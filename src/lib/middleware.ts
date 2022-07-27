import { SECRET } from '../config';

const jwt = require('jsonwebtoken');

enum Strategies {
  fingerprint = 'fingerprint',
}

type Fields = Record<string, RegExp | string>;

type Identity = Record<Strategies, Fields>;

type Permissions = Record<string, Identity[]>;

type ConnectionInfo = {
  headers: Record<string, string>;
};
type ValidatePermissionArg = {
  data: ConnectionInfo;
};
type Role = string;
type Roles = Role[];

export const ValidatePermission =
  (permissions: Permissions, roles: Roles) =>
  ({ data }: ValidatePermissionArg) => {
    if (
      !data?.headers?.Authorization ||
      !data?.headers?.Authorization?.includes('Bearer')
    ) {
      throw new Error('Not authorized');
    }

    const token = data.headers.Authorization.split(' ').pop();
    const decoded = jwt.verify(token, SECRET);
    console.log('VALIDATE', JSON.stringify(decoded));
    for (const role of roles) {
      const roleObj = permissions[role];
      if (!roleObj)
        throw new Error(`Not authorized. Missing permission '${roles}'`);

      for (const identity of roleObj) {
        for (const strat in identity) {
          const fields = identity[Strategies[strat as keyof typeof Strategies]];
          const allowed = Object.keys(fields).reduce((acc, field) => {
            const test = fields[field];
            if (test instanceof RegExp)
              return acc && decoded[strat] && test.test(decoded[strat][field]);
            return (
              acc && decoded[strat] && decoded[strat][field] === fields[field]
            );
          }, true);
          if (allowed) return decoded;
        }
      }
    }

    throw new Error(`Not authorized. Missing permission '${roles}'`);
  };

export const authenticate = ({ data }: ValidatePermissionArg) => {
  if (
    !data?.headers?.Authorization ||
    !data?.headers?.Authorization?.includes('Bearer')
  ) {
    throw new Error('Not authorized');
  }

  const token = data.headers.Authorization.split(' ').pop();

  return jwt.verify(token, SECRET);
};

export const getToken = ({ data }: ValidatePermissionArg) => {
  try {
    const token = data?.headers?.Authorization?.split(' ').pop();
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
};

export const getId = (jwt: any) => {
  if (!jwt) return null;

  if (jwt.compound) return jwt.compound.id;

  if (jwt?.google?.email) return jwt?.google?.email;

  if (jwt?.webauthn?.keyId) return jwt?.webauthn?.keyId;

  if (jwt?.fingerprint?.visitorId) return jwt?.fingerprint?.visitorId;

  return jwt?.address?.id;
};
