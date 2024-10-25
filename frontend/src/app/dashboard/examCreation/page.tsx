import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-64">
      <div className="flex">
        <h1 className="text-3xl text-center">Choose exam type</h1>
      </div>
      <div className="mt-6 flex justify-center items-center gap-10">
        <Link href="/dashboard/examCreation/theory">
            <button className="flex flex-row gap-5 text-xl border border-black p-16 rounded-3xl transform transition-transform duration-300 hover:scale-105">
              <span>Teorijski ispit</span>
              <span>
                <SchoolIcon fontSize="large" style={{ color: 'black' }} />
              </span>
            </button>
        </Link>
        <Link href="/dashboard/examCreation/programming">
            <button className="flex flex-row gap-5 text-xl border border-black p-16 rounded-3xl transform transition-transform duration-300 hover:scale-105">
              <span>Programiranje</span>
              <span>
                <LaptopChromebookIcon fontSize="large" style={{ color: 'black' }} />
              </span>
            </button>
        </Link>
      </div>
    </div>
  );
};

export default page;