// dashboard/examLayout.tsx
import React from 'react';


const ExamLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="exam-layout">

            <div className="content">{children}</div>
        </div>
    );
};

export default ExamLayout;
