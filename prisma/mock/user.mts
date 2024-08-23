// user.ts
import { faker } from '@faker-js/faker';

interface UserModel {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  userId: string;
}

export const _mockUser = {
  id: faker.database.mongodbObjectId(),
  name: '{ ∅ }',
  email: 'varsnothing@gmail.com',
  image: 'https://avatars.githubusercontent.com/u/54047316?v=4',
  emailVerified: false,
  userId: '66315b93521b49388fe71aa8',
};

export const createMockUser = () => ({
  id: faker.database.mongodbObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  image: faker.image.avatar(),
  firstName: 'Vars',
  lastName: 'Nothing',
  birthday: new Date(),
  location: {
    name: 'Nowhere',
  },
});

export const mockUser = createMockUser();
export const mockUser2 = createMockUser();
export const mockUser3 = createMockUser();
