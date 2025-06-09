import bcrypt from "bcrypt";

const Hashing = {
  // Number of rounds for bcrypt to salt the key. Higher values increase security but also increase execution time.
  saltRounds: 10,

  // Function to generate a hashed key using bcrypt
  async generate(key: string): Promise<string> {
    return await bcrypt.hash(key, this.saltRounds);
  },

  // Function to validate a hashed key using bcrypt
  async validate(key: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(key, hash);
  },
};

export default Hashing;
