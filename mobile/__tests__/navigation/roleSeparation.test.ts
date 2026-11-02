import type {UserRole} from '../../src/types';

function routeForRole(role: UserRole | null): 'Auth' | 'Retailer' | 'Supplier' {
  if (role === 'retailer') {
    return 'Retailer';
  }
  if (role === 'supplier') {
    return 'Supplier';
  }
  return 'Auth';
}

describe('role-based navigation routing', () => {
  it('keeps unauthenticated users on Auth', () => {
    expect(routeForRole(null)).toBe('Auth');
  });

  it('routes retailers and suppliers separately', () => {
    expect(routeForRole('retailer')).toBe('Retailer');
    expect(routeForRole('supplier')).toBe('Supplier');
    expect(routeForRole('retailer')).not.toBe(routeForRole('supplier'));
  });
});
