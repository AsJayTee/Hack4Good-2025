//need to do "import {supabase} from './client"; or something, in the actual app file
//an eg of the above can be seen in vid 4, 3 min in

//rmbr to install supabase-js (npm install @supabase/supabase-js)
//can consider writing in error handling for this function

//write code <form onSubmit=add_user> or smth to that effect
/*
import {supabase} from './client'

/*async function add_user(){
    const { data, error } = await supabase.auth.signUp({
        email: 'example@email.com', //un-hardcode this, change it to the var containing what the manager enters
        password: 'example-password', //un-hardcode this too
        options: {
            data: {
              phoneNum: 12345678 //un-hardcode this
              role: 'user'
              name: 
              category:
              points:
            }
      })       
}*/

async function add_admin(){
  const { data, error } = await supabase.auth.signUp({
      email: 'example@email.com', //un-hardcode this, change it to the var containing what the manager enters
      password: 'example-password', //un-hardcode this too
      options: {
          data: {
            phoneNum: 12345678 //un-hardcode this
            role: 'admin'
          }
    })
        
}
async function getUserId() {
  const user = supabase.auth.user();
  if (user) {
    console.log('User ID:', user.id);
    return user.id;
  } else {
    console.error('No user is logged in');
    return null;
  }
}

async function getUserRole() {
  const user = supabase.auth.user();
  if (user) {
    const { data, error } = await supabase.from('auth.users').select('user_metadata').eq('id', user.id).single();
    if (error) {
      console.error('Error fetching user metadata:', error);
    } else {
      console.log('User role:', data.user_metadata.role);
      return data.user_metadata.role;
    }
  }
}

async function signIn(email, password) {
  const { user, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    console.error('Login error:', error.message);
    return null;
  }

  return user;
}

import { useHistory } from 'react-router-dom'; // If using React Router

async function handleLogin(email, password) {
  const user = await signIn(email, password);
  if (!user) {
    alert('Login failed. Please try again.');
    return;
  }

  const role = await getUserRole();
  if (role) {
    routeUser(role);
  } else {
    console.error('User role not found');
  }
}

function routeUser(role) {
  const history = useHistory();

  if (role === 'admin') {
    history.push('/admin-dashboard');
  } else if (role === 'user') {
    history.push('/user-dashboard');
  } else {
    console.error('Unknown role:', role);
  }
}
*/


