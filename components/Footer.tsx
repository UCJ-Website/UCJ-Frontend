import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1c2e] text-white">
      <div className="max-w-[1280px] mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Get in Touch */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Get in Touch</h5>
          <div className="flex flex-col gap-3">
            {[
              { icon: "fa-map-marker-alt", text: "No 29 Brown Road, Kokuvil East, Jaffna." },
              { icon: "fa-envelope", text: "info@ucj.ac.lk" },
              { icon: "fa-phone", text: "+94 0212 217 791" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 text-[13px] text-[#8da0c4]">
                <span className="mt-0.5 shrink-0">
                  <i className={`fas ${item.icon} text-[#e85d14]`}></i>
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menus */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Menus</h5>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Course", href: "/courses" },
              { label: "Staff", href: "/staff" },
              { label: "Contact", href: "/contact" },
              { label: "Academic", href: "/academic" },
              { label: "Administration", href: "/administration" },
              { label: "Research", href: "/research" },
              { label: "Library", href: "/library" },
              { label: "Student", href: "/student" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-[13px] text-[#8da0c4] hover:text-[#e85d14] transition-colors duration-150">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Our Courses */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Our Courses</h5>
          <div className="flex flex-col gap-2">
            {["HND ICT", "HND CT", "HND BST", "HND PT","HND MNT","HND FOT","HND FM",].map((course) => (
              <Link key={course} href="/courses" className="text-[13px] text-[#8da0c4] hover:text-[#e85d14] transition-colors duration-150">
                {course}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h5 className="text-[15px] font-bold mb-5 text-white">Social Media</h5>
          <div className="flex gap-3">
            {[
              { icon: "fa-facebook-f", href: "#" },
              { icon: "fa-youtube", href: "#" },
              { icon: "fa-email", href: "#" },
            ].map((social) => (
              <a
                key={social.icon}
                href={social.href}
                className="w-9 h-9 rounded-full bg-[#1a2f4a] flex items-center justify-center text-[#8da0c4] hover:bg-[#e85d14] hover:text-white transition-all duration-200"
              >
                <i className={`fab ${social.icon} text-[14px]`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a2f4a] py-4 text-center text-[12px] text-[#607080]">
        Copyright © 2024 <span className="text-white font-medium">University College of Jaffna</span> | All Rights Reserved
      </div>
    </footer>
  );
}