import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epmpdrpmmlynnkqfjcpk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbXBkcnBtbWx5bm5rcWZqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDQ5OTQsImV4cCI6MjA1MjUyMDk5NH0.IGk80nbnKrDvDV1k9kQV2F2wbiT_yYtNR4CoVyGUZsU';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to update user role to 'admin'
async function setAdminRole() {
  try {
    const user = supabase.auth.user(); // Get the current logged-in user
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    // Update user metadata to add the 'admin' role
    const { data, error } = await supabase.auth.updateUser({
      data: {
        role: 'admin', // Set the role as admin in the user metadata
      },
    });

    if (error) {
      throw error;
    }

    console.log('User role updated to admin:', data);
  } catch (err) {
    console.error('Error updating user role:', err.message);
  }
}

setAdminRole();

/*import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epmpdrpmmlynnkqfjcpk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbXBkcnBtbWx5bm5rcWZqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDQ5OTQsImV4cCI6MjA1MjUyMDk5NH0.IGk80nbnKrDvDV1k9kQV2F2wbiT_yYtNR4CoVyGUZsU'
export const supabase = createClient(supabaseUrl, supabaseKey)
//create admin role
const { user, error } = await supabase.auth.update({
    data: { roles: 'admin' }
  })
  
*/