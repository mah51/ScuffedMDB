//@ts-ignore
import { TypeORMLegacyAdapter } from '@next-auth/typeorm-legacy-adapter';
import User from '../models/user';
import dbConnect from './dbConnect';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function myAdapter(config: any, options = {}): any {
  const { getAdapter: oldAdapter } = TypeORMLegacyAdapter(config, options);
  const getAdapter = async (appOptions) => {
    const funcs = await oldAdapter(appOptions);
    funcs.getUser = async (id) => {
      const user = await User.findById(id);
      return user;
    };
    funcs.getUserByEmail = async (email) => {
      const user = await User.findOne({ email });
      return user;
    };
    funcs.createUser = async (profile) => {
      await dbConnect();
      const user = new User({
        ...profile,
      });
      await user.save();
      return user;
    };
    return funcs;
  };

  return { getAdapter };
}
