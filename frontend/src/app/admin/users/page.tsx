import UsersManagement from '@/src/pages/users/page';

export const metadata = {
  title: 'Users - JobPulse Admin',
  description: 'Manage JobPulse platform users.',
};

export default function AdminUsersRoute() {
  return <UsersManagement />;
}