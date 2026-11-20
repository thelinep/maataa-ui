# Internationalization (i18n) Guide (Phase I Day 2)

## Overview

The maataa-ui internationalization system provides multi-language support with i18next. Currently supports English, Hindi, and Spanish with easy extensibility for additional languages.

## Features

- ✅ 3 languages: English, Hindi, Spanish
- ✅ System language detection
- ✅ localStorage persistence
- ✅ Date/number/currency formatting per locale
- ✅ Pluralization support
- ✅ Full TypeScript support
- ✅ Easy language switching UI

## Supported Languages

| Code | Name | Native | Flag |
|------|------|--------|------|
| en | English | English | 🇺🇸 |
| hi | Hindi | हिन्दी | 🇮🇳 |
| es | Spanish | Español | 🇪🇸 |

## Quick Start

### 1. Initialize i18n in App Entry

```tsx
import { initializeI18n } from '@/i18n';
import { LanguageSelector } from '@/components/common';

async function setupApp() {
  await initializeI18n();
}

export default function App() {
  return (
    <>
      <LanguageSelector />
      <YourApp />
    </>
  );
}
```

### 2. Use useTranslation Hook

```tsx
import { useTranslation } from '@/hooks/useTranslation';

export const MyComponent = () => {
  const { t, language, changeLanguage, formatDate, formatCurrency } = useTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('workflows.budget')}</p>
      <button onClick={() => changeLanguage('es')}>
        {t('labels.language')}
      </button>
    </div>
  );
};
```

### 3. Add Language Selector to UI

```tsx
import { LanguageSelector } from '@/components/common';

export const Header = () => {
  return (
    <header>
      <h1>My App</h1>
      <LanguageSelector showLabel showDropdown={false} />
    </header>
  );
};
```

## Translation Structure

### Namespaces

Translations are organized by namespace for better organization:

- **common** - App-wide UI strings
- **workflows** - Workflow-specific labels
- **errors** - Error messages
- **success** - Success messages
- **forms** - Form field labels
- **buttons** - Button labels
- **labels** - General labels
- **placeholders** - Input placeholders

### Translation Files

Each language has its own JSON file:

```
src/i18n/locales/
├── en.json    (English)
├── hi.json    (Hindi)
└── es.json    (Spanish)
```

## Using Translations

### Basic Translation

```tsx
const { t } = useTranslation();

// Access translations
const appName = t('common.appName');
const save = t('buttons.save');
```

### Translation Keys

```tsx
// Namespaced keys
t('common.loading')        // "Loading..."
t('errors.required')       // "This field is required"
t('forms.email')          // "Email Address"
t('buttons.addNew')       // "Add New"
t('workflows.budget')     // "Budget"
```

### Fallback Value

```tsx
const { t } = useTranslation();

// Provide fallback if key not found
const label = t('custom.key', 'Default Value');
```

## Language Switching

### Programmatic Switching

```tsx
const { changeLanguage } = useTranslation();

// Switch to Spanish
await changeLanguage('es');

// Current language is now Spanish
// All translations update automatically
```

### UI-Based Switching

```tsx
import { LanguageSelector } from '@/components/common';

export const LanguageSwitcher = () => {
  return (
    <>
      {/* Button style selector */}
      <LanguageSelector showDropdown={false} />
      
      {/* Or dropdown style */}
      <LanguageSelector showDropdown={true} />
    </>
  );
};
```

## Formatting Functions

### Date Formatting

```tsx
const { formatDate } = useTranslation();

const date = new Date('2026-11-20');
formatDate(date);                    // "November 20, 2026" (English)
formatDate(date, 'time');            // "11/20/2026 10:30 AM" (English)
// In Hindi: "20 नवंबर, 2026"
// In Spanish: "20 de noviembre de 2026"
```

### Number Formatting

```tsx
const { formatNumber } = useTranslation();

formatNumber(1000);                  // "1,000" (English)
formatNumber(1000, 2);               // "1,000.00" (English)
// In Hindi: "१,०००"
// In Spanish: "1.000"
```

### Currency Formatting

```tsx
const { formatCurrency } = useTranslation();

formatCurrency(99.99);               // "$99.99" (English, USD)
formatCurrency(5000, 'INR');         // "₹5,000.00" (English, INR)
// Automatically uses correct symbol per language and currency
```

## Adding New Languages

### 1. Create Translation File

Create `src/i18n/locales/fr.json`:

```json
{
  "common": {
    "appName": "Maataa UI",
    "loading": "Chargement...",
    "error": "Erreur",
    // ... all keys
  }
}
```

### 2. Update Configuration

Edit `src/i18n/config.ts`:

```tsx
export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string; flag: string }> = {
  // ... existing languages
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
};
```

### 3. Update Hook

Edit `src/hooks/useTranslation.ts`:

```tsx
function getLanguageName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    es: 'Español',
    fr: 'Français',  // Add this
  };
  return names[language];
}
```

### 4. Update i18n Config

Edit `src/i18n/config.ts`:

```tsx
const frTranslations = await import('./locales/fr.json');

export async function initializeI18n(): Promise<void> {
  // ... existing code
  resources: {
    en: enTranslations.default,
    hi: hiTranslations.default,
    es: esTranslations.default,
    fr: frTranslations.default,  // Add this
  },
}
```

## Integration Examples

### Forms

