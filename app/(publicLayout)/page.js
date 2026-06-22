'use client';

import { useEffect } from 'react';
import axios from 'axios';
import Banner from '@/components/home/Banner';
import FeaturedClasses from '@/components/home/FeaturedClasses';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import LatestForumPosts from '@/components/home/LatestForumPosts';
import BmiCalculator from '@/components/home/BmiCalculator';
import MembershipCTA from '@/components/home/MembershipCTA';

export default function HomePage() {
  
  useEffect(() => {
    // Function to automatically insert 3 dummy posts if the forum database is empty
    const seedForumDatabase = async () => {
      try {
        const dummyPosts = [
          {
            title: "Setting Realistic Fitness Goals That Last",
            content: "Many people begin their fitness journey with ambitious goals but lose motivation...",
            role: "Admin",
            authorName: "Admin",
            image: "https://images.unsplash.com/photo-151783836357463-d25dfeac3438?w=500",
            upvotes: 0,
            downvotes: 0
          },
          {
            title: "Nutrition Tips for Better Workout Performance",
            content: "Proper nutrition fuels your workouts and supports recovery. Consuming a balanced...",
            role: "Admin",
            authorName: "Admin",
            image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500",
            upvotes: 0,
            downvotes: 0
          },
          {
            title: "Why Strength Training Benefits Everyone",
            content: "Strength training is often associated with bodybuilders, but its benefits...",
            role: "Admin",
            authorName: "Admin",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
            upvotes: 0,
            downvotes: 0
          }
        ];

        // Sending data to your backend forum/posts API route
        // (If your backend route is /posts instead of /forums, please change the URL below)
        await axios.post('http://localhost:5000/forums', dummyPosts[0]);
        await axios.post('http://localhost:5000/forums', dummyPosts[1]);
        await axios.post('http://localhost:5000/forums', dummyPosts[2]);
        
        console.log('✅ 3 Forum posts successfully sent to the database!');
      } catch (error) {
        console.log('Data already exists or error in API path:', error.message);
      }
    };

    seedForumDatabase();
  }, []);

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