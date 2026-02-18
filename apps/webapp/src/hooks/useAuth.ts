import { authClient } from '@/lib/auth';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const logIn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    mutationKey: ['logIn'],
  });

  const signUp = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/dashboard',
      });
      if (error) throw new Error(error.message);
      return data;
    },
    mutationKey: ['signUp'],
  });

  const logOut = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);
      localStorage.removeItem('token');
    },
    mutationKey: ['logOut'],
  });

  return { logIn, signUp, logOut };
};
