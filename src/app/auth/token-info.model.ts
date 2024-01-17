import { JwtPayload } from './jwt-payload.model';

export class TokenInfo extends JwtPayload {
    access_token !: string;
    expires_in!: number;
    token_type!: string;
}