import { FiHeart } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom'

const Card = ({ url, title, desc, views, instructor, publicId, likes=0, liked=true }) => {
  const navigate = useNavigate();
  return (
    <a className='cursor-pointer' onClick={() => navigate(`/course?c=${publicId}`)}>
      <div className="card card-animation hover:-translate-y-0 md:hover:-translate-y-3 bg-base-200 max-h-[24rem] mx-auto w-[90%] md:w-[18rem] lg:w-[20rem] shadow-xl transition-all duration-300 ease-in-out">
        
        {/* Consistent Aspect Ratio Wrapper */}
        <figure className="w-full px-5 pt-5 md:px-8 md:pt-8 lg:px-10 lg:pt-10">
          <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </figure>

        <div className="card-body">
          {/* Profile + Title + Username */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={instructor.profilePicture}
              alt={instructor.username}
              className="rounded-full w-10 h-10 object-cover"
            />
            <div className="flex flex-col">
              <h2 className="card-title text-base md:text-lg lg:text-xl m-0">
                {title}
              </h2>
              <span className="text-xs text-base-content/60 flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <FaEye className="text-xs" />
                  <span>{views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FiHeart className="text-xs" fill={liked ? "oklch(80.8% 0.114 19.571)": "var(--color-base-200)"} />
                  <span>{likes}</span>
                </span>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm font-light text-left leading-snug text-base-content/80">
            {desc}
          </p>
        </div>
      </div>
    </a>
  );
};

export default Card;
