
import React from 'react';
import { useTheme } from '../App';
import './SharedComponents.css';

export default function ClosingStatement() {
  const { isDarkMode } = useTheme();

  return (
    <section className={`closing-statement ${isDarkMode ? 'dark' : 'light'}`}>
      <h2>Professional Serama Management System</h2>
      <p>
        Our professional serama management system leverages authentic breed
        standards—Traditional/American, Ayam (Malaysian), and Modern Malaysian—to
        deliver comprehensive trait evaluation, defect detection, color-variety
        assessment, and extended-trait analysis. Effortlessly track and manage
        hatches, record every bird for total oversight, and showcase your
        standouts within the serama select community.
      </p>
      <ul className="closing-bullets">
        <li>Pro Standards</li>
        <li>All Types</li>
        <li>Breed Approved</li>
      </ul>
    </section>
  )
}
