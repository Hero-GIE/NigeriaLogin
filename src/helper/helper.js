import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN 

// Make API Request

/** To get username from Token */
export async function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject("Cannot find Token");
    const decode = jwtDecode (token);
    return decode; // Assuming the decoded token contains the username field
}

// authenticate function
export async function authentication(username){
    try {
        return await axios.post('/api/authentication', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

// get user details
export async function getUser(username) {
    try {
        const response = await axios.get(`/api/user/${username}`);
        return response.data;
    } catch (error) {
        return { error: "Password doesn't match!" };
    }
}

// register user function
export async function registerUser(credentials) {
    try {
        const response = await axios.post('/api/register', credentials);
        const { status, data: { msg } } = response;

        if (status === 201) {
            const { username, email } = credentials;
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return msg;
    } catch (error) {
        return { error };
    }
}

// login function
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}


//update user profile function
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}


//generate OTP
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });
        // Send mail with the OTP
        if (status === 201) {
            const { data: { email } } = await getUser({ username });
            const text = `Your Password Recovery OTP is ${code}. Verify and recover your password`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" });
        }
        return code;
    } catch (error) {
        return { error };
    }
}

//verify OTP
export async function verifyOTP({username, code}) {
   try {
      const {data, status} = await axios.get('/api/verifyOTP', {params: {username, code}})
      return {data, status};
    } catch (error) {
    return {error};
   }
    }

 //reset password
export async function resetPassword({username, password}){
        try {
           const {data,status} = await axios.post('/api/resetPassword',{username, password})
             return({data, status})
        } catch (error) {
            return {error}
        }
    }


