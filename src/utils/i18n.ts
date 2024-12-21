// Simple translations object for minimal i18n support
export const translations = {
  pages: {
    home: {
      title: 'App works !'
    }
  }
};

// Helper function to get translation by key path
export function getTranslation(keyPath: string): string {
  const keys = keyPath.toLowerCase().split('.');
  let current: any = translations;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
    current = current[key];
  }
  
  return current;
}
