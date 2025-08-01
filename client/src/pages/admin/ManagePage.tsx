import React from 'react';
import { useSearchParams } from 'react-router-dom';
import UniversityTab from '@/pages/admin/University/UniversityTab';
import Courses from '@/pages/admin/Courses/CoursesTab';
import Branches from '@/pages/admin/Branches/BranchesTab';
import Semesters from '@/pages/admin/Semesters/SemestersTab';
import Subjects from '@/pages/admin/Subjects/SubjectsTab';
import Content from '@/pages/admin/Content/ContentTab';

const tabs = [
  'Universities',
  'Courses',
  'Branches',
  'Semesters',
  'Subjects',
  'Content',
] as const;

type TabType = typeof tabs[number];

const ManagePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabType) || 'Universities';

  const changeTab = (tab: TabType) => {
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Universities':
        return <UniversityTab />;
      case 'Courses':
        return <Courses />;
      case 'Branches':
        return <Branches />;
      case 'Semesters':
        return <Semesters />;
      case 'Subjects':
        return <Subjects />;
      case 'Content':
        return <Content />;
      default:
        return <p>Coming soon: {activeTab}</p>;
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Manage</h1>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${tab === activeTab ? 'active' : ''}`}
            onClick={() => changeTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default ManagePage;
