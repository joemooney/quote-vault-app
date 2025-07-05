import QuoteVaultClient from './quote-vault-client';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense>
      <QuoteVaultClient />
    </Suspense>
  );
}
