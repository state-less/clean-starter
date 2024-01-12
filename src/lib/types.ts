export type Session = {
    id: string;
    token: string;
    strategy: Strategies;
    strategies: Record<Strategies, Strategy>;
};

export enum Strategies {
    Google = 'google',
}

export type Strategy = {
    email: string;
    id: string;
    token: string;
    decoded: GoogleToken;
};

export type GoogleToken = {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: true;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
    jti: string;
};
