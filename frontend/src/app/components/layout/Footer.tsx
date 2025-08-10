import { keepServerRunning } from "@/services/util.service";
import React from "react";

const Footer = () => {
  keepServerRunning();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Signalyze</h3>
            <p className="text-gray-400 mt-2">AI-Powered Document Analysis</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Signalyze. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
