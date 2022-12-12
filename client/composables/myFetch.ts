export default (request, options?) => {
  const config = useRuntimeConfig();

  return $fetch(request, { baseURL: config.public.apiBase, ...options }).catch((error: Error) => {
    throw error;
  });
};
