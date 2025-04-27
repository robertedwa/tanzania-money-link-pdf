
import { supabase } from "@/integrations/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);
