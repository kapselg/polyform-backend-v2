import { customAlphabet } from "nanoid";
import { env } from "../../env";

export const SIMPLE_ID = customAlphabet(env.SIMPLE_ALPHABET, 6);
export const LONG_ID = customAlphabet(env.LONG_ALPHABET, 12);

export class GeneratedID {
  id: string;

  constructor(type: () => string){
    this.id = type();
  }
}