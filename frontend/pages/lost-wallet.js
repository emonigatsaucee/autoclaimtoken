import LostWalletRecovery from '../components/LostWalletRecovery';
import Head from 'next/head';

export default function LostWalletPage() {
  return (
    <>
      <Head>
        <title>Lost Wallet Recovery - CryptoRecover</title>
        <meta name="description" content="Professional seed phrase reconstruction and wallet recovery service" />
      </Head>
      <LostWalletRecovery />
    </>
  );
}