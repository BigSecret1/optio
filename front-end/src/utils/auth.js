const base_url = 'http://localhost:8000';

const login_url = `${base_url}/user/login/`;
const logout_url = `${base_url}/user/logout/`;

export async function login(email, password) {
    const credentials = {
        email: email,
        password: password
    };
    
    console.log("CREDENTIALS ", credentials);

    try {
        const response = await fetch(login_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        console.log("RESPONSE : ", response);

        if (response.status === 200) {
            const data = await response.json();
            console.log('Login successful!');
            const access_token = data.access;
            const refresh_token = data.refresh;
            return { access_token, refresh_token };
        } else {
            console.error(`Login failed: ${response.status} - ${response.statusText}`);
            return { access_token: null, refresh_token: null };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { access_token: null, refresh_token: null };
    }
}

export async function logout(access_token, refresh_token) {
    const logout_data = { refresh: refresh_token };

    try {
        const response = await fetch(logout_url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logout_data)
        });

        if (response.status === 205) {
            console.log('Logout successful!');
        } else {
            console.error(`Logout failed: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}


