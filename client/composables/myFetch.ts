export default (request, options?) => {
  const config = useRuntimeConfig();

  return useFetch(request, { baseURL: config.public.apiBase, ...options });
};
