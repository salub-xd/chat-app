import * as express from 'express';

export interface GoogleTokenResult {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
  }

  declare global {
    namespace Express {
      interface Request {
        user?: {
          id:string;
          email:string;
        }; // Replace User with your actual user type or interface
      }
    }
  }