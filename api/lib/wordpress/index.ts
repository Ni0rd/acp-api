import fetch from 'node-fetch';

export async function login(
  apiEndpoint: string,
  params: { username: string; password: string }
): Promise<boolean> {
  const url = `${apiEndpoint}/jwt-auth/v1/token`;

  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 200) {
    return false;
  }

  return true;
}
