import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpenCheck,
    BookOpenText,
    ChartNoAxesCombined,
    CirclePlus,
    FileText,
    Layers3,
    MessageSquareText,
    UsersRound,
} from 'lucide-react';
import './dashboard.css';

const number = (value) => new Intl.NumberFormat().format(Number(value || 0));

const StatCard = ({ icon: Icon, label, value, note, tone }) => (
    <article className="dashboard-stat-card">
        <div className={`dashboard-stat-icon ${tone}`}><Icon size={21} strokeWidth={1.8} /></div>
        <div className="dashboard-stat-copy">
            <span>{label}</span>
            <strong>{number(value)}</strong>
            <small>{note}</small>
        </div>
    </article>
);

const EnquiryChart = ({ items = [] }) => {
    const chartWidth = 620;
    const chartHeight = 230;
    const left = 34;
    const right = 12;
    const top = 18;
    const bottom = 30;
    const values = items.map((item) => Number(item.count || 0));
    const maximum = Math.max(...values, 1);
    const points = items.map((item, index) => {
        const x = items.length < 2
            ? chartWidth / 2
            : left + (index * (chartWidth - left - right)) / (items.length - 1);
        const y = top + ((maximum - Number(item.count || 0)) / maximum) * (chartHeight - top - bottom);
        return { ...item, x, y };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    const area = points.length
        ? `${points[0].x},${chartHeight - bottom} ${line} ${points[points.length - 1].x},${chartHeight - bottom}`
        : '';

    return (
        <div className="dashboard-chart-wrap">
            {items.length ? (
                <svg className="dashboard-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Enquiries over the last seven days">
                    <defs>
                        <linearGradient id="enquiry-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#635bff" stopOpacity=".2" />
                            <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[0, 1, 2, 3].map((row) => {
                        const y = top + (row * (chartHeight - top - bottom)) / 3;
                        return <line key={row} x1={left} x2={chartWidth - right} y1={y} y2={y} className="dashboard-chart-grid" />;
                    })}
                    {area && <polygon points={area} fill="url(#enquiry-area)" />}
                    {points.length > 1 && <polyline points={line} className="dashboard-chart-line" />}
                    {points.map((point, index) => (
                        <g key={`${point.date}-${index}`}>
                            <circle cx={point.x} cy={point.y} r="4.5" className="dashboard-chart-point" />
                            <text x={point.x} y={chartHeight - 7} textAnchor="middle" className="dashboard-chart-label">{point.label}</text>
                        </g>
                    ))}
                </svg>
            ) : <div className="dashboard-chart-empty">Enquiry activity will appear here.</div>}
        </div>
    );
};

const Dashboard = ({ stats = {}, recentCourses = [], recentEnquiries = [], weeklyEnquiries = [], courseCategories = [] }) => {
    const { auth } = usePage().props;
    const firstName = auth?.user?.name?.trim().split(/\s+/)[0] || 'there';
    const categoryMaximum = Math.max(...courseCategories.map((category) => Number(category.count || 0)), 1);

    return (
        <div className="course-dashboard">
            <header className="dashboard-heading">
                <div>
                    <span className="dashboard-eyebrow">Securium Solution · ADMIN</span>
                    <h1>Good day, {firstName} <span aria-hidden="true">✦</span></h1>
                    <p>Here’s what’s happening across your learning platform.</p>
                </div>
                <Link href={route('courses.create')} className="dashboard-primary-action"><CirclePlus size={17} /> Add a course</Link>
            </header>

            <section className="dashboard-stats" aria-label="Platform summary">
                <StatCard icon={BookOpenText} label="Total courses" value={stats.total_courses} note={`${number(stats.published_courses)} published · ${number(stats.draft_courses)} drafts`} tone="violet" />
                <StatCard icon={UsersRound} label="Course learners" value={stats.total_course_students} note="Learners across all courses" tone="blue" />
                <StatCard icon={MessageSquareText} label="Enquiries" value={stats.total_enquiries} note="Contact form submissions" tone="amber" />
                <StatCard icon={BookOpenCheck} label="Lessons" value={stats.total_course_lessons} note="Across your course library" tone="green" />
            </section>

            <section className="dashboard-main-grid">
                <article className="dashboard-panel dashboard-activity-panel">
                    <div className="dashboard-panel-heading">
                        <div><span className="dashboard-panel-kicker">ACTIVITY</span><h2>Enquiries this week</h2></div>
                        <span className="dashboard-panel-badge"><ChartNoAxesCombined size={15} /> Last 7 days</span>
                    </div>
                    <EnquiryChart items={weeklyEnquiries} />
                    <div className="dashboard-chart-summary"><strong>{number(weeklyEnquiries.reduce((total, item) => total + Number(item.count || 0), 0))}</strong><span>enquiries received in the last seven days</span></div>
                </article>

                <article className="dashboard-panel dashboard-category-panel">
                    <div className="dashboard-panel-heading">
                        <div><span className="dashboard-panel-kicker">COURSE LIBRARY</span><h2>Top categories</h2></div>
                        <Layers3 size={19} className="dashboard-muted-icon" />
                    </div>
                    {courseCategories.length ? (
                        <ul className="dashboard-category-list">
                            {courseCategories.map((category, index) => (
                                <li key={`${category.name}-${index}`}>
                                    <div className="dashboard-category-meta"><span>{category.name}</span><strong>{number(category.count)}</strong></div>
                                    <div className="dashboard-category-track"><span style={{ width: `${Math.max((Number(category.count || 0) / categoryMaximum) * 100, 3)}%` }} /></div>
                                </li>
                            ))}
                        </ul>
                    ) : <div className="dashboard-panel-empty">Add course categories to see a breakdown here.</div>}
                    <Link href={route('courses.categories.index')} className="dashboard-panel-link">Manage categories <ArrowRight size={15} /></Link>
                </article>
            </section>

            <section className="dashboard-lower-grid">
                <article className="dashboard-panel dashboard-table-panel">
                    <div className="dashboard-panel-heading">
                        <div><span className="dashboard-panel-kicker">RECENTLY UPDATED</span><h2>Latest courses</h2></div>
                        <Link href={route('courses.index')} className="dashboard-panel-link">View all <ArrowRight size={15} /></Link>
                    </div>
                    {recentCourses.length ? (
                        <div className="dashboard-course-list">
                            {recentCourses.map((course) => (
                                <div className="dashboard-course-row" key={course.id}>
                                    <div className="dashboard-course-mark"><BookOpenText size={18} /></div>
                                    <div className="dashboard-course-info"><strong>{course.title}</strong><span>{course.category}</span></div>
                                    <span className={`dashboard-status ${course.is_published ? 'is-published' : 'is-draft'}`}>{course.is_published ? 'Published' : 'Draft'}</span>
                                </div>
                            ))}
                        </div>
                    ) : <div className="dashboard-panel-empty">Your courses will show up here when you add them.</div>}
                </article>

                <article className="dashboard-panel dashboard-enquiries-panel">
                    <div className="dashboard-panel-heading">
                        <div><span className="dashboard-panel-kicker">INBOX</span><h2>Recent enquiries</h2></div>
                        <FileText size={19} className="dashboard-muted-icon" />
                    </div>
                    {recentEnquiries.length ? (
                        <ul className="dashboard-enquiry-list">
                            {recentEnquiries.map((enquiry) => (
                                <li key={enquiry.id}>
                                    <span className="dashboard-enquiry-avatar">{(enquiry.name || '?').slice(0, 1).toUpperCase()}</span>
                                    <div><strong>{enquiry.name}</strong><span>{enquiry.course || enquiry.email}</span></div>
                                    <small>{enquiry.created_at}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <div className="dashboard-panel-empty">New contact form enquiries will appear here.</div>}
                </article>
            </section>

            <section className="dashboard-quick-actions" aria-label="Quick actions">
                <div className="dashboard-quick-copy"><span className="dashboard-quick-icon"><CirclePlus size={19} /></span><div><strong>Keep your catalog growing</strong><span>Create a course or fine-tune the categories learners browse.</span></div></div>
                <div className="dashboard-quick-links"><Link href={route('courses.create')}>Create course <ArrowRight size={15} /></Link><Link href={route('courses.categories.index')}>Edit categories <ArrowRight size={15} /></Link></div>
            </section>
        </div>
    );
};

export default Dashboard;
