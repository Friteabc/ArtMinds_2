import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(id: string, newCredits: number): Promise<User>;
  updateUserDriveInfo(id: string, driveToken: string, folderId: string): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      credits: 10,
      createdAt: new Date(),
      driveConnected: false,
      driveToken: null,
      driveFolderId: null
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserCredits(id: string, newCredits: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser: User = {
      ...user,
      credits: newCredits
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserDriveInfo(id: string, driveToken: string, folderId: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser: User = {
      ...user,
      driveConnected: true,
      driveToken,
      driveFolderId: folderId
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();