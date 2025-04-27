
// Mock data store to simulate backend functionality
import { v4 as uuidv4 } from 'uuid';

export interface Contribution {
  id: string;
  title: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  date: Date;
  contributors: string[];
}

export interface Profile {
  name: string;
  phone: string;
  email?: string;
}

// Mock local storage implementation
const getContributions = (): Contribution[] => {
  const stored = localStorage.getItem('tanzapay-contributions');
  if (!stored) return [];
  return JSON.parse(stored);
};

const saveContributions = (contributions: Contribution[]) => {
  localStorage.setItem('tanzapay-contributions', JSON.stringify(contributions));
};

const getProfile = (): Profile => {
  const stored = localStorage.getItem('tanzapay-profile');
  if (!stored) return { name: '', phone: '' };
  return JSON.parse(stored);
};

const saveProfile = (profile: Profile) => {
  localStorage.setItem('tanzapay-profile', JSON.stringify(profile));
};

// Data operations
export const addContribution = (contribution: Omit<Contribution, 'id' | 'date'>): Contribution => {
  const newContribution = {
    ...contribution,
    id: uuidv4(),
    date: new Date(),
    contributors: [],
  };
  
  const contributions = getContributions();
  contributions.push(newContribution);
  saveContributions(contributions);
  return newContribution;
};

export const getAllContributions = (): Contribution[] => {
  return getContributions();
};

export const updateProfile = (profile: Profile): Profile => {
  saveProfile(profile);
  return profile;
};

export const getProfileData = (): Profile => {
  return getProfile();
};

export const mobileMoneyProviders = [
  { id: 'mpesa', name: 'M-Pesa', logo: '📱' },
  { id: 'tigopesa', name: 'Tigo Pesa', logo: '💰' },
  { id: 'airtelmoney', name: 'Airtel Money', logo: '💸' },
  { id: 'halopesa', name: 'Halotel Halopesa', logo: '💳' },
];
