import bcrypt from "bcrypt";

const Hashing = {
  // Number of rounds for bcrypt to salt the key. Higher values increase security but also increase execution time.
  saltRounds: 10,

  // Function to generate a hashed key using bcrypt
  async generate(key: string): Promise<string> {
    try {
      return await bcrypt.hash(key, this.saltRounds);
    } catch (error) {
      console.error(error);
      return "";
    }
  },

  // Function to validate a hashed key using bcrypt
  async validate(key: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(key, hash);
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default Hashing;
