// pages/projects.js
import { prisma } from '@/lib/prisma';
import React from 'react';
import NavBar from '../components/NavBar';

export default async function Projects() {
  const projects = await prisma.project.findMany();

  return (
    <>
      <NavBar />
      <div className="flex flex-wrap justify-center">
        {projects.map((project) => (
          <div key={project.id} className="m-4">
            <div className="relative flex flex-col text-gray-700 bg- shadow-md bg-clip-border rounded-xl w-96 ">
              <div className="p-6">
                <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                  {project.title}
                </h5>
                <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                  {project.description}
                </p>
                <div className="mt-4">
                  <span className="font-semibold">Tech Stack:</span>{' '}
                  {project.techStack.join(', ')}
                </div>
              </div>
              <div className="p-6 pt-0">
                <button
                  className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                  type="button">
                Request to join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
