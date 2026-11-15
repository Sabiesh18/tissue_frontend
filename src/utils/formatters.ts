/**
 * Formats database raw uppercase snake_case identifiers into user-friendly title casing.
 * Example: 'COMPANY_NAME' -> 'Company Name'
 * Example: 'FINISHED_GOOD' -> 'Finished Good'
 * Example: 'RAW_MATERIAL' -> 'Raw Material'
 * Example: 'MAIN_WAREHOUSE' -> 'Main Warehouse'
 * Example: 'INWARD_PURCHASE' -> 'Inward Purchase'
 * Example: 'LOGIN_SUCCESS' -> 'Login Success'
 */
export const formatLabel = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Common human-friendly descriptions for system setting keys
 */
export const formatSettingKey = (key: string): string => {
  const customMap: Record<string, string> = {
    COMPANY_NAME: 'Company Name',
    GSTIN_NUMBER: 'GST Identification Number (GSTIN)',
    CURRENCY_SYMBOL: 'Currency Symbol',
    FACTORY_LOCATION: 'Factory & Plant Location',
    DEFAULT_TAX_RATE: 'Default Tax Rate (GST %)',
    MIN_REORDER_ALERT_DAYS: 'Minimum Stock Alert Threshold (Days)',
  };

  return customMap[key] || formatLabel(key);
};
