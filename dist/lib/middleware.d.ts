declare enum Strategies {
    fingerprint = "fingerprint"
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
export declare const ValidatePermission: (permissions: Permissions, roles: Roles) => ({ data }: ValidatePermissionArg) => any;
export declare const authenticate: ({ data }: ValidatePermissionArg) => any;
export declare const getToken: ({ data }: ValidatePermissionArg) => any;
export declare const getId: (jwt: any) => any;
export {};
