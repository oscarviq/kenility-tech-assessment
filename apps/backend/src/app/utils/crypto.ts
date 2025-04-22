import * as bcrypt from 'bcrypt';

export default {
  hash: async (text: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(text, salt);
  },

  validate: async (text: string, hash: string) => {
    return await bcrypt.compare(text, hash);
  }
};

