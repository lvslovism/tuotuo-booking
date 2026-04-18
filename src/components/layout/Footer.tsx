import { useMerchant } from '../../hooks/useMerchant';

export function Footer() {
  const { merchant } = useMerchant();

  return (
    <footer
      className="mt-auto py-6 text-center text-xs"
      style={{ color: 'var(--t-sub)', borderTop: '1px solid var(--t-line)' }}
    >
      <p>{merchant?.display_name}</p>
      <p className="mt-1 opacity-60">Powered by 妥妥預約</p>
    </footer>
  );
}
