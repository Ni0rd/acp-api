import jsonwebtoken from 'jsonwebtoken';

const TOKEN_DURATION = '365d';

interface TokenPayload {
  userId: number;
}

export default class Token {
  payload: TokenPayload;

  constructor(payload: TokenPayload) {
    this.payload = payload;
  }

  getSigned(): string {
    return jsonwebtoken.sign(this.payload, process.env.JWT_SECRET as string, {
      expiresIn: TOKEN_DURATION,
    });
  }

  static getTokenFromEncoded(encoded: string): Token | null {
    try {
      const payload = jsonwebtoken.verify(
        encoded,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
      return new Token(payload);
    } catch (err) {
      return null;
    }
  }
}
