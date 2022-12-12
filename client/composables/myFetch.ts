export default (request, options?) => {
  const config = useRuntimeConfig();

  const baseURL = process.client ? config.public.apiBase : 'http://localhost:5000/api';

  console.log(baseURL);

  return useFetch(request, { baseURL, ...options });
};
