export async function signUpApi(body: {
  email: string;
  password: string;
  name: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 20 * 1000));
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return { success: false, message: 'Signup failed' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch {
    return { success: false, message: 'Signup failed' };
  }
}

export type SignupResponse = Awaited<ReturnType<typeof signUpApi>>;
