import StolenFundsRecovery from '../components/StolenFundsRecovery';
import Head from 'next/head';

export default function StolenFundsPage() {
  return (
    <>
      <Head>
        <title>Stolen Funds Recovery - CryptoRecover</title>
        <meta name="description" content="Professional blockchain forensics and stolen cryptocurrency recovery" />
      </Head>
      <StolenFundsRecovery />
    </>
  );
}