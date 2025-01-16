import { User } from '../entities/user.entity';

export interface UserWithImageUrl extends User {
  imageUrl: string;
} 