import {NavLink} from 'react-router-dom'

export default function NavBar(){
    return(
      <nav className="flex justify-center gap-5">
        <NavLink className="m-3 p-4 text-xl bg-blue-400 dark:bg-blue-500 hover:bg-blue-500 rounded-md font-medium dark:hover:bg-blue-400 text-white dark:text-black" to={'/'}>All Entries</NavLink>
        <NavLink className="m-3 p-4 text-xl bg-blue-400  dark:bg-blue-500 hover:bg-blue-500 rounded-md font-medium  dark:hover:bg-blue-400 text-white dark:text-black " to={'/create'}>New Entry</NavLink>
        
      
      </nav>
    )
}