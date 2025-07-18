import { useState } from 'react';
import { Button, Grid, TextField, Card, Typography } from '@mui/material';
import ApiProvider from '../../api/ApiProvider.api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginWms = async () => {
    try {
      const response = await usePagination.(username, password);
      console.log('Login success:', response.data);

      // localStorage.setItem('token', response.data.token);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
        console.error('Error:', error);
      } else {
        setErrorMsg('An unexpected error occurred');
        console.error('Unknown error:', error);
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Card sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Login</Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <Typography color="error" variant="body2" mt={1}>{errorMsg}</Typography>
        )}

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={loginWms}>
          Login
        </Button>
      </Card>
    </Grid>
  );
}

export default Login;
