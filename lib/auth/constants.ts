// constants.ts TS-Doc?
/* eslint @typescript-eslint/consistent-type-assertions:0 */
import type { NextAuthConfig } from 'next-auth';
import { v4 as uuid } from 'uuid';
import type { PrismaClient } from '@prisma/client';
import { PrivatePrisma } from '@model';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {
  UpdatePrivateUserServices,
  GetPrivateCommonServices,
  UpdatePrivateUserAbilities,
  GetPrivateCommonAbilities,
} from '@controller';

export const GetSession = async ({ cookies = '' }) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/auth/session`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
    });
    const session = await response.json();
    console.log({ cookies, session });
    return session;
  } catch (e) {
    console.error(e);
  }
};

// schema sanitizer
const allUsersSideEffects = async ({ user }: any) => {
  const services = await GetPrivateCommonServices({});
  const abilities = await GetPrivateCommonAbilities({});
  const commonServices = services.map((service) => service?.id).map((el) => el);
  const commonAbilities = abilities.map((ability) => ability?.id).map((el) => el);

  await UpdatePrivateUserServices({ user, services: [...commonServices, ...user.servicesIds], upsert: false });
  await UpdatePrivateUserAbilities({ user, abilities: [...commonAbilities, ...user.abilitiesIds], upsert: false });
};

export const providers: any[] = [
  EmailProvider({
    server: process.env.EMAIL_SERVER as string,
    from: process.env.EMAIL_FROM as string,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
  AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID as string,
    clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    wellKnown: 'https://appleid.apple.com/.well-known/openid-configuration',
    checks: ['pkce'],
    authorization: {
      url: 'https://appleid.apple.com/auth/authorize',
      params: {
        scope: 'name email',
        response_type: 'code',
        response_mode: 'form_post',
        state: uuid(),
      },
    },
    token: {
      url: `https://appleid.apple.com/auth/token`,
    },
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    profile(profile: any) {
      return {
        id: profile.sub,
        name: profile.name || null,
        email: profile.email || null,
        image: null,
      };
    },
    profileConform(profile: any, query: any) {
      if (query.user) {
        const user = JSON.parse(query.user);
        if (user.name) {
          profile.name = Object.values(user.name).join(' ');
        }
      }
      return profile;
    },
  } as any),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  }),
];

// config.ts
export const authConfig = {
  providers,
  adapter: PrismaAdapter(PrivatePrisma as unknown as PrismaClient),
  // session: {
  //   strategy: 'jwt',
  // },
  events: {
    async signIn(props) {
      const { user, isNewUser } = props;
      try {
        if (isNewUser) {
          await allUsersSideEffects({ user });
        }
      } catch (e) {
        console.warn(
          `Code 005: Sign-up side-effects failed. New user entry probably has inconsistent data and might experience problems: ${e}`,
        );
      }
    },
  },
  callbacks: {
    async signIn(props) {
      const { user } = props;
      try {
        await allUsersSideEffects({ user });
      } catch (e) {
        console.warn(`Code 004: Log-in side-effects failed. If it's a new user, plese ignore: ${e}`);
      }

      return true;
    },
    async redirect() {
      return `${process.env.MAIN_URL}/dash`;
    },
    // async jwt({ user, token }) {
    //   if (user) {
    //     // Note that this if condition is needed
    //     token.user = { ...user };
    //   }
    //   return token;
    // },
    async session({ session, user }: any) {
      const facadedUser = {
        id: user.id,
        email: user.email,
        image: user.image,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        preferences: user.preferencesIds,
        roles: user.rolesIds,
        services: user.servicesIds,
        abilities: user.abilitiesIds,
        favorites: user.favoritesIds,
        favoritesStrings: user.favoritesStrings,
      };
      session.user = facadedUser;
      // if (token?.user) {
      //   // Note that this if condition is needed
      //   session.user = token.user;
      // }
      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  trustHost: true,
  pages: {
    signIn: '/dash/signin',
    signOut: '/',
    error: '/dash/error', // Error code passed in query string as ?error=
    verifyRequest: '/dash/verify', // (used for check email message)
    // newUser: '/' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
} satisfies NextAuthConfig;

export const providerMap = providers.map((provider: any) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
