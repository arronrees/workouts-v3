import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/constants';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function VerifyEmail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token: string };
}) {
  if (!params.id || !searchParams.token) {
    redirect('/');
  }

  const res = await fetch(
    api(`/api/auth/email/verify/${params.id}/${searchParams.token}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid token</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href='/'>Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success!</CardTitle>
        <CardDescription>Email verified successfully</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href='/auth/signin'>Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
