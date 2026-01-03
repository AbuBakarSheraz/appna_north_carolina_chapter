import { Check } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column - Membership Info */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              APPNA – NORTH CAROLINA MEMBERSHIP
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              The membership of APPNA – North Carolina shall be of the following categories: Active, Associate, Honorary, Emeritus, Affiliate, Physician-in-Training and Student. Unless otherwise specified in the Bylaws, Active members shall be entitled to all the privileges of APPNA – North Carolina including the right to vote and hold office.
            </p>
          </div>

          {/* Middle Column - Organization */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              ORGANIZATION
            </h3>
            <ul className="space-y-3">
              {[
                'Independent',
                'Not for Profit',
                'Professional & Educational',
                'No Political',
                'Membership',
                'Donate'
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300 text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              CONTACT US
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Phone:</p>
                <a 
                  href="tel:+34324325324" 
                  className="text-orange-500 hover:text-orange-400 transition-colors text-base md:text-lg font-semibold"
                >
                  + 1 34-332-3243
                </a>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email:</p>
                <a 
                  href="mailto:abcxyz@gmail.com" 
                  className="text-orange-500 hover:text-orange-400 transition-colors text-base md:text-lg font-semibold break-all"
                >
                  abcxyz@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 APPNA North Carolina. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}