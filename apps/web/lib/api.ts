export const post = async <R>(url: string, data: Object) => {
  const response = await fetch('http://localhost:3000/' + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result as R;
};

export const get = async <R>(
  url: string,
  { headers, ...opts }: RequestInit,
) => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...opts,
  };
  const response = await fetch('http://localhost:3000/' + url, options);
  const result = await response.json();
  return result as R;
};
