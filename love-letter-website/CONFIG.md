# Love Letter Website Setup

## Supabase Configuration

1. Copy `src/js/config.template.js` to `src/js/config.js`
2. Fill in your actual Supabase URL and anon key in `config.js`
3. The `config.js` file is gitignored so your credentials won't be committed

```bash
cp src/js/config.template.js src/js/config.js
# Edit src/js/config.js with your credentials
```

## Security Note

The Supabase anon key is designed to be public - it's meant for client-side use and has limited permissions controlled by your Row Level Security (RLS) policies. However, keeping it in a separate file still provides:

- Cleaner code organization
- Easier credential management
- Prevention of accidental commits with real credentials