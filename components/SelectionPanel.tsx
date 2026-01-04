
import React from 'react';
import { Grade, Subject } from '../types';
import { GRADES, SUBJECTS, Icons } from '../constants';

interface SelectionPanelProps {
  currentGrade: Grade | null;
  currentSubject: Subject | null;
  onGradeChange: (grade: Grade) => void;
  onSubjectChange: (subject: Subject) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  currentGrade,
  currentSubject,
  onGradeChange,
  onSubjectChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <Icons.GraduationCap />
            Select Your Grade
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GRADES.map((grade) => (
              <button
                key={grade}
                onClick={() => onGradeChange(grade)}
                className={`px-4 py-2.5 text-sm rounded-xl text-left transition-all border ${
                  currentGrade === grade
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium ring-2 ring-indigo-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <Icons.BookOpen />
            Select Subject
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => onSubjectChange(subject)}
                className={`px-3 py-2 text-xs sm:text-sm rounded-xl text-center transition-all border ${
                  currentSubject === subject
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium ring-2 ring-emerald-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
