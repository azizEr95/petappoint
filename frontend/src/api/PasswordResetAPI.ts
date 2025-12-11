export const requestPasswordReset = async (email: string): Promise<void> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/password-reset/request',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    }
  );

  if (!res.ok) {
    throw new Error('Failed to request password reset');
  }
};

export const verifyResetToken = async (token: string): Promise<boolean> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/password-reset/verify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include'
    }
  );

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return data.valid;
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const res = await fetch(
    import.meta.env.VITE_API_URL + '/password-reset/confirm',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
      credentials: 'include'
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to reset password');
  }
};
