export function getCurrentRole(pathname: string) {
    return pathname?.split("/")[1] || "";
  }
  
  export function normalizePath(pathname: string) {
    return pathname?.replace(/^\/(admin|super_admin|employee)/, "") || "";
  }
  
  export function buildPathWithRole(role: string, href: string) {
    return `/${role}${href}`;
  }
  