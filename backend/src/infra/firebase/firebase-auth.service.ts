// firebase-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
