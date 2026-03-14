export function isAdmin(roles) {
  for (let i = 0; i < roles.length; ++i) {
    if (roles[i].toLowerCase() === "admin") {
      return true;
    }
  }
  return false;
}

export function getUserRole(user) {
  if (!user?.organizations || !user?.currentOrganizationId) return null;
  const org = user.organizations.find(
    (o) => String(o.organizationId) === String(user.currentOrganizationId),
  );
  return org?.role ?? null;
}
