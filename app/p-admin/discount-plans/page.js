import React from 'react';
import Main from '@/components/templates/P-Admin/Discount_Plans/Main';
import { cookies } from 'next/headers';
import getDiscountPlans from '@/funcs/getDiscountPlans';

export const metadata = {
  title: 'احسانی مارکت - تخفیف‌ها',
};

async function Discount_Plans() {
  const token = (await cookies()).get('ramian-pakhsh-admin');
  const data = await getDiscountPlans(token?.value);

  return <Main data={data} />;
}

export default Discount_Plans;