```tsx
import { useTranslation } from '@/hooks/useTranslation';
import styled from 'styled-components';

const Form = () => {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('forms.firstName')}</label>
      <input placeholder={t('placeholders.enterName')} />
      
      <label>{t('forms.email')}</label>
      <input placeholder={t('placeholders.enterEmail')} />
      
      <button>{t('buttons.submit')}</button>
    </form>
  );
};
```

### Error Handling

```tsx
const handleSubmit = async (data) => {
  try {
    // ... API call
  } catch (error) {
    const { t } = useTranslation();
    
    if (error.code === 'EMAIL_EXISTS') {
      showError(t('errors.conflict'));
    } else if (error.code === 'VALIDATION') {
      showError(t('errors.required'));
    } else {
      showError(t('errors.serverError'));
    }
  }
};
```

### Success Messages

```tsx
const { t } = useTranslation();

if (saveSuccess) {
  showSuccess(t('success.saved'));
  // Shows: "Successfully saved" (en), "सफलतापूर्वक सहेजा गया" (hi), etc.
}
```

### Dynamic Workflow Labels

```tsx
const workflows = [
  { id: 'budget', label: t('workflows.budget') },
  { id: 'team', label: t('workflows.team') },
  { id: 'project', label: t('workflows.project') },
];

workflows.map(w => <WorkflowCard key={w.id} label={w.label} />);
```

## Translation Keys Reference

### Common UI Elements

```
common.appName
common.loading
common.error
common.success
common.warning
common.info
common.close
common.confirm
common.cancel
common.delete
common.save
common.submit
common.login
common.logout
```

### Workflows

```
workflows.budget
workflows.team
workflows.project
workflows.schedule
workflows.ecommerce
workflows.analytics
workflows.admin
workflows.reporting
```

### Form Fields

```
forms.firstName
forms.lastName
forms.email
forms.password
forms.phone
forms.dateOfBirth
forms.status
forms.priority
```

### Buttons

```
buttons.addNew
buttons.importData
buttons.exportData
buttons.downloadReport
buttons.sendEmail
buttons.printView
buttons.shareLink
buttons.viewDetails
buttons.editItem
buttons.deleteItem
buttons.approveRequest
buttons.rejectRequest
```

### Error Messages

```
errors.required
errors.invalidEmail
errors.invalidPhone
errors.passwordTooShort
errors.passwordMismatch
errors.conflict
errors.notFound
errors.unauthorized
errors.forbidden
errors.serverError
errors.networkError
errors.timeout
```

## System Preference Detection

Automatically detect user's preferred language:

```tsx
import { getSystemLanguage } from '@/i18n/config';

// Returns user's browser language (or fallback to English)
const userLanguage = getSystemLanguage();
// 'hi' if browser is set to Hindi
// 'es' if browser is set to Spanish
// 'en' otherwise
```

## localStorage Persistence

Language preference is automatically saved:

```tsx
// User changes to Spanish
await changeLanguage('es');

// 'es' is saved to localStorage as 'language'

// On next page load, Spanish is restored automatically
```

## Pluralization

Handle singular/plural forms:

```tsx
const { pluralize } = useTranslation();

pluralize('items', 1);     // "1 item"
pluralize('items', 5);     // "5 items"
```

Translation keys:

```json
{
  "items_singular": "1 item",
  "items_plural": "{{count}} items"
}
```

## TypeScript Support

Fully typed translations with IntelliSense:

```tsx
const { t } = useTranslation();

// IDE autocomplete works for valid keys
t('common.appName')        // ✓ Valid
t('forms.email')          // ✓ Valid
t('invalid.key')          // ✗ Invalid (but no error at runtime)
```

## Testing Translations

```tsx
test('translations work for all languages', () => {
  const { t } = useTranslation();
  
  expect(t('common.appName')).toBeTruthy();
  expect(t('workflows.budget')).toBeTruthy();
  expect(t('errors.required')).toBeTruthy();
});

test('language switching works', async () => {
  const { changeLanguage, language } = useTranslation();
  
  await changeLanguage('es');
  expect(language).toBe('es');
});
```

## Browser Compatibility

- Chrome 24+
- Firefox 29+
- Safari 9.1+
- Edge 12+
- Opera 15+
- localStorage required

## Performance

- Lazy loading of translation files
- Zero-runtime translation compilation
- Minimal bundle overhead (~50KB for all 3 languages)
- localStorage caching prevents re-parsing

## Migration Path

### From Phase 1 to Phase I i18n

If upgrading from hardcoded strings to i18n:

```tsx
// Before
<Button>Save</Button>

// After
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Button>{t('buttons.save')}</Button>;
};
```

## Best Practices

1. **Use translation keys consistently** across the app
2. **Keep translation files organized** by namespace
3. **Test all languages** before deployment
4. **Avoid embedded HTML** in translations
5. **Use date/currency formatting functions** for locales
6. **Store language preference** in localStorage
7. **Detect system preference** on first load
8. **Provide fallback values** for missing keys

## Troubleshooting

### Translations Not Showing

Ensure i18n is initialized:
```tsx
await initializeI18n();
```

### Language Not Persisting

Check if localStorage is available and not disabled.

### Wrong Language After Page Reload

Verify localStorage is working and language was saved.

### Missing Translations

Check key spelling and namespace in translation files.

## Resources

- i18next docs: https://www.i18next.com/
- Locale codes: https://www.localeplanet.com/
- Translation best practices: https://www.i18next.com/how-to-guides/for-translators
