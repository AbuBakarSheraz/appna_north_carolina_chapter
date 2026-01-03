import React from 'react';
import { Wrench, Clock, Rocket } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-800 rounded-full p-6 shadow-lg">
            <Wrench className="text-white" size={48} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Under Development</h1>

        {/* Subheading */}
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-2 rounded-full mb-6">
          <Clock size={20} />
          <span className="font-semibold text-sm">In Progress</span>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-2">
          This section of the site is under development by our dev team.
        </p>
        <p className="text-gray-700 mb-4">
          It will be live soon — please visit again in the next <span className="font-bold text-green-800">24 hours</span>.
        </p>
        <p className="text-gray-600 mb-6">Thank you for your patience!</p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <Rocket className="text-green-800" size={24} />
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Development Progress</span>
            <span className="font-semibold text-green-800">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full" 
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        {/* Contact info */}
        <p className="text-sm text-gray-500 mt-8">
          Questions? Contact us at{' '}
          <a href="mailto:info@appnanc.org" className="text-green-800 font-semibold hover:underline">
            info@appnanc.org
          </a>
        </p>

      </div>
    </div>
  );
}
