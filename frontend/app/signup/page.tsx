import SignupForm from './SignupForm';

type SignupPageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const role = params.role;
  const initialRole = role === 'farmer' || role === 'company' ? role : null;

  return <SignupForm initialRole={initialRole} />;
}
