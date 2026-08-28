import React from 'react';
import Main from '@/components/templates/P-Admin/Discounts/Main';
import getAsnaf from '@/funcs/getAsnaf';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'احسانی مارکت - تخفیف‌ها',
};

async function Discounts() {
  const token = (await cookies()).get('ramian-pakhsh-admin');
  const data = await getAsnaf(token?.value);

  return <Main data={data} />;
}

export default Discounts;
