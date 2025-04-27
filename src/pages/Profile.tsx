
import { Layout } from '@/components/Layout';
import { ProfileSection } from '@/components/ProfileSection';

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <ProfileSection />
      </div>
    </Layout>
  );
};

export default Profile;
