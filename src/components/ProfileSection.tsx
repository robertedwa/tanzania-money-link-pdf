
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getProfileData, updateProfile, Profile } from '@/lib/data';
import { User } from 'lucide-react';

export const ProfileSection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load profile data
    const profile = getProfileData();
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      toast({
        title: "Error",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }
    
    // Update profile
    updateProfile({ 
      name, 
      phone,
      email: email || undefined
    });
    
    toast({
      title: "Success",
      description: "Your profile has been updated",
    });
    
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Profile</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 XXX XXX XXX"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {name || phone || email ? (
              <>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{phone}</p>
                  </div>
                </div>
                
                {email && (
                  <div className="pt-2 text-sm">
                    <p className="text-gray-500">Email</p>
                    <p>{email}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <User size={40} className="mx-auto text-gray-300" />
                <p className="text-gray-500">Please update your profile information</p>
                <Button onClick={() => setIsEditing(true)}>
                  Set Up Profile
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
