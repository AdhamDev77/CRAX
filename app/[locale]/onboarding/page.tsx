import EnhancedSignup from "../signup/page";


export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return <EnhancedSignup email={searchParams.email} />;
}