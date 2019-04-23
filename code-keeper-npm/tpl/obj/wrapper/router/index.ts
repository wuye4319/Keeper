import form from '@/form/router';

const routes = [
  {
    path: '',
    redirect: 'form'
  },
  ...form,
];

export default routes;