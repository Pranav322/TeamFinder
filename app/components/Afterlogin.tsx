"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HeroParallax } from "./ui/hero-parallax";

// Define the type for the product objects
interface Product {
  title: string;
  description: string;
  skillsNeeded: string[];
  link: string;
  thumbnail: string; // Update the type if Unsplash might return `undefined`
}

export function HeroParallaxDemo() {
  const [products, setProducts] = useState<Product[]>([]); // Specify the Product[] type here

  useEffect(() => {
    const fetchImages = async () => {
      const projectTitles = [
        "AI Chat Application",
        "E-Learning Platform",
        "Fitness Tracking App",
        "Project Management Tool",
        "Blockchain Wallet",
        "Social Network",
        "IoT Dashboard",
        "Video Streaming App",
        "AR Navigation",
        "Code Review Platform",
        "Music Production App",
        "Healthcare Portal",
        "Game Development",
        "ML Image Processing",
        "DevOps Pipeline",
      ];

      try {
        const images = await Promise.all(
          projectTitles.map(async (title) => {
            const res = await axios.get(`https://api.unsplash.com/search/photos`, {
              params: {
                query: title.split(" ").join("+"),
                page: 1,
                per_page: 1,
              },
              headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
              },
            });

            return res.data.results[0]?.urls?.small || ""; // Default to an empty string if no image
          })
        );

        // Set the products with fetched images
        setProducts([
          {
            title: "AI Chat Application",
            description: "Building a next-gen AI chatbot with real-time translation",
            skillsNeeded: ["React", "OpenAI", "WebSocket"],
            link: "/projects/ai-chat",
            thumbnail: images[0],
          },
          {
            title: "E-Learning Platform",
            description: "Creating an interactive platform for online education",
            skillsNeeded: ["Vue.js", "Node.js", "MongoDB"],
            link: "/projects/e-learning",
            thumbnail: images[1],
          },
          {
            title: "Fitness Tracking App",
            description: "Mobile app for tracking workouts and nutrition",
            skillsNeeded: ["React Native", "Firebase", "UI/UX"],
            link: "/projects/fitness-app",
            thumbnail: images[2],
          },
          {
            title: "Project Management Tool",
            description: "Collaborative tool for remote teams",
            skillsNeeded: ["Angular", "Express", "PostgreSQL"],
            link: "/projects/project-management",
            thumbnail: images[3],
          },
          {
            title: "Blockchain Wallet",
            description: "Secure crypto wallet with multi-chain support",
            skillsNeeded: ["Solidity", "Web3.js", "TypeScript"],
            link: "/projects/blockchain-wallet",
            thumbnail: images[4],
          },
          {
            title: "Social Network",
            description: "Niche social platform for developers",
            skillsNeeded: ["Next.js", "GraphQL", "AWS"],
            link: "/projects/social-network",
            thumbnail: images[5],
          },
          {
            title: "IoT Dashboard",
            description: "Real-time monitoring for smart devices",
            skillsNeeded: ["Python", "MQTT", "D3.js"],
            link: "/projects/iot-dashboard",
            thumbnail: images[6],
          },
          {
            title: "Video Streaming App",
            description: "Live streaming platform for content creators",
            skillsNeeded: ["WebRTC", "FFmpeg", "Redis"],
            link: "/projects/video-streaming",
            thumbnail: images[7],
          },
          {
            title: "AR Navigation",
            description: "Augmented reality indoor navigation",
            skillsNeeded: ["Unity", "ARKit", "C#"],
            link: "/projects/ar-navigation",
            thumbnail: images[8],
          },
          {
            title: "Code Review Platform",
            description: "Automated code review and analysis tool",
            skillsNeeded: ["Python", "Docker", "Jenkins"],
            link: "/projects/code-review",
            thumbnail: images[9],
          },
          {
            title: "Music Production App",
            description: "Browser-based music creation studio",
            skillsNeeded: ["Web Audio API", "React", "Redux"],
            link: "/projects/music-production",
            thumbnail: images[10],
          },
          {
            title: "Healthcare Portal",
            description: "Patient management system with telemedicine",
            skillsNeeded: ["Java Spring", "React", "HIPAA"],
            link: "/projects/healthcare-portal",
            thumbnail: images[11],
          },
          {
            title: "Game Development",
            description: "2D platformer with multiplayer support",
            skillsNeeded: ["Phaser.js", "Socket.io", "Node.js"],
            link: "/projects/game-dev",
            thumbnail: images[12],
          },
          {
            title: "ML Image Processing",
            description: "AI-powered image enhancement tool",
            skillsNeeded: ["Python", "TensorFlow", "OpenCV"],
            link: "/projects/ml-image",
            thumbnail: images[13],
          },
          {
            title: "DevOps Pipeline",
            description: "Automated deployment and monitoring system",
            skillsNeeded: ["Kubernetes", "Terraform", "GitOps"],
            link: "/projects/devops-pipeline",
            thumbnail: images[14],
          },
        ]);
      } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
      }
    };

    fetchImages();
  }, []);

  return <HeroParallax products={products} />;
}
