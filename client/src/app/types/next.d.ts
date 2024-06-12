// src/types/next.d.ts

// Importing the User type from @supabase/supabase-js
import { User } from '@supabase/supabase-js';

// Declaring a module augmentation for 'next'
declare module 'next' {
  // Extending the NextApiRequest interface
  interface NextApiRequest {
    // Adding an optional user property of type User
    user?: User;
  }
}