import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export function configurePassport(passport: PassportStatic) {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (jwt_payload, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: jwt_payload.userId },
          });

          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          const isMatch = await bcrypt.compare(password, user.passwordHash);

          if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}