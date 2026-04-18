import { cookies } from 'next/headers'
import LandingContent from '@/components/LandingContent'

export default async function LandingPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('FORMHUBS_session');
  
  const startHref = session ? "/dashboard" : "/signup";
  const loginHref = session ? "/dashboard" : "/login";

  return (
    <LandingContent 
      session={session} 
      loginHref={loginHref} 
      startHref={startHref} 
    />
  )
}
