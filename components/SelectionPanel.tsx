
import React from 'react';
import { Grade, Subject } from '../types';
import { GRADES, SUBJECTS, Icons } from '../constants';

interface SelectionPanelProps {
  currentGrade: Grade | null;
  currentSubject: Subject | null;
  onGradeChange: (grade: Grade | null) => void;
  onSubjectChange: (subject: Subject | null) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  currentGrade,
  currentSubject,
  onGradeChange,
  onSubjectChange,
}) => {
  // Step 1: No Grade selected
  if (!currentGrade) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <Icons.GraduationCap />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">First, select your grade level</h2>
          <p className="text-slate-500 mt-2">This helps EduGenie tailor the complexity of explanations.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GRADES.map((grade) => (
            <button
              key={grade}
              onClick={() => onGradeChange(grade)}
              className="group p-6 text-left rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                {grade}
              </div>
              <div className="text-xs text-slate-400 mt-1 group-hover:text-indigo-500">
                Click to select
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Grade selected, but no Subject selected
  if (!currentSubject) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Compact Grade Summary */}
        <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Icons.GraduationCap />
            </div>
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Selected Grade</p>
              <p className="font-bold text-lg">{currentGrade}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              onGradeChange(null);
              onSubjectChange(null);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            Change
          </button>
        </div>

        {/* Subject Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <Icons.BookOpen />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">What are we studying today?</h2>
            <p className="text-slate-500 mt-2">Pick a subject to start your learning session.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => onSubjectChange(subject)}
                className="group p-4 text-center rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                  {subject}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Both selected (Compact Summary View)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
            <Icons.GraduationCap />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Grade</p>
            <p className="font-bold text-slate-700">{currentGrade}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            onGradeChange(null);
            onSubjectChange(null);
          }}
          className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
        >
          Change
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <Icons.BookOpen />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Subject</p>
            <p className="font-bold text-slate-700">{currentSubject}</p>
          </div>
        </div>
        <button 
          onClick={() => onSubjectChange(null)}
          className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
        >
          Change
        </button>
      </div>
    </div>
  );
};

export default SelectionPanel;
