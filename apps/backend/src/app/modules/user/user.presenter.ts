import { UserDocument, UserResponseSchema } from './user.schema';

type UserWithToken = UserDocument & { accessToken: string };

export const UserPresenter = (user: UserWithToken) => {
  const parsed = UserResponseSchema.parse({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    accessToken: user.accessToken
  });

  if (!user.accessToken) {
    delete parsed.accessToken;
  }

  return parsed;
};
