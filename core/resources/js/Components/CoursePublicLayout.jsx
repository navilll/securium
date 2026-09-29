import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/course-catalog.css';

const CoursePublicLayout = ({ children }) => (
    <div className="course-site">
        <header className="course-header">
            <div className="course-header-inner">
                <Link href={route('course-catalog.index')} className="course-brand"><span className="course-brand-mark">E</span><span>Eduan</span></Link>
                <nav className="course-nav"><Link href={route('course-catalog.index')}>Home</Link><Link href={route('course-catalog.index')}>Courses</Link><a href="#about">Pages</a><a href="#news">Blog</a><a href="#contact">Contact</a></nav>
                <div className="course-header-actions"><Link className="course-header-search" href={route('course-catalog.index')}>Search courses <span>⌕</span></Link><Link className="course-button" href={route('course-catalog.index')}>Enroll Now</Link></div>
            </div>
        </header>
        <main>{children}</main>
        <footer className="course-footer"><div><strong>Eduan</strong><span> · Learn something that moves you forward.</span></div><Link href={route('course-catalog.index')}>Explore courses</Link></footer>
    </div>
);

export default CoursePublicLayout;
