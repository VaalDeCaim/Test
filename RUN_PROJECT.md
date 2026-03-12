supabase run server: supabase stop && supabase start
supabase functions in functions folder!: supabase functions serve --env-file .env
stripe webook: stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook
frontend: npm run dev
