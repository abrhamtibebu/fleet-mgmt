export const usePublicRoutes = () => {
  const publicRoutes = [
    "/login"
  ];

  const isPublicRoute = (route: string): boolean => {
    return publicRoutes.some(
      (publicRoute) =>
        route === publicRoute || route.startsWith(`${publicRoute}/`)
    );
  };

  return { isPublicRoute };
};