"use client";
import React, { useEffect, useState } from "react";
import { HeroParallax } from "./ui/hero-parallax";

// Define the type for the product objects
interface Product {
  title: string;
  description: string;
  skillsNeeded: string[];
  link: string;
  thumbnail: string;
}

export function HeroParallaxDemo() {
  const [products, setProducts] = useState<Product[]>([]); // Specify the Product[] type here

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        // Transform projects to match the Product interface
        const transformedProducts = projects.map((project: any) => ({
          title: project.title,
          description: project.description,
          skillsNeeded: project.techStack,
          link: `/projects/${project.id}`,
          thumbnail: project.imageUrl || '/ai.jpg', // Fallback to default image
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Set empty array on error
        setProducts([]);
      }
    };

    fetchProjects();
  }, []);

  return <HeroParallax products={products} />;
}
