import React from 'react';
import Link from 'next/link';

const Sidebar = ({ classes }) => {
    return (
        <div className="bg-gray-800 text-white h-screen w-1/4 flex flex-col">
            <div className="p-4 bg-gray-900">Classes</div>
            <div className="flex-1 overflow-y-auto">
                {classes.map((classItem, index) => (
                    <Link key={index} href={`/class/${classItem.classId}`} className='p-4 hover:bg-gray-700 cursor-pointer block'>
                        {classItem.className}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
