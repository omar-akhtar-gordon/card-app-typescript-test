import React from "react";
import NavBar from './components/NavBar'
import AllEntries from './routes/AllEntries'
import NewEntry from './routes/NewEntry'
import EditEntry from './routes/EditEntry'
import { EntryProvider } from './utilities/globalContext'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState } from "react";

export default function App() {
  const [darkMode,setDarkMode]=useState(false);

  const toggleDarkMode=()=>{
    setDarkMode(!darkMode);
  }


  return (
<div className={`${darkMode && "dark"}`}>
<main className="flex min-h-screen flex-col p-12  dark:bg-neutral-800">
<section >
  <Router>
    <EntryProvider>
    <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<AllEntries/>}>
        </Route>
        <Route path="create" element={<NewEntry/>}>
        </Route>
        <Route path="edit/:id" element={<EditEntry/>}>
        </Route>
      </Routes>
    </EntryProvider>
    </Router>
    </section>
    <button className='absolute w-20 h-20 bottom-20 right-20 rounded-full
     bg-neutral-800 dark:bg-neutral-50 text-white dark:text-black'
     onClick={toggleDarkMode}
     >
      {darkMode ? "Light": "Dark"}
    </button>
    </main>
    </div>
  );
}
