import { FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 mt-6 border-t border-gray-200">
      <p className="text-sm text-gray-400">
        © 2025 PackPilot. All rights reserved.
      </p>
      <a
        href="https://github.com/RuxinMa/tours-app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 text-gray-400 hover:text-blue-600 transition-colors duration-200 group"
      >
        <FiGithub className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        <span className="text-sm transition-transform duration-200 group-hover:scale-110">
          View Source
        </span>
      </a>
    </footer>
  );
};

export default Footer;