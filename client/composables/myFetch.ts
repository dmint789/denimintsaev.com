export default (request, options?) => {
  const config = useRuntimeConfig();

  const baseURL = process.client ? config.public.apiBase : 'http://localhost:5000/api';

  return $fetch(request, { baseURL, ...options }).catch((error: Error) => {
    throw error;
  });
};
