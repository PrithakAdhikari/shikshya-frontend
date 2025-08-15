import React from "react";

const Footer = () => {
  const footerConfig = {
    brand: {
      title: "Shikshya",
      copyright: `© ${new Date().getFullYear()} Shikshya. All rights reserved.`
    },
    links: [
      { title: "About", href: "/about" },
      { title: "Courses", href: "/courses" },
      { title: "Privacy Policy", href: "/privacy" }
    ],
    socialMedia: [
      {
        name: "Facebook",
        href: "#",
        icon: "https://cdn-icons-png.flaticon.com/512/2504/2504903.png"
      },
      {
        name: "Twitter",
        href: "#",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968830.png"
      },
      {
        name: "Instagram",
        href: "#",
        icon: "https://cdn-icons-png.flaticon.com/512/15713/15713420.png"
      }
    ]
  };

  return (
    <footer className="bg-base-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">{footerConfig.brand.title}</h2>
            <p className="text-sm">{footerConfig.brand.copyright}</p>
          </div>

          {/* Center Section */}
          <div className="flex justify-center my-4 md:my-0">
            {footerConfig.links.map(link => (
              <a key={link.title} href={link.href} className="btn btn-ghost mx-2">
                {link.title}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="text-center md:text-right">
            <p className="text-sm">Follow us on:</p>
            <div className="flex justify-center md:justify-end space-x-4 mt-2">
              {footerConfig.socialMedia.map(social => (
                <a key={social.name} href={social.href} className="link" aria-label={social.name}>
                  <img src={social.icon} alt={social.name} className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
