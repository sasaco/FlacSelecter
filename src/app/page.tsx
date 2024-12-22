import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to input page since this is the primary interface for users
  redirect('/input');
  return null;
}
