import Banner from '@/components/home/Banner';
 import FeaturedClasses from '@/components/home/FeaturedClasses';
 import WhyChooseUs from '@/components/home/WhyChooseUs';
 import LatestForumPosts from '@/components/home/LatestForumPosts';
 import BmiCalculator from '@/components/home/BmiCalculator';
 import MembershipCTA from '@/components/home/MembershipCTA';

export default function HomePage() {
  return (
    <>
      <Banner />
       <FeaturedClasses />
       <WhyChooseUs />
       <LatestForumPosts />
       <BmiCalculator />
       <MembershipCTA />    
    </>
  );
}
