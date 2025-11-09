import MEVAttackRecovery from '../components/MEVAttackRecovery';
import Head from 'next/head';

export default function MEVRecoveryPage() {
  return (
    <>
      <Head>
        <title>MEV Attack Recovery - CryptoRecover</title>
        <meta name="description" content="Counter MEV bots and recover funds from sandwich attacks" />
      </Head>
      <MEVAttackRecovery />
    </>
  );
}