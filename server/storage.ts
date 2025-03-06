import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(id: string, newCredits: number): Promise<User>;
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
      credits: 10, // S'assurer que les nouveaux utilisateurs reçoivent 10 crédits
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    console.log(`Nouvel utilisateur créé avec ${user.credits} crédits:`, user);
    return user;
  }

  async updateUserCredits(id: string, newCredits: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // S'assurer que les crédits ne peuvent pas être négatifs
    const updatedCredits = Math.max(0, newCredits);

    const updatedUser: User = {
      ...user,
      credits: updatedCredits
    };
    this.users.set(id, updatedUser);

    console.log(`Crédits mis à jour pour l'utilisateur ${id}:`, {
      avant: user.credits,
      apres: updatedUser.credits
    });

    return updatedUser;
  }
}

export const storage = new MemStorage();